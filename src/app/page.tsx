"use client";

import { useEffect, useState } from "react";
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

export default function Home() {
  const [phase, setPhase] = useState<Phase>("void");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const goToNext = (nextPhase: Phase) => {
    setDirection("forward");
    setPhase(nextPhase);
  };

  const goToPrev = (prevPhase: Phase) => {
    setDirection("backward");
    setPhase(prevPhase);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const act = params.get("act");
      if (act === "8" || act === "final") {
        setPhase("final");
      } else if (act === "7" || act === "community") {
        setPhase("community");
      } else if (act === "6" || act === "philosophy") {
        setPhase("philosophy");
      } else if (act === "5" || act === "realization") {
        setPhase("realization");
      } else if (act === "4" || act === "discovery") {
        setPhase("discovery");
      } else if (act === "3" || act === "corridor") {
        setPhase("corridor");
      } else if (act === "2" || act === "questions") {
        setPhase("questions");
      } else if (act === "1" || act === "void") {
        setPhase("void");
      }
    }
  }, []);

  const isBackward = direction === "backward";
  const initialProgress = isBackward ? 1 : 0;

  return (
    <main className="fixed inset-0 bg-[#000000]">
      {/* Floating Sound Toggle */}
      <AudioToggle />

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
