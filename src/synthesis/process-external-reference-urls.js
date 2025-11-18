import { getJson } from 'serpapi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../../config/external-reference-urls.json');
const CACHE_PATH = path.join(__dirname, '../../cache/external-reference-urls.json');

// Module metadata for registry system
export const metadata = {
  id: 'external-reference-urls',
  name: 'External Reference URL Discovery',
  columns: [
    { id: 'externalReferenceUrls', header: 'External Reference URLs' }
  ],
  dependencies: ['botanical-name'], // Requires valid botanical name for searching
  description: 'Discovers URLs for plant species across botanical reference websites with caching'
};

/**
 * Module runner function for registry system
 * @param {string} genus - The genus name
 * @param {string} species - The species name
 * @param {Object} priorResults - Results from previously executed modules
 * @returns {Promise<Object>} Object with columnValues Record matching metadata.columns
 */
export async function run(genus, species, priorResults) {
  const urls = await discoverAllUrls(genus, species);
  
  return {
    // Column values object (keys match column IDs from metadata.columns)
    columnValues: {
      externalReferenceUrls: urls
    }
  };
}

let config = null;
let cache = null;

function loadConfig() {
  if (!config) {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    config = JSON.parse(configData);
  }
  return config;
}

function loadCache() {
  try {
    if (!cache) {
      const cacheData = fs.readFileSync(CACHE_PATH, 'utf-8');
      cache = JSON.parse(cacheData);
    }
    return cache;
  } catch (error) {
    console.warn('Cache file not found or invalid, starting with empty cache');
    cache = {};
    return cache;
  }
}

