"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * HeroEclipse
 *
 * The universe opens. A background cinematic video plays the obsidian mask
 * cracking and exploding with gold dust, transitioning to the title card.
 *
 * Pillars invoked:
 *   IV Egyptian (sun disk / eclipse as central light)
 *   VII Astronomy (starfield, corona, orbital motion)
 *   IX Philosophy (∞ tagline lockup)
 */
export default function HeroEclipse() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoActive, setIsVideoActive] = useState(false);

    // Sync muted state to video element
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Start and show video after preloader dissolves (4.2s)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVideoActive(true);
            if (videoRef.current) {
                videoRef.current.play().catch(err => {
                    console.warn("Autoplay playback failed or was blocked:", err);
                });
            }
        }, 4200);

        return () => clearTimeout(timer);
    }, []);

    const easeSlow = [0.22, 0.9, 0.28, 1] as const;

    return (
        <section
            data-chapter="I · The Arrival"
            className="relative w-full h-screen min-h-[760px] overflow-hidden bg-void flex items-center justify-center"
        >
            {/* Background Cinematic Video */}
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-[1500ms] ease-out ${
                    isVideoActive ? "opacity-100" : "opacity-0"
                }`}
            >
                <source src="/pillar videos/OWN_KARMA_combined.mp4" type="video/mp4" />
            </video>

            {/* Vignette & overlay wash for text contrast */}
            <div 
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,6,10,0.95)_100%)] bg-void/35 z-5" 
                aria-hidden
            />

            {/* CTA — anchored to the lower portion of the viewport */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-32 sm:bottom-36 md:bottom-40 z-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 7.2 }}
            >
                <a
                    href="#manifesto"
                    className="group inline-flex items-center gap-4 border border-gold/50 hover:border-gold-bright px-8 py-4 font-utility text-[11px] tracking-[0.35em] uppercase text-marble hover:text-gold-bright transition-colors"
                >
                    <span>Begin the Journey</span>
                    <svg width="24" height="10" viewBox="0 0 24 10" className="stroke-current">
                        <path d="M0 5 H22 M18 1 L22 5 L18 9" fill="none" strokeWidth="1.2" />
                    </svg>
                </a>
            </motion.div>

            {/* Audio Mute/Unmute Controller */}
            <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 select-none">
                <button
                    type="button"
                    onClick={() => setIsMuted(prev => !prev)}
                    aria-label={isMuted ? "Unmute cinematic audio" : "Mute cinematic audio"}
                    className="group relative w-12 h-12 rounded-full cursor-pointer border border-gold/50 hover:border-gold-bright bg-void/50 backdrop-blur-md flex items-center justify-center transition-all duration-500 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright/60"
                >
                    {isMuted ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors group-hover:stroke-gold-bright">
                            <path d="M11 5 L6 9 H2 V15 H6 L11 19 V5 Z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-bright)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5 L6 9 H2 V15 H6 L11 19 V5 Z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className="animate-pulse" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className="animate-pulse duration-1000" />
                        </svg>
                    )}
                </button>
                <div className="pointer-events-none hidden sm:block text-left">
                    <p className="utility-label text-stone text-[9px] tracking-[0.2em]">Teaser Audio</p>
                    <p className="font-editorial italic text-gold text-[11px] mt-0.5 tracking-wider">
                        {isMuted ? "Muted" : "Playing"}
                    </p>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1.4, delay: 7.8 }}
            >
                <span className="utility-label text-[9px] text-stone">Descend</span>
                <span className="block w-px h-10 bg-gradient-to-b from-gold/70 to-transparent" />
            </motion.div>
        </section>
    );
}

