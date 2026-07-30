"use client";

import { useState } from "react";
import { audioEngine } from "@/utils/audioEngine";

/**
 * Minimalist Audio Toggle Component
 * Floating subtle sound control in bottom-left corner of the experience.
 */
export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const active = audioEngine.toggle();
    setIsPlaying(active);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-[#C9A55A]/30 text-[#C9A55A] font-mono text-xs uppercase tracking-[0.3em] cursor-pointer transition-all duration-500 hover:border-[#C9A55A] hover:bg-[#C9A55A]/10 hover:shadow-[0_0_20px_rgba(201,165,90,0.3)] select-none"
      aria-label="Toggle Sound Atmosphere"
    >
      {/* Pulse Dot */}
      <span className="relative flex h-2 w-2">
        {isPlaying && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A55A] opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isPlaying ? "bg-[#C9A55A]" : "bg-[#F4F0E8]/40"
          }`}
        />
      </span>

      <span>{isPlaying ? "SOUND ON" : "SOUND OFF"}</span>
    </button>
  );
}
