"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ==================================================================== */
/*  LoadingKodandaArcher — physically modeled bow loader                */
/*                                                                      */
/*  DRAW     rigid riser, flexing limbs, string under tension; strain   */
/*           tremble + aim sway grow with draw weight (∝ v²)            */
/*  RELEASE  string-contact acceleration → constant-velocity flight     */
/*           with motion stretch + comet trail; limbs and string snap   */
/*           forward past brace and oscillate (damped elastic)          */
/*  BURST    muzzle flash, 3 shockwave rings, spark + shard particles   */
/*           integrated per-frame with gravity and air drag, decaying   */
/*           screen shake                                               */
/*  EXIT     center seams flash, the 4 backdrop quadrants are blasted   */
/*           apart to reveal the app                                    */
/*                                                                      */
/*  Perf: one gsap ticker writes SVG attributes directly — zero React   */
/*  re-renders during the 60 fps animation (the old version set state   */
/*  every frame). Honors prefers-reduced-motion. Cleans up fully.       */
/* ==================================================================== */

interface LoadingKodandaArcherProps {
  onComplete?: () => void;
}

type Phase = "drawing" | "ready" | "exiting";

/* ------------- physical model (SVG viewBox 0 0 100 100) ------------- */
const REST_NOCK = 47; // string y when braced
const DRAW_LEN = 37; // nock travel at full draw, in svg units
const GRAVITY = 1500; // px/s² acting on burst particles
const AIR_DRAG = 1.4; // 1/s velocity damping on burst particles

const clampV = gsap.utils.clamp(-0.5, 1.06);

const tipAt = (v: number) => ({ x: 14 + 4 * v, y: 47 + 6.5 * v });
const nockAt = (v: number) => REST_NOCK + DRAW_LEN * v;

/** Limbs: the riser (grip) at the apex is rigid; only the limbs bend
 *  toward the string as draw v grows. Negative v = forward overshoot
 *  right after release, so the whole bow visibly "twangs". */
const bowPath = (v: number) => {
  const t = tipAt(v);
  const sag = 33 + 7.5 * v; // mid-limb deflection
  return `M ${t.x.toFixed(2)},${t.y.toFixed(2)} C ${(t.x + 5).toFixed(2)},${sag.toFixed(
    2,
  )} 36,17.5 50,17 C 64,17.5 ${(95 - t.x).toFixed(2)},${sag.toFixed(2)} ${(100 - t.x).toFixed(
    2,
  )},${t.y.toFixed(2)}`;
};

const stringPath = (v: number) => {
  const t = tipAt(v);
  return `M ${t.x.toFixed(2)},${t.y.toFixed(2)} L 50,${nockAt(v).toFixed(2)} L ${(
    100 - t.x
  ).toFixed(2)},${t.y.toFixed(2)}`;
};

