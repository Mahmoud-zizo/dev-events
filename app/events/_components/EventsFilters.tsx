"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

const MODES = ["all", "online", "offline", "hybrid"] as const;

export default function EventsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentMode = (searchParams.get("mode") ||
    "all") as (typeof MODES)[number];
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      startTransition(() => {
        router.push(`/events?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateFilters("search", searchInput);
    },
    [searchInput, updateFilters],
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    startTransition(() => {
      router.push("/events", { scroll: false });
    });
  }, [router]);

  const hasActiveFilters = currentMode !== "all" || currentSearch || currentTag;

  return (
    <div className="mb-8 space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          suppressHydrationWarning
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search events..."
          className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg px-3 sm:px-4 py-3 pr-20 sm:pr-24
          text-sm text-zinc-100 font-mono placeholder:text-zinc-500
          focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20
          focus:bg-zinc-900/70 transition-all duration-200"
        />
        <button
          suppressHydrationWarning
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5
          bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-mono text-white
          transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          Search
        </button>
      </form>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
          Filter:
        </span>

        {/* Mode filter */}
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map((mode) => (
            <button
              suppressHydrationWarning
              key={mode}
              onClick={() => updateFilters("mode", mode)}
              disabled={isPending}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono tracking-wider uppercase
                transition-all duration-200 disabled:opacity-50 backdrop-blur-sm ${
                  currentMode === mode
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-zinc-900/50 text-zinc-400 border border-zinc-700/50 hover:border-zinc-500/50 hover:bg-zinc-900/70"
                }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            suppressHydrationWarning
            onClick={clearFilters}
            disabled={isPending}
            className="ml-auto px-2.5 sm:px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-300
            border border-zinc-700/50 hover:border-zinc-600/50 rounded-md transition-all duration-200
            disabled:opacity-50 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/50"
          >
            <span className="hidden sm:inline">✕ Clear filters</span>
            <span className="sm:hidden">✕ Clear</span>
          </button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Active:</span>
          {currentMode !== "all" && (
            <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 backdrop-blur-sm">
              Mode: {currentMode}
            </span>
          )}
          {currentSearch && (
            <span className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-zinc-300 backdrop-blur-sm truncate max-w-50">
              &quot;{currentSearch}&quot;
            </span>
          )}
          {currentTag && (
            <span className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-zinc-300 backdrop-blur-sm">
              #{currentTag}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
