#!/usr/bin/env bun
/**
 * Verify the plugin works end-to-end
 * 
 * Tests:
 * 1. Credential discovery (auth.ts)
 * 2. gRPC streaming (grpc-client.ts)  
 * 3. Model mapping (models.ts)
 */

import { getCredentials, isWindsurfRunning } from '../../src/plugin/auth.js';
import { streamChatGenerator, ChatMessage } from '../../src/plugin/grpc-client.js';
import { modelNameToEnum, getCanonicalModels } from '../../src/plugin/models.js';

async function main() {
  console.log('=== Windsurf Plugin Verification ===\n');

  // Test 1: Check if Windsurf is running
  console.log('1. Checking if Windsurf is running...');
  if (!isWindsurfRunning()) {
    console.error('   FAIL: Windsurf is not running. Please start Windsurf first.');
    process.exit(1);
  }
  console.log('   OK: Windsurf is running\n');

  // Test 2: Get credentials
  console.log('2. Getting credentials...');
  let credentials;
  try {
    credentials = getCredentials();
    console.log(`   Port: ${credentials.port}`);
    console.log(`   Version: ${credentials.version}`);
    console.log(`   CSRF: ${credentials.csrfToken.slice(0, 8)}...`);
    console.log(`   API Key: ${credentials.apiKey.slice(0, 15)}...`);
    console.log('   OK: Credentials retrieved\n');
  } catch (error) {
    console.error(`   FAIL: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  // Test 3: Model mapping
  console.log('3. Testing model mapping...');
  const testModels = ['gpt-4o', 'claude-3.5-sonnet', 'gpt-4.1', 'swe-1.5'];
  for (const model of testModels) {
    const enumVal = modelNameToEnum(model);
    console.log(`   ${model} -> ${enumVal}`);
  }
  console.log(`   Total canonical models: ${getCanonicalModels().length}`);
  console.log('   OK: Model mapping works\n');

  // Test 4: Stream a simple request
  console.log('4. Testing gRPC streaming with GPT-4o...');
  const messages: ChatMessage[] = [
    { role: 'user', content: 'Say "Plugin works!" and nothing else.' }
  ];

  try {
    const chunks: string[] = [];
    const generator = streamChatGenerator(credentials, {
      model: 'gpt-4o',
      messages,
    });

    process.stdout.write('   Response: ');
    for await (const chunk of generator) {
      chunks.push(chunk);
      process.stdout.write(chunk);
    }
    console.log('\n   OK: Streaming completed\n');
    
    const fullResponse = chunks.join('');
    if (fullResponse.length === 0) {
      console.error('   WARN: Empty response received');
    }
  } catch (error) {
    console.error(`\n   FAIL: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  // Test 5: Test another model (Claude)
  console.log('5. Testing with Claude 3.5 Sonnet...');
  const messages2: ChatMessage[] = [
    { role: 'user', content: 'Reply with just: "Claude OK"' }
  ];

  try {
    const chunks: string[] = [];
    const generator = streamChatGenerator(credentials, {
      model: 'claude-3.5-sonnet',
      messages: messages2,
    });

    process.stdout.write('   Response: ');
    for await (const chunk of generator) {
      chunks.push(chunk);
      process.stdout.write(chunk);
    }
    console.log('\n   OK: Claude streaming completed\n');
  } catch (error) {
    console.error(`\n   FAIL: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  console.log('=== All Tests Passed! ===');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
