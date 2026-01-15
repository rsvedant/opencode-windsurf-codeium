/**
 * Model name to enum mappings for Windsurf gRPC protocol
 * 
 * Maps OpenAI-compatible model names to Windsurf protobuf enum values.
 * These values were extracted from Windsurf's extension.js.
 * 
 * To discover/verify these values:
 * 1. Find: /Applications/Windsurf.app/Contents/Resources/app/extensions/windsurf/dist/extension.js
 * 2. Search: grep -oE 'CLAUDE[A-Z0-9_]+\s*=\s*[0-9]+' extension.js
 */

import { ModelEnum, type ModelEnumValue } from './types.js';

// ==========================================================================
// Variant-aware catalog
// ==========================================================================

type VariantName = string;

type VariantMeta = {
  /** Human-oriented hint used in /v1/models variants payload */
  description?: string;
  /** Maps to Windsurf enum */
  enumValue: ModelEnumValue;
};

type ModelCatalogEntry = {
  /** Canonical model id exposed to OpenCode */
  id: string;
  /** Default enum when no variant supplied */
  defaultEnum: ModelEnumValue;
  /** Optional variants keyed by variant name (lowercase) */
  variants?: Record<VariantName, VariantMeta>;
  /** Aliases accepted for backwards compatibility */
  aliases?: string[];
};

// ==========================================================================
// Variant Catalog
// ==========================================================================

