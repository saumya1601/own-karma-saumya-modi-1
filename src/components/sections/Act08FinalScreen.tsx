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

/** Preset drift paths for the ambient gold embers on the finale beat. */
const EMBERS: { left: string; duration: number; delay: number; drift: string }[] = [
  { left: "12%", duration: 7.0, delay: 0.0, drift: "10px" },
  { left: "22%", duration: 9.0, delay: 1.2, drift: "-14px" },
  { left: "35%", duration: 6.5, delay: 2.4, drift: "8px" },
  { left: "48%", duration: 8.0, delay: 0.6, drift: "-6px" },
  { left: "58%", duration: 7.5, delay: 3.0, drift: "12px" },
  { left: "67%", duration: 9.5, delay: 1.8, drift: "-10px" },
  { left: "76%", duration: 6.8, delay: 2.9, drift: "6px" },
  { left: "84%", duration: 8.4, delay: 0.3, drift: "-8px" },
  { left: "40%", duration: 10.0, delay: 4.0, drift: "4px" },
  { left: "60%", duration: 7.2, delay: 3.6, drift: "-4px" },
];

/** Fixed constellation of ambient stars scattered across the whole viewport. */
const STARS: { top: string; left: string; size: number; duration: number; delay: number }[] = [
  { top: "6%", left: "12%", size: 1.5, duration: 4.5, delay: 0.0 },
  { top: "10%", left: "42%", size: 0.8, duration: 6.8, delay: 3.0 },
  { top: "15%", left: "78%", size: 1.0, duration: 6.0, delay: 1.8 },
  { top: "18%", left: "24%", size: 1.2, duration: 7.2, delay: 4.2 },
  { top: "22%", left: "56%", size: 1.5, duration: 5.2, delay: 2.5 },
  { top: "26%", left: "88%", size: 1.5, duration: 4.8, delay: 3.4 },
  { top: "30%", left: "5%", size: 1.0, duration: 7.4, delay: 4.6 },
  { top: "34%", left: "38%", size: 0.8, duration: 5.6, delay: 1.1 },
  { top: "38%", left: "70%", size: 1.5, duration: 5.8, delay: 0.7 },
  { top: "44%", left: "16%", size: 1.2, duration: 6.4, delay: 2.8 },
  { top: "48%", left: "52%", size: 0.9, duration: 4.0, delay: 1.5 },
  { top: "52%", left: "92%", size: 1.8, duration: 5.5, delay: 2.0 },
  { top: "58%", left: "8%", size: 1.0, duration: 6.5, delay: 1.2 },
  { top: "62%", left: "44%", size: 1.2, duration: 5.0, delay: 3.9 },
  { top: "66%", left: "74%", size: 1.4, duration: 6.2, delay: 3.1 },
  { top: "72%", left: "22%", size: 1.0, duration: 5.0, delay: 2.9 },
  { top: "76%", left: "60%", size: 0.8, duration: 7.0, delay: 4.4 },
  { top: "80%", left: "84%", size: 1.5, duration: 7.5, delay: 0.4 },
  { top: "86%", left: "36%", size: 1.2, duration: 5.4, delay: 2.2 },
  { top: "90%", left: "68%", size: 1.0, duration: 6.6, delay: 3.7 },
  { top: "12%", left: "62%", size: 0.9, duration: 5.9, delay: 4.9 },
  { top: "40%", left: "84%", size: 1.0, duration: 4.4, delay: 0.9 },
  { top: "68%", left: "48%", size: 0.8, duration: 7.8, delay: 2.4 },
  { top: "82%", left: "12%", size: 1.2, duration: 5.3, delay: 4.0 },
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
  const overtitleRef = useRef<HTMLDivElement>(null);
  const stepStageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outerRingRef = useRef<SVGPathElement>(null);
  const innerRingRef = useRef<SVGPathElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const becomingRef = useRef<HTMLParagraphElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

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
    const overtitle = overtitleRef.current;
    const stage = stepStageRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      if (overtitle) {
        tl.fromTo(
          overtitle,
          { opacity: 0, y: -10, scale: 0.94, filter: "blur(4px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
        );
      }
      if (stage) {
        tl.fromTo(
          stage,
          { opacity: 0, y: 18, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
          overtitle ? "-=0.5" : 0
        );
      }
    });

    const t = window.setTimeout(() => inputRef.current?.focus(), 350);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [step, submitted]);

  // Ceremonial reveal for the post-ENTER finale: sigil stitches in, then
  // text lines rise into place one by one.
  useEffect(() => {
    if (!submitted) return;

    const outerRing = outerRingRef.current;
    const innerRing = innerRingRef.current;
    const ringWrap = ringWrapRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const becoming = becomingRef.current;
    const wordmark = wordmarkRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      if (ringWrap) {
        gsap.set(ringWrap, { opacity: 0, scale: 0.6 });
        tl.to(ringWrap, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" });
      }

      [outerRing, innerRing].forEach((ring, i) => {
        if (!ring) return;
        const len = ring.getTotalLength();
        gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(
          ring,
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
          i === 0 ? "<" : "<0.1"
        );
      });

      [line1, line2, becoming, wordmark].forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 16, filter: "blur(6px)" });
        tl.to(
          el,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
          i === 0 ? "-=0.3" : "-=0.5"
        );
      });
    });

    return () => ctx.revert();
  }, [submitted]);

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
      {/* Top-Left Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={() => onBack?.()}
          className="fixed top-6 left-6 z-50 text-xs font-mono uppercase tracking-[0.25em] text-[#C9A55A]/70 hover:text-[#C9A55A] transition-colors cursor-pointer flex items-center gap-2"
        >
          ← Back
        </button>
      )}
      {/* Radial Aura */}
      <div className="absolute top-1/2 left-1/2 w-180 h-180 bg-radial from-[#C9A55A]/15 via-transparent to-transparent pointer-events-none filter blur-3xl animate-[auraBreathe_6s_ease-in-out_infinite]" />

      {/* Drifting gold embers — ambient life across the whole invocation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {EMBERS.map((ember, i) => (
          <span
            key={i}
            className="absolute bottom-[12%] w-1 h-1 rounded-full bg-[#E8C87A] shadow-[0_0_6px_2px_rgba(201,165,90,0.6)]"
            style={
              {
                left: ember.left,
                animationName: "emberRise",
                animationDuration: `${ember.duration}s`,
                animationDelay: `${ember.delay}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "ease-in",
                "--ember-drift": ember.drift,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Slow-twinkling constellation across the whole viewport */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#F4F0E8] shadow-[0_0_4px_1px_rgba(232,200,122,0.35)]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationName: "starTwinkle",
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </div>

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
          <div className="relative px-8 sm:px-16 py-14 sm:py-20">
            {/* Overtitle */}
            <div ref={overtitleRef} className="flex flex-col items-center gap-6 mb-14">
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
                  className="group relative cursor-pointer px-10 py-3 rounded-full bg-white/3 text-[#F4F0E8] font-[var(--font-cormorant)] italic text-lg tracking-[0.45em] uppercase transition-all duration-700 hover:bg-[#C9A55A]/10 hover:text-[#C9A55A] hover:shadow-[0_0_35px_rgba(201,165,90,0.35)] animate-[ctaBreathe_3.2s_ease-in-out_infinite]"
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
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-10 max-w-2xl">
          <div ref={ringWrapRef} className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* OWN KARMA emblem — same lotus mandala + 8-point star from Act V */}
            <svg
              viewBox="130 30 160 160"
              className="w-full h-full filter drop-shadow-[0_0_22px_rgba(201,165,90,0.55)]"
              fill="none"
            >
              <path
                ref={outerRingRef}
                d="M 194.7,73 C 181.3,40.7 238.7,40.7 225.3,73 C 238.7,40.7 279.3,81.3 247,94.7 C 279.3,81.3 279.3,138.7 247,125.3 C 279.3,138.7 238.7,179.3 225.3,147 C 238.7,179.3 181.3,179.3 194.7,147 C 181.3,179.3 140.7,138.7 173,125.3 C 140.7,138.7 140.7,81.3 173,94.7 C 140.7,81.3 181.3,40.7 194.7,73 Z"
                stroke="#C9A55A"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={innerRingRef}
                d="M 210,85 L 213.8,100.8 L 227.7,92.3 L 219.2,106.2 L 235,110 L 219.2,113.8 L 227.7,127.7 L 213.8,119.2 L 210,135 L 206.2,119.2 L 192.3,127.7 L 200.8,113.8 L 185,110 L 200.8,106.2 L 192.3,92.3 L 206.2,100.8 Z"
                stroke="#C9A55A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Orbiting accent motes echoing the step sigil's rotation */}
            <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full animate-[spin_26s_linear_infinite] pointer-events-none">
              <circle cx="80" cy="6" r="2.2" fill="#E8C87A" />
            </svg>
            <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full animate-[spin_38s_linear_infinite_reverse] pointer-events-none">
              <circle cx="80" cy="24" r="1.6" fill="#C9A55A" />
            </svg>
          </div>

          <div className="space-y-4">
            <p ref={line1Ref} className="font-[var(--font-cormorant)] italic text-[#F4F0E8] text-3xl sm:text-5xl font-light leading-relaxed">
              &ldquo;Every choice creates a story. <br />
              <span ref={line2Ref} className="text-[#C9A55A]">This is yours.&rdquo;</span>
            </p>

            {becoming && (
              <p ref={becomingRef} className="text-xs uppercase tracking-[0.4em] text-[#C9A55A]/80 font-mono pt-4">
                Becoming: {becoming}
              </p>
            )}
          </div>

          <h1
            ref={wordmarkRef}
            className="font-[var(--font-cormorant)] bg-clip-text text-transparent text-2xl tracking-[0.4em] uppercase font-light pt-6 animate-[shimmerSweep_4s_linear_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #C9A55A 0%, #C9A55A 35%, #FFF3D6 50%, #C9A55A 65%, #C9A55A 100%)",
              backgroundSize: "200% 100%",
            }}
          >
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
