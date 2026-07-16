import Link from "next/link";
import React from "react";

/**
 * Footer — the single canonical site footer.
 *
 * Merges the cosmic brand chrome (constellation, brand seal, ouroboros
 * closing line) with the practical site navigation (Journey / Navigate /
 * Platform) so visitors get both the mythology and the useful links in
 * one place.
 *
 * Pillars invoked: VII Astronomy (constellation), VIII Ancient (seal),
 * IX Philosophy (∞ closing line).
 */
export default function Footer() {
  const journey = [
    { label: "Manifesto", href: "#manifesto" },
    { label: "Artifacts", href: "#" },
    { label: "The Lexicon", href: "#" },
    { label: "Editions", href: "#" },
    { label: "Correspondence", href: "#" },
  ];

  const navigate = [
    { label: "Home", href: "/" },
    { label: "About Mission", href: "/about" },
    { label: "Pricing", href: "/pricing" },
  ];

  const platform = [
    { label: "Dashboard", href: "/admin" },
    { label: "Karma Logs", href: "/admin/karma-logs" },
    { label: "Privacy Policy", href: "#", disabled: true },
  ];

  return (
    <footer
      data-chapter="X · The Constellation"
      className="relative bg-void border-t border-gold/15 pt-22.25 pb-13.75 px-6 sm:px-10 md:px-14 overflow-hidden"
    >
      {/* ══════════════════════════════════════════════════════════════════
          DECORATIVE BACKDROP — layered "temple night sky" for the footer.
          ══════════════════════════════════════════════════════════════════ */}

      {/* 1 · Deep radial nebula wash centered on the brand seal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 28%, rgba(35,35,67,0.5) 0%, rgba(35,35,67,0.15) 40%, transparent 70%)",
        }}
      />

      {/* 2 · Warm gold shaft descending from the top-center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "conic-gradient(from 220deg at 50% -10%, transparent 0deg, rgba(198,161,91,0.10) 25deg, rgba(233,205,139,0.06) 40deg, transparent 80deg)",
        }}
      />

      {/* 3 · Concentric orbit rings emanating from the seal (SVG) */}
      <div className="pointer-events-none absolute left-1/2 top-[220px] -translate-x-1/2 -translate-y-1/2 opacity-25">
        <OrbitRings />
      </div>

      {/* 4 · Corner mandala ornaments */}
      <FooterCornerMandala className="absolute top-6 left-6 opacity-30" />
      <FooterCornerMandala className="absolute top-6 right-6 opacity-30 -scale-x-100" />
      <FooterCornerMandala className="absolute bottom-6 left-6 opacity-30 -scale-y-100" />
      <FooterCornerMandala className="absolute bottom-6 right-6 opacity-30 -scale-x-100 -scale-y-100" />

      {/* 5 · Gold hairlines at the extreme corners — architectural anchors */}
      <span aria-hidden className="pointer-events-none absolute top-0 left-0 h-px w-24 bg-linear-to-r from-gold/60 to-transparent" />
      <span aria-hidden className="pointer-events-none absolute top-0 right-0 h-px w-24 bg-linear-to-l from-gold/60 to-transparent" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-px w-24 bg-linear-to-r from-gold/40 to-transparent" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-px w-24 bg-linear-to-l from-gold/40 to-transparent" />

      {/* 6 · Ambient gold dust — very sparse specks (deterministic positions) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
        {FOOTER_DUST.map((d) => (
          <span
            key={d.id}
            className="absolute rounded-full bg-gold"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              opacity: d.opacity,
              filter: "blur(0.4px)",
            }}
          />
        ))}
      </div>

      {/* 7 · Decorative constellation strip along the top */}
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none opacity-40">
        <Constellation />
      </div>

      {/* 8 · Bottom vignette — deepens the fade into the page-end */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to top, rgba(6,6,10,0.9), transparent)",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          CONTENT
          ══════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full z-10">
        {/* Central brand mark */}
        <div className="text-center mb-22.25 flex flex-col items-center gap-6">
          <BrandSeal />
          <h3 className="font-monument text-marble uppercase tracking-[0.3em] text-lg">
            Own · Karma
          </h3>
          <p className="font-editorial italic text-stone text-base max-w-md">
            A universe of artifacts, released once. Empowering conscious
            living, mindful action, and every thread that returns.
          </p>
        </div>

        {/* Gold hairline with a diamond node */}
        <div className="gold-hairline text-center mb-14">
          <span className="w-1 h-1 bg-gold rotate-45" />
        </div>

        {/* Practical navigation grid — spans the full navbar-width canvas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 w-full">
          <NavColumn title="The Journey" items={journey} />
          <NavColumn title="Navigate" items={navigate} />
          <NavColumn title="Platform" items={platform} />
        </div>

        {/* Bottom bar — copyright left, "Every thread returns." dead-center,
            right side left empty because the Vegvísir progress sigil sits in
            the fixed bottom-right corner of the viewport. */}
        <div className="mt-13.75 pt-10 border-t border-gold/10 grid grid-cols-1 md:grid-cols-3 items-center gap-4 font-utility text-[10px] tracking-[0.28em] uppercase text-stone/70">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} · Own Karma · Edition One
          </p>
          <p className="flex items-center justify-center gap-3">
            <span className="w-1 h-1 bg-gold rotate-45" />
            Every thread returns.
            <span className="w-1 h-1 bg-gold rotate-45" />
          </p>
          {/* Right cell intentionally empty — reserved for the Vegvísir sigil. */}
          <div aria-hidden />
        </div>
      </div>
    </footer>
  );
}

