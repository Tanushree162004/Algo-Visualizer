# Algorithm Visualizer

## Overview

This is an interactive algorithm visualization tool built with React and Express. It allows users to visualize sorting algorithms (bubble sort, selection sort, insertion sort, merge sort, quick sort) and searching algorithms (linear search, binary search) with animated step-by-step execution. The application is entirely client-side for algorithm execution, using generator functions to step through each algorithm iteration with precise timing control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: React hooks with useRef for animation control
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth bar/element transitions during visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Purpose**: Serves static files only - all algorithm logic runs client-side
- **Development**: Vite middleware for HMR during development
- **Production**: Static file serving from built assets

### Algorithm Visualization Design
- **Generator Pattern**: Each algorithm is implemented as a JavaScript generator function that yields `Step` objects
- **Step Object**: Contains `array` (current state), `comparing` (indices being compared), `swapping` (indices being swapped), `sorted` (completed indices), and optionally `found` (for search)
- **Playback Control**: Uses refs (`stopRef`, `generatorRef`) to manage pause/resume and speed adjustment without re-renders
- **Visual Feedback**: Color-coded bars indicate state (primary=default, amber=comparing, red=swapping, green=sorted/found)

### Database Configuration
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Current Usage**: Minimal - users table exists but not actively used (algorithm runs are client-side only)
- **Migrations**: Managed via `drizzle-kit push`

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets/*` → `./attached_assets/*`

## External Dependencies

### UI Component Library
- **shadcn/ui**: Full component suite with Radix UI primitives
- **Configuration**: `components.json` defines new-york style, neutral base color, CSS variables enabled

### Key Runtime Dependencies
- **@tanstack/react-query**: Data fetching/caching (available but algorithms don't use API)
- **framer-motion**: Essential for smooth layout animations during sorting
- **drizzle-orm**: PostgreSQL ORM (requires DATABASE_URL environment variable)
- **connect-pg-simple**: Session storage (available for future auth needs)

### Build & Development
- **tsx**: TypeScript execution for development server
- **esbuild**: Production server bundling with dependency optimization
- **vite**: Client-side bundling with React plugin

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required by drizzle config)