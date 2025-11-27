#!/usr/bin/env node
/**
 * Migration script to convert old single-file cache to per-species files
 * 
 * Old format: cache/external-reference-urls.json (single file with all species)
 * New format: cache/ExternalReferences/Genus_species_refURLs.json (one file per species)
 * 
 * Usage: node scripts/migrate-external-urls-cache.js
 */

import { migrateFromSingleFile } from '../src/synthesis/process-external-reference-urls.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLD_CACHE_PATH = path.join(__dirname, '../cache/external-reference-urls.json');

console.log('External Reference URLs Cache Migration');
console.log('========================================\n');
console.log(`Old cache file: ${OLD_CACHE_PATH}`);
console.log('New cache directory: cache/ExternalReferences/\n');

try {
  const result = migrateFromSingleFile(OLD_CACHE_PATH);
  
  console.log('\n✅ Migration Summary:');
  console.log(`   - Migrated: ${result.migrated} species`);
  console.log(`   - Skipped: ${result.skipped} species`);
  
  if (result.migrated > 0) {
    console.log('\n💡 You can now safely delete the old cache file:');
    console.log(`   rm ${OLD_CACHE_PATH}`);
  }
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}
