/**
 * OpenCode Windsurf Auth Plugin
 * 
 * Enables using Windsurf/Codeium models through OpenCode by leveraging
 * Windsurf's local language server and authentication.
 * 
 * @example
 * ```typescript
 * import { WindsurfPlugin } from 'opencode-windsurf-codeium';
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

export {
  createWindsurfPlugin,
  WindsurfPlugin,
  CodeiumPlugin,
} from './src/plugin.js';

// Default export for OpenCode plugin loader compatibility
export { WindsurfPlugin as default } from './src/plugin.js';
