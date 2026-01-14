# Windsurf/Codeium API Specification

> **Note**: This specification is based on reverse-engineering of the Windsurf extension.
> It may be incomplete or change with Windsurf updates.

## Overview

Windsurf/Codeium uses a **gRPC-web** protocol with protobuf encoding to communicate with backend servers. The architecture involves:

1. **Local Language Server**: A Go binary that handles local operations
2. **Remote API Servers**: Cloud endpoints for inference and user management

## Endpoints

### Primary Servers

| Server | URL | Purpose |
|--------|-----|---------|
| API Server | `https://server.codeium.com` | Main API operations |
| Inference Server | `https://inference.codeium.com` | Model inference |
| Registration | `https://register.windsurf.com` | User registration |
| Feature Flags | `https://unleash.codeium.com/api/` | Unleash feature flags |

### Regional Endpoints

| Region | URL |
|--------|-----|
| EU | `https://eu.windsurf.com/_route/api_server` |
| FedStart (Gov) | `https://windsurf.fedstart.com/_route/api_server` |
| Enterprise | `https://{tenant}.windsurf.com/_route/api_server` |

## Authentication

### Firebase Authentication

Windsurf uses Firebase Authentication with the following flow:

1. **Device Flow OAuth**
   - Call `StartDeviceFlow` gRPC method
   - Receive: `device_code`, `user_code`, `verification_url`
   - User visits URL and enters code
   - Poll `GetDeviceFlowState` until completion
   - Receive Firebase ID token

2. **Token Format**
   - Firebase ID Token (JWT)
   - Contains: `sub` (user ID), `email`, `exp`, `iat`
   - Expiry: Typically 1 hour

3. **Token Refresh**
   ```
   POST https://securetoken.googleapis.com/v1/token?key={FIREBASE_API_KEY}
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=refresh_token&refresh_token={REFRESH_TOKEN}
   ```

### Request Metadata

Every gRPC request includes metadata:

```protobuf
message Metadata {
  string api_key = 1;           // User's API key / Firebase token
  string ide_name = 2;          // "windsurf"
  string ide_version = 3;       // Version string
  string extension_version = 4; // Extension version
  string session_id = 5;        // Unique session ID
  string locale = 6;            // User locale
}
```

## gRPC Services

### LanguageServerService (Local)

Runs on localhost, handles IDE operations.

```protobuf
service LanguageServerService {
  // Completions
  rpc GetCompletions(GetCompletionsRequest) returns (GetCompletionsResponse);
  rpc GetStreamingCompletions(GetCompletionsRequest) returns (stream GetCompletionsResponse);
  
  // Chat/Cascade
  rpc GetChatMessage(GetChatMessageRequest) returns (GetChatMessageResponse);
  rpc SendUserCascadeMessage(SendUserCascadeMessageRequest) returns (SendUserCascadeMessageResponse);
  rpc StartCascade(StartCascadeRequest) returns (StartCascadeResponse);
  rpc StreamCascadeReactiveUpdates(StreamCascadeReactiveUpdatesRequest) returns (stream CascadeReactiveUpdate);
  
  // Auth
  rpc GetAuthToken(GetAuthTokenRequest) returns (GetAuthTokenResponse);
  rpc GetUserStatus(GetUserStatusRequest) returns (GetUserStatusResponse);
  rpc RegisterUser(RegisterUserRequest) returns (RegisterUserResponse);
}
```

### ApiServerService (Remote)

Backend API for inference and management.

```protobuf
service ApiServerService {
  // Chat/Inference
  rpc GetChatMessage(GetChatMessageRequest) returns (GetChatMessageResponse);
  rpc GetChatCompletions(GetChatCompletionsRequest) returns (GetChatCompletionsResponse);
  rpc GetStreamingCompletions(GetStreamingCompletionsRequest) returns (stream CompletionChunk);
  rpc GetStreamingExternalChatCompletions(ExternalChatRequest) returns (stream ExternalChatChunk);
  
  // Telemetry
  rpc BatchRecordCompletions(BatchRecordCompletionsRequest) returns (BatchRecordCompletionsResponse);
  rpc RecordCortexTrajectory(RecordCortexTrajectoryRequest) returns (RecordCortexTrajectoryResponse);
  
  // Rate Limiting
  rpc CheckUserMessageRateLimit(CheckRateLimitRequest) returns (CheckRateLimitResponse);
  
  // Configuration
  rpc GetCascadeModelConfigs(GetCascadeModelConfigsRequest) returns (GetCascadeModelConfigsResponse);
}
```

### ExtensionServerService

Extension-to-IDE bridge.

