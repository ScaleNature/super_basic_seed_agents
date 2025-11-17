import { validateBotanicalName } from './src/common/botanical-validator.js';

async function runTests() {
  console.log('Testing Botanical Name Validator\n');
  console.log('='.repeat(60));
  
  // Test 1: Current/valid botanical name
  console.log('\n1. Testing current botanical name: "Quercus robur"');
  try {
    const result1 = await validateBotanicalName('Quercus robur');
    console.log('Result:', JSON.stringify(result1, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test 2: Outdated botanical name (synonym)
  console.log('\n2. Testing outdated botanical name: "Echinacea angustifolia var. strigosa"');
  try {
    const result2 = await validateBotanicalName('Echinacea angustifolia var. strigosa');
    console.log('Result:', JSON.stringify(result2, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test 3: Invalid botanical name
  console.log('\n3. Testing invalid botanical name: "Fakeus plantus"');
  try {
    const result3 = await validateBotanicalName('Fakeus plantus');
    console.log('Result:', JSON.stringify(result3, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\nTests completed!\n');
}

runTests();
