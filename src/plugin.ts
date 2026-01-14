/**
 * Windsurf Plugin for OpenCode
 * 
 * Enables using Windsurf/Codeium models through OpenCode by intercepting
 * requests and routing them through the local Windsurf language server.
 * 
 * Architecture:
 * 1. Plugin registers a custom fetch handler for windsurf.local domain
 * 2. Requests are transformed to gRPC format and sent to local language server
 * 3. Responses are streamed back in OpenAI-compatible SSE format
 * 
 * Requirements:
 * - Windsurf must be running (launches language_server_macos process)
 * - User must be logged into Windsurf (provides API key in ~/.codeium/config.json)
 */

import * as crypto from 'crypto';
import type { PluginInput, Hooks } from '@opencode-ai/plugin';
import { getCredentials, isWindsurfRunning, WindsurfCredentials } from './plugin/auth.js';
import { streamChatGenerator, ChatMessage } from './plugin/grpc-client.js';
import { getDefaultModel, getCanonicalModels } from './plugin/models.js';
import { PLUGIN_ID } from './constants.js';

// ============================================================================
// Types
// ============================================================================

interface ChatCompletionRequest {
  model?: string;
  messages: Array<{
    role: string;
    content: string | Array<{ type: string; text?: string }>;
  }>;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { content?: string; role?: string };
    finish_reason: string | null;
  }>;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create an OpenAI-compatible response object
 */
function createOpenAICompatibleResponse(
  id: string,
  model: string,
  content: string,
  isStreaming: boolean,
  finishReason: string | null = null
): ChatCompletionChunk | ChatCompletionResponse {
  const timestamp = Math.floor(Date.now() / 1000);

  if (isStreaming) {
    return {
      id,
      object: 'chat.completion.chunk',
      created: timestamp,
      model,
      choices: [
        {
          index: 0,
          delta: { content },
          finish_reason: finishReason,
        },
      ],
    };
  }

  return {
    id,
    object: 'chat.completion',
    created: timestamp,
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: finishReason || 'stop',
      },
    ],
  };
}

/**
 * Create a streaming response using the gRPC generator
 */
function createStreamingResponse(
  credentials: WindsurfCredentials,
  request: ChatCompletionRequest
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const responseId = `chatcmpl-${crypto.randomUUID()}`;
  const model = request.model || getDefaultModel();

  return new ReadableStream({
    async start(controller) {
      try {
        // Convert messages to the format expected by gRPC client
        const messages: ChatMessage[] = request.messages.map((m) => ({
          role: m.role as ChatMessage['role'],
          content:
            typeof m.content === 'string'
              ? m.content
              : m.content.map((p) => p.text || '').join(''),
        }));

        const generator = streamChatGenerator(credentials, {
          model,
          messages,
        });

        for await (const chunk of generator) {
          const responseChunk = createOpenAICompatibleResponse(
            responseId,
            model,
            chunk,
            true
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(responseChunk)}\n\n`)
          );
        }

        // Send final chunk with finish_reason
        const finalChunk = createOpenAICompatibleResponse(
          responseId,
          model,
          '',
          true,
          'stop'
        );
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`)
        );

        // Send [DONE] marker
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: { message: errorMessage } })}\n\n`
          )
        );
        controller.close();
      }
    },
  });
}

/**
 * Create a non-streaming response by collecting all chunks
 */
async function createNonStreamingResponse(
  credentials: WindsurfCredentials,
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const responseId = `chatcmpl-${crypto.randomUUID()}`;
  const model = request.model || getDefaultModel();
  const chunks: string[] = [];

  // Convert messages
  const messages: ChatMessage[] = request.messages.map((m) => ({
    role: m.role as ChatMessage['role'],
    content:
      typeof m.content === 'string'
        ? m.content
        : m.content.map((p) => p.text || '').join(''),
  }));

  const generator = streamChatGenerator(credentials, {
    model,
    messages,
  });

  for await (const chunk of generator) {
    chunks.push(chunk);
  }

  const fullContent = chunks.join('');
  return createOpenAICompatibleResponse(
    responseId,
    model,
    fullContent,
    false,
    'stop'
  ) as ChatCompletionResponse;
}

/**
 * Parse request body from various formats
 */
function parseRequestBody(body: unknown): ChatCompletionRequest {
  if (!body) {
    return { model: getDefaultModel(), messages: [] };
  }

  if (typeof body === 'string') {
    return JSON.parse(body);
  }

  if (body instanceof ArrayBuffer) {
    return JSON.parse(new TextDecoder().decode(body));
  }

  if (typeof body === 'object' && body !== null) {
    return body as ChatCompletionRequest;
  }

  return { model: getDefaultModel(), messages: [] };
}

// ============================================================================
// Plugin Factory
// ============================================================================

/**
 * Create the Windsurf plugin
 */
export const createWindsurfPlugin =
  (providerId: string = PLUGIN_ID) =>
  async (_context: PluginInput): Promise<Hooks> => {
    return {
      auth: {
        provider: providerId,

        loader: async (
          _getAuth: () => Promise<unknown>,
          _provider: unknown
        ): Promise<Record<string, unknown>> => {
          // Check if Windsurf is running
          if (!isWindsurfRunning()) {
            console.warn(
              '[windsurf-plugin] Windsurf is not running. Please start Windsurf first.'
            );
            return {};
          }

          return {
            // Empty API key since we use local credentials
            apiKey: '',
            // Use a fake baseURL that our fetch handler intercepts
            baseURL: 'https://windsurf.local',

            // Custom fetch handler
            fetch: async (
              input: string | URL | Request,
              init?: RequestInit
            ): Promise<Response> => {
              const url =
                typeof input === 'string'
                  ? input
                  : input instanceof URL
                    ? input.href
                    : input.url;

              // Handle /v1/models - return available models
              if (url.includes('/models') || url.includes('/v1/models')) {
                const models = getCanonicalModels();
                return new Response(
                  JSON.stringify({
                    object: 'list',
                    data: models.map((id) => ({
                      id,
                      object: 'model',
                      created: Math.floor(Date.now() / 1000),
                      owned_by: 'windsurf',
                    })),
                  }),
                  {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                  }
                );
              }

              // Handle chat completions
              if (
                url.includes('/chat/completions') ||
                url.includes('/v1/chat/completions')
              ) {
                try {
                  // Get fresh credentials for each request
                  const credentials = getCredentials();

                  // Parse request body
                  const requestBody = parseRequestBody(init?.body);
                  const isStreaming = requestBody.stream === true;

                  if (isStreaming) {
                    const stream = createStreamingResponse(
                      credentials,
                      requestBody
                    );
                    return new Response(stream, {
                      status: 200,
                      headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                      },
                    });
                  }

                  // Non-streaming response
                  const responseData = await createNonStreamingResponse(
                    credentials,
                    requestBody
                  );
                  return new Response(JSON.stringify(responseData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                  });
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : 'Unknown error';
                  return new Response(
                    JSON.stringify({
                      error: {
                        message: errorMessage,
                        type: 'windsurf_error',
                        code: 'windsurf_connection_failed',
                      },
                    }),
                    {
                      status: 500,
                      headers: { 'Content-Type': 'application/json' },
                    }
                  );
                }
              }

              // For any other endpoint, return a generic success
              return new Response(JSON.stringify({ status: 'ok' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              });
            },
          };
        },

        // No auth methods needed - we use Windsurf's existing auth
        methods: [],
      },
    };
  };

/** Default Windsurf plugin export */
export const WindsurfPlugin = createWindsurfPlugin();

/** Alias for Codeium users */
export const CodeiumPlugin = createWindsurfPlugin('codeium');
