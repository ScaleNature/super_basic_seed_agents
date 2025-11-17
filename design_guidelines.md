# Seed and Species Aggregator - Design Guidelines

## Design Approach: Data Dashboard System

**Selected Approach:** Design System - Carbon Design System  
**Justification:** This is a utility-focused, data-management application requiring clear information hierarchy, efficient data visualization, and professional credibility. Carbon Design excels at enterprise data applications with its structured grid system and comprehensive data table components.

## Core Design Principles

1. **Data Clarity First:** Prioritize readability and scannability of seed/species information
2. **Efficient Workflows:** Minimize clicks for data aggregation, validation, and synthesis tasks
3. **Professional Credibility:** Establish trust for scientific/agricultural data management
4. **Responsive Data Tables:** Ensure data remains accessible across devices

---

## Typography System

**Font Stack:**
- Primary: 'IBM Plex Sans' (via Google Fonts CDN)
- Monospace: 'IBM Plex Mono' for data fields and IDs

**Hierarchy:**
- Page Titles: text-3xl font-semibold (36px)
- Section Headers: text-xl font-medium (24px)
- Data Table Headers: text-sm font-semibold uppercase tracking-wide (14px)
- Body Text: text-base (16px)
- Data Cells: text-sm (14px)
- Helper Text: text-xs text-gray-600 (12px)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8  
- Component padding: p-4 to p-6
- Section spacing: mb-8
- Grid gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Grid Structure:**
- Container: max-w-7xl mx-auto px-4
- Main content: Single column on mobile, 12-column grid on desktop
- Sidebar navigation: 64px collapsed, 240px expanded (left-aligned)

---

## Component Library

### Navigation
- **Top Bar:** Fixed header with logo, search, user profile dropdown
- **Side Navigation:** Collapsible left sidebar with icon + label pattern
  - Home/Dashboard
  - Data Sources (Google Drive sync status)
  - Synthesis Tools
  - Validation Center
  - Output/Export
  - Settings

### Data Display Components

**Primary Data Table:**
- Sticky header row with sortable columns
- Alternating row backgrounds for scannability
- Row hover states for clarity
- Expandable rows for detailed species information
- Inline editing capabilities
- Pagination: 25/50/100 rows per page
- Column filters and search

**Cards for Summaries:**
- Stats cards: Total species count, data sources connected, last sync timestamp
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Icon + metric + label pattern

**Status Indicators:**
- Badges for sync status (Synced, Syncing, Error)
- Progress bars for validation processes
- Heroicons for status icons (check-circle, exclamation-circle, clock)

### Forms & Inputs

**Column Specification Forms:**
- Label above input pattern
- Input fields: border rounded px-4 py-2 focus:ring-2
- Dropdowns for mapping columns
- Multi-select for species attributes
- Text areas for notes/descriptions

**Validation Feedback:**
- Inline error messages below fields (text-sm text-red-600)
- Success checkmarks for validated data
- Warning banners for data conflicts

### Action Components

**Buttons:**
- Primary: Solid background, font-medium, px-6 py-2.5 rounded
- Secondary: Border outline, transparent background
- Icon buttons: Square 40x40px touch targets
- Heroicons for button icons (download, upload, sync)

**Modals:**
- Centered overlay for configuration dialogs
- Max-width: max-w-2xl
- Header + scrollable content + sticky footer with actions

---

## Dashboard Layout

**Main Dashboard Screen:**

1. **Stats Bar:** 4-column metric cards showing:
   - Total species aggregated
   - Active data sources
   - Last sync time
   - Validation errors

2. **Quick Actions Panel:** Prominent CTAs for:
   - Sync Google Drive sources
   - Run synthesis process
   - Export aggregated data
   - View validation report

3. **Recent Activity Table:** Last 10 data operations with:
   - Timestamp
   - Action type
   - Status
   - Affected records count

4. **Data Source Status:** Card-based grid showing each configured Google Drive folder:
   - Folder name
   - Connection status
   - Last sync time
   - Record count

---

## Specialized Screens

**Column Specifications Editor:**
- Split view: Source columns (left) → Mapping interface (center) → Target schema (right)
- Drag-and-drop or dropdown mapping
- Preview table at bottom showing transformed data

**Validation Center:**
- Filter sidebar for error types
- Data table with flagged records
- Bulk actions toolbar
- Detail panel showing validation rules

---

## Images

This data-focused application does not require hero images or decorative photography. All visual content should be:
- Data visualizations (charts showing species distribution, data quality metrics)
- Iconography for navigation and status indicators
- Empty state illustrations for "No data yet" scenarios (simple line drawings)

---

## Key Interactions

- **Loading States:** Skeleton screens for tables, spinner for button actions
- **Empty States:** Centered icon + message + CTA to configure first data source
- **Toasts:** Top-right notifications for sync completion, errors
- **Drag-and-Drop:** For column mapping and reordering table columns

**Animations:** Minimal - smooth transitions for sidebar expansion (300ms), subtle row hover, toast slide-in. No decorative animations.