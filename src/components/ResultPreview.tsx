"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ResultPreviewProps {
  originalUrl: string;
  resultUrl: string;
  onReset: () => void;
}

export default function ResultPreview({ originalUrl, resultUrl, onReset }: ResultPreviewProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "background-removed.png";
    a.click();
  }, [resultUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowOriginal(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showOriginal
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setShowOriginal(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showOriginal
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Original
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full flex justify-center">
        <div
          className={`relative max-h-[70vh] rounded-xl overflow-hidden ${
            !showOriginal ? "checkerboard" : "bg-gray-900"
          }`}
        >
          <Image
            src={showOriginal ? originalUrl : resultUrl}
            alt={showOriginal ? "Original image" : "Background removed"}
            width={800}
            height={600}
            className="max-h-[70vh] w-auto object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
        >
          Download PNG
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-colors"
        >
          New Image
        </button>
      </div>
    </div>
  );
}
