# Luxurious Color Palette: Gold, White, & Black

A strict design system palette to ensure all navigation components maintain a cohesive, high-end, premium aesthetic.

---

## 1. Core Color Spectrum

| Tone | Hex Code / Tailwind Token | Description | Best Use Cases |
| :--- | :--- | :--- | :--- |
| **Obsidian Black** | `#020617` (`slate-950`); `#090D16`; `#000000` (Pure Black) | Matte, deep space black or obsidian stone textures. | Main bar backgrounds, card panels, backdrop grids, and text on active gold. |
| **Ivory White** | `#FAF9F6` (Ivory); `#F1F5F9` (`slate-100`); `#FFFFFF` (Pure White) | Crisp off-white, creamy ivory, or light silver. | Inactive icons, subheadings, coordinate readouts, hover highlights. |
| **Molten Gold** | `#F59E0B` (`amber-500`); `#D4AF37` (Metallic Gold); `#C5A059` (Soft Gold/Bronze) | Glowing metallic gold leaf or liquid brass. | Active tabs, borders, glow rings, astrolabe ticks, and particle grids. |

---

## 2. Interactive States & Hover Behaviors

* **Default / Inactive State**:
  * Background: Slate/Obsidian Black (`bg-slate-950` or `bg-slate-900`).
  * Text / Icons: Faint Slate Gray or White (`text-slate-400` or `text-slate-500`).
  * Borders: Hairline gold opacity (`border-amber-500/15`).
* **Hover State**:
  * Text / Icons: Shift to warm white or soft gold (`hover:text-amber-100` / `hover:text-slate-200`).
  * Border / Glow: Mild gold highlight (`hover:border-amber-500/40`).
* **Active / Selected State**:
  * Option A (Inverted): Solid gold background with dark icon (`bg-amber-400 text-slate-950`) and a heavy gold shadow halo.
  * Option B (Holographic): Faint gold tint background (`bg-amber-500/10`), bold gold border, and gold text (`text-amber-300`).

---

## 3. Reference Implementation Files

* [NavbarUniverse.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/own%20karma/own-karma-saumya-modi-1/src/components/NavbarUniverse.tsx) (concentric orbits using Gold/White/Black planets)
* [NavbarOrigamiFold.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/own%20karma/own-karma-saumya-modi-1/src/components/NavbarOrigamiFold.tsx) (nested 3D panels in Matte Black & Gold Console)
* [NavbarCyberHUD.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/own%20karma/own-karma-saumya-modi-1/src/components/NavbarCyberHUD.tsx) (Vector golden grids on obsidian)
