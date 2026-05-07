"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EventCardProps {
  event: {
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
  };
}

const MODE_ICONS: Record<string, string> = {
  online: "⬡",
  offline: "◈",
  hybrid: "◉",
};

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    router.push(`/events?tag=${tag}`);
  };

  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group  bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-lg overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20 hover:bg-zinc-900/60 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-zinc-800/50 overflow-hidden shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Mode badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/50 rounded-full flex items-center gap-1.5">
          <span className="text-sm">{MODE_ICONS[event.mode]}</span>
          <span className="text-xs font-mono text-zinc-300 capitalize">
            {event.mode}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col">
        {/* Date + Time */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">{formattedDate}</span>
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="truncate">{event.time}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-zinc-100 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-200">
          {event.title}
        </h3>

        {/* Overview */}
        <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
          {event.overview}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Spacer to push tags and organizer to bottom */}
        <div className="flex-1" />

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/50">
          {event.tags.slice(0, 3).map((tag) => (
            <button
              suppressHydrationWarning
              key={tag}
              onClick={(e) => handleTagClick(e, tag)}
              className="px-2 py-0.5 bg-zinc-800/50 hover:bg-emerald-500/20 border border-zinc-700/50 hover:border-emerald-500/40 rounded text-xs font-mono text-zinc-400 hover:text-emerald-400 backdrop-blur-sm transition-all duration-200"
            >
              #{tag}
            </button>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-mono text-zinc-500">
              +{event.tags.length - 3}
            </span>
          )}
        </div>

        {/* Organizer */}
        <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">
            by <span className="text-zinc-400">{event.organizer}</span>
          </span>
          <span className="text-emerald-400 text-sm group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
