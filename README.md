# TV Shows Application

A real-time TV show discovery platform built with Nuxt 4, featuring intelligent data fetching, server-sent events for live updates, and an adaptive UI optimized for both mobile and desktop experiences.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [Performance Optimizations](#performance-optimizations)
- [Getting Started](#getting-started)

## Architecture Overview

This application demonstrates a modern full-stack architecture with clean separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Components  │  │  Composables │  │    Pages     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────┬────────────────────────────────────────────┘
             │ HTTP + SSE
┌────────────▼────────────────────────────────────────────┐
│                     Server Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  API Routes  │  │   Services   │  │    Cache     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────┬────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│                 External API (TVMaze)                   │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **No Traditional State Management** - Leverages Vue 3's Composition API with `useState` for global state and SSE for real-time synchronization
2. **Server-Sent Events over WebSocket** - Unidirectional server-to-client updates with automatic reconnection
3. **Normalized Cache Strategy** - Shows stored by ID for O(1) lookups and duplicate prevention
4. **Service Layer Abstraction** - Clean separation between external API, business logic, and domain logic
5. **Isomorphic Type Safety** - Shared TypeScript types and utilities between client and server

## Tech Stack

### Core Framework
- **Nuxt 4.2.2** - Full-stack Vue framework with SSR/SSG capabilities
- **Vue 3.5.25** - Composition API for reactive UI components
- **TypeScript** - End-to-end type safety

### State & Reactivity
- **VueUse** - Composition utilities library
  - `useSessionStorage` - Persistent genre selection
  - `useColorMode` - Automatic theme management
  - `useWindowSize` - Responsive behavior
  - `useDebounceFn` - Search input debouncing

### Styling
- **Sass** - CSS preprocessing
- **CSS Variables** - Design token system with theme support
- **CSS Grid & Flexbox** - Modern responsive layouts

### Backend
- **Nitro** - Nuxt's built-in server engine
- **h3** - Underlying HTTP framework
- **EventSource API** - Native browser SSE client
- **Nuxt Storage** - Unified storage abstraction for caching

### External API
- **TVMaze API** - TV show data source

## Project Structure

```
/tv-shows/
├── app/                          # Client-side application
│   ├── components/
│   │   ├── Components/           # Reusable base components
│   │   │   ├── Modal.vue        # Reusable modal with scroll locking
│   │   │   ├── Input.vue        # Form input component
│   │   │   ├── Button.vue       # Polymorphic button component
│   │   │   └── ...
│   │   └── DashboardComponents/  # Domain-specific components
│   │       ├── ShowCard.vue     # Show display card (lg/sm/auto)
│   │       ├── Search.vue       # Search modal with debouncing
│   │       ├── Shows.vue        # Main show listing
│   │       └── Genres.vue       # Genre filter sidebar
│   ├── composables/
│   │   ├── useShows.ts          # Global state + SSE connection
│   │   ├── useDeduped.ts        # Request deduplication HOC
│   │   ├── useApi.ts            # Typed HTTP client
│   │   ├── useTheme.ts          # Auto theme switching
│   │   └── useVerticalSnapScroll.ts  # Custom scroll behavior
│   ├── pages/
│   │   ├── index.vue            # Dashboard (genre-filtered shows)
│   │   └── show/[id].vue        # Show detail page
│   └── assets/css/
│       └── main.scss            # Design tokens & theme system
│
├── server/                       # Server-side logic
│   ├── api/
│   │   ├── shows/
│   │   │   ├── index.get.ts    # Initial data fetch
│   │   │   └── stream.get.ts   # SSE endpoint
│   │   └── search.get.ts        # Search endpoint
│   ├── services/
│   │   ├── tvmaze.service.ts   # External API wrapper
│   │   ├── shows.service.ts    # Core business logic
│   │   └── genres.service.ts   # Genre management
│   ├── cache/
│   │   ├── shows.cache.ts      # Normalized show data
│   │   └── genres.cache.ts     # Genre statistics
│   └── streams/
│       └── shows.stream.ts      # SSE pub/sub implementation
│
├── shared/                       # Isomorphic code
│   ├── types/
│   │   └── Show.ts             # Type definitions
│   └── utils/
│       ├── mergeById.ts        # Normalize & merge utility
│       ├── sortByRating.ts     # Show sorting
│       └── getPerGenre.ts      # Genre filtering
│
└── nuxt.config.ts               # Nuxt configuration
```

## Core Features

### 1. Intelligent Data Fetching Strategy

The application implements a **genre coverage algorithm** that optimizes data fetching:

**Cold Start (No Cache)**
- Fetches shows page-by-page until minimum coverage is achieved (10 shows per genre)
- Maximum 10 pages to prevent excessive API calls
- Early termination when genre requirements are satisfied

**Warm Start (Cache Available)**
- Remembers how many pages were fetched in previous session (`pagesFetched` metadata)
- Refetches exact same number of pages on restart for consistency
- Recalculates all genre counts from fresh cache

```typescript
// Singleton pattern prevents concurrent coverage runs
let coveragePromise: Promise<void> | null = null;

export async function ensureFullCoverage() {
  if (coveragePromise) return coveragePromise;
  coveragePromise = runCoverage();
  // ... implementation
}
```

### 2. Real-Time Updates via Server-Sent Events

**Pub/Sub Architecture**
- Server maintains registry of active SSE connections
- Broadcasts incremental updates to all connected clients
- Automatic cleanup on client disconnection

**Two-Phase Client Initialization**
1. **Phase 1**: HTTP GET `/api/shows` - Fast initial data load
2. **Phase 2**: EventSource `/api/shows/stream` - Real-time updates

```typescript
interface BroadcastResponse {
  shows: Show[] | null;      // Incremental updates (null = recalc only)
  genres: GenreCounts;        // Always contains current state
}
```

### 3. Search with Cache Enrichment

Search results are merged into the main cache, enriching the dataset over time:

```typescript
export async function addFromSearch(shows: Show[]) {
  const showsCache = await getShowsCache();
  showsCache.byId = mergeById(showsCache.byId, shows);
  await setShowsCache(showsCache);
  await resetGenreCounts();
  const newGenreCounts = await setGenreCounts(Object.values(showsCache.byId));
  broadcastShowsUpdate(shows, newGenreCounts);
}
```

**Benefits:**
- Future searches find previously discovered shows
- Genre counts remain accurate
- All clients receive updates, not just the searcher

### 4. Request Deduplication

The `useDeduped` composable prevents race conditions in rapid sequential requests:

```typescript
const searchShows = useDeduped(async (signal, query: string) => {
  return await useApi<Show[]>(`/api/search?query=${query}`, { signal });
});
```

When user types rapidly, only the latest request completes; all previous requests are aborted using `AbortController`.

### 5. Adaptive UI Components

**Vertical Snap Scroll**
- Only enabled on medium-height viewports (470px - 1030px)
- Disabled when search modal is open
- Handles both wheel and touch events
- Filters out disconnected DOM elements for robustness

**Responsive Genre Filter**
- Mobile: Drawer overlay with toggle button
- Desktop: Persistent sidebar
- Selection persists via `useSessionStorage`

**Show Card Sizing**
- `lg`: Large cards for top-rated shows (400-600px)
- `sm`: Compact cards for grid layouts (300-450px)
- `auto`: Fluid width for modal/container contexts (100%)

### 6. Automatic Theme Switching

Time-based theme management with recursive scheduling:

```typescript
// Light mode: 7am - 7pm
// Dark mode: 7pm - 7am
// Auto-schedules next theme change
```

## Design Patterns

### Caching Patterns

**Normalization Pattern**
```typescript
interface ShowsCache {
  byId: Record<number, Show>;  // O(1) lookups, no duplicates
  pagesFetched: number;         // Revalidation metadata
}
```

**Cache-Aside Pattern**
- Check cache first, fetch on miss, populate cache

**Write-Through Pattern**
- Search results immediately merge into cache

**Revalidation Pattern**
- Stores metadata to intelligently refetch on restart

### Service Layer Patterns

**Facade Pattern**
- `shows.service` coordinates cache, API, streaming, and genres

**Singleton Pattern**
- `coveragePromise` ensures only one coverage run executes globally

**Strategy Pattern**
- Cold start vs. warm start fetching strategies

### Composable Patterns

**Higher-Order Function**
- `useDeduped` wraps any async function with abort logic

**Decorator Pattern**
- Enhances functions with cross-cutting concerns (cancellation, debouncing)

### Component Patterns

**Polymorphic Components**
```vue
<base-button as="a" href="/show/1">View Show</base-button>
<base-button as="button" @click="submit">Submit</base-button>
```

**Controlled Components**
- `v-model` for two-way data binding
- `defineModel` for cleaner component APIs

**Compound Components**
- Modal + Search + Input work together as a composed unit

## Data Flow

### Complete Request Lifecycle

```
1. CLIENT INITIALIZATION
   Browser Load
      ↓
   useShows() composable
      ↓
   ┌─────────────────────┬─────────────────────┐
   ↓                     ↓                     ↓
HTTP GET /api/shows  EventSource /stream   Initial Render
   ↓                     ↓
Initial Cache State  SSE Connection
   ↓                     ↓
   └──────────┬──────────┘
              ↓
       useState updates
              ↓
         UI Re-render

2. BACKGROUND SERVER PROCESSING
   SSE Connected
      ↓
   ensureFullCoverage()
      ↓
   Check cache.pagesFetched
      ↓
   ┌─────────────┴──────────────┐
   ↓                            ↓
Cold Start                  Warm Start
(Fetch until satisfied)     (Refetch N pages)
   ↓                            ↓
   └──────────┬─────────────────┘
              ↓
   TVMaze API fetchShowsPage()
              ↓
   Merge into normalized cache
              ↓
   Update genre counts
              ↓
   Broadcast SSE to all clients
              ↓
   Client receives & merges updates

3. USER SEARCH FLOW
   User types in search
      ↓
   500ms debounce
      ↓
   useDeduped (aborts previous)
      ↓
   GET /api/search
      ↓
   TVMaze search API
      ↓
   Merge results into cache
      ↓
   Recalculate genre counts
      ↓
   ┌────────────┴────────────┐
   ↓                         ↓
Broadcast to all SSE    Return to searcher
   ↓
All clients update
```

## Performance Optimizations

### Data Layer

1. **Normalized Cache Structure** - `Record<number, Show>` prevents duplicates and enables O(1) lookups
2. **Incremental Loading** - Fetch only what's needed via genre coverage algorithm
3. **Smart Revalidation** - Remembers `pagesFetched` to avoid over-fetching
4. **In-Place Mutations** - `mergeCountsInPlace` avoids object copying overhead

### Network Layer

1. **Server-Sent Events** - Single long-lived connection vs. polling
2. **Request Deduplication** - `useDeduped` cancels in-flight requests via `AbortController`
3. **Debouncing** - 500ms search debounce reduces API calls during typing
4. **Incremental Updates** - Only new shows broadcasted, not entire dataset

### Rendering Layer

1. **Computed Properties** - Vue 3 reactivity efficiently tracks dependencies
2. **Stable Keys** - `v-for :key="show.id"` for efficient list reconciliation
3. **Scoped CSS** - Component-level isolation prevents style pollution
4. **CSS Grid** - GPU-accelerated layouts
5. **Scroll Snap** - Native browser performance, no JavaScript scroll handling

### Code Splitting

1. **Nuxt Auto-Splits** - Page-based code splitting automatic
2. **Component Auto-Import** - Tree-shakable base components via Nuxt config

### Memory Management

1. **SSE Cleanup** - `onBeforeUnmount(disconnectSSE)` prevents leaks
2. **Scroll Section Cleanup** - Filters disconnected elements, clears array on unmount
3. **AbortController Cleanup** - Controllers cleared after request completion

## Getting Started

### Prerequisites

- Node.js 18+ (or compatible version)
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment

The application uses the public TVMaze API and requires no environment variables for basic operation.

### Configuration

**Nuxt Config** (`nuxt.config.ts`):
- Auto-imports for components and composables
- Base component prefix configuration
- TypeScript strict mode

**Design Tokens** (`app/assets/css/main.scss`):
- CSS variables for colors, spacing, typography, shadows
- Dark/light mode themes
- Transition/animation timings

### Development

```bash
npm run dev
```

Access the application at `http://localhost:3000`

**Available Routes:**
- `/` - Main dashboard with genre filtering
- `/show/:id` - Individual show detail page

**SSE Endpoint:**
- `http://localhost:3000/api/shows/stream`

**API Endpoints:**
- `GET /api/shows` - Initial cache state
- `GET /api/search?query=:term` - Search shows

## Architecture Highlights

This application demonstrates production-grade patterns:

1. **Clean Separation of Concerns** - Service layer, cache layer, streaming layer
2. **Performance-First Decisions** - Normalization, SSE, deduplication, debouncing
3. **Scalability Patterns** - Singleton coverage, pub/sub streaming, cache abstraction
4. **Type Safety** - TypeScript throughout, shared types, function overloading
5. **Modern Patterns** - Composition API, SSE, CSS Grid, design tokens
6. **Production-Ready** - Error handling, cleanup, graceful degradation
7. **Developer Experience** - Nuxt auto-imports, file-based routing, clear structure

The architecture balances **pragmatism** (no over-engineering) with **quality** (proper patterns). It's ready to scale—swap cache backend to Redis, add rate limiting, horizontal scaling—without major refactoring.

---

Built with Nuxt 4 + Vue 3 + TypeScript
