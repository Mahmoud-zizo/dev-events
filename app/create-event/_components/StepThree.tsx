"use client";

import { useRef, useState, useCallback } from "react";
import { FieldLabel, FieldError } from "./FormFields";
import { StepProps } from "./types";

export default function StepThree({ data, errors, update }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");
  const [agendaInput, setAgendaInput] = useState("");

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const preview = URL.createObjectURL(file);
      update("image", file);
      update("imagePreview", preview);
    },
    [update],
  );

  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || data.tags.includes(tag) || data.tags.length >= 10) return;
    update("tags", [...data.tags, tag]);
    setTagInput("");
  }, [tagInput, data.tags, update]);

  const removeTag = useCallback(
    (tag: string) => {
      update(
        "tags",
        data.tags.filter((t) => t !== tag),
      );
    },
    [data.tags, update],
  );

  const addAgendaItem = useCallback(() => {
    if (!agendaInput.trim()) return;
    update("agenda", [...data.agenda, agendaInput.trim()]);
    setAgendaInput("");
  }, [agendaInput, data.agenda, update]);

  const removeAgendaItem = useCallback(
    (index: number) => {
      update(
        "agenda",
        data.agenda.filter((_, i) => i !== index),
      );
    },
    [data.agenda, update],
  );

  const updateAgendaItem = useCallback(
    (index: number, value: string) => {
      const updated = [...data.agenda];
      updated[index] = value;
      update("agenda", updated);
    },
    [data.agenda, update],
  );

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <FieldLabel required>Cover Image</FieldLabel>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
            ${errors.image ? "border-red-500/60" : "border-zinc-700 hover:border-emerald-500/50"}`}
        >
          {data.imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white font-mono text-xs tracking-widest uppercase">
                  Change Image
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                <span className="text-2xl">⬆</span>
              </div>
              <p className="text-sm text-zinc-400 font-mono">
                Click to upload cover image
              </p>
              <p className="text-xs text-zinc-600 font-mono mt-1">
                PNG, JPG, WEBP — recommended 1200×630
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <FieldError message={errors.image} />
      </div>

      {/* Tags */}
      <div>
        <FieldLabel required>Tags</FieldLabel>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="e.g. hackathon, web3, react"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 font-mono
            placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-all duration-200"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 font-mono text-sm
            hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200"
          >
            + Add
          </button>
        </div>

        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30
                rounded-full text-xs font-mono text-emerald-400"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-emerald-600 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
        <FieldError message={errors.tags} />
      </div>

      {/* Agenda */}
      <div>
        <FieldLabel required>Agenda</FieldLabel>
        <div className="flex gap-2">
          <input
            value={agendaInput}
            onChange={(e) => setAgendaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAgendaItem();
              }
            }}
            placeholder="e.g. 10:00 AM — Opening Keynote"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 font-mono
            placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-all duration-200"
          />
          <button
            type="button"
            onClick={addAgendaItem}
            className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 font-mono text-sm
            hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200"
          >
            + Add
          </button>
        </div>

        {data.agenda.length > 0 && (
          <ol className="mt-3 space-y-2">
            {data.agenda.map((item, i) => (
              <li key={i} className="flex items-center gap-2 group">
                <span className="text-xs font-mono text-zinc-600 w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <input
                  value={item}
                  onChange={(e) => updateAgendaItem(i, e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 font-mono
                  focus:outline-none focus:border-zinc-600 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => removeAgendaItem(i)}
                  className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}
        <FieldError message={errors.agenda} />
      </div>
    </div>
  );
}
