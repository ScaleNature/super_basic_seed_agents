import { migrateCacheKeys } from '../synthesis/process-external-reference-urls.js';

console.log('================================================================================');
console.log('Cache Migration Tool');
console.log('================================================================================');
console.log('This will consolidate duplicate cache entries with different capitalizations.');
console.log('For example: "carex grayi" and "Carex grayi" will be merged into "Carex grayi"\n');

try {
  const result = migrateCacheKeys();
  
  console.log('Migration Results:');
  console.log(`  Before: ${result.before} cache entries`);
  console.log(`  After:  ${result.after} cache entries`);
  console.log(`  Merged: ${result.merged.length} duplicate groups`);
  console.log(`  Unparsable: ${result.unparsable || 0} entries preserved\n`);
  
  if (result.merged.length > 0) {
    console.log('Merged Entries:');
    for (const { normalizedKey, originalKeys, urlCount } of result.merged) {
      console.log(`\n  ${normalizedKey} (${urlCount} URLs total)`);
      console.log(`    Consolidated from:`);
      originalKeys.forEach(key => {
        console.log(`      - "${key}"`);
      });
    }
  } else {
    console.log('✓ No duplicates found - cache is already normalized');
  }
  
  if (result.unparsable > 0) {
    console.log(`\n⚠ ${result.unparsable} unparsable entries preserved for manual review`);
    console.log('  These entries could not be normalized but remain in the cache');
  }
  
  console.log('\n✓ Migration complete!');
  
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
