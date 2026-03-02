"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface DeleteEventButtonProps {
  eventSlug: string; // Changed from eventId to eventSlug
  eventTitle: string;
  redirectTo?: string; // Where to redirect after deletion (default: /events)
}

export default function DeleteEventButton({
  eventSlug,
  eventTitle,
  redirectTo = "/events",
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");

    try {
      const res = await fetch(`/api/events/${eventSlug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      // Close modal and redirect
      setShowConfirm(false);
      startTransition(() => {
        router.push(redirectTo);
        router.refresh(); // Refresh to update cached data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="cursor-pointer px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 text-sm font-mono transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete Event
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-xl">⚠</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                  Delete Event
                </h3>
                <p className="text-sm text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Event Title */}
            <div className="mb-6 p-3 bg-zinc-800/50 rounded border border-zinc-700/50">
              <p className="text-xs font-mono text-zinc-500 mb-1">
                Event to delete:
              </p>
              <p className="text-sm text-zinc-200 font-medium line-clamp-2">
                {eventTitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
                <p className="text-xs font-mono text-red-400">✕ {error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                disabled={isPending}
                className="cursor-pointer flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 text-sm font-mono transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="cursor-pointer flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-mono font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <span className=" inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Event"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
