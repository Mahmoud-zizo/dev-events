"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import EventCard from "./EventsCard";

interface Event {
  _id: string;
  title: string;
  slug: string;
  overview: string;
  image: string;
  date: string;
  time: string;
  location: string;
  mode: "online" | "offline" | "hybrid";
  tags: string[];
  organizer: string;
}

export default function EventsList({ events }: { events: Event[] }) {
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "all";
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Mode filter
      if (mode !== "all" && event.mode !== mode) return false;

      // Search filter (title, organizer, location)
      if (search) {
        const query = search.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesOrganizer = event.organizer.toLowerCase().includes(query);
        const matchesLocation = event.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrganizer && !matchesLocation)
          return false;
      }

      // Tag filter
      if (tag && !event.tags.includes(tag)) return false;

      return true;
    });
  }, [events, mode, search, tag]);

  if (filteredEvents.length === 0) {
    return (
      <div className="py-16 text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900/50 
        border border-zinc-800/50 mb-4 backdrop-blur-sm"
        >
          <span className="text-2xl">⌀</span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-200 mb-2">
          No events found
        </h3>
        <p className="text-sm text-zinc-400 font-mono">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {filteredEvents.map((event, i) => (
        <div
          key={event._id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
