"use client";

import { FieldLabel, Input, Textarea } from "./FormFields";
import { StepProps } from "./types";

export default function StepOne({ data, errors, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>Event Title</FieldLabel>
        <Input
          value={data.title}
          onChange={(v: string) => update("title", v)}
          placeholder="e.g. Next.js Global Hackathon 2025"
          maxLength={100}
          error={errors.title}
        />
      </div>

      <div>
        <FieldLabel required>Overview</FieldLabel>
        <Textarea
          value={data.overview}
          onChange={(v: string) => update("overview", v)}
          placeholder="A short summary shown in event cards (max 500 chars)"
          maxLength={500}
          rows={3}
          error={errors.overview}
        />
      </div>

      <div>
        <FieldLabel required>Full Description</FieldLabel>
        <Textarea
          value={data.description}
          onChange={(v: string) => update("description", v)}
          placeholder="Detailed information about the event, what to expect, speakers, etc."
          maxLength={1000}
          rows={5}
          error={errors.description}
        />
      </div>

      <div>
        <FieldLabel required>Organizer</FieldLabel>
        <Input
          value={data.organizer}
          onChange={(v: string) => update("organizer", v)}
          placeholder="e.g. Vercel, Local Dev Community, etc."
          error={errors.organizer}
        />
      </div>
    </div>
  );
}