export default function LoadingKodandaArcher({ onComplete }: LoadingKodandaArcherProps) {
  const [phase, setPhase] = useState<Phase>("drawing");

  /* layout + fx refs */
  const rootRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const emberRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const bowWrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const panelTL = useRef<HTMLDivElement>(null);
  const panelTR = useRef<HTMLDivElement>(null);
  const panelBL = useRef<HTMLDivElement>(null);
  const panelBR = useRef<HTMLDivElement>(null);
  const seamVRef = useRef<HTMLDivElement>(null);
  const seamHRef = useRef<HTMLDivElement>(null);

  /* svg refs */
  const bowRef = useRef<SVGPathElement>(null);
  const stringRef = useRef<SVGPathElement>(null);
  const tipLRef = useRef<SVGCircleElement>(null);
  const tipRRef = useRef<SVGCircleElement>(null);
  const aimRef = useRef<SVGLineElement>(null);
  const arrowRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGLineElement>(null);

  /* simulation state */
  const phys = useRef({ v: 0, free: false });
  const phaseRef = useRef<Phase>("drawing");
  const labelCache = useRef("");
  const reducedRef = useRef(false);
  const masterRef = useRef<gsap.core.Timeline | null>(null);
  const sparkCleanup = useRef<(() => void) | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  /* ---------------- mount: draw sequence + render loop ---------------- */
  useEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reduced = reducedRef.current;

    const P = phys.current;
    P.v = 0;
    P.free = false;

    /* Draw sequence: quick nock, long grind against peak weight, settle at anchor. */
    const drawTl = gsap
      .timeline({ onComplete: () => setPhase("ready") })
      .to(P, { v: 0.3, duration: 1.2, ease: "power2.out" })
      .to(P, { v: 0.86, duration: 3.2, ease: "power1.inOut" })
      .to(P, { v: 1, duration: 1.8, ease: "power3.out" });

    /* One 60 fps loop writes SVG attributes directly — no React re-renders. */
    const render = (time: number) => {
      const ph = phaseRef.current;
      let v = P.v;

      if (!reduced && ph !== "exiting") {
        /* Strain tremble: the arm shakes harder near full draw (∝ v²). */
        const strain = v * v;
        v += (Math.sin(time * 34) + 0.6 * Math.sin(time * 57 + 1.7)) * 0.011 * strain;
        if (bowWrapRef.current) {
          const sway = Math.sin(time * 1.5) * (ph === "ready" ? 1.25 : 0.85) * strain;
          gsap.set(bowWrapRef.current, { rotation: sway });
        }
      }
      v = clampV(v);

      bowRef.current?.setAttribute("d", bowPath(v));
      stringRef.current?.setAttribute("d", stringPath(v));

      const t = tipAt(v);
      if (tipLRef.current) {
        tipLRef.current.setAttribute("cx", t.x.toFixed(2));
        tipLRef.current.setAttribute("cy", t.y.toFixed(2));
      }
      if (tipRRef.current) {
        tipRRef.current.setAttribute("cx", (100 - t.x).toFixed(2));
        tipRRef.current.setAttribute("cy", t.y.toFixed(2));
      }

      /* Arrow rides the nock point until it is loosed. */
      if (!P.free && arrowRef.current) gsap.set(arrowRef.current, { y: DRAW_LEN * v });

      if (aimRef.current) {
        const headY = -7 + DRAW_LEN * Math.max(v, 0);
        aimRef.current.setAttribute("y1", (headY - 6).toFixed(2));
        aimRef.current.setAttribute(
          "opacity",
          P.free ? "0" : (0.05 + 0.3 * Math.max(v, 0)).toFixed(2),
        );
        aimRef.current.setAttribute("stroke-dashoffset", ((-time * 8) % 6).toFixed(2));
      }

      if (glowRef.current) glowRef.current.style.opacity = `${0.35 + 0.65 * Math.max(v, 0)}`;

      if (ph === "drawing") {
        if (pctRef.current)
          pctRef.current.textContent = `${Math.round(gsap.utils.clamp(0, 1, P.v) * 100)}%`;
        const label = P.v < 0.16 ? "Nocking arrow" : P.v < 0.9 ? "Drawing" : "Anchoring";
        if (labelRef.current && labelCache.current !== label) {
          labelCache.current = label;
          labelRef.current.textContent = label;
        }
      }
    };
    gsap.ticker.add(render);

    /* Ambient embers drifting up through the scene. */
    const emberLayer = emberRef.current;
    const fxLayer = fxRef.current;
    const emberTweens: gsap.core.Tween[] = [];
    if (!reduced && emberLayer) {
      for (let i = 0; i < 9; i++) {
        const e = document.createElement("div");
        const s = 1.5 + Math.random() * 2.5;
        e.style.cssText = `position:absolute;bottom:-12px;left:${4 + Math.random() * 92}%;width:${s}px;height:${s}px;border-radius:9999px;background:rgba(253,230,138,0.75);box-shadow:0 0 6px 1px rgba(251,191,36,0.45);opacity:0;`;
        emberLayer.appendChild(e);
        emberTweens.push(
          gsap.to(e, {
            y: -(window.innerHeight + 80),
            duration: 7 + Math.random() * 6,
            repeat: -1,
            delay: Math.random() * 7,
            ease: "none",
          }),
          gsap.to(e, {
            x: `+=${10 + Math.random() * 26}`,
            duration: 1.6 + Math.random() * 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(e, {
            opacity: 0.8,
            duration: 1.1 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
        );
      }
    }

    return () => {
      drawTl.kill();
      gsap.ticker.remove(render);
      masterRef.current?.kill();
      sparkCleanup.current?.();
      emberTweens.forEach((tw) => tw.kill());
      if (emberLayer) emberLayer.innerHTML = "";
      if (fxLayer) fxLayer.innerHTML = "";
    };
  }, []);

  /* --------------------------- release ------------------------------ */
  const release = useCallback(() => {
    if (phaseRef.current !== "ready") return;
    phaseRef.current = "exiting";
    setPhase("exiting");

    const P = phys.current;
    P.free = true;
    const reduced = reducedRef.current;
    const fx = fxRef.current;
    if (rootRef.current) rootRef.current.style.pointerEvents = "none";

    /* --- burst: muzzle flash --- */
    const fireFlash = () => {
      if (!fx) return;
      const f = document.createElement("div");
      f.style.cssText =
        "position:absolute;left:50%;top:50%;width:260px;height:260px;border-radius:9999px;pointer-events:none;background:radial-gradient(closest-side,rgba(255,251,235,0.95),rgba(251,191,36,0.55) 35%,rgba(251,146,60,0.16) 62%,transparent 74%);";
      fx.appendChild(f);
      gsap.fromTo(
        f,
        { xPercent: -50, yPercent: -52, scale: 0.25, opacity: 1 },
        { scale: 2.3, opacity: 0, duration: 0.32, ease: "expo.out", onComplete: () => f.remove() },
      );
    };

    /* --- burst: expanding shockwave rings --- */
    const fireShockwaves = () => {
      if (!fx) return;
      [0, 1, 2].forEach((i) => {
        const r = document.createElement("div");
        r.style.cssText = `position:absolute;left:50%;top:50%;width:120px;height:120px;border-radius:9999px;pointer-events:none;border:${i === 0 ? 2.5 : 1.5
          }px solid rgba(252,211,77,${0.85 - i * 0.22});box-shadow:0 0 24px rgba(245,158,11,0.35),inset 0 0 18px rgba(245,158,11,0.22);`;
        fx.appendChild(r);
        gsap.fromTo(
          r,
          { xPercent: -50, yPercent: -52, scale: 0.15, opacity: 0.95 },
          {
            scale: 2.7 + i * 1.6,
            opacity: 0,
            duration: 0.55 + i * 0.3,
            delay: i * 0.07,
            ease: "power2.out",
            onComplete: () => r.remove(),
          },
        );
      });
    };

    /* --- burst: sparks + shards, integrated with gravity and drag --- */
    const spawnSparks = () => {
      if (!fx) return;
      type Spark = {
        el: HTMLDivElement;
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        ttl: number;
        shard: boolean;
      };
      const sparks: Spark[] = [];
      const count = reduced ? 10 : 34;

      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        const shard = i % 6 === 5;
        const hot = Math.random() < 0.35;
        if (shard) {
          el.style.cssText = `position:absolute;left:50%;top:50%;width:2px;height:${10 + Math.random() * 12
            }px;border-radius:2px;pointer-events:none;transform-origin:center;background:linear-gradient(to bottom,#fffbeb,rgba(251,191,36,0));`;
        } else {
          const s = 2.5 + Math.random() * 4.5;
          el.style.cssText = `position:absolute;left:50%;top:50%;width:${s}px;height:${s}px;border-radius:9999px;pointer-events:none;transform-origin:center;background:${hot ? "#fffbeb" : "#fbbf24"
            };box-shadow:0 0 ${hot ? 10 : 6}px ${hot ? 2 : 1}px rgba(251,191,36,0.8);`;
        }
        /* velocity: 70% launch in an upward cone, the rest scatter radially */
        const up = Math.random() < 0.7;
        const ang = up ? -Math.PI / 2 + (Math.random() - 0.5) * 1.9 : Math.random() * Math.PI * 2;
        const spd = (240 + Math.random() * 720) * (up ? 1 : 0.55);
        sparks.push({
          el,
          x: 0,
          y: -8,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0,
          ttl: 0.55 + Math.random() * 0.65,
          shard,
        });
        fx.appendChild(el);
      }

      const tick = (_t: number, dms: number) => {
        const dt = Math.min(dms / 1000, 0.05);
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.life += dt;
          const k = 1 - p.life / p.ttl;
          if (k <= 0) {
            p.el.remove();
            sparks.splice(i, 1);
            continue;
          }
          p.vy += GRAVITY * dt; // gravity
          const drag = Math.max(0, 1 - AIR_DRAG * dt); // air resistance
          p.vx *= drag;
          p.vy *= drag;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          const rot = p.shard
            ? ` rotate(${((Math.atan2(p.vy, p.vx) * 180) / Math.PI + 90).toFixed(1)}deg)`
            : "";
          p.el.style.transform = `translate(-50%,-50%) translate(${p.x.toFixed(1)}px,${p.y.toFixed(
            1,
          )}px)${rot} scale(${(0.35 + 0.65 * k).toFixed(3)})`;
          p.el.style.opacity = (k * k).toFixed(3);
        }
        if (!sparks.length) {
          gsap.ticker.remove(tick);
          sparkCleanup.current = null;
        }
      };
      gsap.ticker.add(tick);
      sparkCleanup.current = () => {
        gsap.ticker.remove(tick);
        sparks.forEach((p) => p.el.remove());
        sparks.length = 0;
      };
    };

    /* --- burst: decaying screen shake --- */
    const shake = () => {
      const el = shakeRef.current;
      if (!el) return;
      const shakeTl = gsap.timeline();
      let amp = 13;
      for (let i = 0; i < 8; i++) {
        shakeTl.to(el, {
          x: gsap.utils.random(-amp, amp),
          y: gsap.utils.random(-amp, amp),
          rotation: gsap.utils.random(-amp, amp) * 0.045,
          duration: 0.05,
          ease: "none",
        });
        amp *= 0.64;
      }
      shakeTl.to(el, { x: 0, y: 0, rotation: 0, duration: 0.14, ease: "power2.out" });
    };

    /* ----------------------- master timeline ----------------------- */
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current?.() });
    masterRef.current = tl;

    /* archer steadies at the loose; UI hides */
    if (bowWrapRef.current)
      tl.to(bowWrapRef.current, { rotation: 0, duration: 0.15, ease: "power2.out" }, 0);
    if (buttonRef.current)
      tl.to(buttonRef.current, { opacity: 0, y: 8, duration: 0.15, ease: "power1.in" }, 0);

    /* limbs + string snap forward and oscillate around brace
       (elastic overshoots v below 0 — the visible twang) */
    tl.to(P, { v: 0, duration: 0.75, ease: "elastic.out(1.2, 0.14)" }, 0);

    /* arrow: accelerates only while the string is in contact (~70 ms),
       then flies at constant velocity with motion stretch + trail */
    if (arrowRef.current) {
      tl.to(arrowRef.current, { y: 0, duration: 0.07, ease: "power1.in" }, 0)
        .to(arrowRef.current, { y: -340, duration: 0.32, ease: "none" }, 0.07)
        .to(
          arrowRef.current,
          { scaleY: 1.5, transformOrigin: "50% 0%", duration: 0.12, ease: "power1.out" },
          0.07,
        )
        .to(arrowRef.current, { opacity: 0, duration: 0.1, ease: "power1.in" }, 0.3);
    }
    if (trailRef.current) tl.to(trailRef.current, { opacity: 0.9, duration: 0.05 }, 0.07);

    /* the burst fires the instant the arrow leaves the string */
    tl.add(() => {
      fireFlash();
      fireShockwaves();
      spawnSparks();
      if (!reduced) shake();
    }, 0.07);

    /* scene fades once the twang has played out */
    if (sceneRef.current)
      tl.to(sceneRef.current, { opacity: 0, duration: 0.22, ease: "power2.out" }, 0.45);

    if (reduced) {
      if (rootRef.current)
        tl.to(rootRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.55);
      return;
    }

    /* seams flash, then the backdrop quadrants are blasted apart */
    const seams = [seamVRef.current, seamHRef.current].filter(Boolean) as HTMLDivElement[];
    if (seams.length) {
      tl.to(seams, { opacity: 1, duration: 0.12, ease: "power2.in" }, 0.46).to(
        seams,
        { opacity: 0, duration: 0.4, ease: "power1.out" },
        0.62,
      );
    }

    const D = 0.95;
    const T = 0.56;
    const EASE = "expo.inOut";
    tl.to(panelTL.current, { xPercent: -115, yPercent: -115, rotation: -3.5, duration: D, ease: EASE }, T)
      .to(panelTR.current, { xPercent: 115, yPercent: -115, rotation: 3.5, duration: D, ease: EASE }, T)
      .to(panelBL.current, { xPercent: -115, yPercent: 115, rotation: 3.5, duration: D, ease: EASE }, T)
      .to(panelBR.current, { xPercent: 115, yPercent: 115, rotation: -3.5, duration: D, ease: EASE }, T);
  }, []);

  /* release with Space / Enter as well */
  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        release();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, release]);

  /* ------------------------------ view ------------------------------ */
  return (
    <div
      ref={rootRef}
      onClick={release}
      className={`fixed inset-0 z-[9999] select-none overflow-hidden ${phase === "ready" ? "cursor-pointer" : "cursor-default"
        }`}
    >
      {/* Shake layer is oversized so the shake never reveals screen edges */}
      <div ref={shakeRef} className="absolute -inset-4 will-change-transform">
        {/* ---- backdrop quadrants (these are what gets blasted apart) ---- */}
        <div
          ref={panelTL}
          className="absolute left-0 top-0 h-1/2 w-1/2 border-b border-r border-amber-500/10 bg-slate-950 will-change-transform"
          style={{ transformOrigin: "100% 100%" }}
        />
        <div
          ref={panelTR}
          className="absolute right-0 top-0 h-1/2 w-1/2 border-b border-l border-amber-500/10 bg-slate-950 will-change-transform"
          style={{ transformOrigin: "0% 100%" }}
        />
        <div
          ref={panelBL}
          className="absolute bottom-0 left-0 h-1/2 w-1/2 border-r border-t border-amber-500/10 bg-slate-950 will-change-transform"
          style={{ transformOrigin: "100% 0%" }}
        />
        <div
          ref={panelBR}
          className="absolute bottom-0 right-0 h-1/2 w-1/2 border-l border-t border-amber-500/10 bg-slate-950 will-change-transform"
          style={{ transformOrigin: "0% 0%" }}
        />

        {/* ---- seam flashes (fire right before the blast) ---- */}
        <div
          ref={seamVRef}
          className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-300 to-transparent opacity-0 shadow-[0_0_18px_4px_rgba(251,191,36,0.65)]"
        />
        <div
          ref={seamHRef}
          className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-0 shadow-[0_0_18px_4px_rgba(251,191,36,0.65)]"
        />

        {/* ------------------------------ scene ------------------------------ */}
        <div ref={sceneRef} className="absolute inset-0">
          {/* charge glow — brightens with draw */}
          <div
            ref={glowRef}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(245,158,11,0.14),rgba(245,158,11,0.045)_38%,transparent_68%)]"
            style={{ opacity: 0.35 }}
          />
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_46%,rgba(2,6,23,0.55)_100%)]" />
          {/* ambient embers */}
          <div ref={emberRef} className="pointer-events-none absolute inset-0 overflow-hidden" />

          {/* wordmark */}
          <div className="absolute left-1/2 top-12 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.55em] text-amber-500/60">
            Kodanda
          </div>

          {/* ------------------------------ bow rig ------------------------------ */}
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 sm:h-80 sm:w-80">
            <div ref={bowWrapRef} className="h-full w-full will-change-transform">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full overflow-visible drop-shadow-[0_0_14px_rgba(245,158,11,0.28)]"
                aria-hidden
              >
                <defs>
                  <linearGradient id="kod-limb" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#f59e0b" />
                    <stop offset="0.5" stopColor="#fcd34d" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="kod-trail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fde68a" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* trajectory guide */}
                <line
                  ref={aimRef}
                  x1="50"
                  y1="-13"
                  x2="50"
                  y2="-150"
                  stroke="#f59e0b"
                  strokeWidth="0.7"
                  strokeDasharray="1.5 4.5"
                  opacity="0.05"
                />

                {/* limbs (flex with draw) */}
                <path
                  ref={bowRef}
                  d={bowPath(0)}
                  fill="none"
                  stroke="url(#kod-limb)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* rigid riser / grip */}
                <path d="M 45,17.3 L 55,17.3" stroke="#b45309" strokeWidth="5.4" strokeLinecap="round" />
                <path
                  d="M 45,17.3 L 55,17.3"
                  stroke="#f59e0b"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* limb tip nocks */}
                <circle ref={tipLRef} cx="14" cy="47" r="1.5" fill="#fcd34d" />
                <circle ref={tipRRef} cx="86" cy="47" r="1.5" fill="#fcd34d" />

                {/* string */}
                <path
                  ref={stringRef}
                  d={stringPath(0)}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="0.9"
                  strokeOpacity="0.92"
                  strokeLinejoin="round"
                />

                {/* arrow (rest pose: tail y=47, head y=-7; rides the nock) */}
                <g ref={arrowRef} className="will-change-transform">
                  {/* comet trail — hidden until flight */}
                  <line
                    ref={trailRef}
                    x1="50"
                    y1="47"
                    x2="50"
                    y2="78"
                    stroke="url(#kod-trail)"
                    strokeWidth="1.6"
                    opacity="0"
                  />
                  {/* shaft */}
                  <line
                    x1="50"
                    y1="46"
                    x2="50"
                    y2="-3"
                    stroke="#fde68a"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  {/* fletching */}
                  <path d="M 50,38 L 46.6,42.2 L 46.6,44.6 L 50,40.6 Z" fill="#fb923c" opacity="0.95" />
                  <path d="M 50,38 L 53.4,42.2 L 53.4,44.6 L 50,40.6 Z" fill="#f97316" opacity="0.95" />
                  <path d="M 50,41.5 L 47.2,45 L 47.2,47 L 50,43.7 Z" fill="#fdba74" opacity="0.9" />
                  <path d="M 50,41.5 L 52.8,45 L 52.8,47 L 50,43.7 Z" fill="#fb923c" opacity="0.9" />
                  {/* nock */}
                  <path
                    d="M 48.7,47.8 L 50,45.9 L 51.3,47.8"
                    fill="none"
                    stroke="#fcd34d"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  {/* head */}
                  <path
                    d="M 46.9,2.2 L 50,-7 L 53.1,2.2 L 50,0.4 Z"
                    fill="#fffbeb"
                    stroke="#fcd34d"
                    strokeWidth="0.5"
                    style={{ filter: "drop-shadow(0 0 3px rgba(253,230,138,0.95))" }}
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* ------------------------------ readout ------------------------------ */}
          <div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="flex h-16 flex-col items-center justify-center gap-2.5">
              {phase === "drawing" ? (
                <>
                  <span
                    ref={labelRef}
                    className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400"
                  >
                    Nocking arrow
                  </span>
                  <span
                    ref={pctRef}
                    className="font-mono text-sm font-bold tracking-[0.2em] text-amber-400"
                  >
                    0%
                  </span>
                </>
              ) : (
                <>
                  <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-slate-500">
                    Full draw · space or click
                  </span>
                  <button
                    ref={buttonRef}
                    onClick={release}
                    disabled={phase === "exiting"}
                    className="pointer-events-auto relative rounded-full border border-amber-400/80 bg-amber-400/5 px-7 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.18)] transition-all duration-300 hover:scale-105 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 active:scale-95"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 animate-pulse rounded-full bg-amber-400/10 blur-md"
                    />
                    Release arrow
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* fx layer: flash, shockwaves, sparks (survives the panel blast) */}
        <div ref={fxRef} className="pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}