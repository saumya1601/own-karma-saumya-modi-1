"use client";

import { useEffect, useRef, useState } from "react";
import {
  Act01Void,
  Act02Questions,
  Act03Corridor,
  Act04Discovery,
  Act05Realization,
  Act06Philosophy,
  Act07Community,
  Act08FinalScreen,
} from "@/components/sections";
import { AudioToggle } from "@/components/ui/AudioToggle";

type Phase =
  | "void"
  | "questions"
  | "corridor"
  | "discovery"
  | "realization"
  | "philosophy"
  | "community"
  | "final";

// How long a single act-to-act transition is considered "in flight". While
// locked, every subsequent onComplete/onBack call is ignored. This is the
// guard that individual Acts can't provide themselves: each Act stores its
// own "already transitioned" flag in a local ref, but that ref is wiped out
// the instant the Act unmounts. Trackpad inertia keeps emitting wheel events
// for a few hundred ms after the gesture ends, which — without a lock that
// survives the remount — was tripping the *next* act's threshold too and
// skipping straight through it.
const TRANSITION_LOCK_MS = 900;
const OVERLAY_FADE_MS = 650;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("void");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const overlayRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);

  // Read ?act=... deep-link AFTER hydration so server and client HTML match.
  // The overlay starts opaque and fades out once the correct phase is set,
  // hiding the brief pre-navigation frame.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const act = params.get("act");
    const targetPhase: Phase =
      act === "8" || act === "final" ? "final" :
        act === "7" || act === "community" ? "community" :
          act === "6" || act === "philosophy" ? "philosophy" :
            act === "5" || act === "realization" ? "realization" :
              act === "4" || act === "discovery" ? "discovery" :
                act === "3" || act === "corridor" ? "corridor" :
                  act === "2" || act === "questions" ? "questions" :
                    "void";

    if (targetPhase !== "void") {
      setPhase(targetPhase);
    }

    // Give React one frame to mount the target Act, then fade the curtain.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const overlay = overlayRef.current;
        if (overlay) {
          overlay.style.transition = `opacity ${OVERLAY_FADE_MS}ms ease-out`;
          overlay.style.opacity = "0";
        }
      });
    });
  }, []);

  const navigate = (nextPhase: Phase, dir: "forward" | "backward") => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    const overlay = overlayRef.current;
    // Snap to fully opaque with no transition so it covers the outgoing
    // frame before React swaps the tree underneath it.
    if (overlay) {
      overlay.style.transition = "none";
      overlay.style.opacity = "1";
    }

    requestAnimationFrame(() => {
      setDirection(dir);
      setPhase(nextPhase);

      requestAnimationFrame(() => {
        if (overlay) {
          overlay.style.transition = `opacity ${OVERLAY_FADE_MS}ms ease-out`;
          overlay.style.opacity = "0";
        }
      });
    });

    window.setTimeout(() => {
      lockedRef.current = false;
    }, TRANSITION_LOCK_MS);
  };

  const goToNext = (nextPhase: Phase) => navigate(nextPhase, "forward");
  const goToPrev = (prevPhase: Phase) => navigate(prevPhase, "backward");

  const isBackward = direction === "backward";
  const initialProgress = isBackward ? 1 : 0;

  return (
    <main className="fixed inset-0 bg-[#000000]">
      {/* Cross-act transition curtain — starts opaque so the brief moment
          before ?act=... phase detection is hidden. Also guarantees every
          subsequent phase change fades through black uniformly. */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[200] bg-black"
        style={{ opacity: 1 }}
        aria-hidden
      />

      {/* Floating Sound Toggle — hidden during Act I to preserve the spec's
          "Pure black. No logo. No menu. No navigation. Nothing." */}
      {phase !== "void" && <AudioToggle />}

      {/* ACT I: The Void -> Transitions into Act II: The Questions */}
      {phase === "void" && (
        <Act01Void onComplete={() => goToNext("questions")} />
      )}

      {/* ACT II: The Questions -> Transitions into Act III: The Corridor */}
      {phase === "questions" && (
        <Act02Questions
          onComplete={() => goToNext("corridor")}
          onBack={() => goToPrev("void")}
        />
      )}

      {/* ACT III: The Corridor */}
      {phase === "corridor" && (
        <Act03Corridor
          key={`corridor-${direction}`}
          initialProgress={initialProgress}
          onComplete={() => goToNext("discovery")}
          onBack={() => goToPrev("questions")}
        />
      )}

      {/* ACT IV: The Discovery */}
      {phase === "discovery" && (
        <Act04Discovery
          key={`discovery-${direction}`}
          initialProgress={initialProgress}
          onComplete={() => goToNext("realization")}
          onBack={() => goToPrev("corridor")}
        />
      )}

      {/* ACT V: The Realization */}
      {phase === "realization" && (
        <Act05Realization
          key={`realization-${direction}`}
          initialProgress={initialProgress}
          onComplete={() => goToNext("philosophy")}
          onBack={() => goToPrev("discovery")}
        />
      )}

      {/* ACT VI: The Philosophy */}
      {phase === "philosophy" && (
        <Act06Philosophy
          key={`philosophy-${direction}`}
          initialProgress={initialProgress}
          onComplete={() => goToNext("community")}
          onBack={() => goToPrev("realization")}
        />
      )}

      {/* ACT VII: The Community */}
      {phase === "community" && (
        <Act07Community
          key={`community-${direction}`}
          initialProgress={initialProgress}
          onComplete={() => goToNext("final")}
          onBack={() => goToPrev("philosophy")}
        />
      )}

      {/* ACT VIII: Own Your Karma & Final Screen */}
      {phase === "final" && (
        <Act08FinalScreen onBack={() => goToPrev("community")} />
      )}
    </main>
  );
}
