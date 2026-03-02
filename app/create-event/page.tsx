"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import StepNav from "./_components/StepNav";
import StepOne from "./_components/StepOne";
import StepTwo from "./_components/StepTow";
import StepThree from "./_components/StepThree";
import StepFour from "./_components/StepFour";

import { validateStep } from "./_components/Validation";
import {
  STEPS,
  STEP_SUBTITLES,
  BASE_URL,
  INITIAL_FORM_DATA,
} from "./_components/Constans";
import { EventFormData, StepErrors } from "./_components/types";

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<StepErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resetKey, setResetKey] = useState(0); // Force full remount after submit

  // Reset form state when component mounts (fixes stuck submit state after redirect)
  useEffect(() => {
    setIsSubmitting(false);
    setSubmitError("");
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const update = useCallback((key: keyof EventFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setErrors({});
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    goToStep(currentStep + 1);
  }, [currentStep, formData, goToStep]);

  const handleBack = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("overview", formData.overview);
      fd.append("description", formData.description);
      fd.append("organizer", formData.organizer);
      fd.append("date", formData.date);
      fd.append("time", formData.time);
      fd.append("mode", formData.mode);
      fd.append("venue", formData.venue);
      fd.append("location", formData.location);
      fd.append("audience", formData.audience);
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("agenda", JSON.stringify(formData.agenda));
      if (formData.image) fd.append("image", formData.image);

      console.log("[Submit] Posting to:", `${BASE_URL}/api/events`);
      const res = await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to create event");
      }

      // Validate slug exists before redirect
      if (!json.event?.slug) {
        throw new Error("Event created but slug is missing in response");
      }

      console.log("[Submit] Redirecting to:", `/events/${json.event.slug}`);

      // Reset all state before redirect to prevent stale data on back navigation
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setErrors({});
      setResetKey((prev) => prev + 1);

      router.push(`/events/${json.event.slug}`);
    } catch (err) {
      console.error("[Submit] Error:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, router]);

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main key={resetKey} className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sticky header with progress bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              DevEvent
            </p>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Create Event
            </h1>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        <div className="h-0.5 bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step nav */}
        <StepNav currentStep={currentStep} onStepClick={goToStep} />

        {/* Step title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            {STEPS[currentStep - 1].label}
          </h2>
          <p className="text-sm text-zinc-500 font-mono mt-1">
            {STEP_SUBTITLES[currentStep]}
          </p>
        </div>

        {/* Step content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {currentStep === 1 && (
            <StepOne data={formData} errors={errors} update={update} />
          )}
          {currentStep === 2 && (
            <StepTwo data={formData} errors={errors} update={update} />
          )}
          {currentStep === 3 && (
            <StepThree data={formData} errors={errors} update={update} />
          )}
          {currentStep === 4 && <StepFour data={formData} />}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm font-mono text-red-400">✕ {submitError}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
          {currentStep > 1 ? (
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg
              text-sm font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-500
              transition-all duration-200 disabled:opacity-40"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500
              rounded-lg text-sm font-mono text-white font-medium
              transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              Continue →
            </button>
          ) : (
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500
              rounded-lg text-sm font-mono text-white font-medium
              transition-all duration-200 shadow-lg shadow-emerald-500/20
              disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish Event ↗"
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
