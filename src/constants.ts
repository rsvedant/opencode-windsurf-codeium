/**
 * Windsurf/Codeium API Constants
 * 
 * Based on reverse-engineering of Windsurf extension.js
 * These endpoints and configurations may change with Windsurf updates.
 */

// ============================================================================
// API Endpoints
// ============================================================================

/** Primary Codeium API server */
export const CODEIUM_API_SERVER = 'https://server.codeium.com';

/** Inference API server */
export const CODEIUM_INFERENCE_SERVER = 'https://inference.codeium.com';

/** User registration server */
export const WINDSURF_REGISTER_SERVER = 'https://register.windsurf.com';

/** Feature flags (Unleash) */
export const CODEIUM_UNLEASH_SERVER = 'https://unleash.codeium.com/api';

/** EU region endpoint */
export const WINDSURF_EU_SERVER = 'https://eu.windsurf.com/_route/api_server';

/** FedStart (government) endpoint */
export const WINDSURF_FEDSTART_SERVER = 'https://windsurf.fedstart.com/_route/api_server';

// ============================================================================
// gRPC Service Paths
// ============================================================================

/** gRPC-web content types */
export const GRPC_CONTENT_TYPES = {
  PROTO: 'application/grpc-web+proto',
  JSON: 'application/grpc-web+json',
  NATIVE: 'application/grpc+proto',
} as const;

/** Known gRPC service namespaces (from extension analysis) */
export const GRPC_SERVICES = {
  LANGUAGE_SERVER: 'exa.language_server_pb.LanguageServerService',
  API_SERVER: 'exa.api_server_pb.ApiServerService',
  SEAT_MANAGEMENT: 'exa.seat_management_pb.SeatManagementService',
  EXTENSION_SERVER: 'exa.extension_server_pb.ExtensionServerService',
} as const;

/** Key gRPC methods for inference */
export const GRPC_METHODS = {
  // Chat/Cascade methods
  GET_CHAT_MESSAGE: 'GetChatMessage',
  GET_CHAT_COMPLETIONS: 'GetChatCompletions',
  SEND_USER_CASCADE_MESSAGE: 'SendUserCascadeMessage',
  START_CASCADE: 'StartCascade',
  STREAM_CASCADE_REACTIVE_UPDATES: 'StreamCascadeReactiveUpdates',
  
  // Auth methods
  GET_AUTH_TOKEN: 'GetAuthToken',
  GET_USER_STATUS: 'GetUserStatus',
  REGISTER_USER: 'RegisterUser',
  START_DEVICE_FLOW: 'StartDeviceFlow',
  GET_DEVICE_FLOW_STATE: 'GetDeviceFlowState',
  
  // Completions
  GET_COMPLETIONS: 'GetCompletions',
  GET_STREAMING_COMPLETIONS: 'GetStreamingCompletions',
} as const;

// ============================================================================
// Model Identifiers
// ============================================================================

/** Windsurf internal model identifiers */
export const WINDSURF_MODELS = {
  // SWE models (Windsurf's proprietary)
  SWE_1: 'swe-1-model-id',
  SWE_1_5: 'cognition-swe-1.5',
  SWE_1_LITE: 'swe-1-lite-model-id',
  VISTA: 'vista-model-id',
  SHAMU: 'shamu-model-id',
  
  // Claude models
  CLAUDE_3_5_SONNET: 'CLAUDE_3_5_SONNET_20241022',
  CLAUDE_3_7_SONNET: 'CLAUDE_3_7_SONNET_20250219',
  CLAUDE_3_7_SONNET_THINKING: 'CLAUDE_3_7_SONNET_20250219_THINKING',
  CLAUDE_4_OPUS: 'CLAUDE_4_OPUS',
  CLAUDE_4_OPUS_THINKING: 'CLAUDE_4_OPUS_THINKING',
  CLAUDE_4_SONNET: 'CLAUDE_4_SONNET',
  CLAUDE_4_SONNET_THINKING: 'CLAUDE_4_SONNET_THINKING',
  CLAUDE_4_5_SONNET: 'CLAUDE_4_5_SONNET',
  CLAUDE_4_5_SONNET_THINKING: 'CLAUDE_4_5_SONNET_THINKING',
  CLAUDE_4_5_OPUS: 'CLAUDE_4_5_OPUS',
  CLAUDE_4_5_OPUS_THINKING: 'CLAUDE_4_5_OPUS_THINKING',
  
  // Gemini models
  GEMINI_2_5_FLASH: 'GEMINI_2_5_FLASH',
  GEMINI_2_5_PRO: 'GEMINI_2_5_PRO',
  GEMINI_3_0_FLASH_HIGH: 'GEMINI_3_0_FLASH_HIGH',
  GEMINI_3_0_PRO_HIGH: 'GEMINI_3_0_PRO_HIGH',
  
  // OpenAI models
  GPT_4O: 'GPT_4O_2024_08_06',
  GPT_4_1: 'GPT_4_1',
  GPT_4_5: 'GPT_4_5',
  O1: 'O1',
  O1_MINI: 'O1_MINI',
} as const;

