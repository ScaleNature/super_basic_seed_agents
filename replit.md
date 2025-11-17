# Seed and Species Aggregator

## Overview

The Seed and Species Aggregator is a data management platform designed to aggregate, validate, and synthesize botanical data from multiple Google Drive sources. The application provides a professional dashboard for managing seed and species information with features for data source synchronization, validation reporting, and data synthesis. Built as a full-stack web application, it combines a React frontend with an Express backend, emphasizing data clarity and efficient workflows for scientific/agricultural data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Carbon Design System inspiration for data-heavy interfaces
- IBM Plex Sans and IBM Plex Mono typography for professional credibility

**Design Principles:**
- Data dashboard approach prioritizing information hierarchy
- Responsive data tables with clear scannability
- Professional color scheme with primary green accent (142 76% 36%)
- Dark mode support with theme toggle functionality

### Backend Architecture

**Server Framework:**
- Express.js HTTP server with TypeScript
- RESTful API design (routes prefixed with `/api`)
- Custom middleware for request logging and JSON response capture
- Development-only Vite middleware integration for HMR

**Data Storage Strategy:**
- In-memory storage implementation (MemStorage) as current pattern
- Interface-based storage abstraction (IStorage) for future database integration
- Drizzle ORM configured for PostgreSQL (via Neon serverless driver)
- Schema defined with users table as foundation for future expansion

**Session & State Management:**
- express-session configured (connect-pg-simple for PostgreSQL sessions)
- In-memory user management with UUID-based identifiers
- No authentication currently implemented (placeholder User schema exists)

### Data Processing Pipeline

**Data Sources:**
- Google Drive folder integration for multiple botanical data sources
- Configurable folder IDs stored in `config/config.json`
- Manual PDF extraction approach (automation deferred)

**Synthesis & Validation:**
- Validation-first quality gate philosophy before data processing
- Strict mode validation with required field enforcement
- Configurable merge strategies (currently set to "latest")
- JSON output format for synthesized data

**AI Integration:**
- Anthropic Claude API (Claude Sonnet 4.5) for advanced data processing
- API key managed via environment variables
- Test harness provided for API connectivity verification

### Application Pages

**Dashboard (`/`):**
- Overview statistics (total species, data sources, validation errors, last sync)
- Quick action panel (sync, synthesis, export, validation)
- Data source status cards with sync indicators
- Recent activity table with filterable records

**Data Sources (`/data-sources`):**
- Connected sources management interface
- Search functionality for filtering sources
- Individual source cards with sync status badges
- Add new data source capability

**Synthesis Tools (`/synthesis`):**
- Data aggregation process controls
- Progress tracking for synthesis operations
- Configuration for merge strategies

**Validation Center (`/validation`):**
- Error reporting with severity levels (high/medium/low)
- Searchable validation error table
- Field-level error descriptions

## External Dependencies

**Third-Party Services:**
- Google Drive API (for data source synchronization)
- Anthropic Claude API (for AI-powered data processing)
- Neon Database (PostgreSQL serverless, configured but not yet actively used)

**Key NPM Packages:**
- `@anthropic-ai/sdk`: Claude API integration
- `@neondatabase/serverless`: Serverless PostgreSQL driver
- `drizzle-orm` & `drizzle-kit`: TypeScript ORM and migration tools
- `@radix-ui/*`: Headless UI component primitives (17+ packages)
- `@tanstack/react-query`: Asynchronous state management
- `wouter`: Lightweight routing library
- `date-fns`: Date manipulation and formatting
- `zod`: Schema validation and type inference

**Development Tools:**
- Replit-specific plugins for development environment
- TypeScript compiler with strict mode enabled
- ESBuild for production builds
- PostCSS with Tailwind CSS and Autoprefixer

**Repository & Project Management:**
- GitHub repository: `ScaleNature/super_basic_seed_agents`
- Google Drive for data storage
- GitHub Projects for task management