"use client";

import { STEPS } from "./Constans";
import { useSyncExternalStore } from "react";
interface StepNavProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
}
const subscribe = () => () => {}; // No-op subscribe
const getSnapshot = () => true; // Client value
const getServerSnapshot = () => false; // Server value
export default function StepNav({ currentStep, onStepClick }: StepNavProps) {
  const isMounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  if (!isMounted) return <div className="h-12 mb-8" />;
  return (
    <nav className="flex items-center gap-1 mb-8 overflow-x-auto pb-1 scrollbar-hide">
      {STEPS.map((step, i) => {
        const state =
          step.id < currentStep
            ? "done"
            : step.id === currentStep
              ? "active"
              : "upcoming";

        return (
          <div key={step.id} className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => step.id < currentStep && onStepClick(step.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all duration-200
                ${state === "done" ? "text-emerald-400 hover:bg-zinc-800 cursor-pointer" : ""}
                ${state === "active" ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : ""}
                ${state === "upcoming" ? "text-zinc-600 cursor-default" : ""}
              `}
            >
              <span
                className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px]
                  ${state === "done" ? "bg-emerald-500/20 text-emerald-400" : ""}
                  ${state === "active" ? "bg-zinc-700 text-zinc-100" : ""}
                  ${state === "upcoming" ? "bg-zinc-900 text-zinc-700 border border-zinc-800" : ""}
                `}
              >
                {state === "done" ? "✓" : step.short}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>

            {i < STEPS.length - 1 && (
              <span className="text-zinc-800 text-xs font-mono">──</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
