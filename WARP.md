# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DevEvent is a Next.js 16.0.1 application built with React 19.2.0 and TypeScript. It's a developer events hub showcasing hackathons, meetups, and conferences. The app uses the Next.js App Router architecture with server and client components.

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Environment Variables
Required environment variables (stored in `.env`):
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL
- `MONGODB_URI` - MongoDB connection string (currently configured but not actively used in codebase)

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router (React Server Components)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom utility classes
- **Animations**: tw-animate-css
- **WebGL**: OGL library for advanced canvas rendering
- **Analytics**: PostHog for tracking and error monitoring
- **UI Components**: shadcn/ui configuration (New York style)
- **Fonts**: Schibsted Grotesk (primary), Martian Mono (monospace)

### Project Structure
```
app/                    # Next.js App Router
├── layout.tsx         # Root layout with fonts, navbar, and light rays
├── page.tsx           # Home page with event listings
└── globals.css        # Global styles with Tailwind and custom utilities

components/            # React components
├── EventCard.tsx     # Event card display component
├── ExploreBtn.tsx    # Scroll-to-events button (client component)
├── LightRays.tsx     # WebGL animated background (client component)
└── NavBar.tsx        # Header navigation

lib/                   # Utilities and constants
├── constants.ts      # Static event data
└── utils.ts          # cn() utility for class merging

public/               # Static assets
├── icons/           # SVG icons (logo, calendar, clock, pin, etc.)
└── images/          # Event posters (event1-6.png, event-full.png)
```

### Path Aliases
TypeScript path aliases are configured (`@/*` → root):
- `@/components` - Component imports
- `@/lib` - Utilities and constants
- `@/app` - App Router pages

### Key Design Patterns

**Client Components**: Components using hooks, browser APIs, or event handlers must be marked with `"use client"`:
- `LightRays.tsx` - Uses WebGL, refs, effects, and Intersection Observer
- `ExploreBtn.tsx` - Interactive button component

**Custom Tailwind Utilities** (defined in `globals.css`):
- `flex-center` - Flex with centered items
- `text-gradient` - Blue gradient text effect
- `glass` - Glassmorphic background effect
- `card-shadow` - Consistent card shadow

**Component Styling**: Uses scoped CSS with Tailwind's `@layer` and ID/class selectors in `globals.css` (e.g., `#event-card`, `#explore-btn`, `header nav`)

**LightRays Component**: A complex WebGL shader-based visual effect with the following architecture:
- Uses OGL library for WebGL rendering
- Implements custom GLSL vertex and fragment shaders for animated light rays
- Features intersection observer to optimize performance (only renders when visible)
- Accepts 14 configurable props for customization (origin, color, speed, spread, etc.)
- Includes mouse tracking with smoothing for interactive effects
- Handles proper WebGL cleanup to prevent memory leaks

**PostHog Integration**: Analytics are initialized client-side via `instrumentation-client.ts` with:
- Custom `/ingest` proxy rewrites in `next.config.ts` to avoid ad blockers
- Exception tracking enabled
- Debug mode in development

### Event Data Structure
Events are stored as static data in `lib/constants.ts` with the following shape:
```typescript
{
  slug: string,        // URL-friendly identifier
  image: string,       // Path to event poster
  title: string,       // Event name
  location: string,    // City, State
  date: string,        // Human-readable date
  time: string         // Duration or time range
}
```

## Development Guidelines

### Styling
- Use Tailwind CSS utilities; custom classes are defined in `globals.css`
- Follow existing patterns: use `@layer components` for complex component styles
- Component-specific styles use ID selectors (e.g., `#event-card`, `#explore-btn`)
- Use custom utilities (`flex-center`, `text-gradient`, `glass`) where applicable
- Responsive design uses Tailwind breakpoints (`max-sm:`, `sm:`, `md:`, `lg:`)

### TypeScript
- Strict mode is enabled
- Target ES2017
- Use proper typing for component props (define interfaces)
- Use React.FC or explicit function typing for components

### Component Creation
- Server components by default (no `"use client"` directive)
- Add `"use client"` only when using hooks, browser APIs, or event handlers
- Use `@/` path aliases for imports
- Follow existing naming: PascalCase for components
- For layout components (NavBar, layout), keep as server components when possible

### Image Handling
- Use Next.js `Image` component from `next/image`
- Icons are in `/public/icons/` (SVG format except logo.png)
- Event images in `/public/images/`
- Always provide `width`, `height`, and `alt` props

### Adding New Events
Events are currently hardcoded in `lib/constants.ts`. To add events:
1. Add event object to the `events` array
2. Place corresponding poster image in `public/images/`
3. Follow existing slug naming convention (lowercase-with-hyphens)

### WebGL/Canvas Work
When modifying `LightRays.tsx`:
- Understand the shader code in the `frag` and `vert` strings
- Uniforms are reactive to prop changes via useEffect
- Always test cleanup logic to prevent memory leaks
- Performance: Uses `devicePixelRatio` clamped to 2 max
- Intersection Observer prevents rendering when off-screen
