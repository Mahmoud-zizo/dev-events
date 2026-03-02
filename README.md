# DevEvent - Events Hub

A modern web application for discovering and booking developer events including hackathons, meetups, and conferences.

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 with custom CSS utilities
- **Database:** MongoDB with Mongoose 9
- **Image Storage:** Cloudinary
- **UI Libraries:** Lucide React (icons), OGL (WebGL light rays effect)
- **Fonts:** Schibsted Grotesk, Martian Mono (Google Fonts)

## Project Structure

```
events-hub/
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts              # GET all events, POST create event
│   │       └── [slug]/
│   │           └── route.ts          # GET single event by slug
│   ├── events/
│   │   └── [slug]/
│   │       └── page.tsx              # Event details page
│   ├── globals.css                   # Global styles + Tailwind utilities
│   ├── layout.tsx                    # Root layout with NavBar & LightRays
│   └── page.tsx                      # Homepage with featured events
├── components/
│   ├── BookEvent.tsx                 # Event booking form (client component)
│   ├── EventCard.tsx                 # Event card for listings
│   ├── ExploreBtn.tsx                # CTA button (client component)
│   ├── LightRays.tsx                 # WebGL background effect (client component)
│   └── NavBar.tsx                    # Navigation header
├── database/
│   ├── event.model.ts                # Event mongoose schema
│   ├── booking.model.ts              # Booking mongoose schema
│   └── index.ts                      # Model exports
├── lib/
│   ├── actions/
│   │   └── event.action.ts           # Server actions for events
│   ├── mongodb.ts                    # MongoDB connection singleton
│   └── utils.ts                      # Utility functions (cn for classnames)
└── public/
    ├── icons/                        # SVG icons (pin, calendar, clock, etc.)
    └── images/                       # Static images
```

## Database Models

### Event Model (`database/event.model.ts`)

| Field       | Type       | Required | Description                              |
|-------------|------------|----------|------------------------------------------|
| title       | String     | Yes      | Event title (max 100 chars)              |
| slug        | String     | Auto     | URL-friendly slug (auto-generated)       |
| description | String     | Yes      | Full description (max 1000 chars)        |
| overview    | String     | Yes      | Brief overview (max 500 chars)           |
| image       | String     | Yes      | Cloudinary image URL                     |
| venue       | String     | Yes      | Venue name                               |
| location    | String     | Yes      | Location address                         |
| date        | String     | Yes      | Event date (normalized to YYYY-MM-DD)    |
| time        | String     | Yes      | Event time (normalized to HH:MM 24hr)    |
| mode        | String     | Yes      | "online" | "offline" | "hybrid"         |
| audience    | String     | Yes      | Target audience description              |
| agenda      | [String]   | Yes      | List of agenda items (min 1)             |
| organizer   | String     | Yes      | Organizer name/info                      |
| tags        | [String]   | Yes      | Event tags for categorization (min 1)    |
| createdAt   | Date       | Auto     | Timestamp                                |
| updatedAt   | Date       | Auto     | Timestamp                                |

**Indexes:**
- `slug` (unique)
- `date, mode` (compound)

### Booking Model (`database/booking.model.ts`)

| Field     | Type     | Required | Description                        |
|-----------|----------|----------|------------------------------------|
| eventId   | ObjectId | Yes      | Reference to Event                 |
| email     | String   | Yes      | User email (validated, lowercase)  |
| createdAt | Date     | Auto     | Timestamp                          |
| updatedAt | Date     | Auto     | Timestamp                          |

**Indexes:**
- `eventId`
- `eventId, createdAt` (compound)
- `email`
- `eventId, email` (unique compound - prevents duplicate bookings)

**Validation:** Pre-save hook verifies the referenced event exists.

## API Routes

### `GET /api/events`
Fetches all events sorted by creation date (newest first).

**Response:**
```json
{
  "message": "Events Fetched Successfully",
  "events": [{ ...event }]
}
```

### `POST /api/events`
Creates a new event with image upload to Cloudinary.

