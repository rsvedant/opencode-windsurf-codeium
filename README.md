# opencode-windsurf-auth

OpenCode plugin for Windsurf/Codeium authentication - use Windsurf models in OpenCode.

## Overview

This plugin enables OpenCode users to access Windsurf/Codeium models by leveraging their existing Windsurf installation. It communicates directly with the **local Windsurf language server** via gRPC - no network traffic capture or OAuth flows required.

### How It Works

1. **Credential Discovery**: Extracts CSRF token and port from the running `language_server_macos` process
2. **API Key**: Reads from `~/.codeium/config.json`
3. **gRPC Communication**: Sends requests to `localhost:{port}` using HTTP/2 gRPC protocol
4. **Response Transformation**: Converts gRPC responses to OpenAI-compatible SSE format

### Supported Models (90+)

| Category | Models |
|----------|--------|
| **SWE** | `swe-1.5`, `swe-1.5-thinking` |
| **Claude** | `claude-3.5-sonnet`, `claude-3.7-sonnet`, `claude-4-opus`, `claude-4-sonnet`, `claude-4.5-sonnet`, `claude-4.5-opus`, `claude-code` |
| **GPT** | `gpt-4o`, `gpt-4.5`, `gpt-4.1`, `gpt-5`, `gpt-5.2`, `gpt-5-codex` |
| **O-Series** | `o1`, `o3`, `o3-mini`, `o3-pro`, `o4-mini` |
| **Gemini** | `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-3.0-pro` |
| **DeepSeek** | `deepseek-v3`, `deepseek-r1`, `deepseek-r1-fast` |
| **Llama** | `llama-3.1-8b`, `llama-3.1-70b`, `llama-3.1-405b`, `llama-3.3-70b` |
| **Qwen** | `qwen-2.5-72b`, `qwen-3-235b`, `qwen-3-coder-480b` |
| **Grok** | `grok-2`, `grok-3`, `grok-code-fast` |
| **Other** | `mistral-7b`, `kimi-k2`, `glm-4.5`, `minimax-m2` |

## Prerequisites

1. **Windsurf IDE installed** - Download from [windsurf.com](https://windsurf.com)
2. **Windsurf running** - The plugin communicates with the local language server
3. **Logged into Windsurf** - Provides API key in `~/.codeium/config.json`
4. **Active Windsurf subscription** - Model access depends on your plan

## Installation

```bash
npm install opencode-windsurf-auth
```

## Usage

Add to your OpenCode configuration (`~/.config/opencode/opencode.json`):

```json
{
  "plugin": ["opencode-windsurf-auth"],
  "provider": {
    "windsurf": {
      "models": {
        "claude-4.5-sonnet": {
          "name": "Claude 4.5 Sonnet (Windsurf)",
          "limit": { "context": 200000, "output": 64000 }
        },
        "swe-1.5": {
          "name": "SWE 1.5 (Windsurf)",
          "limit": { "context": 128000, "output": 32000 }
        },
        "gpt-5": {
          "name": "GPT-5 (Windsurf)",
          "limit": { "context": 128000, "output": 32000 }
        }
      }
    }
  }
}
```

Then run:

```bash
opencode run "Hello" --model=windsurf/claude-4.5-sonnet
```

## Verification

To verify the plugin can communicate with Windsurf:

```bash
# 1. Check Windsurf is running
ps aux | grep language_server_macos

# 2. Extract credentials manually
ps aux | grep language_server_macos | grep -oE '\-\-csrf_token\s+[a-f0-9-]+'
ps aux | grep language_server_macos | grep -oE '\-\-extension_server_port\s+[0-9]+'
cat ~/.codeium/config.json | grep apiKey

# 3. Test gRPC endpoint (port = extension_server_port + 2)
curl -X POST http://localhost:{port}/exa.language_server_pb.LanguageServerService/RawGetChatMessage \
  -H "content-type: application/grpc" \
  -H "te: trailers" \
  -H "x-codeium-csrf-token: YOUR_TOKEN" \
  --data-binary ""
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   OpenCode      │────▶│  Windsurf Plugin │────▶│  language_server    │
│   (requests)    │     │  (transform)     │     │  (local gRPC)       │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  ~/.codeium/     │
                        │  config.json     │
                        │  (API key)       │
                        └──────────────────┘
```

### File Structure

```
src/
├── plugin.ts              # Main plugin, OpenAI-compatible fetch handler
├── constants.ts           # Plugin ID, gRPC service names
└── plugin/
    ├── auth.ts            # Credential discovery from process args
    ├── grpc-client.ts     # HTTP/2 gRPC client with protobuf encoding
    ├── models.ts          # Model name → enum mappings
    └── types.ts           # TypeScript types, ModelEnum values
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run typecheck

# Run tests
npm test
```

## How It Works (Technical Details)

### 1. Credential Discovery

The plugin discovers credentials from the running Windsurf process:

```bash
# Process args contain:
--csrf_token abc123-def456-...
--extension_server_port 42100
--windsurf_version 1.13.104
```

The gRPC port is `extension_server_port + 2`.

### 2. Protobuf Encoding

Requests are manually encoded to protobuf format (no protobuf library needed):

```typescript
// Encode a string field (wire type 2)
function encodeString(fieldNum: number, str: string): number[] {
  const strBytes = Buffer.from(str, 'utf8');
  return [(fieldNum << 3) | 2, ...encodeVarint(strBytes.length), ...strBytes];
}
```

### 3. Model Enum Values

Model names are mapped to protobuf enum values extracted from Windsurf's `extension.js`:

```typescript
const ModelEnum = {
  CLAUDE_4_5_SONNET: 353,
  CLAUDE_4_5_OPUS: 391,
  GPT_5: 340,
  SWE_1_5: 359,
  // ... 80+ more
};
```

### 4. gRPC Service

Requests go to the local language server:

```
POST http://localhost:{port}/exa.language_server_pb.LanguageServerService/RawGetChatMessage
Headers:
  content-type: application/grpc
  te: trailers
  x-codeium-csrf-token: {csrf_token}
```

## Reverse Engineering Notes

The model enum values were extracted from:
```
/Applications/Windsurf.app/Contents/Resources/app/extensions/windsurf/dist/extension.js
```

To discover new models:
```bash
grep -oE '[A-Z0-9_]+\s*=\s*[0-9]+' extension.js | grep -E 'CLAUDE|GPT|GEMINI|DEEPSEEK'
```

## Known Limitations

- **Windsurf must be running** - The plugin communicates with the local language server
- **macOS focus** - Linux/Windows paths need verification
- **Response parsing** - Uses heuristic text extraction from protobuf (may miss edge cases)
- **No tool calling yet** - Basic chat completion only

## Related Projects

- [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) - Similar plugin for Google's Antigravity API

## License

MIT
