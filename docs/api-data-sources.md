# API & Data Sources Reference

This document describes all external APIs and data sources that the Seed and Species Aggregator accesses.

---

## 1. Google Drive & Sheets API

### Purpose
- **Data Output**: Creates and manages Google Sheets for storing processed botanical data
- **File Management**: Organizes output sheets in designated Google Drive folders
- **Data Persistence**: Provides long-term storage for synthesis results

### Authentication
**Method**: Replit Google Drive Connector (OAuth via environment variables)

**Environment Variables**:
- `REPLIT_CONNECTORS_HOSTNAME` - Connector service hostname
- `REPL_IDENTITY` / `WEB_REPL_RENEWAL` - Authentication tokens

**How it Works**:
- Replit's connector system handles OAuth flow automatically
- Access tokens are obtained through Replit's secure token exchange
- No manual OAuth configuration required in Replit environment

### API Endpoints Used
- `sheets.spreadsheets.create()` - Creates new Google Sheets
- `sheets.spreadsheets.values.append()` - Appends row data to sheets
- `drive.files.list()` - Searches for output folder by name
- `drive.permissions.create()` - Sets sharing permissions on created sheets

### Usage in Codebase
**Files**: `src/output/plant-pipeline.js`, `src/output/process-plant.js`, `src/output/batch-process-plants.js`

**Key Functions**:
- `createPlantSheet(folderId, prefix)` - Creates timestamped Google Sheet
- `appendPlantRows(spreadsheetId, plantRecords)` - Writes plant data rows

### Portability Considerations
✅ **Works in Replit**: Fully integrated via connector  
❌ **Outside Replit**: Requires alternative authentication

**To run outside Replit**, you must:
- Switch to Google Service Account authentication (recommended for automation)
- OR implement OAuth 2.0 client credentials flow (for personal use)
- Update authentication code in `src/output/plant-pipeline.js`

---

## 2. Anthropic Claude API

### Purpose
- **Botanical Validation**: Verifies botanical names and checks nomenclature status
- **Taxonomic Classification**: Retrieves family classification for valid species
- **Native Status Checking**: Determines if species is native to Southeast Michigan
- **Common Name Discovery**: Identifies vernacular names used in regional flora

### Authentication
**Method**: API Key (via environment variable)

**Environment Variable**: `ANTHROPIC_API_KEY`

**Storage**: Replit Secrets (secure encrypted storage)

### Model Used
**Current Model**: `claude-sonnet-4-5`

**Configuration**:
- Botanical validation: 1024 max tokens
- Native status checking: 512 max tokens
- Common names discovery: 1024 max tokens

### API Endpoints Used
- `client.messages.create()` - Sends prompts and receives JSON-structured responses

### Usage in Codebase
**Files**:
- `src/synthesis/process-botanical-name.js`
- `src/synthesis/process-native-checker.js`
- `src/synthesis/process-common-names.js`

**Response Format**: JSON objects with structured botanical data

**Error Handling**:
- Strips markdown code block formatting if present
- Parses multi-block text responses
- Validates JSON structure before returning

### Portability Considerations
✅ **Works in any environment**: Just set `ANTHROPIC_API_KEY`  
✅ **Local development**: Export environment variable  
✅ **No Replit dependencies**: Pure API key authentication

### Rate Limits & Costs
- Usage based on prompt/completion tokens
- Token counts vary by synthesis module (512-1024 max tokens per request)
- See Anthropic pricing for current rates

---

## 3. SerpApi (Google Search API)

### Purpose
- **External Reference URL Discovery**: Finds plant species pages on botanical reference websites
- **Site-Specific Searches**: Uses `site:` operator to target specific domains
- **Result Caching**: Stores discovered URLs locally to minimize API usage

### Authentication
**Method**: API Key (via environment variable)

**Environment Variable**: `SERPAPI_API_KEY`

**Storage**: Replit Secrets (secure encrypted storage)

### Free Tier Details
- **Limit**: 100 searches/month (no credit card required)
- **Signup**: https://serpapi.com/users/sign_up
- **API Key Management**: https://serpapi.com/manage-api-key

### Search Parameters
**Standard Query Format**: `site:{domain} {genus} {species}`

**Example**: `site:illinoiswildflowers.info Quercus alba`

**Request Configuration**:
```javascript
{
  api_key: process.env.SERPAPI_API_KEY,
  q: searchQuery,
  num: 1  // Return only top result
}
```

### Targeted Websites
The module searches 8 botanical reference websites:
1. Michigan Flora (`michiganflora.net`)
2. Go Botany (`gobotany.nativeplanttrust.org`)
3. Illinois Wildflowers (`illinoiswildflowers.info`)
4. Lady Bird Johnson Wildflower Center (`wildflower.org`)
5. Prairie Moon Nursery (`prairiemoon.com`)
6. USDA PLANTS (`plants.usda.gov`)
7. Tropicos (`tropicos.org`)
8. Minnesota Wildflowers (`minnesotawildflowers.info`)

**Plus**:
- Google Images (direct URL construction, no API call required)

### Caching Strategy
**Cache Location**: `cache/external-reference-urls.json`

**Cache Structure**:
```json
{
  "Genus species": {
    "Site Name": "https://url...",
    "Another Site": "https://url..."
  }
}
```

**Behavior**:
- Cache hit: Returns all URLs immediately (no API calls)
- Partial cache: Only searches missing sites
- Cache miss: Searches all configured sites
- Empty results NOT cached (allows retry on next run)