const VARIANT_CATALOG: Record<string, ModelCatalogEntry> = {
  // Claude thinking variants
  'claude-3.7-sonnet': {
    id: 'claude-3.7-sonnet',
    defaultEnum: ModelEnum.CLAUDE_3_7_SONNET_20250219,
    variants: {
      thinking: { enumValue: ModelEnum.CLAUDE_3_7_SONNET_20250219_THINKING, description: 'Thinking mode' },
    },
  },
  'claude-4.5-sonnet': {
    id: 'claude-4.5-sonnet',
    defaultEnum: ModelEnum.CLAUDE_4_5_SONNET,
    variants: {
      thinking: { enumValue: ModelEnum.CLAUDE_4_5_SONNET_THINKING, description: 'Thinking mode' },
    },
  },
  'claude-4.5-opus': {
    id: 'claude-4.5-opus',
    defaultEnum: ModelEnum.CLAUDE_4_5_OPUS,
    variants: {
      thinking: { enumValue: ModelEnum.CLAUDE_4_5_OPUS_THINKING, description: 'Thinking mode' },
    },
  },
  'claude-4.1-opus': {
    id: 'claude-4.1-opus',
    defaultEnum: ModelEnum.CLAUDE_4_1_OPUS,
    variants: {
      thinking: { enumValue: ModelEnum.CLAUDE_4_1_OPUS_THINKING, description: 'Thinking mode' },
    },
    aliases: ['claude-4-1-opus'],
  },
  'claude-4-opus': {
    id: 'claude-4-opus',
    defaultEnum: ModelEnum.CLAUDE_4_OPUS,
    variants: {
      thinking: { enumValue: ModelEnum.CLAUDE_4_OPUS_THINKING, description: 'Thinking mode' },
    },
  },
  'claude-4-sonnet': {
    id: 'claude-4-sonnet',
    defaultEnum: ModelEnum.CLAUDE_4_SONNET,
    variants: {
      thinking: { enumValue: ModelEnum.CLAUDE_4_SONNET_THINKING, description: 'Thinking mode' },
    },
  },

  // Google Gemini 2.5 / 3.0
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    defaultEnum: ModelEnum.GEMINI_2_5_FLASH,
    variants: {
      thinking: { enumValue: ModelEnum.GEMINI_2_5_FLASH_THINKING, description: 'Thinking budget enabled' },
      lite: { enumValue: ModelEnum.GEMINI_2_5_FLASH_LITE, description: 'Lite / lower cost' },
    },
    aliases: ['gemini-2-5-flash'],
  },
  // Google Gemini 3.0 Pro
  'gemini-3.0-pro': {
    id: 'gemini-3.0-pro',
    defaultEnum: ModelEnum.GEMINI_3_0_PRO_MEDIUM,
    variants: {
      minimal: { enumValue: ModelEnum.GEMINI_3_0_PRO_MINIMAL, description: 'Cheaper, least reasoning' },
      low: { enumValue: ModelEnum.GEMINI_3_0_PRO_LOW, description: 'Lower cost / speed' },
      medium: { enumValue: ModelEnum.GEMINI_3_0_PRO_MEDIUM, description: 'Balanced (default)' },
      high: { enumValue: ModelEnum.GEMINI_3_0_PRO_HIGH, description: 'Higher reasoning budget' },
    },
    aliases: ['gemini-3-0-pro'],
  },
  // Google Gemini 3.0 Flash
  'gemini-3.0-flash': {
    id: 'gemini-3.0-flash',
    defaultEnum: ModelEnum.GEMINI_3_0_FLASH_MEDIUM,
    variants: {
      minimal: { enumValue: ModelEnum.GEMINI_3_0_FLASH_MINIMAL, description: 'Cheapest, lowest latency' },
      low: { enumValue: ModelEnum.GEMINI_3_0_FLASH_LOW, description: 'Low thinking budget' },
      medium: { enumValue: ModelEnum.GEMINI_3_0_FLASH_MEDIUM, description: 'Balanced (default)' },
      high: { enumValue: ModelEnum.GEMINI_3_0_FLASH_HIGH, description: 'Higher reasoning budget' },
    },
    aliases: ['gemini-3-0-flash'],
  },
  // GPT 5.2
  'gpt-5.2': {
    id: 'gpt-5.2',
    defaultEnum: ModelEnum.GPT_5_2_MEDIUM,
    variants: {
      low: { enumValue: ModelEnum.GPT_5_2_LOW, description: 'Lower cost' },
      medium: { enumValue: ModelEnum.GPT_5_2_MEDIUM, description: 'Balanced (default)' },
      high: { enumValue: ModelEnum.GPT_5_2_HIGH, description: 'Higher capability' },
      xhigh: { enumValue: ModelEnum.GPT_5_2_XHIGH, description: 'Maximum capability' },
      priority: { enumValue: ModelEnum.GPT_5_2_MEDIUM_PRIORITY, description: 'Priority routing (medium)' },
      'low-priority': { enumValue: ModelEnum.GPT_5_2_LOW_PRIORITY, description: 'Priority routing (low)' },
      'high-priority': { enumValue: ModelEnum.GPT_5_2_HIGH_PRIORITY, description: 'Priority routing (high)' },
      'xhigh-priority': { enumValue: ModelEnum.GPT_5_2_XHIGH_PRIORITY, description: 'Priority routing (xhigh)' },
    },
    aliases: ['gpt-5-2'],
  },
  // GPT 5
  'gpt-5': {
    id: 'gpt-5',
    defaultEnum: ModelEnum.GPT_5,
    variants: {
      low: { enumValue: ModelEnum.GPT_5_LOW, description: 'Lower cost' },
      high: { enumValue: ModelEnum.GPT_5_HIGH, description: 'Higher capability' },
      nano: { enumValue: ModelEnum.GPT_5_NANO, description: 'Small footprint' },
    },
  },
  // GPT 5.1 Codex families
  'gpt-5.1-codex-mini': {
    id: 'gpt-5.1-codex-mini',
    defaultEnum: ModelEnum.GPT_5_1_CODEX_MINI_MEDIUM,
    variants: {
      low: { enumValue: ModelEnum.GPT_5_1_CODEX_MINI_LOW },
      medium: { enumValue: ModelEnum.GPT_5_1_CODEX_MINI_MEDIUM },
      high: { enumValue: ModelEnum.GPT_5_1_CODEX_MINI_HIGH },
    },
    aliases: ['gpt-5-1-codex-mini'],
  },
  'gpt-5.1-codex': {
    id: 'gpt-5.1-codex',
    defaultEnum: ModelEnum.GPT_5_1_CODEX_MEDIUM,
    variants: {
      low: { enumValue: ModelEnum.GPT_5_1_CODEX_LOW },
      medium: { enumValue: ModelEnum.GPT_5_1_CODEX_MEDIUM },
      high: { enumValue: ModelEnum.GPT_5_1_CODEX_HIGH },
    },
    aliases: ['gpt-5-1-codex'],
  },
  'gpt-5.1-codex-max': {
    id: 'gpt-5.1-codex-max',
    defaultEnum: ModelEnum.GPT_5_1_CODEX_MAX_MEDIUM,
    variants: {
      low: { enumValue: ModelEnum.GPT_5_1_CODEX_MAX_LOW },
      medium: { enumValue: ModelEnum.GPT_5_1_CODEX_MAX_MEDIUM },
      high: { enumValue: ModelEnum.GPT_5_1_CODEX_MAX_HIGH },
    },
    aliases: ['gpt-5-1-codex-max'],
  },
  // O series
  o3: {
    id: 'o3',
    defaultEnum: ModelEnum.O3,
    variants: {
      low: { enumValue: ModelEnum.O3_LOW },
      high: { enumValue: ModelEnum.O3_HIGH },
    },
  },
  'o3-pro': {
    id: 'o3-pro',
    defaultEnum: ModelEnum.O3_PRO,
    variants: {
      low: { enumValue: ModelEnum.O3_PRO_LOW },
      high: { enumValue: ModelEnum.O3_PRO_HIGH },
    },
  },
  'o4-mini': {
    id: 'o4-mini',
    defaultEnum: ModelEnum.O4_MINI,
    variants: {
      low: { enumValue: ModelEnum.O4_MINI_LOW },
      high: { enumValue: ModelEnum.O4_MINI_HIGH },
    },
  },
};

const VARIANT_NAME_SET = new Set<string>();
for (const entry of Object.values(VARIANT_CATALOG)) {
  if (entry.variants) {
    for (const variantKey of Object.keys(entry.variants)) {
      VARIANT_NAME_SET.add(`${entry.id}-${variantKey}`);
      if (entry.aliases) {
        for (const alias of entry.aliases) {
          VARIANT_NAME_SET.add(`${alias}-${variantKey}`);
        }
      }
    }
  }
}

// Mapping of alias -> canonical id for quick lookup
const ALIAS_TO_ID: Record<string, string> = Object.values(VARIANT_CATALOG).reduce(
  (acc, entry) => {
    acc[entry.id] = entry.id;
    for (const alias of entry.aliases || []) {
      acc[alias] = entry.id;
    }
    return acc;
  },
  {} as Record<string, string>
);

