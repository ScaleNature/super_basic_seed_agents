import { validateBotanicalName } from './src/common/botanical-validator.js';

const testCases = [
  // Valid current botanical names - SHOULD PASS
  {
    name: 'Valid current name - Oak tree',
    input: 'Quercus robur',
    expectedStatus: 'current',
    shouldPass: true
  },
  {
    name: 'Valid current name - Tomato',
    input: 'Solanum lycopersicum',
    expectedStatus: 'current',
    shouldPass: true
  },
  {
    name: 'Valid current name - Cannabis',
    input: 'Cannabis sativa',
    expectedStatus: 'current',
    shouldPass: true
  },
  {
    name: 'Valid current name - Sunflower',
    input: 'Helianthus annuus',
    expectedStatus: 'current',
    shouldPass: true
  },
  
  // Outdated botanical names (synonyms) - SHOULD PASS with updated info
  {
    name: 'Outdated synonym - Echinacea variety',
    input: 'Echinacea angustifolia var. strigosa',
    expectedStatus: 'updated',
    shouldPass: true
  },
  {
    name: 'Outdated synonym - Tomato old name',
    input: 'Lycopersicon esculentum',
    expectedStatus: 'updated',
    shouldPass: true
  },
  
  // Invalid/fake botanical names - SHOULD FAIL
  {
    name: 'Completely fake name',
    input: 'Fakeus plantus',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  {
    name: 'Made-up species',
    input: 'Nonsensicus ridiculosa',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  {
    name: 'Random gibberish',
    input: 'Xyz abc',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  
  // Common names instead of botanical - SHOULD FAIL
  {
    name: 'Common name instead of botanical',
    input: 'Red Oak',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  {
    name: 'Common vegetable name',
    input: 'Tomato plant',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  
  // Misspelled botanical names - SHOULD FAIL
  {
    name: 'Misspelled genus',
    input: 'Qurcus robur',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  {
    name: 'Misspelled species',
    input: 'Quercus robor',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  
  // Incomplete names - SHOULD FAIL
  {
    name: 'Only genus, no species',
    input: 'Quercus',
    expectedStatus: 'invalid',
    shouldPass: false
  },
  {
    name: 'Only genus, no species (2)',
    input: 'Cannabis',
    expectedStatus: 'invalid',
    shouldPass: false
  }
];

async function runTests() {
  console.log('='.repeat(70));
  console.log('BOTANICAL NAME VALIDATOR - COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(70));
  console.log();
  
  let passCount = 0;
  let failCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testNum = i + 1;
    
    console.log(`Test ${testNum}/${testCases.length}: ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.shouldPass ? 'PASS' : 'FAIL'} (status: ${testCase.expectedStatus})`);
    
    try {
      const result = await validateBotanicalName(testCase.input);
      
      console.log(`Result: valid=${result.valid}, status=${result.status}`);
      
      if (result.valid && result.status === 'current') {
        console.log(`  → Family: ${result.family}, Genus: ${result.genus}, Species: ${result.species}`);
      } else if (result.valid && result.status === 'updated') {
        console.log(`  → Updated name: ${result.currentName}`);
        console.log(`  → Family: ${result.family}, Genus: ${result.genus}, Species: ${result.species}`);
      } else if (!result.valid && result.status === 'invalid') {
        console.log(`  → Error: ${result.error}`);
      }
      
      // Check if result matches expectations
      if (result.status === testCase.expectedStatus) {
        console.log('✓ TEST PASSED\n');
        passCount++;
      } else {
        console.log(`✗ TEST FAILED - Expected status '${testCase.expectedStatus}' but got '${result.status}'\n`);
        failCount++;
      }
      
    } catch (error) {
      console.log(`✗ ERROR: ${error.message}\n`);
      errorCount++;
    }
    
    console.log('-'.repeat(70));
  }
  
  // Summary
  console.log();
  console.log('='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total tests: ${testCases.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Success rate: ${((passCount / testCases.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(70));
}

// Handle empty string test separately (will throw error before API call)
async function testEdgeCases() {
  console.log('\n\nEDGE CASE TESTS');
  console.log('='.repeat(70));
  
  // Test empty string
  console.log('Edge Case 1: Empty string');
  try {
    await validateBotanicalName('');
    console.log('✗ FAILED - Should have thrown error for empty string\n');
  } catch (error) {
    console.log(`✓ PASSED - Correctly threw error: ${error.message}\n`);
  }
  
  // Test whitespace only
  console.log('Edge Case 2: Whitespace only');
  try {
    await validateBotanicalName('   ');
    console.log('✗ FAILED - Should have thrown error for whitespace\n');
  } catch (error) {
    console.log(`✓ PASSED - Correctly threw error: ${error.message}\n`);
  }
  
  console.log('='.repeat(70));
}

// Run all tests
(async () => {
  await runTests();
  await testEdgeCases();
})();