### Retry & Rate Limiting
**Exponential Backoff**:
- Start delay: 10ms
- Max delay: 1000ms
- Doubles on rate limit errors (429)
- Maximum attempts until max delay exceeded

### Usage in Codebase
**Files**: `src/synthesis/process-external-reference-urls.js`

**Key Functions**:
- `discoverAllUrls(genus, species)` - Main discovery function with caching
- `searchWithRetry(searchQuery, site)` - Retry logic for individual sites
- `normalizeSpeciesKey(genus, species)` - Ensures consistent cache keys

### Portability Considerations
✅ **Works in any environment**: Just set `SERPAPI_API_KEY`  
✅ **Local development**: Export environment variable  
✅ **Cache persists**: Results stored in JSON file (portable across systems)  
✅ **Graceful degradation**: Works without API key (direct URLs still generated)

---

## 4. GBIF Species API

### Purpose
- **Botanical Synonym Retrieval**: Finds historical scientific names for species
- **Taxonomic Matching**: Resolves species names to GBIF Backbone Taxonomy
- **Cross-Reference Support**: Provides "previously known as" names for literature searches

### Authentication
**Method**: None required (public API)

**Base URL**: `https://api.gbif.org/v1/species`

### API Endpoints Used

#### 1. Species Match
**Endpoint**: `GET /species/match`

**Purpose**: Matches botanical name to GBIF taxonomy database

**Parameters**:
```javascript
{
  name: "Genus species",  // Full binomial name
  verbose: false           // Compact response
}
```

**Response Fields Used**:
- `usageKey` - Unique identifier for this taxon
- `scientificName` - Accepted scientific name
- `canonicalName` - Name without author citation
- `rank` - Taxonomic rank (SPECIES, GENUS, etc.)
- `matchType` - Match confidence (EXACT, FUZZY, HIGHERRANK)
- `status` - Nomenclatural status (ACCEPTED, SYNONYM, etc.)

#### 2. Name Usage Synonyms
**Endpoint**: `GET /species/{usageKey}/synonyms`

**Purpose**: Retrieves all synonyms for a given taxon

**Response**: Array of synonym objects with:
- `key` - Synonym usage key
- `scientificName` - Full synonym with author
- `canonicalName` - Synonym without author
- `rank` - Taxonomic rank

### Data Processing Rules

**Species-Level Filtering**:
- Only includes synonyms with rank = "SPECIES"
- Excludes varieties (`var.`) and subspecies (`subsp.`)
- Returns binomial names only (genus + species epithet)

**Output Format**: Comma-separated binomial names  
**Example**: `"Eupatorium fistulosum, Eupatoriadelphus fistulosus"`

### Usage in Codebase
**Files**:
- `src/utils/gbif-client.js` - API client utility
- `src/synthesis/process-previous-botanical.js` - Synthesis module
- `test/gbif-integration.test.js` - Integration tests

**Key Functions**:
- `matchSpecies(genus, species)` - Matches botanical name to GBIF
- `getSynonyms(usageKey)` - Retrieves species-level synonyms
- `getTaxonDetails(usageKey)` - Gets complete taxon information

### Error Handling
**Module Behavior**:
- Network errors → Returns empty string (maintains column contract)
- No match found → Returns empty string
- Higher-rank match (genus only) → Returns empty string
- Invalid species → Returns empty string

**Philosophy**: Non-critical failures don't stop pipeline processing

### Portability Considerations
✅ **Works anywhere**: Public API, no authentication  
✅ **No API key needed**: Free and open  
✅ **No rate limits**: (Be respectful of public infrastructure)  
✅ **Stable endpoints**: Long-term API stability from GBIF

### API Documentation
**Official Docs**: https://www.gbif.org/developer/species

---

## Summary Table

| API/Service | Auth Method | API Key Required | Portability | Primary Use |
|-------------|-------------|------------------|-------------|-------------|
| **Google Drive/Sheets** | Replit Connector | No (via connector) | ❌ Replit-specific | Sheet creation & output |
| **Anthropic Claude** | API Key | Yes (`ANTHROPIC_API_KEY`) | ✅ Universal | Botanical validation, native status |
| **SerpApi** | API Key | Yes (`SERPAPI_API_KEY`) | ✅ Universal | External reference URLs |
| **GBIF Species** | None | No | ✅ Universal | Botanical synonyms |

---

## Environment Variable Setup

### Required Secrets (Replit)
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
SERPAPI_API_KEY=xxxxx
```

### Connector Variables (Automatic in Replit)
```bash
REPLIT_CONNECTORS_HOSTNAME=connector-service.replit.com
REPL_IDENTITY=xxxxx
WEB_REPL_RENEWAL=xxxxx
```

### Checking Configuration
All environment variables can be viewed in:
- **Replit**: Secrets tab in left sidebar
- **Local**: Environment variable settings for your OS

---

## Rate Limits & Usage Guidelines

### Claude API
- **Billing**: Token-based usage pricing
- **Limits**: Based on your Anthropic account tier
- **Best Practice**: Cache results when possible

### SerpApi
- **Free Tier**: 100 searches/month
- **Paid Tiers**: Available for higher volumes
- **Caching**: All results cached to minimize usage

### GBIF
- **Rate Limits**: None specified (public API)
- **Best Practice**: Be respectful, don't hammer endpoints
- **Availability**: High uptime (production-grade infrastructure)

### Google Drive/Sheets
- **Quotas**: Per-user quotas apply
- **Limits**: 300 read requests per minute per user
- **Best Practice**: Batch operations when possible

---

*Last Updated: 2024*
*Maintained by: Agent (auto-updated with code changes)*
