"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act08FinalScreenProps {
  /** Callback fired when visitor scrolls backward to return to Act VII. */
  onBack?: () => void;
}

type Step = 0 | 1 | 2;

const PROMPTS: {
  numeral: string;
  overline: string;
  question: string;
  hint: string;
  placeholder: string;
  field: "name" | "email" | "becoming";
  type: string;
  accent: boolean;
}[] = [
    {
      numeral: "01",
      overline: "The Invocation",
      question: "What shall we call you?",
      hint: "A name is the first thread of a story.",
      placeholder: "Your name",
      field: "name",
      type: "text",
      accent: false,
    },
    {
      numeral: "02",
      overline: "The Address",
      question: "Where shall we send your becoming?",
      hint: "Your quiet channel. No noise, only signal.",
      placeholder: "your@email.com",
      field: "email",
      type: "email",
      accent: false,
    },
    {
      numeral: "03",
      overline: "The Reflection",
      question: "In one word — who are you becoming?",
      hint: "Not a title. A direction.",
      placeholder: "Unbound…",
      field: "becoming",
      type: "text",
      accent: true,
    },
  ];

/**
 * ACT VIII — "OWN YOUR KARMA" (The Final Screen)
 *
 * Ceremonial three-step invocation. One question at a time, framed by
 * corner ornaments, a rotating dual-ring sigil, and a progressive hairline rail.
 */