function normalizeModelId(modelName: string): string {
  return modelName.toLowerCase().trim();
}

function splitModelAndVariant(raw: string): { base: string; variant?: string } {
  const normalized = normalizeModelId(raw);
  // Allow colon-delimited (opencode variants) or suffix "-<variant>"
  const colonIdx = normalized.indexOf(':');
  if (colonIdx !== -1) {
    const base = normalized.slice(0, colonIdx);
    const variant = normalized.slice(colonIdx + 1).trim();
    return { base, variant: variant || undefined };
  }

  const parts = normalized.split('-');
  if (parts.length > 1) {
    const maybeVariant = parts[parts.length - 1];
    const base = parts.slice(0, -1).join('-');
    if (VARIANT_CATALOG[ALIAS_TO_ID[base] || base]?.variants?.[maybeVariant]) {
      return { base, variant: maybeVariant };
    }
  }

  return { base: normalized };
}

// ============================================================================
// Model Name Mappings (legacy fallback)
// ============================================================================

/**
 * Map of model name strings to their protobuf enum values
 * Supports multiple aliases for each model
 */
const MODEL_NAME_TO_ENUM: Record<string, ModelEnumValue> = {
  // ============================================================================
  // Claude Models
  // ============================================================================
  'claude-3-opus': ModelEnum.CLAUDE_3_OPUS_20240229,
  'claude-3-opus-20240229': ModelEnum.CLAUDE_3_OPUS_20240229,
  'claude-3-sonnet': ModelEnum.CLAUDE_3_SONNET_20240229,
  'claude-3-sonnet-20240229': ModelEnum.CLAUDE_3_SONNET_20240229,
  'claude-3-haiku': ModelEnum.CLAUDE_3_HAIKU_20240307,
  'claude-3-haiku-20240307': ModelEnum.CLAUDE_3_HAIKU_20240307,
  
  'claude-3.5-sonnet': ModelEnum.CLAUDE_3_5_SONNET_20241022,
  'claude-3-5-sonnet': ModelEnum.CLAUDE_3_5_SONNET_20241022,
  'claude-3-5-sonnet-20241022': ModelEnum.CLAUDE_3_5_SONNET_20241022,
  'claude-3.5-haiku': ModelEnum.CLAUDE_3_5_HAIKU_20241022,
  'claude-3-5-haiku': ModelEnum.CLAUDE_3_5_HAIKU_20241022,
  'claude-3-5-haiku-20241022': ModelEnum.CLAUDE_3_5_HAIKU_20241022,
  
  'claude-3.7-sonnet': ModelEnum.CLAUDE_3_7_SONNET_20250219,
  'claude-3-7-sonnet': ModelEnum.CLAUDE_3_7_SONNET_20250219,
  'claude-3-7-sonnet-20250219': ModelEnum.CLAUDE_3_7_SONNET_20250219,
  'claude-3.7-sonnet-thinking': ModelEnum.CLAUDE_3_7_SONNET_20250219_THINKING,
  'claude-3-7-sonnet-thinking': ModelEnum.CLAUDE_3_7_SONNET_20250219_THINKING,
  
  'claude-4-opus': ModelEnum.CLAUDE_4_OPUS,
  'claude-4-opus-thinking': ModelEnum.CLAUDE_4_OPUS_THINKING,
  'claude-4-sonnet': ModelEnum.CLAUDE_4_SONNET,
  'claude-4-sonnet-thinking': ModelEnum.CLAUDE_4_SONNET_THINKING,
  
  'claude-4.1-opus': ModelEnum.CLAUDE_4_1_OPUS,
  'claude-4-1-opus': ModelEnum.CLAUDE_4_1_OPUS,
  'claude-4.1-opus-thinking': ModelEnum.CLAUDE_4_1_OPUS_THINKING,
  'claude-4-1-opus-thinking': ModelEnum.CLAUDE_4_1_OPUS_THINKING,
  
  'claude-4.5-sonnet': ModelEnum.CLAUDE_4_5_SONNET,
  'claude-4-5-sonnet': ModelEnum.CLAUDE_4_5_SONNET,
  'claude-4.5-sonnet-thinking': ModelEnum.CLAUDE_4_5_SONNET_THINKING,
  'claude-4-5-sonnet-thinking': ModelEnum.CLAUDE_4_5_SONNET_THINKING,
  // NOTE: claude-4.5-sonnet-1m is defined in enum but not available via API
  
  'claude-4.5-opus': ModelEnum.CLAUDE_4_5_OPUS,
  'claude-4-5-opus': ModelEnum.CLAUDE_4_5_OPUS,
  'claude-4.5-opus-thinking': ModelEnum.CLAUDE_4_5_OPUS_THINKING,
  'claude-4-5-opus-thinking': ModelEnum.CLAUDE_4_5_OPUS_THINKING,
  
  'claude-code': ModelEnum.CLAUDE_CODE,

  // ============================================================================
  // GPT Models
  // ============================================================================
  'gpt-4': ModelEnum.GPT_4,
  'gpt-4-turbo': ModelEnum.GPT_4_1106_PREVIEW,
  'gpt-4-1106-preview': ModelEnum.GPT_4_1106_PREVIEW,
  
  'gpt-4o': ModelEnum.GPT_4O_2024_08_06,
  'gpt-4o-2024-08-06': ModelEnum.GPT_4O_2024_08_06,
  'gpt-4o-mini': ModelEnum.GPT_4O_MINI_2024_07_18,
  'gpt-4o-mini-2024-07-18': ModelEnum.GPT_4O_MINI_2024_07_18,
  
  // NOTE: gpt-4.5 is defined in enum but not available via API
  
  'gpt-4.1': ModelEnum.GPT_4_1_2025_04_14,
  'gpt-4-1': ModelEnum.GPT_4_1_2025_04_14,
  'gpt-4.1-mini': ModelEnum.GPT_4_1_MINI_2025_04_14,
  'gpt-4-1-mini': ModelEnum.GPT_4_1_MINI_2025_04_14,
  'gpt-4.1-nano': ModelEnum.GPT_4_1_NANO_2025_04_14,
  'gpt-4-1-nano': ModelEnum.GPT_4_1_NANO_2025_04_14,
  
  'gpt-5': ModelEnum.GPT_5,
  'gpt-5-nano': ModelEnum.GPT_5_NANO,
  'gpt-5-low': ModelEnum.GPT_5_LOW,
  'gpt-5-high': ModelEnum.GPT_5_HIGH,
  'gpt-5-codex': ModelEnum.GPT_5_CODEX,
  
  // GPT 5.1 Codex variants
  'gpt-5.1-codex-mini-low': ModelEnum.GPT_5_1_CODEX_MINI_LOW,
  'gpt-5.1-codex-mini-medium': ModelEnum.GPT_5_1_CODEX_MINI_MEDIUM,
  'gpt-5.1-codex-mini-high': ModelEnum.GPT_5_1_CODEX_MINI_HIGH,
  'gpt-5.1-codex-mini': ModelEnum.GPT_5_1_CODEX_MINI_MEDIUM,
  'gpt-5.1-codex-low': ModelEnum.GPT_5_1_CODEX_LOW,
  'gpt-5.1-codex-medium': ModelEnum.GPT_5_1_CODEX_MEDIUM,
  'gpt-5.1-codex-high': ModelEnum.GPT_5_1_CODEX_HIGH,
  'gpt-5.1-codex': ModelEnum.GPT_5_1_CODEX_MEDIUM,
  'gpt-5.1-codex-max-low': ModelEnum.GPT_5_1_CODEX_MAX_LOW,
  'gpt-5.1-codex-max-medium': ModelEnum.GPT_5_1_CODEX_MAX_MEDIUM,
  'gpt-5.1-codex-max-high': ModelEnum.GPT_5_1_CODEX_MAX_HIGH,
  'gpt-5.1-codex-max': ModelEnum.GPT_5_1_CODEX_MAX_MEDIUM,
  
  // GPT 5.2 variants
  'gpt-5.2': ModelEnum.GPT_5_2_MEDIUM,
  'gpt-5-2': ModelEnum.GPT_5_2_MEDIUM,
  'gpt-5.2-low': ModelEnum.GPT_5_2_LOW,
  'gpt-5-2-low': ModelEnum.GPT_5_2_LOW,
  'gpt-5.2-high': ModelEnum.GPT_5_2_HIGH,
  'gpt-5-2-high': ModelEnum.GPT_5_2_HIGH,
  'gpt-5.2-xhigh': ModelEnum.GPT_5_2_XHIGH,
  'gpt-5-2-xhigh': ModelEnum.GPT_5_2_XHIGH,
  'gpt-5.2-priority': ModelEnum.GPT_5_2_MEDIUM_PRIORITY,
  'gpt-5.2-low-priority': ModelEnum.GPT_5_2_LOW_PRIORITY,
  'gpt-5.2-high-priority': ModelEnum.GPT_5_2_HIGH_PRIORITY,
  'gpt-5.2-xhigh-priority': ModelEnum.GPT_5_2_XHIGH_PRIORITY,

  // ============================================================================
  // O-Series (OpenAI Reasoning)
  // NOTE: o1, o1-mini, o1-preview are deprecated - use o3/o4 series instead
  // ============================================================================
  'o3': ModelEnum.O3,
  'o3-mini': ModelEnum.O3_MINI,
  'o3-low': ModelEnum.O3_LOW,
  'o3-high': ModelEnum.O3_HIGH,
  
  'o3-pro': ModelEnum.O3_PRO,
  'o3-pro-low': ModelEnum.O3_PRO_LOW,
  'o3-pro-high': ModelEnum.O3_PRO_HIGH,
  
  'o4-mini': ModelEnum.O4_MINI,
  'o4-mini-low': ModelEnum.O4_MINI_LOW,
  'o4-mini-high': ModelEnum.O4_MINI_HIGH,

  // ============================================================================
  // Google Gemini
  // NOTE: gemini-1.0-pro and gemini-1.5-pro are deprecated - use 2.x+ versions
  // ============================================================================
  'gemini-2.0-flash': ModelEnum.GEMINI_2_0_FLASH,
  'gemini-2-0-flash': ModelEnum.GEMINI_2_0_FLASH,
  
  'gemini-2.5-pro': ModelEnum.GEMINI_2_5_PRO,
  'gemini-2-5-pro': ModelEnum.GEMINI_2_5_PRO,
  'gemini-2.5-flash': ModelEnum.GEMINI_2_5_FLASH,
  'gemini-2-5-flash': ModelEnum.GEMINI_2_5_FLASH,
  'gemini-2.5-flash-thinking': ModelEnum.GEMINI_2_5_FLASH_THINKING,
  'gemini-2-5-flash-thinking': ModelEnum.GEMINI_2_5_FLASH_THINKING,
  'gemini-2.5-flash-lite': ModelEnum.GEMINI_2_5_FLASH_LITE,
  'gemini-2-5-flash-lite': ModelEnum.GEMINI_2_5_FLASH_LITE,
  
  'gemini-3.0-pro-low': ModelEnum.GEMINI_3_0_PRO_LOW,
  'gemini-3-0-pro-low': ModelEnum.GEMINI_3_0_PRO_LOW,
  'gemini-3.0-pro-high': ModelEnum.GEMINI_3_0_PRO_HIGH,
  'gemini-3-0-pro-high': ModelEnum.GEMINI_3_0_PRO_HIGH,
  'gemini-3.0-pro': ModelEnum.GEMINI_3_0_PRO_MEDIUM,
  'gemini-3-0-pro': ModelEnum.GEMINI_3_0_PRO_MEDIUM,
  'gemini-3.0-pro-minimal': ModelEnum.GEMINI_3_0_PRO_MINIMAL,
  'gemini-3-0-pro-minimal': ModelEnum.GEMINI_3_0_PRO_MINIMAL,
  'gemini-3.0-pro-medium': ModelEnum.GEMINI_3_0_PRO_MEDIUM,
  'gemini-3-0-pro-medium': ModelEnum.GEMINI_3_0_PRO_MEDIUM,
  'gemini-3.0-flash': ModelEnum.GEMINI_3_0_FLASH_MEDIUM,
  'gemini-3-0-flash': ModelEnum.GEMINI_3_0_FLASH_MEDIUM,
  'gemini-3.0-flash-minimal': ModelEnum.GEMINI_3_0_FLASH_MINIMAL,
  'gemini-3-0-flash-minimal': ModelEnum.GEMINI_3_0_FLASH_MINIMAL,
  'gemini-3.0-flash-low': ModelEnum.GEMINI_3_0_FLASH_LOW,
  'gemini-3-0-flash-low': ModelEnum.GEMINI_3_0_FLASH_LOW,
  'gemini-3.0-flash-medium': ModelEnum.GEMINI_3_0_FLASH_MEDIUM,
  'gemini-3-0-flash-medium': ModelEnum.GEMINI_3_0_FLASH_MEDIUM,
  'gemini-3.0-flash-high': ModelEnum.GEMINI_3_0_FLASH_HIGH,
  'gemini-3-0-flash-high': ModelEnum.GEMINI_3_0_FLASH_HIGH,

  // ============================================================================
  // DeepSeek
  // ============================================================================
  'deepseek-v3': ModelEnum.DEEPSEEK_V3,
  'deepseek-v3-2': ModelEnum.DEEPSEEK_V3_2,
  'deepseek-r1': ModelEnum.DEEPSEEK_R1,
  'deepseek-r1-fast': ModelEnum.DEEPSEEK_R1_FAST,
  'deepseek-r1-slow': ModelEnum.DEEPSEEK_R1_SLOW,

  // ============================================================================
  // Llama
  // ============================================================================
  'llama-3.1-8b': ModelEnum.LLAMA_3_1_8B_INSTRUCT,
  'llama-3-1-8b': ModelEnum.LLAMA_3_1_8B_INSTRUCT,
  'llama-3.1-70b': ModelEnum.LLAMA_3_1_70B_INSTRUCT,
  'llama-3-1-70b': ModelEnum.LLAMA_3_1_70B_INSTRUCT,
  'llama-3.1-405b': ModelEnum.LLAMA_3_1_405B_INSTRUCT,
  'llama-3-1-405b': ModelEnum.LLAMA_3_1_405B_INSTRUCT,
  'llama-3.3-70b': ModelEnum.LLAMA_3_3_70B_INSTRUCT,
  'llama-3-3-70b': ModelEnum.LLAMA_3_3_70B_INSTRUCT,
  'llama-3.3-70b-r1': ModelEnum.LLAMA_3_3_70B_INSTRUCT_R1,
  'llama-3-3-70b-r1': ModelEnum.LLAMA_3_3_70B_INSTRUCT_R1,

  // ============================================================================
  // Qwen
  // ============================================================================
  'qwen-2.5-7b': ModelEnum.QWEN_2_5_7B_INSTRUCT,
  'qwen-2-5-7b': ModelEnum.QWEN_2_5_7B_INSTRUCT,
  'qwen-2.5-32b': ModelEnum.QWEN_2_5_32B_INSTRUCT,
  'qwen-2-5-32b': ModelEnum.QWEN_2_5_32B_INSTRUCT,
  'qwen-2.5-72b': ModelEnum.QWEN_2_5_72B_INSTRUCT,
  'qwen-2-5-72b': ModelEnum.QWEN_2_5_72B_INSTRUCT,
  'qwen-3-235b': ModelEnum.QWEN_3_235B_INSTRUCT,
  'qwen-3-coder-480b': ModelEnum.QWEN_3_CODER_480B_INSTRUCT,
  'qwen-3-coder-480b-fast': ModelEnum.QWEN_3_CODER_480B_INSTRUCT_FAST,
  'qwen-3-coder': ModelEnum.QWEN_3_CODER_480B_INSTRUCT,
  'qwen-2.5-32b-r1': ModelEnum.QWEN_2_5_32B_INSTRUCT_R1,
  'qwen-2-5-32b-r1': ModelEnum.QWEN_2_5_32B_INSTRUCT_R1,

  // ============================================================================
  // XAI Grok
  // ============================================================================
  'grok-2': ModelEnum.GROK_2,
  'grok-3': ModelEnum.GROK_3,
  'grok-3-mini': ModelEnum.GROK_3_MINI_REASONING,
  'grok-code-fast': ModelEnum.GROK_CODE_FAST,

  // ============================================================================
  // Other Models
  // ============================================================================
  'mistral-7b': ModelEnum.MISTRAL_7B,
  'kimi-k2': ModelEnum.KIMI_K2,
  'kimi-k2-thinking': ModelEnum.KIMI_K2_THINKING,
  'glm-4.5': ModelEnum.GLM_4_5,
  'glm-4-5': ModelEnum.GLM_4_5,
  'glm-4.5-fast': ModelEnum.GLM_4_5_FAST,
  'glm-4-5-fast': ModelEnum.GLM_4_5_FAST,
  'glm-4.6': ModelEnum.GLM_4_6,
  'glm-4-6': ModelEnum.GLM_4_6,
  'glm-4.6-fast': ModelEnum.GLM_4_6_FAST,
  'glm-4-6-fast': ModelEnum.GLM_4_6_FAST,
  'glm-4.7': ModelEnum.GLM_4_7,
  'glm-4-7': ModelEnum.GLM_4_7,
  'glm-4.7-fast': ModelEnum.GLM_4_7_FAST,
  'glm-4-7-fast': ModelEnum.GLM_4_7_FAST,
  'minimax-m2': ModelEnum.MINIMAX_M2,
  'minimax-m2.1': ModelEnum.MINIMAX_M2_1,
  'minimax-m2-1': ModelEnum.MINIMAX_M2_1,
  'swe-1.5': ModelEnum.SWE_1_5,
  'swe-1-5': ModelEnum.SWE_1_5,
  'swe-1.5-thinking': ModelEnum.SWE_1_5_THINKING,
  'swe-1-5-thinking': ModelEnum.SWE_1_5_THINKING,
  'swe-1.5-slow': ModelEnum.SWE_1_5_SLOW,
  'swe-1-5-slow': ModelEnum.SWE_1_5_SLOW,
};

