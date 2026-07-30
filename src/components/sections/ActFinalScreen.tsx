"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface ActFinalScreenProps {
  /** Callback fired when visitor scrolls backward to return to Act VII. */
  onBack?: () => void;
}

/**
 * ACT VIII — "OWN YOUR KARMA" (The Final Screen)
 *
 * Floating glass panel with no borders, only soft light.
 * Journal form fields asking "Who are you becoming?" and primary action "ENTER".
 */
export function ActFinalScreen({ onBack }: ActFinalScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [becoming, setBecoming] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const transitionFiredRef = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (transitionFiredRef.current) return;
      if (e.deltaY < -15) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [onBack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000] px-6 select-none">
      {/* Background Soft Lighting Radial Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#C9A55A]/15 via-transparent to-transparent pointer-events-none filter blur-3xl" />

      {!submitted ? (
        /* Floating Glass Panel — Minimal, No Borders, Only Soft Light */
        <div className="relative z-10 w-full max-w-xl p-8 sm:p-14 rounded-3xl bg-white/[0.02] backdrop-blur-2xl shadow-[0_0_100px_rgba(201,165,90,0.1)] transition-all duration-1000">
          {/* First Page Header */}
          <div className="text-center mb-10 space-y-2">
            <h2 className="font-[var(--font-cormorant)] text-[#C9A55A] text-4xl sm:text-5xl tracking-[0.35em] uppercase font-light drop-shadow-[0_0_15px_rgba(201,165,90,0.4)]">
              WELCOME
            </h2>
            <p className="font-[var(--font-cormorant)] italic text-[#F4F0E8]/85 text-xl sm:text-2xl tracking-wide font-light">
              This is where your story begins.
            </p>
          </div>

          {/* Story Journal Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Field 1: Name */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent border-b border-[#F4F0E8]/20 px-0 py-2.5 text-[#F4F0E8] font-[var(--font-cormorant)] italic text-xl focus:outline-none focus:border-[#C9A55A] transition-colors placeholder:text-[#F4F0E8]/20"
                required
              />
            </div>

            {/* Field 2: Email */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-[#F4F0E8]/60 font-mono">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-[#F4F0E8]/20 px-0 py-2.5 text-[#F4F0E8] font-[var(--font-cormorant)] italic text-xl focus:outline-none focus:border-[#C9A55A] transition-colors placeholder:text-[#F4F0E8]/20"
                required
              />
            </div>

            {/* Field 3: Reflection Prompt */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-[#C9A55A] font-mono">
                One word... Who are you becoming?
              </label>
              <input
                type="text"
                value={becoming}
                onChange={(e) => setBecoming(e.target.value)}
                placeholder="Unbound..."
                className="w-full bg-transparent border-b border-[#C9A55A]/40 px-0 py-2.5 text-[#C9A55A] font-[var(--font-cormorant)] italic text-xl focus:outline-none focus:border-[#C9A55A] transition-colors placeholder:text-[#C9A55A]/30"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-amber-400 font-mono tracking-wider text-center">
                {error}
              </p>
            )}

            {/* Primary Action Button: ENTER */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                className="group relative cursor-pointer px-12 py-3.5 rounded-full bg-white/[0.04] text-[#F4F0E8] font-[var(--font-cormorant)] italic text-xl tracking-[0.35em] uppercase transition-all duration-700 hover:bg-[#C9A55A]/15 hover:text-[#C9A55A] hover:shadow-[0_0_35px_rgba(201,165,90,0.35)]"
              >
                <span className="relative z-10 filter drop-shadow-[0_0_10px_rgba(201,165,90,0.4)]">
                  ENTER
                </span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Post-ENTER Final Story Confirmation Beat */
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-10 max-w-2xl animate-fade-in">
          {/* Double Concentric Resting Emblem */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(201,165,90,0.5)]">
              <circle cx="80" cy="80" r="62" stroke="#C9A55A" strokeWidth="1.8" fill="none" />
              <circle cx="80" cy="80" r="44" stroke="#C9A55A" strokeWidth="1.8" fill="none" />
            </svg>
          </div>

          <div className="space-y-4">
            <p className="font-[var(--font-cormorant)] italic text-[#F4F0E8] text-3xl sm:text-5xl font-light leading-relaxed">
              "Every choice creates a story. <br />
              <span className="text-[#C9A55A]">This is yours."</span>
            </p>

            {becoming && (
              <p className="text-xs uppercase tracking-[0.4em] text-[#C9A55A]/80 font-mono pt-4">
                Becoming: {becoming}
              </p>
            )}
          </div>

          <h1 className="font-[var(--font-cormorant)] text-[#C9A55A] text-2xl tracking-[0.4em] uppercase font-light pt-6">
            OWN KARMA
          </h1>
        </div>
      )}
    </div>
  );
}
