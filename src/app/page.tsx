"use client";

import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import ResultPreview from "@/components/ResultPreview";

export default function Home() {
  const { state, progress, originalUrl, resultUrl, error, processImage, reset } =
    useBackgroundRemoval();

  const isProcessing = state === "loading-model" || state === "processing";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">✂️</span>
          <h1 className="text-lg font-semibold">BG Remover</h1>
        </div>
        <a
          href="https://github.com/wangyupeng993/image-background-remover"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="View source on GitHub"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-8">
        {/* Hero - only show when idle or error */}
        {(state === "idle" || state === "error") && (
          <div className="text-center space-y-3 max-w-xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Remove Image Background
            </h2>
            <p className="text-gray-400 text-lg">
              100% free. Runs entirely in your browser. Your images never leave your device.
            </p>
          </div>
        )}

        {/* Error */}
        {state === "error" && error && (
          <div className="w-full max-w-2xl mx-auto p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Upload */}
        {(state === "idle" || state === "error") && (
          <UploadZone onFileSelect={processImage} />
        )}

        {/* Progress */}
        {isProcessing && <ProgressBar state={state} progress={progress} />}

        {/* Result */}
        {state === "done" && originalUrl && resultUrl && (
          <ResultPreview originalUrl={originalUrl} resultUrl={resultUrl} onReset={reset} />
        )}

        {/* Privacy note */}
        {(state === "idle" || state === "error") && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>All processing happens locally. No data is sent to any server.</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-800 text-center text-sm text-gray-500">
        Powered by{" "}
        <a href="https://img.ly" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
          IMG.LY
        </a>{" "}
        Background Removal &middot; Built with Next.js + Tailwind CSS
      </footer>
    </div>
  );
}
