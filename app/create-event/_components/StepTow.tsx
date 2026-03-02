"use client";

import { FieldLabel, FieldError, Input } from "./FormFields";
import { MODES } from "./Constans";
import { StepProps } from "./types";

export default function StepTwo({ data, errors, update }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Date</FieldLabel>
          <Input
            type="date"
            value={data.date}
            onChange={(v) => update("date", v)}
            error={errors.date}
          />
        </div>
        <div>
          <FieldLabel required>Time</FieldLabel>
          <Input
            type="time"
            value={data.time}
            onChange={(v) => update("time", v)}
            error={errors.time}
          />
        </div>
      </div>

      {/* Mode */}
      <div>
        <FieldLabel required>Event Mode</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => update("mode", m.value)}
              className={`flex flex-col items-center gap-2 py-4 rounded-lg border text-sm font-mono transition-all duration-200 ${
                data.mode === m.value
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="tracking-widest uppercase text-xs">
                {m.label}
              </span>
            </button>
          ))}
        </div>
        <FieldError message={errors.mode} />
      </div>

      {/* Venue */}
      <div>
        <FieldLabel required>Venue</FieldLabel>
        <Input
          value={data.venue}
          onChange={(v) => update("venue", v)}
          placeholder="e.g. Discord Stage, Convention Center Hall A"
          error={errors.venue}
        />
      </div>

      {/* Location */}
      <div>
        <FieldLabel required>Location</FieldLabel>
        <Input
          value={data.location}
          onChange={(v) => update("location", v)}
          placeholder="e.g. Online, San Francisco CA, Berlin Germany"
          error={errors.location}
        />
      </div>

      {/* Audience */}
      <div>
        <FieldLabel required>Target Audience</FieldLabel>
        <Input
          value={data.audience}
          onChange={(v) => update("audience", v)}
          placeholder="e.g. Frontend developers, Web3 builders, Beginner to intermediate"
          error={errors.audience}
        />
      </div>
    </div>
  );
}
