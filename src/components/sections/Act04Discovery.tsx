"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act04DiscoveryProps {
  /** Callback fired when visitor completes Room 4 (Legacy) and hands off to Act V. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward at Room 1. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

const ROOMS = [
  {
    id: 1,
    tag: "ROOM ONE",
    name: "SILENCE",
    text: "Every creation begins in silence.",
    video: "/videos/room1_silence.mp4",
  },
  {
    id: 2,
    tag: "ROOM TWO",
    name: "TIME",
    text: "Time never creates character. Choices do.",
    video: "/videos/room2_time.mp4",
  },
  {
    id: 3,
    tag: "ROOM THREE",
    name: "PURPOSE",
    text: "We don't make clothing. We preserve intention.",
    video: "/videos/room3_purpose.mp4",
  },
  {
    id: 4,
    tag: "ROOM FOUR",
    name: "LEGACY",
    text: "Everything fades. Meaning remains.",
    video: "/videos/room4_legacy.mp4",
  },
];

/**
 * Interactive HTML5 Gold Dust & Ambient Ripple Canvas overlay
 */
function AmbientGoldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool
    const numParticles = 45;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.4 - 0.15,
      alpha: Math.random() * 0.6 + 0.2,
      maxAlpha: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle mouse aura glow
      const grad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        280
      );
      grad.addColorStop(0, "rgba(201, 165, 90, 0.06)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render gold particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Soft pulse alpha
        p.alpha += p.pulseSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Mouse magnetic drift
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.3;
          p.y += (dy / dist) * 0.3;
        }

        // Screen wrap
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 193, 112, ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = "#C9A55A";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}

/**
 * Animated Staggered Motion Typography with 3D Tilt & Character Physics
 */
