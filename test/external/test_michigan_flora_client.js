/**
 * Test script for Michigan Flora Client
 * 
 * Tests:
 * 1. Dataset loading and parsing
 * 2. Metadata row skipping
 * 3. Lookup functions (by name, genus/species)
 * 4. Native status checks
 * 5. Coefficient and wetness lookups
 * 6. Dataset statistics
 */

import {
  loadDataset,
  findByScientificName,
  findByGenusSpecies,
  isNative,
  getCoefficient,
  getWetness,
  getCommonName,
  getNativeSpecies,
  getNonNativeSpecies,
  getDatasetStats,
  clearCache
} from '../../src/utils/michigan-flora-client.js';

async function runTests() {
  console.log('Testing Michigan Flora Client\n');
  
  let passed = 0;
  let failed = 0;
  
  function assert(condition, testName) {
    if (condition) {
      console.log(`   PASS: ${testName}`);
      passed++;
    } else {
      console.log(`   FAIL: ${testName}`);
      failed++;
    }
  }
  
  clearCache();
  
  console.log('Test 1: Dataset Loading\n');
  const dataset = await loadDataset();
  assert(Array.isArray(dataset), 'Dataset is an array');
  assert(dataset.length > 2800, `Dataset has ${dataset.length} records (expected ~2873)`);
  assert(dataset.length < 3000, 'Dataset size is reasonable');
  
  const firstRecord = dataset[0];
  assert(firstRecord.scientificName !== '', 'First record has scientific name');
  assert(firstRecord.family !== '', 'First record has family');
  assert(typeof firstRecord.isNative === 'boolean', 'isNative is boolean');
  assert(typeof firstRecord.coefficientC === 'number', 'coefficientC is number');
  assert(typeof firstRecord.wetnessW === 'number', 'wetnessW is number');
  console.log('');
  
  console.log('Test 2: Lookup by Scientific Name\n');
  const balsamFir = await findByScientificName('Abies balsamea');
  assert(balsamFir !== null, 'Found Abies balsamea');
  assert(balsamFir?.family === 'Pinaceae', 'Correct family (Pinaceae)');
  assert(balsamFir?.acronym === 'ABIBAL', 'Correct acronym (ABIBAL)');
  assert(balsamFir?.isNative === true, 'Correctly identified as native');
  assert(balsamFir?.coefficientC === 3, 'Correct C value (3)');
  assert(balsamFir?.commonName === 'balsam fir', 'Correct common name');
  console.log('');
  
  console.log('Test 3: Lookup by Genus + Species\n');
  const whiteOak = await findByGenusSpecies('Quercus', 'alba');
  assert(whiteOak !== null, 'Found Quercus alba');
  assert(whiteOak?.family === 'Fagaceae', 'Correct family (Fagaceae)');
  assert(whiteOak?.isNative === true, 'Correctly identified as native');
  console.log('');
  
  console.log('Test 4: Native Status Checks\n');
  const sugarMapleNative = await isNative('Acer', 'saccharum');
  assert(sugarMapleNative === true, 'Acer saccharum is native');
  
  const norwayMapleNative = await isNative('Acer', 'platanoides');
  assert(norwayMapleNative === false, 'Acer platanoides is non-native');
  
  const unknownNative = await isNative('Nonexistent', 'species');
  assert(unknownNative === null, 'Unknown species returns null');
  console.log('');
  
  console.log('Test 5: Coefficient and Wetness Lookups\n');
  const sugarMapleC = await getCoefficient('Acer', 'saccharum');
  assert(typeof sugarMapleC === 'number', 'C value is a number');
  assert(sugarMapleC >= 0 && sugarMapleC <= 10, `C value (${sugarMapleC}) is in valid range`);
  
  const balsamFirW = await getWetness('Abies', 'balsamea');
  assert(typeof balsamFirW === 'number', 'W value is a number');
  assert(balsamFirW >= -5 && balsamFirW <= 5, `W value (${balsamFirW}) is in valid range`);
  console.log('');
  
  console.log('Test 6: Common Name Lookup\n');
  const boxElderCommon = await getCommonName('Acer', 'negundo');
  assert(boxElderCommon !== null, 'Found common name for Acer negundo');
  assert(boxElderCommon?.includes('box-elder') || boxElderCommon?.includes('box elder'), 
    `Common name includes "box-elder": "${boxElderCommon}"`);
  console.log('');
  
  console.log('Test 7: Dataset Statistics\n');
  const stats = await getDatasetStats();
  assert(stats.totalSpecies > 2800, `Total species: ${stats.totalSpecies}`);
  assert(stats.nativeSpecies > 1700, `Native species: ${stats.nativeSpecies}`);
  assert(stats.nonNativeSpecies > 1000, `Non-native species: ${stats.nonNativeSpecies}`);
  assert(stats.nativeSpecies + stats.nonNativeSpecies === stats.totalSpecies, 
    'Native + non-native = total');
  assert(stats.nativeMeanC > 5, `Native mean C: ${stats.nativeMeanC}`);
  assert(stats.totalMeanC > 3, `Total mean C: ${stats.totalMeanC}`);
  console.log('');
  
  console.log('Test 8: Native/Non-native Filtering\n');
  const natives = await getNativeSpecies();
  const nonNatives = await getNonNativeSpecies();
  assert(natives.length === stats.nativeSpecies, 'getNativeSpecies matches count');
  assert(nonNatives.length === stats.nonNativeSpecies, 'getNonNativeSpecies matches count');
  assert(natives.every(r => r.isNative === true), 'All native records have isNative=true');
  assert(nonNatives.every(r => r.isNative === false), 'All non-native records have isNative=false');
  console.log('');
  
  console.log('Test 9: Case Insensitive Lookup\n');
  const lowerCase = await findByGenusSpecies('acer', 'saccharum');
  const upperCase = await findByGenusSpecies('ACER', 'SACCHARUM');
  const mixedCase = await findByGenusSpecies('Acer', 'Saccharum');
  assert(lowerCase !== null, 'Lowercase lookup works');
  assert(upperCase !== null, 'Uppercase lookup works');
  assert(mixedCase !== null, 'Mixed case lookup works');
  assert(lowerCase?.acronym === upperCase?.acronym, 'All cases return same record');
  console.log('');
  
  console.log('Test 10: Sample Record Structure\n');
  console.log('   Sample record (Acer saccharum):');
  const sample = await findByGenusSpecies('Acer', 'saccharum');
  console.log(JSON.stringify(sample, null, 2).split('\n').map(l => '   ' + l).join('\n'));
  console.log('');
  
  console.log('='.repeat(50));
  console.log(`\nTest Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