function saveCache() {
  try {
    // Sort species keys alphabetically (top level) - case-insensitive
    const sortedCache = {};
    const speciesKeys = Object.keys(cache).sort((a, b) => 
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    
    for (const speciesKey of speciesKeys) {
      // Sort site keys alphabetically (nested level) - case-insensitive
      const siteUrls = cache[speciesKey];
      const sortedSites = {};
      const siteKeys = Object.keys(siteUrls).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      );
      
      for (const siteKey of siteKeys) {
        sortedSites[siteKey] = siteUrls[siteKey];
      }
      
      sortedCache[speciesKey] = sortedSites;
    }
    
    // Update in-memory cache to match persisted order
    cache = sortedCache;
    
    fs.writeFileSync(CACHE_PATH, JSON.stringify(sortedCache, null, 2), 'utf-8');
    console.log('Cache saved successfully');
  } catch (error) {
    console.error('Failed to save cache:', error.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalize botanical name to ensure consistent capitalization
 * Genus: First alphabetic letter uppercase, rest lowercase
 * Species: All lowercase
 * Handles hybrid symbols (×), whitespace, and other botanical variations
 * @param {string} genus - Genus name (required)
 * @param {string} species - Species name (required)
 * @returns {string} Normalized species key in "Genus species" format
 * @throws {Error} If genus or species is missing or not a string
 */
function normalizeSpeciesKey(genus, species) {
  if (!genus || typeof genus !== 'string') {
    throw new Error('Genus must be a non-empty string');
  }
  if (!species || typeof species !== 'string') {
    throw new Error('Species must be a non-empty string');
  }
  
  // Trim whitespace
  const trimmedGenus = genus.trim();
  const trimmedSpecies = species.trim();
  
  if (trimmedGenus.length === 0 || trimmedSpecies.length === 0) {
    throw new Error('Genus and species cannot be empty after trimming');
  }
  
  // Normalize genus: Find first alphabetic character and uppercase it
  // This handles hybrid genera like "×Chitalpa" correctly
  let normalizedGenus = trimmedGenus.toLowerCase();
  for (let i = 0; i < normalizedGenus.length; i++) {
    if (/[a-z]/i.test(normalizedGenus[i])) {
      normalizedGenus = normalizedGenus.substring(0, i) + 
                       normalizedGenus[i].toUpperCase() + 
                       normalizedGenus.substring(i + 1);
      break;
    }
  }
  
  // Normalize species: all lowercase
  const normalizedSpecies = trimmedSpecies.toLowerCase();
  
  return `${normalizedGenus} ${normalizedSpecies}`;
}

async function searchWithRetry(searchQuery, site) {
  const cfg = loadConfig();
  const { startDelayMs, maxDelayMs } = cfg.retrySettings;
  
  let delay = startDelayMs;
  let attempts = 0;
  
  while (delay <= maxDelayMs) {
    attempts++;
    const apiKey = process.env.SERPAPI_API_KEY;
    
    if (!apiKey) {
      console.error('SERPAPI_API_KEY environment variable not set');
      return null;
    }
    
    try {
      console.log(`  Attempt ${attempts} for ${site.name} (delay: ${delay}ms)`);
      
      if (delay > startDelayMs) {
        await sleep(delay);
      }
      
      const params = {
        api_key: apiKey,
        q: searchQuery,
        num: 1
      };
      
      const result = await getJson(params);
      
      if (result.organic_results && result.organic_results.length > 0) {
        const topResult = result.organic_results[0];
        console.log(`  ✓ Found URL for ${site.name}: ${topResult.link}`);
        return topResult.link;
      } else {
        console.log(`  ✗ No results found for ${site.name}`);
        return null;
      }
      
    } catch (error) {
      console.error(`  Error searching ${site.name}:`, error.message);
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.log(`  Rate limited, backing off...`);
        delay = delay * 2;
        continue;
      }
      
      delay = delay * 2;
    }
  }
  
  console.log(`  ✗ Giving up on ${site.name} after ${attempts} attempts`);
  return null;
}

export async function discoverAllUrls(genus, species) {
  const cfg = loadConfig();
  const currentCache = loadCache();
  
  // Normalize species key to ensure consistent capitalization (Genus species format)
  const speciesKey = normalizeSpeciesKey(genus, species);
  
  // Load existing cached URLs for this species (if any)
  const cachedUrls = currentCache[speciesKey] || {};
  const urls = { ...cachedUrls }; // Start with existing cache
  
  // Check which sites are missing from cache
  const sitesToDiscover = cfg.sites.filter(site => !cachedUrls[site.name]);
  
  if (sitesToDiscover.length === 0) {
    console.log(`\nCache hit for ${speciesKey} (all ${cfg.sites.length} sites cached)`);
    return urls;
  }
  
  const cachedCount = Object.keys(cachedUrls).length;
  console.log(`\nPartial cache for ${speciesKey}: ${cachedCount}/${cfg.sites.length} sites cached`);
  console.log(`Discovering ${sitesToDiscover.length} missing URLs...`);
  
  let newDiscoveries = 0;
  const apiKey = process.env.SERPAPI_API_KEY;
  
  // Warn if API key is missing but continue (direct URLs will still work)
  if (!apiKey) {
    console.warn('\n⚠️  SERPAPI_API_KEY not set - web searches will be skipped');
    console.warn('   Only direct URLs (e.g., Google Images) will be generated');
  }
  
  for (const site of sitesToDiscover) {
    let url;
    
    if (site.useDirectUrl) {
      // Construct URL directly (e.g., for Google Images) - no API key needed
      const searchTerm = encodeURIComponent(`${genus} ${species}`);
      url = `https://www.${site.baseUrl}&q=${searchTerm}`;
      console.log(`Constructing direct URL for ${site.name}: ${url}`);
    } else {
      // Use SerpApi to search for the URL - requires API key
      if (!apiKey) {
        console.log(`Skipping ${site.name} (requires SERPAPI_API_KEY)`);
        continue;
      }
      
      const searchQuery = `site:${site.baseUrl} ${genus} ${species}`;
      console.log(`Searching: ${searchQuery}`);
      
      url = await searchWithRetry(searchQuery, site);
    }
    
    if (url) {
      urls[site.name] = url;
      newDiscoveries++;
    }
  }
  
  // Save updated cache if we discovered any new URLs
  if (newDiscoveries > 0) {
    currentCache[speciesKey] = urls;
    cache = currentCache;
    saveCache();
    console.log(`\nDiscovered ${newDiscoveries} new URLs for ${speciesKey}`);
    console.log(`Total: ${Object.keys(urls).length}/${cfg.sites.length} URLs cached`);
  } else if (Object.keys(urls).length === 0) {
    console.log(`\n⚠️  No URLs discovered for ${speciesKey} - not caching empty result`);
    console.log('   This allows retry on next run if issues are resolved');
  } else {
    console.log(`\nNo new URLs discovered (still have ${Object.keys(urls).length}/${cfg.sites.length} from cache)`);
  }
  
  return urls;
}

export function getCachedUrls(genus, species) {
  const currentCache = loadCache();
  // Normalize species key to ensure consistent capitalization (Genus species format)
  const speciesKey = normalizeSpeciesKey(genus, species);
  return currentCache[speciesKey] || null;
}

export function clearCache() {
  cache = {};
  saveCache();
  console.log('Cache cleared');
}

/**
 * Migrate cache to consolidate duplicate entries with different capitalizations
 * Merges all variants (e.g., "carex grayi", "Carex grayi", "CAREX GRAYI") into
 * the normalized form ("Carex grayi")
 * @returns {Object} Migration summary with before/after counts
 * @throws {Error} If migration fails (original cache is preserved)
 */
export function migrateCacheKeys() {
  // Work on a deep clone to avoid mutating the original until save succeeds
  const currentCache = loadCache();
  const originalCache = JSON.parse(JSON.stringify(currentCache));
  const migratedCache = {};
  const mergeLog = [];
  
  try {
    // Group entries by normalized key
    const groups = {};
    const unparsableEntries = {}; // Preserve entries that can't be normalized
    
    for (const [originalKey, urls] of Object.entries(currentCache)) {
      // Extract genus and species from key
      const parts = originalKey.split(' ');
      if (parts.length < 2) {
        console.warn(`Preserving unparsable cache key: "${originalKey}" (cannot split into genus + species)`);
        unparsableEntries[originalKey] = urls;
        continue;
      }
      
      const genus = parts[0];
      const species = parts.slice(1).join(' '); // Handle multi-word species
      
      try {
        const normalizedKey = normalizeSpeciesKey(genus, species);
        
        if (!groups[normalizedKey]) {
          groups[normalizedKey] = [];
        }
        
        groups[normalizedKey].push({ originalKey, urls });
      } catch (error) {
        console.warn(`Preserving unparsable key "${originalKey}": ${error.message}`);
        unparsableEntries[originalKey] = urls;
      }
    }
    
    // Merge duplicate entries
    for (const [normalizedKey, entries] of Object.entries(groups)) {
      if (entries.length > 1) {
        // Multiple entries found - merge them
        const mergedUrls = {};
        const originalKeys = entries.map(e => e.originalKey);
        
        // Merge all URLs, prioritizing entries with more sites
        for (const { urls } of entries) {
          Object.assign(mergedUrls, urls);
        }
        
        migratedCache[normalizedKey] = mergedUrls;
        mergeLog.push({
          normalizedKey,
          originalKeys,
          urlCount: Object.keys(mergedUrls).length
        });
      } else {
        // Single entry - just use it
        migratedCache[normalizedKey] = entries[0].urls;
      }
    }
    
    // Add back unparsable entries (preserve for manual cleanup)
    Object.assign(migratedCache, unparsableEntries);
    
    // Only commit to cache after successful processing
    cache = migratedCache;
    saveCache();
    
    return {
      before: Object.keys(currentCache).length,
      after: Object.keys(migratedCache).length,
      merged: mergeLog,
      unparsable: Object.keys(unparsableEntries).length
    };
    
  } catch (error) {
    // Rollback on any error - restore original cache
    cache = originalCache;
    console.error('Migration failed, cache restored to original state');
    throw new Error(`Cache migration failed: ${error.message}`);
  }
}
