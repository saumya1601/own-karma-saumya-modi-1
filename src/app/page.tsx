"use client";

import React, { useState } from "react";

// Loaders
import LoadingKarmaWheel from "@/components/loading/LoadingKarmaWheel";
import LoadingVoidParticle from "@/components/loading/LoadingVoidParticle";
import LoadingUnboundFracture from "@/components/loading/LoadingUnboundFracture";
import LoadingKodandaArcher from "@/components/loading/LoadingKodandaArcher";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [activeLoader, setActiveLoader] = useState<"karma" | "void" | "fracture" | "archer">("karma");

  const renderLoader = () => {
    switch (activeLoader) {
      case "void":
        return <LoadingVoidParticle onComplete={() => setShowLoader(false)} />;
      case "fracture":
        return <LoadingUnboundFracture onComplete={() => setShowLoader(false)} />;
      case "archer":
        return <LoadingKodandaArcher onComplete={() => setShowLoader(false)} />;
      case "karma":
      default:
        return <LoadingKarmaWheel onComplete={() => setShowLoader(false)} />;
    }
  };

  const triggerLoaderPreview = (type: "karma" | "void" | "fracture" | "archer") => {
    setActiveLoader(type);
    setShowLoader(true);
  };

  return (
    <main className="relative bg-slate-950 text-white min-h-screen font-sans overflow-x-hidden flex items-center justify-center">
      {/* Dynamic Loader Sandbox Wrapper */}
      {showLoader && renderLoader()}
      
      {/* Floating Developer Loader Selector Sandbox Control Panel - Always Visible */}
      <div className="fixed bottom-6 left-6 z-[10000] flex flex-col gap-2 p-3 bg-slate-950/95 border border-amber-500/30 rounded-xl shadow-2xl backdrop-blur-md font-mono text-[9px] pointer-events-auto">
        <span className="text-amber-400 font-bold uppercase tracking-wider text-center border-b border-amber-500/15 pb-1">
          Loader Sandbox
        </span>
        <button 
          onClick={() => triggerLoaderPreview("karma")}
          className={`px-2 py-1 text-left rounded transition-colors ${activeLoader === "karma" ? "bg-amber-500/10 text-amber-300 font-bold" : "hover:bg-slate-900 hover:text-amber-300 text-slate-400"}`}
        >
          • Karma Wheel
        </button>
        <button 
          onClick={() => triggerLoaderPreview("void")}
          className={`px-2 py-1 text-left rounded transition-colors ${activeLoader === "void" ? "bg-amber-500/10 text-amber-300 font-bold" : "hover:bg-slate-900 hover:text-amber-300 text-slate-400"}`}
        >
          • Void Particle
        </button>
        <button 
          onClick={() => triggerLoaderPreview("fracture")}
          className={`px-2 py-1 text-left rounded transition-colors ${activeLoader === "fracture" ? "bg-amber-500/10 text-amber-300 font-bold" : "hover:bg-slate-900 hover:text-amber-300 text-slate-400"}`}
        >
          • Unbound Fracture
        </button>
        <button 
          onClick={() => triggerLoaderPreview("archer")}
          className={`px-2 py-1 text-left rounded transition-colors ${activeLoader === "archer" ? "bg-amber-500/10 text-amber-300 font-bold" : "hover:bg-slate-900 hover:text-amber-300 text-slate-400"}`}
        >
          • Kodanda Archer
        </button>
      </div>

      {/* 01 — THE VOID: Brand Reveal Canvas (Shown after loader completes) */}
      {!showLoader && (
        <div className="text-center max-w-2xl px-6 py-12 flex flex-col items-center justify-center animate-fade-in">
          {/* Spatial glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <span className="text-[10px] font-mono tracking-[0.4em] text-amber-500/50 uppercase">
              01 — THE VOID
            </span>
            
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.3em] text-slate-200 uppercase">
              OWN KARMA
            </h1>

            <div className="h-[1px] w-12 bg-amber-500/25 my-2" />

            <p className="text-xs md:text-sm font-mono tracking-[0.25em] text-slate-400 uppercase">
              NOT BOUND. UNBOUND.
            </p>

            <div className="mt-8 flex flex-col gap-3 font-mono text-[9px] tracking-[0.2em] text-slate-500 uppercase">
              <p className="animate-pulse">EVERY ACTION LEAVES A TRACE.</p>
              <p className="animate-pulse" style={{ animationDelay: "1s" }}>EVERY CHOICE CREATES A PATH.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); filter: blur(4px); }
          to { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </main>
  );
}
