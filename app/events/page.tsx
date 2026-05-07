import { Suspense } from "react";
import EventsList from "./_components/EventsList";
import EventsHeader from "./_components/EventsHeader";
import EventsFilters from "./_components/EventsFilters";
import { getAllEvents } from "@/lib/actions/event.action";
async function EventsContent() {
  // Direct DB call. No fetch, no BASE_URL, no build hangs.
  const events = await getAllEvents();

  return (
    <>
      <EventsHeader totalEvents={events.length} />
      <div className="max-w-7xl mx-auto  py-8">
        <EventsFilters />
        <EventsList events={events} />
      </div>
    </>
  );
}

export default async function EventsPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<EventsPageSkeleton />}>
        <EventsContent />
      </Suspense>
    </main>
  );
}

function EventsPageSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <div className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="h-3 w-20 bg-zinc-800/50 rounded mb-2" />
              <div className="h-8 w-40 bg-zinc-800/50 rounded mb-2" />
              <div className="h-4 w-64 bg-zinc-800/50 rounded" />
            </div>
            <div className="h-10 w-16 bg-zinc-800/50 rounded" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-12 bg-zinc-900/50 backdrop-blur-sm rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-105 bg-zinc-900/50 backdrop-blur-sm rounded-lg animate-pulse border border-zinc-800/50"
            />
          ))}
        </div>
      </div>
    </>
  );
}