/** Model name mapping: OpenCode model names -> Windsurf model IDs */
export const MODEL_NAME_MAP: Record<string, string> = {
  // SWE models
  'swe-1': WINDSURF_MODELS.SWE_1,
  'swe-1.5': WINDSURF_MODELS.SWE_1_5,
  'swe-1-lite': WINDSURF_MODELS.SWE_1_LITE,
  
  // Claude models
  'claude-3.5-sonnet': WINDSURF_MODELS.CLAUDE_3_5_SONNET,
  'claude-3.7-sonnet': WINDSURF_MODELS.CLAUDE_3_7_SONNET,
  'claude-3.7-sonnet-thinking': WINDSURF_MODELS.CLAUDE_3_7_SONNET_THINKING,
  'claude-4-opus': WINDSURF_MODELS.CLAUDE_4_OPUS,
  'claude-4-opus-thinking': WINDSURF_MODELS.CLAUDE_4_OPUS_THINKING,
  'claude-4-sonnet': WINDSURF_MODELS.CLAUDE_4_SONNET,
  'claude-4-sonnet-thinking': WINDSURF_MODELS.CLAUDE_4_SONNET_THINKING,
  'claude-4.5-sonnet': WINDSURF_MODELS.CLAUDE_4_5_SONNET,
  'claude-4.5-sonnet-thinking': WINDSURF_MODELS.CLAUDE_4_5_SONNET_THINKING,
  'claude-4.5-opus': WINDSURF_MODELS.CLAUDE_4_5_OPUS,
  'claude-4.5-opus-thinking': WINDSURF_MODELS.CLAUDE_4_5_OPUS_THINKING,
  
  // Gemini models
  'gemini-2.5-flash': WINDSURF_MODELS.GEMINI_2_5_FLASH,
  'gemini-2.5-pro': WINDSURF_MODELS.GEMINI_2_5_PRO,
  'gemini-3-flash': WINDSURF_MODELS.GEMINI_3_0_FLASH_HIGH,
  'gemini-3-pro': WINDSURF_MODELS.GEMINI_3_0_PRO_HIGH,
  
  // OpenAI models
  'gpt-4o': WINDSURF_MODELS.GPT_4O,
  'gpt-4.1': WINDSURF_MODELS.GPT_4_1,
  'gpt-4.5': WINDSURF_MODELS.GPT_4_5,
  'o1': WINDSURF_MODELS.O1,
  'o1-mini': WINDSURF_MODELS.O1_MINI,
};

// ============================================================================
// Authentication
// ============================================================================

/** macOS Keychain service name for Windsurf credentials */
export const KEYCHAIN_SERVICE = 'Windsurf Safe Storage';

/** Keychain account name */
export const KEYCHAIN_ACCOUNT = 'Windsurf Key';

/** Windsurf config directories */
export const WINDSURF_CONFIG_PATHS = {
  /** Primary config directory */
  CODEIUM: '~/.codeium/windsurf',
  /** macOS Application Support */
  APP_SUPPORT: '~/Library/Application Support/Windsurf',
  /** Linux config */
  LINUX_CONFIG: '~/.config/Windsurf',
} as const;

/** Installation ID file path */
export const INSTALLATION_ID_PATH = '~/.codeium/windsurf/installation_id';

// ============================================================================
// Plugin Configuration
// ============================================================================

/** Default local language server port (0 = dynamic) */
export const DEFAULT_LANGUAGE_SERVER_PORT = 0;

/** Language server binary path (macOS ARM) */
export const LANGUAGE_SERVER_BINARY = '/Applications/Windsurf.app/Contents/Resources/app/extensions/windsurf/bin/language_server_macos_arm';

/** Plugin identifier */
export const PLUGIN_ID = 'windsurf';

/** Storage file name */
export const ACCOUNTS_FILE = 'windsurf-accounts.json';

/** User agent for requests */
export const USER_AGENT = 'opencode-windsurf-auth/0.1.0';

// ============================================================================
// Headers
// ============================================================================

/** Headers to include in requests */
export const DEFAULT_HEADERS = {
  'User-Agent': USER_AGENT,
  'X-Codeium-Csrf-Token': '', // Populated at runtime
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================

/** Rate limit backoff configuration */
export const RATE_LIMIT_CONFIG = {
  /** Initial backoff in ms */
  INITIAL_BACKOFF_MS: 1000,
  /** Maximum backoff in ms */
  MAX_BACKOFF_MS: 60000,
  /** Backoff multiplier */
  BACKOFF_MULTIPLIER: 2,
  /** Maximum retry attempts */
  MAX_RETRIES: 5,
} as const;