export function Act08FinalScreen({ onBack }: Act08FinalScreenProps) {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [becoming, setBecoming] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const transitionFiredRef = useRef(false);
  const stepStageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (transitionFiredRef.current) return;
      if (e.deltaY < -15 && step === 0) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (transitionFiredRef.current) return;
      const diffY = startY - e.touches[0].clientY;
      if (diffY < -40 && step === 0) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onBack, step]);

  // Animate each step transition and autofocus the next input.
  useEffect(() => {
    if (submitted) return;
    const stage = stepStageRef.current;
    if (stage) {
      gsap.fromTo(
        stage,
        { opacity: 0, y: 18, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
      );
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 350);
    return () => window.clearTimeout(t);
  }, [step, submitted]);

  const values: Record<"name" | "email" | "becoming", string> = {
    name,
    email,
    becoming,
  };
  const setters: Record<
    "name" | "email" | "becoming",
    (v: string) => void
  > = {
    name: setName,
    email: setEmail,
    becoming: setBecoming,
  };

  const current = PROMPTS[step];
  const currentValue = values[current.field].trim();
  const canAdvance =
    current.field === "email"
      ? currentValue.includes("@") && currentValue.length > 3
      : currentValue.length > 0;

  const handleAdvance = () => {
    setError("");
    if (!canAdvance) {
      setError(
        current.field === "email"
          ? "Please offer a valid address."
          : "A single word will do."
      );
      return;
    }
    if (step < 2) {
      setStep((step + 1) as Step);
    } else {
      setSubmitted(true);
    }
  };

  const handleRetreat = () => {
    setError("");
    if (step > 0) setStep((step - 1) as Step);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdvance();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050505] px-6 select-none overflow-hidden">
      {/* Radial Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 bg-radial from-[#C9A55A]/15 via-transparent to-transparent pointer-events-none filter blur-3xl" />

      {/* Ambient Film Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />

      {!submitted ? (
        <div className="relative z-10 w-full max-w-2xl">
          {/* Corner Ornaments */}
          <CornerFrame />

          <div className="relative px-8 sm:px-16 py-14 sm:py-20 rounded-xs bg-white/1.5 backdrop-blur-2xl shadow-[0_0_120px_rgba(201,165,90,0.08)]">
            {/* Overtitle */}
            <div className="flex flex-col items-center gap-6 mb-14">
              <SigilEmblem numeral={current.numeral} />
              <div className="flex items-center gap-4 opacity-80">
                <span className="h-px w-10 bg-[#C9A55A]/50" />
                <span className="text-[10px] uppercase tracking-[0.55em] text-[#C9A55A] font-mono">
                  {current.overline}
                </span>
                <span className="h-px w-10 bg-[#C9A55A]/50" />
              </div>
            </div>

            {/* Step Stage — animates on step change */}
            <div ref={stepStageRef} key={step} className="text-center space-y-10">
              <div className="space-y-3">
                <h2 className="font-[var(--font-cormorant)] text-[#F4F0E8] text-3xl sm:text-[2.6rem] leading-tight tracking-wide">
                  {current.question}
                </h2>
                <p className="font-[var(--font-cormorant)] italic text-[#F4F0E8]/45 text-base sm:text-lg tracking-wide">
                  {current.hint}
                </p>
              </div>

              {/* Field */}
              <div className="relative max-w-md mx-auto">
                <input
                  ref={inputRef}
                  type={current.type}
                  value={values[current.field]}
                  onChange={(e) => setters[current.field](e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={current.placeholder}
                  className={`peer w-full bg-transparent px-0 py-3 text-center font-[var(--font-cormorant)] italic text-2xl sm:text-3xl focus:outline-none transition-colors ${current.accent
                      ? "text-[#C9A55A] placeholder:text-[#C9A55A]/25"
                      : "text-[#F4F0E8] placeholder:text-[#F4F0E8]/20"
                    }`}
                />
                {/* Baseline hairline + focus sweep */}
                <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-[#F4F0E8]/10" />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[1.5px] w-0 bg-linear-to-r from-transparent via-[#C9A55A] to-transparent transition-all duration-700 ease-out peer-focus:w-full shadow-[0_0_12px_rgba(201,165,90,0.7)]" />
              </div>

              {/* Error */}
              <p
                className={`text-[11px] uppercase tracking-[0.4em] font-mono transition-opacity duration-300 ${error ? "opacity-100 text-amber-300/90" : "opacity-0"
                  }`}
              >
                {error || "\u00A0"}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-8 pt-2">
                <button
                  type="button"
                  onClick={handleRetreat}
                  disabled={step === 0}
                  className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.45em] text-[#F4F0E8]/40 font-mono transition-colors duration-500 hover:text-[#F4F0E8]/80 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="text-lg leading-none transition-transform duration-500 group-hover:-translate-x-1">
                    ←
                  </span>
                  Return
                </button>

                <button
                  type="button"
                  onClick={handleAdvance}
                  className="group relative cursor-pointer px-10 py-3 rounded-full bg-white/3 text-[#F4F0E8] font-[var(--font-cormorant)] italic text-lg tracking-[0.45em] uppercase transition-all duration-700 hover:bg-[#C9A55A]/10 hover:text-[#C9A55A] hover:shadow-[0_0_35px_rgba(201,165,90,0.35)]"
                >
                  <span className="relative z-10 flex items-center gap-3 filter drop-shadow-[0_0_10px_rgba(201,165,90,0.4)]">
                    {step === 2 ? "Enter" : "Continue"}
                    <span className="text-base leading-none transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Progress Rail */}
            <div className="mt-16 flex items-center justify-center gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <span
                    className={`h-px transition-all duration-700 ${i <= step
                        ? "w-14 bg-[#C9A55A] shadow-[0_0_10px_rgba(201,165,90,0.6)]"
                        : "w-8 bg-[#F4F0E8]/15"
                      }`}
                  />
                  <span
                    className={`text-[10px] font-mono tracking-[0.4em] transition-colors duration-500 ${i === step
                        ? "text-[#C9A55A]"
                        : i < step
                          ? "text-[#C9A55A]/60"
                          : "text-[#F4F0E8]/25"
                      }`}
                  >
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Post-ENTER Final Story Confirmation Beat */
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-10 max-w-2xl animate-fade-in">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(201,165,90,0.5)]">
              <circle cx="80" cy="80" r="62" stroke="#C9A55A" strokeWidth="1.8" fill="none" />
              <circle cx="80" cy="80" r="44" stroke="#C9A55A" strokeWidth="1.8" fill="none" />
            </svg>
          </div>

          <div className="space-y-4">
            <p className="font-[var(--font-cormorant)] italic text-[#F4F0E8] text-3xl sm:text-5xl font-light leading-relaxed">
              &ldquo;Every choice creates a story. <br />
              <span className="text-[#C9A55A]">This is yours.&rdquo;</span>
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

/** Slowly rotating dual-ring sigil with the current step numeral centered inside. */
function SigilEmblem({ numeral }: { numeral: string }) {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 w-full h-full animate-[spin_28s_linear_infinite] filter drop-shadow-[0_0_18px_rgba(201,165,90,0.35)]"
      >
        <circle cx="60" cy="60" r="54" stroke="#C9A55A" strokeOpacity="0.55" strokeWidth="1" fill="none" strokeDasharray="2 6" />
      </svg>
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] animate-[spin_44s_linear_infinite_reverse]"
      >
        <circle cx="60" cy="60" r="46" stroke="#C9A55A" strokeOpacity="0.35" strokeWidth="1" fill="none" />
        <circle cx="60" cy="6" r="1.6" fill="#C9A55A" />
      </svg>
      <span className="relative font-[var(--font-cormorant)] italic text-[#C9A55A] text-3xl tracking-wider drop-shadow-[0_0_10px_rgba(201,165,90,0.5)]">
        {numeral}
      </span>
    </div>
  );
}

/** Four gold hairline brackets pinned to the panel corners. */
function CornerFrame() {
  const stroke = "#C9A55A";
  return (
    <>
      {[
        "top-0 left-0",
        "top-0 right-0 rotate-90",
        "bottom-0 right-0 rotate-180",
        "bottom-0 left-0 -rotate-90",
      ].map((pos, i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className={`pointer-events-none absolute ${pos} w-10 h-10`}
        >
          <path d="M0 20 L0 0 L20 0" stroke={stroke} strokeOpacity="0.65" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </>
  );
}
