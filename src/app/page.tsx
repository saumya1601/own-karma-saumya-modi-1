"use client";

import { useEffect, useState } from "react";
import { ActCommunity } from "@/components/sections/ActCommunity";
import { ActCorridor } from "@/components/sections/ActCorridor";
import { ActDiscovery } from "@/components/sections/ActDiscovery";
import { ActFinalScreen } from "@/components/sections/ActFinalScreen";
import { ActPhilosophy } from "@/components/sections/ActPhilosophy";
import { ActRealization } from "@/components/sections/ActRealization";
import { ActVoid } from "@/components/sections/ActVoid";
import { AudioToggle } from "@/components/ui/AudioToggle";

type Phase =
  | "void"
  | "corridor"
  | "discovery"
  | "realization"
  | "philosophy"
  | "community"
  | "final";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("void");

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
      } else if (act === "3" || act === "corridor" || act === "2" || act === "questions") {
        setPhase("corridor");
      } else if (act === "1" || act === "void") {
        setPhase("void");
      }
    }
  }, []);

  return (
    <main className="fixed inset-0 bg-[#000000]">
      {/* Floating Sound Toggle */}
      <AudioToggle />

      {/* ACT I: The Void -> Transitions into The Corridor */}
      {phase === "void" && (
        <ActVoid onComplete={() => setPhase("corridor")} />
      )}

      {/* ACT III: The Corridor */}
      {phase === "corridor" && (
        <ActCorridor
          onComplete={() => setPhase("discovery")}
          onBack={() => setPhase("void")}
        />
      )}

      {/* ACT IV: The Discovery */}
      {phase === "discovery" && (
        <ActDiscovery
          onComplete={() => setPhase("realization")}
          onBack={() => setPhase("corridor")}
        />
      )}

      {/* ACT V: The Realization */}
      {phase === "realization" && (
        <ActRealization
          onComplete={() => setPhase("philosophy")}
          onBack={() => setPhase("discovery")}
        />
      )}

      {/* ACT VI: The Philosophy */}
      {phase === "philosophy" && (
        <ActPhilosophy
          onComplete={() => setPhase("community")}
          onBack={() => setPhase("realization")}
        />
      )}

      {/* ACT VII: The Community */}
      {phase === "community" && (
        <ActCommunity
          onComplete={() => setPhase("final")}
          onBack={() => setPhase("philosophy")}
        />
      )}

      {/* ACT VIII: Own Your Karma & Final Screen */}
      {phase === "final" && (
        <ActFinalScreen onBack={() => setPhase("community")} />
      )}
    </main>
  );
}
