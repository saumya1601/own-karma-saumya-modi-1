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

// Authentic Own Karma sacred logomark vector paths
const EMBLEM_PATHS = ["M 582,166 L 581,167 L 577,167 L 576,168 L 573,168 L 572,169 L 567,170 L 566,171 L 555,176 L 552,179 L 551,179 L 539,191 L 539,192 L 536,195 L 535,198 L 533,200 L 533,201 L 531,204 L 531,206 L 529,209 L 529,211 L 528,212 L 528,215 L 527,216 L 527,220 L 526,221 L 526,242 L 527,243 L 527,247 L 528,248 L 528,250 L 529,251 L 530,256 L 532,259 L 532,261 L 534,263 L 535,266 L 537,268 L 537,269 L 539,271 L 539,272 L 551,284 L 552,284 L 557,288 L 558,288 L 567,293 L 569,293 L 570,294 L 572,294 L 573,295 L 576,295 L 577,296 L 582,296 L 583,297 L 600,297 L 601,296 L 605,296 L 606,295 L 613,294 L 616,292 L 618,292 L 619,291 L 624,289 L 626,287 L 627,287 L 629,285 L 630,285 L 633,282 L 634,282 L 642,274 L 642,273 L 645,270 L 645,269 L 649,264 L 649,263 L 652,258 L 652,256 L 653,255 L 653,253 L 654,252 L 654,250 L 655,249 L 655,246 L 656,245 L 656,240 L 657,239 L 657,224 L 656,223 L 656,218 L 655,217 L 655,214 L 654,213 L 654,211 L 653,210 L 652,205 L 651,204 L 649,199 L 647,197 L 646,194 L 643,191 L 643,190 L 633,180 L 632,180 L 626,175 L 625,175 L 616,170 L 614,170 L 613,169 L 611,169 L 610,168 L 607,168 L 606,167 L 602,167 L 601,166 Z", "M 572,322 L 572,428 L 578,434 L 579,434 L 592,447 L 593,447 L 595,445 L 595,444 L 608,431 L 608,430 L 611,427 L 611,322 L 610,322 L 609,323 L 607,323 L 606,324 L 605,324 L 604,325 L 603,325 L 602,326 L 601,326 L 598,328 L 596,328 L 595,329 L 588,329 L 587,328 L 585,328 L 584,327 L 583,327 L 582,326 L 581,326 L 580,325 L 579,325 L 576,323 L 574,323 L 573,322 Z", "M 251,145 L 440,243 L 440,444 L 545,472 L 544,433 L 479,414 L 479,215 L 389,190 Z", "M 931,145 L 790,191 L 704,214 L 704,414 L 639,433 L 638,472 L 743,444 L 743,243 Z", "M 376,443 L 376,482 L 377,483 L 377,484 L 378,484 L 381,487 L 382,487 L 383,488 L 384,488 L 386,490 L 387,490 L 388,491 L 389,491 L 390,492 L 391,492 L 392,493 L 393,493 L 394,494 L 395,494 L 396,495 L 397,495 L 398,496 L 399,496 L 400,497 L 402,497 L 403,498 L 404,498 L 405,499 L 406,499 L 407,500 L 409,500 L 410,501 L 412,501 L 413,502 L 414,502 L 414,462 L 412,460 L 411,460 L 410,459 L 409,459 L 408,458 L 407,458 L 406,457 L 405,457 L 404,456 L 403,456 L 402,455 L 401,455 L 400,454 L 399,454 L 398,453 L 397,453 L 396,452 L 395,452 L 394,451 L 393,451 L 392,450 L 391,450 L 390,449 L 389,449 L 388,448 L 387,448 L 386,447 L 384,447 L 383,446 L 382,446 L 381,445 L 380,445 L 379,444 L 377,444 Z", "M 446,480 L 446,521 L 736,662 L 737,621 L 676,591 L 674,591 L 631,569 L 629,569 L 586,547 L 584,547 L 541,525 L 539,525 L 496,503 L 494,503 L 451,481 Z", "M 377,523 L 377,572 L 376,573 L 376,696 L 380,695 L 387,691 L 389,691 L 406,682 L 408,682 L 513,629 L 515,629 L 538,617 L 540,617 L 547,613 L 553,611 L 553,610 L 549,607 L 530,598 L 523,596 L 513,591 L 506,591 L 465,612 L 463,612 L 444,622 L 442,622 L 421,633 L 415,635 L 414,634 L 414,541 Z", "M 807,446 L 803,447 L 757,470 L 755,470 L 732,482 L 730,482 L 671,512 L 669,512 L 660,517 L 658,517 L 634,529 L 630,532 L 638,537 L 652,542 L 669,550 L 679,550 L 738,519 L 740,519 L 751,513 L 753,513 L 768,506 L 769,507 L 769,596 L 806,614 L 806,578 L 807,577 Z", "M 769,639 L 769,681 L 770,682 L 771,682 L 772,683 L 773,683 L 774,684 L 776,684 L 777,685 L 778,685 L 779,686 L 780,686 L 781,687 L 782,687 L 783,688 L 784,688 L 785,689 L 786,689 L 787,690 L 788,690 L 789,691 L 791,691 L 792,692 L 793,692 L 794,693 L 795,693 L 796,694 L 797,694 L 798,695 L 799,695 L 800,696 L 801,696 L 802,697 L 803,697 L 804,698 L 806,698 L 806,675 L 807,674 L 807,657 L 806,657 L 805,656 L 804,656 L 803,655 L 802,655 L 801,654 L 800,654 L 799,653 L 798,653 L 797,652 L 796,652 L 795,651 L 794,651 L 793,650 L 792,650 L 791,649 L 790,649 L 789,648 L 788,648 L 787,647 L 786,647 L 785,646 L 784,646 L 783,645 L 781,645 L 780,644 L 779,644 L 778,643 L 777,643 L 776,642 L 775,642 L 774,641 L 773,641 L 772,640 L 771,640 L 770,639 Z"];

