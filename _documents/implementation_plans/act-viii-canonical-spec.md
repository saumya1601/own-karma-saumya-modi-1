# Act VIII — "Own Your Karma" & Final Screen (canonical spec, decisions locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT VIII — OWN YOUR KARMA & FINAL SCREEN):

> A floating glass panel emerges. Minimal. No borders. Only soft light.  
> Instead of asking only for contact details, make it feel like the first page of a story.  
> **WELCOME**: *"This is where your story begins."*  
> **Fields**: Name, Email, One word... *"Who are you becoming?"*  
> **Button**: `ENTER` *(Not "Submit", not "Join", not "Sign Up")*  
>  
> **FINAL SCREEN** (After submission):  
> Fade to black. One final sentence appears:  
> *"Every choice creates a story. This is yours."*  
> **OWN KARMA** *(Then fade out)*

---

## Locked decisions

- **UI Architecture**: Minimalist floating glassmorphism card (`backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl`).
- **Form Fields**:
  1. `Name` (Text input)
  2. `Email` (Email input)
  3. `Who are you becoming?` (Reflective single-word / short phrase input)
- **Primary CTA Button**: `ENTER` (Subtle gold border, ivory text, gold hover glow).
- **Final Ritual Screen**:
  - Upon clicking `ENTER`, the form panel smoothly dissolves (`opacity: 1 → 0` over 1.0s).
  - Background drops to pure black.
  - Final statement fades in:
    > *"Every choice creates a story.*  
    > *This is yours."*
  - Followed by the **OWN KARMA** emblem & wordmark in warm gold.
  - Slow final fade to dark resting state.

---

## Flow & Sequence Map

| Phase | Component / Visual State | Action / User Interaction |
| ----- | ------------------------ | ------------------------- |
| **1. Entrance** | Glass panel floats up from bottom center. | Soft backlight pulse. Form fields gain focus. |
| **2. Form Input** | Minimal underline inputs with gold focus rings. | Visitor enters Name, Email, and *"Who are you becoming?"*. |
| **3. Submission** | Visitor clicks `ENTER`. | Form validates, GSAP fades out glass panel. |
| **4. Final Screen** | Pure black screen. | Final text fades in: *"Every choice creates a story. This is yours."* |
| **5. Emblem Fade** | OWN KARMA emblem + wordmark glow. | Holds for 4 seconds, then gently dims to resting ambient void. |

---

## What Act VIII is NOT

- Not a standard checkout or high-friction marketing capture form — it feels like opening the first page of a sacred journal.
- No "Thank You!" message — replaced with the poetic final ritual screen.

---

## Tech to use

- `Next.js` client component with React form state.
- `Tailwind CSS` for glassmorphism styling (`backdrop-blur`, subtle borders, gold accents).
- `GSAP` / `motion/react` for smooth panel transitions and final screen text fades.
- `Cormorant Garamond` for display typography.

---

## Edge cases locked

- **Form Validation**: Clean inline warning if email format is invalid, maintaining luxury aesthetic without ugly red browser alerts.
- **Submission Fallback**: Client-side state handling with optional API endpoint hook (`/api/community/join`).
