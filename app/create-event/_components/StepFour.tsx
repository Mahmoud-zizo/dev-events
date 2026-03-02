"use client";

import { EventFormData } from "./types";

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-3 border-b border-zinc-800 last:border-0">
      <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-zinc-200 font-mono flex-1">{value}</span>
    </div>
  );
}

export default function StepFour({ data }: { data: EventFormData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {/* Image preview strip */}
        {data.imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.imagePreview}
            alt="Cover"
            className="w-full h-36 object-cover opacity-80"
          />
        )}

        <div className="p-5">
          <ReviewRow label="Title" value={data.title} />
          <ReviewRow label="Organizer" value={data.organizer} />
          <ReviewRow
            label="Overview"
            value={<span className="line-clamp-2">{data.overview}</span>}
          />
          <ReviewRow label="Date" value={data.date} />
          <ReviewRow label="Time" value={data.time} />
          <ReviewRow
            label="Mode"
            value={<span className="capitalize">{data.mode}</span>}
          />
          <ReviewRow label="Venue" value={data.venue} />
          <ReviewRow label="Location" value={data.location} />
          <ReviewRow label="Audience" value={data.audience} />
          <ReviewRow
            label="Tags"
            value={
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            }
          />
          <ReviewRow
            label="Agenda"
            value={
              <ol className="space-y-1">
                {data.agenda.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-zinc-600">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            }
          />
        </div>
      </div>

      <p className="text-xs font-mono text-zinc-500 text-center">
        Review everything above before submitting. You cannot edit after
        publishing.
      </p>
    </div>
  );
}