/**
 * Reverse mapping from enum values to canonical model names
 */
const ENUM_TO_MODEL_NAME: Partial<Record<ModelEnumValue, string>> = {
  // Claude
  [ModelEnum.CLAUDE_3_OPUS_20240229]: 'claude-3-opus',
  [ModelEnum.CLAUDE_3_SONNET_20240229]: 'claude-3-sonnet',
  [ModelEnum.CLAUDE_3_HAIKU_20240307]: 'claude-3-haiku',
  [ModelEnum.CLAUDE_3_5_SONNET_20241022]: 'claude-3.5-sonnet',
  [ModelEnum.CLAUDE_3_5_HAIKU_20241022]: 'claude-3.5-haiku',
  [ModelEnum.CLAUDE_3_7_SONNET_20250219]: 'claude-3.7-sonnet',
  [ModelEnum.CLAUDE_3_7_SONNET_20250219_THINKING]: 'claude-3.7-sonnet-thinking',
  [ModelEnum.CLAUDE_4_OPUS]: 'claude-4-opus',
  [ModelEnum.CLAUDE_4_OPUS_THINKING]: 'claude-4-opus-thinking',
  [ModelEnum.CLAUDE_4_SONNET]: 'claude-4-sonnet',
  [ModelEnum.CLAUDE_4_SONNET_THINKING]: 'claude-4-sonnet-thinking',
  [ModelEnum.CLAUDE_4_1_OPUS]: 'claude-4.1-opus',
  [ModelEnum.CLAUDE_4_1_OPUS_THINKING]: 'claude-4.1-opus-thinking',
  [ModelEnum.CLAUDE_4_5_SONNET]: 'claude-4.5-sonnet',
  [ModelEnum.CLAUDE_4_5_SONNET_THINKING]: 'claude-4.5-sonnet-thinking',
  // NOTE: CLAUDE_4_5_SONNET_1M not available via API
  [ModelEnum.CLAUDE_4_5_OPUS]: 'claude-4.5-opus',
  [ModelEnum.CLAUDE_4_5_OPUS_THINKING]: 'claude-4.5-opus-thinking',
  [ModelEnum.CLAUDE_CODE]: 'claude-code',
  
  // GPT
  [ModelEnum.GPT_4]: 'gpt-4',
  [ModelEnum.GPT_4_1106_PREVIEW]: 'gpt-4-turbo',
  [ModelEnum.GPT_4O_2024_08_06]: 'gpt-4o',
  [ModelEnum.GPT_4O_MINI_2024_07_18]: 'gpt-4o-mini',
  // NOTE: GPT_4_5 not available via API
  [ModelEnum.GPT_4_1_2025_04_14]: 'gpt-4.1',
  [ModelEnum.GPT_4_1_MINI_2025_04_14]: 'gpt-4.1-mini',
  [ModelEnum.GPT_4_1_NANO_2025_04_14]: 'gpt-4.1-nano',
  [ModelEnum.GPT_5]: 'gpt-5',
  [ModelEnum.GPT_5_NANO]: 'gpt-5-nano',
  [ModelEnum.GPT_5_LOW]: 'gpt-5-low',
  [ModelEnum.GPT_5_HIGH]: 'gpt-5-high',
  [ModelEnum.GPT_5_CODEX]: 'gpt-5-codex',
  [ModelEnum.GPT_5_1_CODEX_MINI_MEDIUM]: 'gpt-5.1-codex-mini',
  [ModelEnum.GPT_5_1_CODEX_MEDIUM]: 'gpt-5.1-codex',
  [ModelEnum.GPT_5_1_CODEX_MAX_MEDIUM]: 'gpt-5.1-codex-max',
  [ModelEnum.GPT_5_2_LOW]: 'gpt-5.2-low',
  [ModelEnum.GPT_5_2_MEDIUM]: 'gpt-5.2',
  [ModelEnum.GPT_5_2_HIGH]: 'gpt-5.2-high',
  [ModelEnum.GPT_5_2_XHIGH]: 'gpt-5.2-xhigh',
  [ModelEnum.GPT_5_2_MEDIUM_PRIORITY]: 'gpt-5.2-priority',
  
  // O-Series (o1 series deprecated - use o3/o4)
  [ModelEnum.O3]: 'o3',
  [ModelEnum.O3_MINI]: 'o3-mini',
  [ModelEnum.O3_LOW]: 'o3-low',
  [ModelEnum.O3_HIGH]: 'o3-high',
  [ModelEnum.O3_PRO]: 'o3-pro',
  [ModelEnum.O3_PRO_LOW]: 'o3-pro-low',
  [ModelEnum.O3_PRO_HIGH]: 'o3-pro-high',
  [ModelEnum.O4_MINI]: 'o4-mini',
  [ModelEnum.O4_MINI_LOW]: 'o4-mini-low',
  [ModelEnum.O4_MINI_HIGH]: 'o4-mini-high',
  
  // Gemini (1.x series deprecated - use 2.x+)
  [ModelEnum.GEMINI_2_0_FLASH]: 'gemini-2.0-flash',
  [ModelEnum.GEMINI_2_5_PRO]: 'gemini-2.5-pro',
  [ModelEnum.GEMINI_2_5_FLASH]: 'gemini-2.5-flash',
  [ModelEnum.GEMINI_2_5_FLASH_THINKING]: 'gemini-2.5-flash-thinking',
  [ModelEnum.GEMINI_2_5_FLASH_LITE]: 'gemini-2.5-flash-lite',
  [ModelEnum.GEMINI_3_0_PRO_LOW]: 'gemini-3.0-pro-low',
  [ModelEnum.GEMINI_3_0_PRO_HIGH]: 'gemini-3.0-pro-high',
  [ModelEnum.GEMINI_3_0_PRO_MEDIUM]: 'gemini-3.0-pro',
  [ModelEnum.GEMINI_3_0_FLASH_MEDIUM]: 'gemini-3.0-flash',
  [ModelEnum.GEMINI_3_0_FLASH_HIGH]: 'gemini-3.0-flash-high',
  
  // DeepSeek
  [ModelEnum.DEEPSEEK_V3]: 'deepseek-v3',
  [ModelEnum.DEEPSEEK_V3_2]: 'deepseek-v3-2',
  [ModelEnum.DEEPSEEK_R1]: 'deepseek-r1',
  [ModelEnum.DEEPSEEK_R1_FAST]: 'deepseek-r1-fast',
  [ModelEnum.DEEPSEEK_R1_SLOW]: 'deepseek-r1-slow',
  
  // Llama
  [ModelEnum.LLAMA_3_1_8B_INSTRUCT]: 'llama-3.1-8b',
  [ModelEnum.LLAMA_3_1_70B_INSTRUCT]: 'llama-3.1-70b',
  [ModelEnum.LLAMA_3_1_405B_INSTRUCT]: 'llama-3.1-405b',
  [ModelEnum.LLAMA_3_3_70B_INSTRUCT]: 'llama-3.3-70b',
  [ModelEnum.LLAMA_3_3_70B_INSTRUCT_R1]: 'llama-3.3-70b-r1',
  
  // Qwen
  [ModelEnum.QWEN_2_5_7B_INSTRUCT]: 'qwen-2.5-7b',
  [ModelEnum.QWEN_2_5_32B_INSTRUCT]: 'qwen-2.5-32b',
  [ModelEnum.QWEN_2_5_72B_INSTRUCT]: 'qwen-2.5-72b',
  [ModelEnum.QWEN_2_5_32B_INSTRUCT_R1]: 'qwen-2.5-32b-r1',
  [ModelEnum.QWEN_3_235B_INSTRUCT]: 'qwen-3-235b',
  [ModelEnum.QWEN_3_CODER_480B_INSTRUCT]: 'qwen-3-coder-480b',
  [ModelEnum.QWEN_3_CODER_480B_INSTRUCT_FAST]: 'qwen-3-coder-480b-fast',
  
  // Grok
  [ModelEnum.GROK_2]: 'grok-2',
  [ModelEnum.GROK_3]: 'grok-3',
  [ModelEnum.GROK_3_MINI_REASONING]: 'grok-3-mini',
  [ModelEnum.GROK_CODE_FAST]: 'grok-code-fast',
  
  // Other
  [ModelEnum.MISTRAL_7B]: 'mistral-7b',
  [ModelEnum.KIMI_K2]: 'kimi-k2',
  [ModelEnum.KIMI_K2_THINKING]: 'kimi-k2-thinking',
  [ModelEnum.GLM_4_5]: 'glm-4.5',
  [ModelEnum.GLM_4_5_FAST]: 'glm-4.5-fast',
  [ModelEnum.GLM_4_6]: 'glm-4.6',
  [ModelEnum.GLM_4_6_FAST]: 'glm-4.6-fast',
  [ModelEnum.GLM_4_7]: 'glm-4.7',
  [ModelEnum.GLM_4_7_FAST]: 'glm-4.7-fast',
  [ModelEnum.MINIMAX_M2]: 'minimax-m2',
  [ModelEnum.MINIMAX_M2_1]: 'minimax-m2.1',
  [ModelEnum.SWE_1_5]: 'swe-1.5',
  [ModelEnum.SWE_1_5_THINKING]: 'swe-1.5-thinking',
  [ModelEnum.SWE_1_5_SLOW]: 'swe-1.5-slow',
};

