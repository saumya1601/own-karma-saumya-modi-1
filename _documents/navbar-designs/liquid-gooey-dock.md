# Concept 5: Liquid Gooey Dock

A floating dock where links behave like organic liquid droplets that merge and deform as they get close to each other.

## Design Aesthetic
* **Organic Fluidity**: Links look like liquid mercury or gold drops.
* **Hinge Stretching**: When items pull away or hover, they stretch like viscous liquid before cleanly separating.

## Library Stack Integration
* **SVG Filters**: Uses an SVG `<filter>` block with `<feGaussianBlur>` and `<feColorMatrix>` to create a gooey metaball effect natively in HTML DOM.
* **`@react-spring/web`**: Animates the scale and position coordinates of the bubbles with natural physics springs.

## Implementation Example

See the file: [NavbarLiquidGooey.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/own%20karma/own-karma-saumya-modi-1/src/components/NavbarLiquidGooey.tsx)
