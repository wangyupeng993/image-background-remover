"use client";

import type { ProcessingState } from "@/hooks/useBackgroundRemoval";

interface ProgressBarProps {
  state: ProcessingState;
  progress: number;
}

const stateLabels: Record<string, string> = {
  "loading-model": "Loading AI model…",
  processing: "Removing background…",
};

export default function ProgressBar({ state, progress }: ProgressBarProps) {
  const label = stateLabels[state] ?? "Processing…";

  return (
    <div className="w-full max-w-2xl mx-auto" role="status" aria-live="polite">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