// ============================================================================
// Public API
// ============================================================================

export function resolveModel(modelName: string, variantOverride?: string): {
  enumValue: ModelEnumValue;
  modelId: string;
  variant?: string;
} {
  const { base, variant } = splitModelAndVariant(modelName);
  const baseId = ALIAS_TO_ID[base] || base;

  const entry = VARIANT_CATALOG[baseId];
  if (entry) {
    const effectiveVariant = (variantOverride || variant || '').trim().toLowerCase();
    if (effectiveVariant && entry.variants?.[effectiveVariant]) {
      return {
        enumValue: entry.variants[effectiveVariant]!.enumValue,
        modelId: entry.id,
        variant: effectiveVariant,
      };
    }
    return { enumValue: entry.defaultEnum, modelId: entry.id };
  }

  // Fallback to legacy map
  const normalized = normalizeModelId(modelName);
  const enumValue = MODEL_NAME_TO_ENUM[normalized];
  if (enumValue) {
    return { enumValue, modelId: normalized };
  }

  return { enumValue: ModelEnum.CLAUDE_3_5_SONNET_20241022, modelId: 'claude-3.5-sonnet' };
}

/**
 * Convert a model name string (optionally including variant) to enum
 */
export function modelNameToEnum(modelName: string, variantOverride?: string): ModelEnumValue {
  return resolveModel(modelName, variantOverride).enumValue;
}