```protobuf
service ExtensionServerService {
  rpc StartDeviceFlow(StartDeviceFlowRequest) returns (StartDeviceFlowResponse);
  rpc GetDeviceFlowState(GetDeviceFlowStateRequest) returns (GetDeviceFlowStateResponse);
  rpc GetAuthToken(GetAuthTokenRequest) returns (GetAuthTokenResponse);
}
```

## Request/Response Formats

### Chat Message Request

```protobuf
message GetChatMessageRequest {
  Metadata metadata = 1;
  string cascade_id = 2;
  ModelOrAlias model_or_alias = 3;
  repeated ChatMessage messages = 4;
  repeated ChatToolDefinition tools = 5;
  ChatToolChoice tool_choice = 6;
  EnterpriseExternalModelConfig enterprise_config = 7;
  PromptCacheOptions cache_options = 8;
}

message ChatMessage {
  string role = 1;        // "user", "assistant", "system", "tool"
  string content = 2;
  string tool_call_id = 3;
  repeated ChatToolCall tool_calls = 4;
}

message ChatToolCall {
  string id = 1;
  string name = 2;
  string arguments = 3;   // JSON string
}
```

### Streaming Response

```protobuf
message CompletionChunk {
  oneof chunk {
    ContentChunk content = 1;
    ToolCallChunk tool_call = 2;
    DoneChunk done = 3;
    ErrorChunk error = 4;
  }
}

message ContentChunk {
  string text = 1;
}

message DoneChunk {
  UsageStats usage = 1;
}

message UsageStats {
  int32 prompt_tokens = 1;
  int32 completion_tokens = 2;
}
```

## Model Identifiers

### Windsurf Proprietary Models

| Model | ID |
|-------|-----|
| SWE-1 | `swe-1-model-id` |
| SWE-1.5 | `cognition-swe-1.5` |
| SWE-1 Lite | `swe-1-lite-model-id` |
| Vista | `vista-model-id` |
| Shamu | `shamu-model-id` |

### Claude Models

| Model | ID |
|-------|-----|
| Claude 3.5 Sonnet | `CLAUDE_3_5_SONNET_20241022` |
| Claude 3.7 Sonnet | `CLAUDE_3_7_SONNET_20250219` |
| Claude 3.7 Sonnet (Thinking) | `CLAUDE_3_7_SONNET_20250219_THINKING` |
| Claude 4 Opus | `CLAUDE_4_OPUS` |
| Claude 4 Opus (Thinking) | `CLAUDE_4_OPUS_THINKING` |
| Claude 4 Sonnet | `CLAUDE_4_SONNET` |
| Claude 4.5 Sonnet | `CLAUDE_4_5_SONNET` |
| Claude 4.5 Opus | `CLAUDE_4_5_OPUS` |

### Gemini Models

| Model | ID |
|-------|-----|
| Gemini 2.5 Flash | `GEMINI_2_5_FLASH` |
| Gemini 2.5 Pro | `GEMINI_2_5_PRO` |
| Gemini 3.0 Flash High | `GEMINI_3_0_FLASH_HIGH` |
| Gemini 3.0 Pro High | `GEMINI_3_0_PRO_HIGH` |

### OpenAI Models

| Model | ID |
|-------|-----|
| GPT-4o | `GPT_4O_2024_08_06` |
| GPT-4.1 | `GPT_4_1` |
| GPT-4.5 | `GPT_4_5` |
| O1 | `O1` |
| O1 Mini | `O1_MINI` |

## HTTP Headers

```
Content-Type: application/grpc-web+proto
X-Codeium-Csrf-Token: {csrf_token}
Authorization: Bearer {firebase_id_token}
User-Agent: windsurf/{version}
```

## Rate Limiting

- Rate limits vary by subscription tier
- 429 responses include `Retry-After` header
- `CheckUserMessageRateLimit` can be called proactively

## Local Storage

### Config Locations

| Platform | Path |
|----------|------|
| macOS | `~/.codeium/windsurf/` |
| Linux | `~/.config/Windsurf/` |
| Windows | `%APPDATA%\Windsurf\` |

### Key Files

| File | Purpose |
|------|---------|
| `installation_id` | Unique installation UUID |
| `user_settings.pb` | Protobuf settings |
| `mcp_config.json` | MCP configuration |

### Keychain (macOS)

- Service: `Windsurf Safe Storage`
- Account: `Windsurf Key`
- Note: Encrypted with Electron's safeStorage

## BYOK (Bring Your Own Key)

Windsurf supports BYOK for:
- Claude models (`*_BYOK` variants)
- OpenRouter models (`*_OPEN_ROUTER_BYOK` variants)
- Databricks models (`*_DATABRICKS` variants)

BYOK configuration is stored in user settings and sent via `EnterpriseExternalModelConfig`.
