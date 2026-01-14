/**
 * OpenCode Windsurf Auth Plugin
 * 
 * Enables using Windsurf/Codeium models through OpenCode by leveraging
 * Windsurf's local language server and authentication.
 * 
 * @example
 * ```typescript
 * import { WindsurfPlugin } from 'opencode-windsurf-auth';
 * 
 * // Use in OpenCode configuration
 * export default {
 *   plugins: [WindsurfPlugin],
 * };
 * ```
 * 
 * Requirements:
 * - Windsurf must be installed and running
 * - User must be logged into Windsurf
 */

// Main plugin exports
export { 
  createWindsurfPlugin, 
  WindsurfPlugin, 
  CodeiumPlugin 
} from './src/plugin.js';

// Auth/credential utilities
export { 
  getCredentials,
  getCSRFToken,
  getPort,
  getApiKey,
  getWindsurfVersion,
  isWindsurfRunning,
  isWindsurfInstalled,
  validateCredentials,
  WindsurfError,
  WindsurfErrorCode,
} from './src/plugin/auth.js';

export type { WindsurfCredentials } from './src/plugin/auth.js';

// gRPC client
export { 
  streamChat, 
  streamChatGenerator 
} from './src/plugin/grpc-client.js';

export type { ChatMessage, StreamChatOptions } from './src/plugin/grpc-client.js';

// Model utilities
export {
  modelNameToEnum,
  enumToModelName,
  getSupportedModels,
  isModelSupported,
  getDefaultModel,
  getDefaultModelEnum,
  getCanonicalModels,
} from './src/plugin/models.js';

// Constants
export {
  PLUGIN_ID,
  GRPC_SERVICES,
  GRPC_METHODS,
} from './src/constants.js';

// Types
export { 
  ModelEnum, 
  ChatMessageSource 
} from './src/plugin/types.js';

export type { 
  ModelEnumValue, 
  ChatMessageSourceValue 
} from './src/plugin/types.js';