/**
 * Convert a protobuf enum value to a canonical model name
 * @param enumValue - The enum value
 * @returns The canonical model name string
 */
export function enumToModelName(enumValue: ModelEnumValue): string {
  return ENUM_TO_MODEL_NAME[enumValue] ?? 'claude-3.5-sonnet';
}

/**
 * Get all supported model names (includes legacy aliases)
 */
export function getSupportedModels(): string[] {
  const fromVariants = Object.keys(VARIANT_CATALOG);
  const aliases: string[] = [];
  for (const entry of Object.values(VARIANT_CATALOG)) {
    if (entry.aliases) aliases.push(...entry.aliases);
    if (entry.variants) {
      for (const variantKey of Object.keys(entry.variants)) {
        aliases.push(`${entry.id}-${variantKey}`);
        for (const alias of entry.aliases || []) {
          aliases.push(`${alias}-${variantKey}`);
        }
      }
    }
  }
  return Array.from(new Set([...fromVariants, ...aliases, ...Object.keys(MODEL_NAME_TO_ENUM)]));
}

/**
 * Check if a model name is supported (canonical or alias or variant)
 */
export function isModelSupported(modelName: string): boolean {
  const normalized = normalizeModelId(modelName);
  const { base, variant } = splitModelAndVariant(normalized);
  const baseId = ALIAS_TO_ID[base] || base;
  if (variant && VARIANT_CATALOG[baseId]?.variants?.[variant]) return true;
  if (VARIANT_CATALOG[baseId]) return true;
  return normalized in MODEL_NAME_TO_ENUM;
}

/** Default canonical model */
export function getDefaultModel(): string {
  return 'claude-3.5-sonnet';
}

export function getDefaultModelEnum(): ModelEnumValue {
  return ModelEnum.CLAUDE_3_5_SONNET_20241022;
}

/**
 * Canonical models (no variants), aligned with OpenCode listing
 */
export function getCanonicalModels(): string[] {
  const bases = new Set<string>(Object.keys(VARIANT_CATALOG));

  // Add non-variant canonical names derived from enum mapping
  for (const name of Object.values(ENUM_TO_MODEL_NAME)) {
    if (!name) continue;
    if (VARIANT_NAME_SET.has(name)) continue; // skip variant entries
    if (!bases.has(name)) bases.add(name);
  }

  return Array.from(bases).sort();
}

export function getModelVariants(modelId: string): Record<string, VariantMeta> | undefined {
  const baseId = ALIAS_TO_ID[normalizeModelId(modelId)] || normalizeModelId(modelId);
  return VARIANT_CATALOG[baseId]?.variants;
}