function StaggeredRoomText({
  room,
  isVisible,
}: {
  room: (typeof ROOMS)[0];
  isVisible: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const charSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // 3D Parallax tilt tracking mouse
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const rotateX = (e.clientY / innerHeight - 0.5) * -12;
      const rotateY = (e.clientX / innerWidth - 0.5) * 12;

      gsap.to(container, {
        rotateX,
        rotateY,
        duration: 1.2,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Character-by-character GSAP stagger animation
  useEffect(() => {
    const quote = quoteRef.current;
    const chars = charSpanRefs.current.filter(
      (c): c is HTMLSpanElement => c !== null
    );

    if (!quote || chars.length === 0) return;

    const ctx = gsap.context(() => {
      if (isVisible) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Reset initial states
        gsap.set(quote, { opacity: 1 });
        gsap.set(chars, {
          opacity: 0,
          y: 40,
          rotateX: -65,
          rotateY: -20,
          filter: "blur(14px)",
          scale: 1.25,
        });

        // Staggered character 3D entrance
        tl.to(chars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.1,
          stagger: 0.035,
          ease: "back.out(1.4)",
        });

        // Living floating sine wave breath per letter
        chars.forEach((char, i) => {
          gsap.to(char, {
            y: i % 2 === 0 ? -4 : 4,
            duration: 2.8 + (i % 3) * 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.1 + i * 0.03,
          });
        });
      } else {
        gsap.set(chars, {
          opacity: 0,
          y: 40,
          filter: "blur(14px)",
        });
        gsap.set(quote, { opacity: 0 });
      }
    });

    return () => ctx.revert();
  }, [isVisible]);

  // Split into words so each word never breaks mid-letter, while still
  // exposing every character to the per-letter GSAP stagger.
  const rawText = `"${room.text}"`;
  const words: { chars: string[]; startIdx: number }[] = [];
  let __charOffset = 0;
  for (const rawWord of rawText.split(" ")) {
    words.push({ chars: Array.from(rawWord), startIdx: __charOffset });
    __charOffset += rawWord.length;
  }

  return (
    <div
      ref={containerRef}
      className={`relative z-20 max-w-5xl px-6 flex flex-col items-center select-none transform-preserve-3d transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label={room.name}
    >
      {/* Subtle luxury radial background backdrop behind text */}
      <div className="absolute -inset-10 bg-radial from-black/80 via-black/40 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Quote with Letter-by-Letter 3D Stagger */}
      <div
        ref={quoteRef}
        className="relative z-10 text-center leading-tight tracking-wide opacity-0"
        style={{
          fontFamily:
            "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
        }}
      >
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light italic text-[#F4F0E8] filter drop-shadow-[0_0_25px_rgba(201,165,90,0.35)]">
          {words.map(({ chars, startIdx }, wIdx) => (
            <Fragment key={wIdx}>
              <span className="inline-block whitespace-nowrap">
                {chars.map((char, cIdx) => {
                  const globalIdx = startIdx + cIdx;
                  return (
                    <span
                      key={globalIdx}
                      ref={(el) => {
                        charSpanRefs.current[globalIdx] = el;
                      }}
                      className="inline-block transform-preserve-3d bg-gradient-to-b from-[#FFFDF9] via-[#F4F0E8] to-[#D9C496] bg-clip-text text-transparent opacity-0"
                      style={{
                        willChange: "transform, opacity, filter",
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              {wIdx < words.length - 1 && " "}
            </Fragment>
          ))}
        </h2>
      </div>
    </div>
  );
}

/**
 * ACT IV — "The Discovery" (4 Enormous Rooms)
 *
 * 4K AI Video background playback engine with ambient GLSL/Canvas particle overlay,
 * interactive 3D parallax typography, and letter-by-letter GSAP animation.
 */
export function Act04Discovery({
  onComplete,
  onBack,
  initialProgress = 0,
}: Act04DiscoveryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [room1TextVisible, setRoom1TextVisible] = useState(false);
  const transitionFiredRef = useRef(false);

  // IntersectionObserver to detect active room with high accuracy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-room-index"));
            if (!isNaN(index)) {
              setCurrentRoomIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    roomRefs.current.forEach((roomEl) => {
      if (roomEl) observer.observe(roomEl);
    });

    return () => observer.disconnect();
  }, []);

  // Room 1 text visibility reset / fallback
  useEffect(() => {
    if (currentRoomIndex === 0) {
      const v = videoRefs.current[0];
      if (v && v.currentTime >= 3.8) {
        setRoom1TextVisible(true);
      }
      const fallbackTimer = setTimeout(() => {
        setRoom1TextVisible(true);
      }, 4500);
      return () => clearTimeout(fallbackTimer);
    } else {
      setRoom1TextVisible(false);
    }
  }, [currentRoomIndex]);

  // Scroll & video control handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (initialProgress === 1) {
      requestAnimationFrame(() => {
        if (!container) return;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          container.scrollTop = maxScroll;
        }
      });
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight } = containerRef.current;
      const roomIdx = Math.min(3, Math.floor((scrollTop + clientHeight / 2) / clientHeight));

      // Play current room video and pause others
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        if (idx === roomIdx) {
          if (v.ended) {
            v.currentTime = 0;
          }
          if (v.paused) v.play().catch(() => { });
        } else {
          if (!v.paused) v.pause();
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (!container || transitionFiredRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;

      if (scrollTop <= 0 && e.deltaY < -15) {
        transitionFiredRef.current = true;
        onBack?.();
      } else if (scrollTop >= maxScroll - 20 && e.deltaY > 15) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!container || transitionFiredRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const diffY = startY - e.touches[0].clientY;

      if (scrollTop <= 0 && diffY < -40) {
        transitionFiredRef.current = true;
        onBack?.();
      } else if (scrollTop >= maxScroll - 20 && diffY > 40) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [onComplete, onBack, initialProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-y-auto bg-[#000000] select-none snap-y snap-mandatory"
      aria-label="Act IV: The Discovery"
    >
      {/* Interactive Ambient Gold Canvas */}
      <AmbientGoldCanvas />

      {/* 4 Enormous Rooms — auto-advance on video end, no scroll hints, no CTAs. */}
      {ROOMS.map((room, idx) => (
        <section
          key={room.id}
          data-room-index={idx}
          ref={(el) => {
            roomRefs.current[idx] = el;
          }}
          className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6 text-center snap-start overflow-hidden"
        >
          {/* 4K AI Video Background */}
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={room.video}
            autoPlay
            muted
            playsInline
            onTimeUpdate={(e) => {
              if (idx === 0 && e.currentTarget.currentTime >= 3.8) {
                setRoom1TextVisible(true);
              }
            }}
            onEnded={() => {
              if (idx < ROOMS.length - 1) {
                containerRef.current?.scrollTo({
                  top: (idx + 1) * window.innerHeight,
                  behavior: "smooth",
                });
              } else if (!transitionFiredRef.current) {
                transitionFiredRef.current = true;
                onComplete?.();
              }
            }}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 filter brightness-90 contrast-110 scale-105 transition-all duration-1000"
          />

          {/* Vignette & Radial Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-85 pointer-events-none z-5" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/90 pointer-events-none z-5" />

          {/* Room Motion Typography Content */}
          <StaggeredRoomText
            room={room}
            isVisible={idx === 0 ? (currentRoomIndex === 0 && room1TextVisible) : idx === currentRoomIndex}
          />
        </section>
      ))}
    </div>
  );
}
