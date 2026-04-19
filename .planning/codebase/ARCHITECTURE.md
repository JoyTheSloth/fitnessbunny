# Architecture

## Overview
A Next.js application with a mobile-first design. Uses the App Router for navigation and layouts.

## Directory Structure
- `app/`: Next.js App Router pages and layouts.
- `src/`: Source code including components, hooks, contexts, and screens.
  - `src/screens/`: High-level screen components.
  - `src/context/`: React Context providers for global state.
  - `src/lib/`: Utility libraries (e.g., Supabase client).
- `public/`: Static assets.

## Navigation
Managed via `BottomNav` component in the root layout, mapping pathnames to active tabs.
