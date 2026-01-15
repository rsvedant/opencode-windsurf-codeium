import { describe, expect, test } from 'bun:test';
import { resolveModel, getModelVariants } from '../../src/plugin/models.js';

describe('resolveModel variants (bun)', () => {
  test('defaults to base enum when no variant provided', () => {
    const result = resolveModel('gemini-3.0-pro');
    expect(result.modelId).toBe('gemini-3.0-pro');
    expect(result.variant).toBeUndefined();
  });

  test('resolves colon-delimited variant', () => {
    const result = resolveModel('gemini-3.0-pro:high');
    expect(result.modelId).toBe('gemini-3.0-pro');
    expect(result.variant).toBe('high');
  });

  test('resolves suffix variant with alias', () => {
    const result = resolveModel('gemini-3-0-pro-high');
    expect(result.modelId).toBe('gemini-3.0-pro');
    expect(result.variant).toBe('high');
  });

  test('respects variant override', () => {
    const result = resolveModel('gemini-3.0-pro', 'low');
    expect(result.variant).toBe('low');
  });
});

describe('getModelVariants (bun)', () => {
  test('returns variants list for canonical id', () => {
    const variants = getModelVariants('gpt-5.2');
    expect(variants).toBeDefined();
    expect(Object.keys(variants || {})).toContain('priority');
  });
});