/**
 * ACT VIII — "OWN YOUR KARMA" (The Final Screen)
 *
 * Ceremonial three-step invocation. One question at a time, framed by
 * corner ornaments, a rotating dual-ring sigil, and a progressive hairline rail.
 * Culminates in the authentic Own Karma sacred logomark reveal.
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
  const emblemGroupRef = useRef<SVGGElement>(null);
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

  // Ceremonial reveal for the post-ENTER finale: authentic emblem stitches in, then
  // text lines rise into place one by one.
  useEffect(() => {
    if (!submitted) return;

    const emblemGroup = emblemGroupRef.current;
    const ringWrap = ringWrapRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const becoming = becomingRef.current;
    const wordmark = wordmarkRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      if (ringWrap) {
        gsap.set(ringWrap, { opacity: 0, scale: 0.8 });
        tl.to(ringWrap, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
      }

      if (emblemGroup) {
        const paths = Array.from(emblemGroup.querySelectorAll<SVGPathElement>("path"));
        paths.forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
            fillOpacity: 0,
          });
        });

        paths.forEach((path, i) => {
          tl.to(
            path,
            { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" },
            i === 0 ? "<" : "<0.08"
          );
          tl.to(
            path,
            { fillOpacity: 1, duration: 0.5, ease: "power1.out" },
            ">-0.3"
          );
        });
      }

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
      {/* Radial Aura */}
      <div className="absolute top-1/2 left-1/2 w-180 h-180 bg-radial from-[#DFC878]/15 via-transparent to-transparent pointer-events-none filter blur-3xl animate-[auraBreathe_6s_ease-in-out_infinite]" />

      {/* Drifting gold embers — ambient life across the whole invocation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {EMBERS.map((ember, i) => (
          <span
            key={i}
            className="absolute bottom-[12%] w-1 h-1 rounded-full bg-[#E8C87A] shadow-[0_0_6px_2px_rgba(223,200,120,0.6)]"
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
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'240\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/></svg>")',
        }}
      />

      {!submitted ? (
        <div className="relative z-10 w-full max-w-2xl">
          <div className="relative px-8 sm:px-16 py-14 sm:py-20">
            {/* Overtitle */}
            <div ref={overtitleRef} className="flex flex-col items-center gap-6 mb-14">
              <SigilEmblem numeral={current.numeral} />
              <div className="flex items-center gap-4 opacity-80">
                <span className="h-px w-10 bg-[#DFC878]/50" />
                <span className="text-[10px] uppercase tracking-[0.55em] text-[#DFC878] font-mono">
                  {current.overline}
                </span>
                <span className="h-px w-10 bg-[#DFC878]/50" />
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
                    ? "text-[#DFC878] placeholder:text-[#DFC878]/25"
                    : "text-[#F4F0E8] placeholder:text-[#F4F0E8]/20"
                    }`}
                />
                {/* Baseline hairline + focus sweep */}
                <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-[#F4F0E8]/10" />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[1.5px] w-0 bg-linear-to-r from-transparent via-[#DFC878] to-transparent transition-all duration-700 ease-out peer-focus:w-full shadow-[0_0_12px_rgba(223,200,120,0.7)]" />
              </div>

              {/* Error */}
              <p
                className={`text-[11px] uppercase tracking-[0.4em] font-mono transition-opacity duration-300 ${error ? "opacity-100 text-amber-300/90" : "opacity-0"
                  }`}
              >
                {error || " "}
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
                  className="group relative cursor-pointer px-10 py-3 rounded-full bg-white/3 text-[#F4F0E8] font-[var(--font-cormorant)] italic text-lg tracking-[0.45em] uppercase transition-all duration-700 hover:bg-[#DFC878]/10 hover:text-[#DFC878] hover:shadow-[0_0_35px_rgba(223,200,120,0.35)] animate-[ctaBreathe_3.2s_ease-in-out_infinite]"
                >
                  <span className="relative z-10 flex items-center gap-3 filter drop-shadow-[0_0_10px_rgba(223,200,120,0.4)]">
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
                      ? "w-14 bg-[#DFC878] shadow-[0_0_10px_rgba(223,200,120,0.6)]"
                      : "w-8 bg-[#F4F0E8]/15"
                      }`}
                  />
                  <span
                    className={`text-[10px] font-mono tracking-[0.4em] transition-colors duration-500 ${i === step
                      ? "text-[#DFC878]"
                      : i < step
                        ? "text-[#DFC878]/60"
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
            {/* Authentic OWN KARMA Sacred Emblem Logomark */}
            <svg
              viewBox="200 120 784 600"
              className="w-full h-full filter drop-shadow-[0_0_24px_rgba(223,200,120,0.55)]"
              fill="none"
            >
              <defs>
                <linearGradient id="goldFillGradAct8" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F7EAC8" />
                  <stop offset="50%" stopColor="#DFC878" />
                  <stop offset="100%" stopColor="#C4A853" />
                </linearGradient>
              </defs>

              <g
                ref={emblemGroupRef}
                stroke="#DFC878"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="url(#goldFillGradAct8)"
              >
                {EMBLEM_PATHS.map((d, i) => (
                  <path key={`act8-emblem-${i}`} d={d} fillRule="evenodd" />
                ))}
              </g>
            </svg>

            {/* Orbiting accent motes echoing the step sigil's rotation */}
            <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full animate-[spin_26s_linear_infinite] pointer-events-none">
              <circle cx="80" cy="6" r="2.2" fill="#E8C87A" />
            </svg>
            <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full animate-[spin_38s_linear_infinite_reverse] pointer-events-none">
              <circle cx="80" cy="24" r="1.6" fill="#DFC878" />
            </svg>
          </div>

          <div className="space-y-4">
            <p ref={line1Ref} className="font-[var(--font-cormorant)] italic text-[#F4F0E8] text-3xl sm:text-5xl font-light leading-relaxed">
              &ldquo;Every choice creates a story. <br />
              <span ref={line2Ref} className="text-[#DFC878]">This is yours.&rdquo;</span>
            </p>

            {becoming && (
              <p ref={becomingRef} className="text-xs uppercase tracking-[0.4em] text-[#DFC878]/80 font-mono pt-4">
                Becoming: {becoming}
              </p>
            )}
          </div>

          <h1
            ref={wordmarkRef}
            className="font-[var(--font-cormorant)] bg-clip-text text-transparent text-2xl sm:text-3xl tracking-[0.4em] uppercase font-light pt-6 animate-[shimmerSweep_4s_linear_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #DFC878 0%, #DFC878 35%, #FFF4D0 50%, #DFC878 65%, #DFC878 100%)",
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
        className="absolute inset-0 w-full h-full animate-[spin_28s_linear_infinite] filter drop-shadow-[0_0_18px_rgba(223,200,120,0.35)]"
      >
        <circle cx="60" cy="60" r="54" stroke="#DFC878" strokeOpacity="0.55" strokeWidth="1" fill="none" strokeDasharray="2 6" />
      </svg>
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] animate-[spin_44s_linear_infinite_reverse]"
      >
        <circle cx="60" cy="60" r="46" stroke="#DFC878" strokeOpacity="0.35" strokeWidth="1" fill="none" />
        <circle cx="60" cy="6" r="1.6" fill="#DFC878" />
      </svg>
      <span className="relative font-[var(--font-cormorant)] italic text-[#DFC878] text-3xl tracking-wider drop-shadow-[0_0_10px_rgba(223,200,120,0.5)]">
        {numeral}
      </span>
    </div>
  );
}
