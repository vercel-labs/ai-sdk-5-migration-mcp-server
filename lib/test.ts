/**
 * Simple test file to test the search system
 * Run with: pnpm tsx test.ts
 */

import { generateChecklist } from './checklist';
import { searchGuide } from './migration-guide';

/**
 * Test the checklist generation function
 */
function testGenerateChecklist() {
  console.log('\n📋 Test: Generate Checklist');
  console.log('-'.repeat(60));

  const checklist = generateChecklist();
  console.log(`✅ Generated checklist (${checklist.length} characters)`);
  console.log('First 300 characters:');
  console.log(checklist.substring(0, 300) + '...\n');

  return checklist;
}

/**
 * Test the search guide function
 */
async function testSearchGuide(query: string, maxResults: number = 3) {
  console.log('\n🔍 Test: Search Migration Guide');
  console.log('-'.repeat(60));
  console.log(`Query: "${query}"\n`);

  const results = await searchGuide(query);
  console.log(`✅ Found ${results.length} results\n`);

  if (results.length > 0) {
    console.log(`Top ${Math.min(maxResults, results.length)} results:`);
    results.slice(0, maxResults).forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   Relevance: ${result.relevance}`);
      console.log(`   Content length: ${result.content.length} chars`);
      console.log(`   Preview: ${result.content.substring(0, 150).replace(/\n/g, ' ')}...`);
    });
  } else {
    console.log('   No results found.');
  }

  console.log('');
  return results;
}

/**
 * Main test runner
 */
async function main() {
  console.log('🧪 Testing AI SDK 5 Migration MCP Server Tools\n');
  console.log('='.repeat(60));

  // Test 1: Generate Checklist
  testGenerateChecklist();

  // Test 2: Search with different queries
  await testSearchGuide('maxTokens');
  await testSearchGuide('coremessage');

  console.log('='.repeat(60));
  console.log('✅ All tests completed!\n');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}

// Export for use in other files
export { testGenerateChecklist, testSearchGuide };

