"use client";

export default function EventsHeader({ totalEvents }: { totalEvents: number }) {
  return (
    <div className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-2">
              DevEvent
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 mb-2">
              All Events
            </h1>
            <p className="text-sm text-zinc-400 font-mono">
              Discover hackathons, meetups, and conferences
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-emerald-400 font-mono">
              {totalEvents}
            </span>
            <span className="text-sm text-zinc-400 font-mono">
              {totalEvents === 1 ? "event" : "events"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
