"use client";

import { useState, useCallback } from "react";
import { removeBackground, type Config } from "@imgly/background-removal";

export type ProcessingState = "idle" | "loading-model" | "processing" | "done" | "error";

interface UseBackgroundRemovalReturn {
  state: ProcessingState;
  progress: number;
  originalUrl: string | null;
  resultUrl: string | null;
  error: string | null;
  processImage: (file: File) => Promise<void>;
  reset: () => void;
}

export function useBackgroundRemoval(): UseBackgroundRemovalReturn {
  const [state, setState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setState("idle");
    setProgress(0);
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
  }, [originalUrl, resultUrl]);

  const processImage = useCallback(async (file: File) => {
    // Validate
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WebP).");
      setState("error");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image too large. Please use an image under 20MB.");
      setState("error");
      return;
    }

    // Reset previous
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    const objUrl = URL.createObjectURL(file);
    setOriginalUrl(objUrl);
    setResultUrl(null);
    setError(null);
    setProgress(0);
    setState("loading-model");

    try {
      const config: Config = {
        progress: (key: string, current: number, total: number) => {
          if (key === "compute:inference") {
            setState("processing");
          }
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          setProgress(pct);
        },
        output: {
          format: "image/png" as const,
          quality: 1,
        },
      };

      const blob = await removeBackground(file, config);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setState("done");
      setProgress(100);
    } catch (err) {
      console.error("Background removal failed:", err);
      setError(err instanceof Error ? err.message : "Processing failed. Please try again.");
      setState("error");
    }
  }, [originalUrl, resultUrl]);

  return { state, progress, originalUrl, resultUrl, error, processImage, reset };
}
