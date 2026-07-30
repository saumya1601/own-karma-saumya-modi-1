# Act VII — "The Community" (canonical spec, decisions locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT VII — THE COMMUNITY):

> Instead of "Join Newsletter", use something unexpected.  
> The page becomes black again.  
> Thousands of tiny gold particles gather and slowly form one phrase:  
> *"You were never looking for clothing."* (Fade)  
> *"You were looking for people who see the world differently."* (Fade)  
> Then, in large typography: **THE KARMA COMMUNITY**  
> No button. The words themselves are the button.  
> **Hover**: The gold particles move.  
> **Click**: Triggers transition to Act VIII.

---

## Locked decisions

- **Visual Concept**: R3F particle formation where 1,500 gold star particles gather dynamically to spell out phrases in dark space, resolving into the interactive wordmark **THE KARMA COMMUNITY**.
- **Interactive Button**: The phrase **THE KARMA COMMUNITY** is the primary call to action (no generic rectangular button).
- **Hover Reaction**: Pointer proximity force in particle vertex shader pushes gold particles away on hover and pulls them back into shape when pointer leaves.
- **Click Behavior**: Clicking the text triggers a gold particle implode/collapse animation and fires `onComplete()` to open Act VIII ("Own Your Karma").

---

## Timeline & Scene Progression

| Stage | Duration | Visual Beat & Particle Behavior |
| ----- | -------- | ------------------------------- |
| **Phrase 1** | `0.0s – 4.5s` | Particles morph into shape: *"You were never looking for clothing."* |
| **Phrase 2** | `4.5s – 9.0s` | Particles morph into shape: *"You were looking for people who see the world differently."* |
| **Community Reveal** | `9.0s+` | Particles condense into **THE KARMA COMMUNITY**. Text becomes interactive. |
| **Interactive Hover** | *On Mouseover* | Gold particles disperse and swirl around cursor position. |
| **Click Trigger** | *On Click* | Particles implode into center point → GSAP black overlay fade → fires `onComplete()`. |

---

## What Act VII is NOT

- Not a standard newsletter subscription pop-up banner.
- Not generic web form input — pure particle typography interaction.

---

## Tech to use

- `@react-three/fiber` + `three` (WebGL particle morph shader).
- `THREE.AdditiveBlending` for glowing particle accumulation.
- `GSAP` for particle progress interpolation (`uMorphProgress`).
- `Cormorant Garamond` for typography alignment.

---

## Edge cases locked

- **Reduced Motion**: Skips particle morphing; displays static gold typography with simple hover glow.
- **Mobile Touch**: Tap on **THE KARMA COMMUNITY** text triggers particle pulse and advances directly to Act VIII.