**Request:** `multipart/form-data`
- All event fields as form fields
- `image` - File upload
- `tags` - JSON string array
- `agenda` - JSON string array

**Response:**
```json
{
  "message": "Event Created Successfully",
  "event": { ...createdEvent }
}
```

### `GET /api/events/[slug]`
Fetches a single event by its slug.

**Response:**
```json
{
  "message": "Event fetched successfully",
  "event": { ...event }
}
```

**Error Responses:**
- `400` - Invalid or missing slug
- `404` - Event not found
- `500` - Server/database error

## Data Fetching Patterns

### Server-Side Fetching (Pages)
Events are fetched server-side using the `NEXT_PUBLIC_BASE_URL` environment variable:

```typescript
// app/page.tsx - Homepage
const res = await fetch(`${BASE_URL}/api/events`);
const { events } = await res.json();

// app/events/[slug]/page.tsx - Event details
const req = await fetch(`${BASE_URL}/api/events/${slug}`);
const { event } = await req.json();
```

### Server Actions
Used for database queries that don't need API routes:

```typescript
// lib/actions/event.action.ts
export const getSimilarEventsBySlug = async (slug: string) => {
  await connectDB();
  const event = await Event.findOne({ slug });
  return await Event.find({
    _id: { $ne: event._id },
    tags: { $in: event.tags },
  }).lean();
};
```

### MongoDB Connection
Singleton pattern with connection caching for serverless environments:

```typescript
// lib/mongodb.ts
// Caches connection on global object to survive hot reloads
// Returns existing connection or creates new one
```

## Components

| Component      | Type   | Description                                      |
|----------------|--------|--------------------------------------------------|
| `NavBar`       | Server | Header with logo and navigation links            |
| `EventCard`    | Server | Displays event thumbnail, title, date, location  |
| `BookEvent`    | Client | Email form for event registration                |
| `ExploreBtn`   | Client | Animated CTA button                              |
| `LightRays`    | Client | WebGL animated background effect                 |

## Environment Variables

Create a `.env.local` file with:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Base URL for API calls (no trailing slash)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Current Features

- ✅ Homepage with featured events list
- ✅ Event detail page with full information
- ✅ Event creation API with image upload
- ✅ Similar events recommendation (by tags)
- ✅ Responsive design with dark theme
- ✅ Animated WebGL background

## TODO / Features to Build

### High Priority
1. **Complete Booking Flow**
   - Connect `BookEvent` component to `/api/bookings` endpoint
   - Create booking API route (POST to create, GET to retrieve)
   - Add booking confirmation/success state
   - Email notification on booking

2. **User Authentication**
   - Add auth provider (NextAuth.js / Clerk / etc.)
   - Protect event creation
   - User dashboard for managing bookings

3. **Events Page**
   - Create `/events` route to list all events
   - Add filtering by mode (online/offline/hybrid)
   - Add filtering by tags
   - Add date-based filtering
   - Add search functionality

4. **Event Creation UI**
   - Create `/create-event` page with form
   - Multi-step form or single page form
   - Image upload preview
   - Tags and agenda dynamic inputs

### Medium Priority
5. **Admin Dashboard**
   - Event management (edit/delete)
   - Booking management
   - Analytics

6. **Event Updates**
   - PUT/PATCH endpoint for event updates
   - DELETE endpoint for event removal

7. **Pagination**
   - Add pagination to events list API
   - Implement infinite scroll or page numbers

### Low Priority
8. **SEO & Meta**
   - Dynamic metadata for event pages
   - OpenGraph images
   - Sitemap generation

9. **Email Integration**
   - Booking confirmation emails
   - Event reminders
   - Newsletter signup

10. **Calendar Integration**
    - Add to Google Calendar
    - iCal export

## Notes for Development

- The `BookEvent` component currently has a mock submission (setTimeout). Needs real API integration.
- NavBar links for "Events" and "Create Event" both point to `/` - need proper routes.
- The `bookings` count on event detail page is hardcoded to `10` - needs real booking count query.
- Cloudinary is configured but ensure env vars are set for image uploads to work.
- React Compiler is enabled in `next.config.ts` for performance optimization.
