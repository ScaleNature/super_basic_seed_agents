import { getPlantRecord, createPlantSheet, appendPlantRows, findFolderByName, getOutputFolderName } from './plant-pipeline.js';

/**
 * Process multiple plants and save to a single Google Sheet
 * Uses incremental save strategy: creates sheet first, then appends each plant immediately
 * This ensures partial progress is preserved if processing fails
 * @param {Array<{genus: string, species: string}>} plants - Array of plant objects
 */
async function batchProcessPlants(plants) {
  console.log('='.repeat(80));
  console.log('Batch Plant Processing Pipeline (Incremental Save)');
  console.log('='.repeat(80));
  console.log(`Processing ${plants.length} plants`);
  console.log();
  
  // Step 1: Create Google Sheet FIRST (before processing any plants)
  console.log(`Step 1: Creating Google Sheet...`);
  
  let spreadsheetId, spreadsheetUrl;
  
  try {
    // Find the folder using config
    const folderName = getOutputFolderName();
    console.log(`  Finding folder "${folderName}"...`);
    const folderId = await findFolderByName(folderName);
    
    if (!folderId) {
      throw new Error(`Folder "${folderName}" not found in Google Drive`);
    }
    
    console.log(`  ✓ Found folder (ID: ${folderId})`);
    
    // Create the sheet with headers
    console.log(`  Creating new Google Sheet with headers...`);
    const sheetInfo = await createPlantSheet(folderId);
    spreadsheetId = sheetInfo.spreadsheetId;
    spreadsheetUrl = sheetInfo.spreadsheetUrl;
    console.log(`  ✓ Created sheet (ID: ${spreadsheetId})`);
    console.log(`  ✓ Sheet URL: ${spreadsheetUrl}`);
    console.log();
    
  } catch (error) {
    console.error(`✗ Failed to create Google Sheet: ${error.message}`);
    process.exit(1);
  }
  
  // Step 2: Process plants one at a time and save immediately
  console.log(`Step 2: Processing plants (saving incrementally)...`);
  console.log();
  
  let successCount = 0;
  const failures = [];
  
  for (let i = 0; i < plants.length; i++) {
    const { genus, species } = plants[i];
    console.log(`  [${i + 1}/${plants.length}] Processing ${genus} ${species}...`);
    
    try {
      const record = await getPlantRecord(genus, species);
      
      if (record) {
        // Immediately append this plant to the sheet
        await appendPlantRows(spreadsheetId, [record]);
        successCount++;
        console.log(`    ✓ Success - Saved to sheet (Native: ${record.isNative}, Family: ${record.family})`);
      } else {
        failures.push({ genus, species, reason: 'Not a current botanical name' });
        console.log(`    ✗ Skipped - Not a current botanical name`);
      }
    } catch (error) {
      failures.push({ genus, species, reason: error.message });
      console.log(`    ✗ Failed - ${error.message}`);
    }
  }
  
  console.log();
  console.log(`Processing complete:`);
  console.log(`  ✓ Successful: ${successCount}`);
  console.log(`  ✗ Failed/Skipped: ${failures.length}`);
  console.log();
  
  if (failures.length > 0) {
    console.log(`Failed/Skipped plants:`);
    failures.forEach(f => {
      console.log(`  - ${f.genus} ${f.species}: ${f.reason}`);
    });
    console.log();
  }
  
  console.log(`✓ Batch processing complete!`);
  console.log(`  View sheet: ${spreadsheetUrl}`);
  console.log(`  Total plants saved: ${successCount}`);
  
  if (successCount === 0) {
    console.log(`  Note: Sheet created but empty (no valid plants processed)`);
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.length % 2 !== 0) {
  console.error('Usage: node src/output/batch-process-plants.js <genus1> <species1> <genus2> <species2> ...');
  console.error('Example: node src/output/batch-process-plants.js Quercus alba Acer rubrum Carya ovata');
  process.exit(1);
}

// Parse plant pairs
const plants = [];
for (let i = 0; i < args.length; i += 2) {
  plants.push({
    genus: args[i],
    species: args[i + 1]
  });
}

batchProcessPlants(plants);
