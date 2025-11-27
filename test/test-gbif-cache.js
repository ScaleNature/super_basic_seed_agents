/**
 * Test script for GBIF caching functionality
 * 
 * Tests:
 * 1. First run creates cache files
 * 2. Second run uses cached data
 * 3. Cache files are human-readable JSON
 */

import { run } from '../src/synthesis/process-previous-botanical.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '../cache/GBIF');

const testSpecies = [
  { genus: 'Acer', species: 'saccharum', expectedSynonyms: 4 },
  { genus: 'Quercus', species: 'alba', expectedSynonyms: 5 },
  { genus: 'Eutrochium', species: 'fistulosum', expectedSynonyms: 2 }
];

async function testGBIFCaching() {
  console.log('🧪 Testing GBIF Caching System\n');
  
  // Clear cache files before testing
  console.log('📁 Clearing existing cache files...');
  for (const sp of testSpecies) {
    const cacheFile = path.join(CACHE_DIR, `${sp.genus}_${sp.species}_gbif.json`);
    if (fs.existsSync(cacheFile)) {
      fs.unlinkSync(cacheFile);
      console.log(`   Deleted: ${sp.genus}_${sp.species}_gbif.json`);
    }
  }
  console.log('');
  
  // Test 1: First run - should create cache files
  console.log('🔄 Test 1: First run (should fetch from GBIF API)\n');
  for (const sp of testSpecies) {
    console.log(`Testing ${sp.genus} ${sp.species}...`);
    const result = await run(sp.genus, sp.species, {});
    console.log(`   Result: ${result.columnValues.previouslyKnownAs || '(empty)'}`);
    
    // Verify cache file was created
    const cacheFile = path.join(CACHE_DIR, `${sp.genus}_${sp.species}_gbif.json`);
    if (fs.existsSync(cacheFile)) {
      console.log(`   ✅ Cache file created: ${sp.genus}_${sp.species}_gbif.json`);
      
      // Check if it's pretty-printed
      const cacheContent = fs.readFileSync(cacheFile, 'utf-8');
      const isPretty = cacheContent.includes('\n') && cacheContent.includes('  ');
      console.log(`   ${isPretty ? '✅' : '❌'} JSON is pretty-printed (human-readable)`);
    } else {
      console.log(`   ❌ Cache file NOT created!`);
    }
    console.log('');
  }
  
  // Test 2: Second run - should use cached data
  console.log('🔄 Test 2: Second run (should use cached data)\n');
  for (const sp of testSpecies) {
    console.log(`Testing ${sp.genus} ${sp.species}...`);
    const result = await run(sp.genus, sp.species, {});
    console.log(`   Result: ${result.columnValues.previouslyKnownAs || '(empty)'}`);
    console.log(`   ✅ Should see "Using cached data" message above`);
    console.log('');
  }
  
  // Test 3: Display cache file contents
  console.log('📄 Cache File Contents (human-readable check):\n');
  for (const sp of testSpecies) {
    const cacheFile = path.join(CACHE_DIR, `${sp.genus}_${sp.species}_gbif.json`);
    if (fs.existsSync(cacheFile)) {
      console.log(`--- ${sp.genus}_${sp.species}_gbif.json ---`);
      const content = fs.readFileSync(cacheFile, 'utf-8');
      console.log(content);
      console.log('');
    }
  }
  
  console.log('✅ GBIF Caching Test Complete!');
}

// Run tests
testGBIFCaching().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
