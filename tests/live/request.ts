#!/usr/bin/env bun
/**
 * Direct gRPC request tester with detailed error analysis
 * 
 * This sends requests directly to the Windsurf language server
 * and captures the exact error messages to understand the expected format.
 * 
 * Usage:
 *   bun run tests/live/request.ts
 */

import * as http2 from "http2";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const FIXTURES_DIR = path.join(import.meta.dir, "../fixtures");

interface Credentials {
  csrfToken: string;
  port: number;
  version: string;
}

function getCredentials(): Credentials | null {
  try {
    const psOutput = execSync("ps aux | grep language_server_macos | grep -v grep", {
      encoding: "utf8",
    });
    const csrfMatch = psOutput.match(/--csrf_token\s+([a-f0-9-]+)/);
    const portMatch = psOutput.match(/--extension_server_port\s+(\d+)/);
    const versionMatch = psOutput.match(/--windsurf_version\s+([\d.]+)/);

    if (!csrfMatch || !portMatch) return null;

    return {
      csrfToken: csrfMatch[1],
      port: parseInt(portMatch[1], 10) + 3,
      version: versionMatch?.[1] || "unknown",
    };
  } catch {
    return null;
  }
}

// ============================================================================
// Protobuf Encoding Helpers
// ============================================================================

function encodeVarint(value: number): number[] {
  const bytes: number[] = [];
  let v = value;
  while (v > 0x7f) {
    bytes.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  bytes.push(v);
  return bytes.length ? bytes : [0];
}

function encodeString(fieldNum: number, str: string): number[] {
  const strBytes = Buffer.from(str, "utf8");
  return [(fieldNum << 3) | 2, ...encodeVarint(strBytes.length), ...strBytes];
}

function encodeVarintField(fieldNum: number, value: number): number[] {
  return [(fieldNum << 3) | 0, ...encodeVarint(value)];
}

function encodeMessage(fieldNum: number, messageBytes: number[]): number[] {
  return [(fieldNum << 3) | 2, ...encodeVarint(messageBytes.length), ...messageBytes];
}

function grpcFrame(payload: Buffer): Buffer {
  const frame = Buffer.alloc(5 + payload.length);
  frame[0] = 0; // Not compressed
  frame.writeUInt32BE(payload.length, 1);
  payload.copy(frame, 5);
  return frame;
}

// ============================================================================
// Request Builders
// ============================================================================

/**
 * Build Metadata message (exa.codeium_common_pb.Metadata)
 * Based on extension.js analysis:
 *   Field 1: ide_name (string)
 *   Field 2: extension_version (string)
 *   Field 3: api_key (string)
 *   Field 7: ide_version (string)
 */
function buildMetadata(version: string): number[] {
  const bytes: number[] = [];
  bytes.push(...encodeString(1, "windsurf")); // ide_name
  bytes.push(...encodeString(2, "2.0.0")); // extension_version
  // Field 3 (api_key) - skip for now, might not be required for local
  bytes.push(...encodeString(7, version)); // ide_version
  return bytes;
}

/**
 * Build FormattedChatMessage (exa.chat_pb.FormattedChatMessage)
 * Based on extension.js analysis:
 *   Field 1: role (enum ChatMessageSource)
 *   Field 2: header (string)
 *   Field 3: content (string)
 *   Field 4: footer (string)
 * 
 * ChatMessageSource enum (from extension.js):
 *   0 = UNKNOWN
 *   1 = USER  
 *   2 = ASSISTANT
 *   3 = SYSTEM
 */
function buildFormattedChatMessage(role: number, content: string): number[] {
  const bytes: number[] = [];
  bytes.push(...encodeVarintField(1, role)); // role
  // Field 2 (header) - skip
  bytes.push(...encodeString(3, content)); // content
  // Field 4 (footer) - skip
  return bytes;
}

/**
 * Build RawGetChatMessageRequest (exa.chat_pb.RawGetChatMessageRequest)
 * Based on extension.js analysis:
 *   Field 1: metadata (Metadata message)
 *   Field 2: chat_messages (repeated FormattedChatMessage)
 *   Field 3: system_prompt_override (string)
 *   Field 4: chat_model (enum Model)
 *   Field 5: chat_model_name (string)
 */
function buildRequest(
  version: string,
  messages: Array<{ role: number; content: string }>,
  modelEnum: number,
  systemPrompt?: string
): Buffer {
  const bytes: number[] = [];

  // Field 1: metadata
  const metadata = buildMetadata(version);
  bytes.push(...encodeMessage(1, metadata));

  // Field 2: chat_messages (repeated)
  for (const msg of messages) {
    const formatted = buildFormattedChatMessage(msg.role, msg.content);
    bytes.push(...encodeMessage(2, formatted));
  }

  // Field 3: system_prompt_override (optional)
  if (systemPrompt) {
    bytes.push(...encodeString(3, systemPrompt));
  }

  // Field 4: chat_model (enum)
  bytes.push(...encodeVarintField(4, modelEnum));

  // Field 5: chat_model_name (optional, skip for now)

  return Buffer.from(bytes);
}

// ============================================================================
// Response Parsing
// ============================================================================

function parseGrpcTrailers(trailers: Record<string, string | string[] | undefined>): {
  status: number;
  message: string;
} {
  const status = parseInt(trailers["grpc-status"] as string, 10) || 0;
  const message = (trailers["grpc-message"] as string) || "";
  return { status, message };
}

// ============================================================================
// Test Cases
// ============================================================================

interface TestCase {
  name: string;
  build: (version: string) => Buffer;
}

const TEST_CASES: TestCase[] = [
  {
    name: "Minimal request (just model)",
    build: () => {
      const bytes: number[] = [];
      bytes.push(...encodeVarintField(4, 4)); // GPT_4O_MINI
      return Buffer.from(bytes);
    },
  },
  {
    name: "With message only",
    build: () => {
      const bytes: number[] = [];
      const msg = buildFormattedChatMessage(1, "Hello");
      bytes.push(...encodeMessage(2, msg));
      bytes.push(...encodeVarintField(4, 4));
      return Buffer.from(bytes);
    },
  },
  {
    name: "With metadata + message",
    build: (version) => {
      return buildRequest(version, [{ role: 1, content: "Say hi" }], 4);
    },
  },
  {
    name: "Full request with system prompt",
    build: (version) => {
      return buildRequest(
        version,
        [{ role: 1, content: "What is 2+2?" }],
        4,
        "You are a helpful assistant."
      );
    },
  },
];

async function runTest(creds: Credentials, testCase: TestCase): Promise<void> {
  return new Promise((resolve) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Test: ${testCase.name}`);
    console.log("=".repeat(60));

    const payload = testCase.build(creds.version);
    const framedRequest = grpcFrame(payload);

    console.log(`Payload size: ${payload.length} bytes`);
    console.log(`Payload hex: ${payload.toString("hex")}`);

    const client = http2.connect(`http://localhost:${creds.port}`);

    client.on("error", (err) => {
      console.log("Connection error:", err.message);
      resolve();
    });

    const req = client.request({
      ":method": "POST",
      ":path": "/exa.language_server_pb.LanguageServerService/RawGetChatMessage",
      "content-type": "application/grpc",
      "te": "trailers",
      "x-codeium-csrf-token": creds.csrfToken,
    });

    let responseData = Buffer.alloc(0);

    req.on("response", (headers) => {
      console.log(`\nResponse status: ${headers[":status"]}`);
    });

    req.on("data", (chunk: Buffer) => {
      responseData = Buffer.concat([responseData, chunk]);
    });

    req.on("trailers", (trailers) => {
      const { status, message } = parseGrpcTrailers(trailers);
      console.log(`\ngRPC status: ${status}`);
      if (message) {
        console.log(`gRPC message: ${decodeURIComponent(message)}`);
      }

      if (status === 0 && responseData.length > 0) {
        console.log(`\nResponse data: ${responseData.length} bytes`);
        console.log(`Response hex: ${responseData.toString("hex").slice(0, 200)}...`);
      }
    });

    req.on("end", () => {
      client.close();
      resolve();
    });

    req.on("error", (err) => {
      console.log("Request error:", err.message);
      client.close();
      resolve();
    });

    req.write(framedRequest);
    req.end();
  });
}

async function main() {
  console.log("=== Windsurf gRPC Request Tester ===\n");

  const creds = getCredentials();
  if (!creds) {
    console.error("Windsurf not running. Please start Windsurf first.");
    process.exit(1);
  }

  console.log("Credentials:");
  console.log(`  Version: ${creds.version}`);
  console.log(`  Port: ${creds.port}`);
  console.log(`  CSRF: ${creds.csrfToken.slice(0, 8)}...`);

  // Ensure fixtures dir exists
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });

  // Run each test case
  for (const testCase of TEST_CASES) {
    await runTest(creds, testCase);
  }

  console.log("\n\nDone!");
}

main().catch(console.error);
