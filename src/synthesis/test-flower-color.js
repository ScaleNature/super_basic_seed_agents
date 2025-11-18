// Test module to verify plug-and-play architecture
// This module demonstrates that new modules can be added without editing pipeline code

export const metadata = {
  id: 'test-flower-color',
  name: 'Flower Color Test Module',
  columns: [
    { id: 'flowerColor', header: 'Flower Color' },
    { id: 'colorNotes', header: 'Color Notes' }
  ],
  dependencies: ['botanical-name'], // Requires valid botanical name
  description: 'Test module that returns flower color information (demonstration purposes)'
};

/**
 * Module runner function
 * Returns mock flower color data to test plug-and-play behavior
 * @param {string} genus - The genus name
 * @param {string} species - The species name
 * @param {Object} priorResults - Results from previously executed modules
 * @returns {Promise<Object>} Object with columnValues Record
 */
export async function run(genus, species, priorResults) {
  // Mock data based on genus (for testing purposes)
  const colorMap = {
    'Carex': { color: 'Green-brown', notes: 'Sedge flowers are typically inconspicuous' },
    'Quercus': { color: 'Yellow-green', notes: 'Oak flowers are catkins' },
    'Acer': { color: 'Red-yellow', notes: 'Maple flowers vary by species' },
    'Betula': { color: 'Yellow-green', notes: 'Birch catkins' }
  };
  
  const colorData = colorMap[genus] || { color: 'Unknown', notes: 'Test module - mock data' };
  
  return {
    columnValues: {
      flowerColor: colorData.color,
      colorNotes: colorData.notes
    }
  };
}
