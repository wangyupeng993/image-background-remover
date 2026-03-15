"use client";

import { useCallback, useState, useRef } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFile(e.dataTransfer.files[0]);
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    },
    [disabled, handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={handlePaste}
      onClick={() => !disabled && inputRef.current?.click()}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
      className={`
        relative flex flex-col items-center justify-center
        w-full max-w-2xl mx-auto h-64
        border-2 border-dashed rounded-2xl
        transition-all duration-200 cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isDragging
          ? "border-purple-400 bg-purple-500/10 scale-[1.02]"
          : "border-gray-600 hover:border-purple-400 hover:bg-white/5"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={disabled}
        aria-hidden="true"
      />

      <svg
        className="w-12 h-12 mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
        />
      </svg>

      <p className="text-lg font-medium text-gray-300">
        {isDragging ? "Drop your image here" : "Drop, paste, or click to upload"}
      </p>
      <p className="mt-1 text-sm text-gray-500">JPG, PNG, WebP — up to 20MB</p>
    </div>
  );
}