// Deterministic ambient dust — computed once at module scope so server &
// client emit identical HTML (no hydration mismatch).
const FOOTER_DUST = Array.from({ length: 22 }).map((_, i) => {
  const seed = (i + 1) * 41;
  return {
    id: i,
    left: (seed * 17) % 100,
    top: (seed * 31) % 100,
    size: 1 + ((seed * 5) % 3),
    opacity: 0.15 + (((seed * 11) % 40) / 100),
  };
});

type NavItem = { label: string; href: string; disabled?: boolean };

function NavColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h4 className="utility-label text-gold mb-6">{title}</h4>
      <ul className="space-y-3">
        {items.map((item) =>
          item.disabled ? (
            <li key={item.label}>
              <span className="font-utility text-sm text-stone/50 cursor-not-allowed">
                {item.label}
              </span>
            </li>
          ) : (
            <li key={item.label}>
              <Link
                href={item.href}
                className="font-utility text-sm text-stone hover:text-gold-bright transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function BrandSeal() {
  return (
    <svg
      viewBox="-60 -60 120 120"
      className="w-24 h-24 stroke-gold"
      strokeWidth="0.9"
      fill="none"
    >
      <circle cx={0} cy={0} r={54} />
      <circle cx={0} cy={0} r={44} strokeDasharray="2 4" />
      <circle cx={0} cy={0} r={30} />

      {/* Inscription tick marks around the outer band */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x1 = (Math.cos(a) * 44).toFixed(3);
        const y1 = (Math.sin(a) * 44).toFixed(3);
        const x2 = (Math.cos(a) * 54).toFixed(3);
        const y2 = (Math.sin(a) * 54).toFixed(3);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}

      {/* Central monogram — OK woven with an ouroboros hint */}
      <path
        d="M -18 0 A 18 18 0 1 1 18 0 L 14 -4"
        stroke="var(--color-gold-bright)"
        strokeWidth="1.2"
      />
      <path d="M 18 0 L 14 4" stroke="var(--color-gold-bright)" strokeWidth="1.2" />
      <text
        x="0"
        y="1"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-monument)"
        fontSize={12}
        letterSpacing={4}
        fill="var(--color-gold-bright)"
      >
        OK
      </text>
    </svg>
  );
}

function Constellation() {
  // Fixed-seed nodes so the constellation is stable across renders.
  const nodes = [
    { x: 6, y: 62 },
    { x: 14, y: 34 },
    { x: 22, y: 68 },
    { x: 30, y: 24 },
    { x: 38, y: 50 },
    { x: 48, y: 20 },
    { x: 55, y: 72 },
    { x: 62, y: 38 },
    { x: 70, y: 60 },
    { x: 78, y: 28 },
    { x: 86, y: 66 },
    { x: 94, y: 42 },
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 7],
    [6, 8],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full stroke-gold"
      strokeWidth="0.15"
      fill="none"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          strokeOpacity="0.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 0.8 : 0.4}
          fill="var(--color-gold-bright)"
        />
      ))}
    </svg>
  );
}

/* ────────── Ambient orbit rings behind the brand seal ────────── */
function OrbitRings() {
  return (
    <svg
      viewBox="-300 -300 600 600"
      className="w-[640px] h-[640px] max-w-[130vw] max-h-[130vw] stroke-gold"
      strokeWidth="0.5"
      fill="none"
    >
      {/* Concentric circles */}
      {[120, 170, 220, 275].map((r, i) => (
        <circle
          key={r}
          cx={0}
          cy={0}
          r={r}
          strokeOpacity={0.35 - i * 0.06}
        />
      ))}
      {/* Tilted ellipse orbits — echo the hero's eclipse arcs */}
      <ellipse cx={0} cy={0} rx={260} ry={80} strokeOpacity="0.18" transform="rotate(-14)" />
      <ellipse cx={0} cy={0} rx={210} ry={55} strokeOpacity="0.14" transform="rotate(22)" />
      {/* Radial tick marks at the outermost ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x1 = (Math.cos(a) * 275).toFixed(3);
        const y1 = (Math.sin(a) * 275).toFixed(3);
        const x2 = (Math.cos(a) * 285).toFixed(3);
        const y2 = (Math.sin(a) * 285).toFixed(3);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeOpacity="0.4"
          />
        );
      })}
      {/* Cardinal dots on the outermost ring */}
      {[0, 90, 180, 270].map((deg) => {
        const a = (deg / 180) * Math.PI;
        const cx = (Math.cos(a) * 275).toFixed(3);
        const cy = (Math.sin(a) * 275).toFixed(3);
        return (
          <circle
            key={deg}
            cx={cx}
            cy={cy}
            r={2.2}
            fill="var(--color-gold-bright)"
            stroke="none"
            opacity="0.85"
          />
        );
      })}
    </svg>
  );
}

/* ────────── Corner mandala ornament (temple architecture) ────────── */
function FooterCornerMandala({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`w-16 h-16 stroke-gold/50 fill-none pointer-events-none ${className}`}
      strokeWidth="0.6"
      aria-hidden
    >
      {/* Twin arcs bending into the corner */}
      <path d="M2 40 Q2 2 40 2" />
      <path d="M10 40 Q10 10 40 10" />
      <path d="M18 40 Q18 18 40 18" />
      {/* Diamond node at the corner intersection */}
      <path d="M2 40 L14 40" />
      <path d="M40 2 L40 14" />
      <circle cx="10" cy="10" r="1.2" fill="var(--color-gold)" stroke="none" />
      <path d="M14 14 L22 22" />
      <circle cx="22" cy="22" r="0.8" fill="var(--color-gold-bright)" stroke="none" />
    </svg>
  );
}
