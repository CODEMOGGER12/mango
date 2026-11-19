# MANGO

A one-page store for MANGO's handmade clay wall hooks: ten two-color variations, ¥12 each.

- The hook is a real 3D model built in code (React Three Fiber): a procedural clay puck and a swept, rolled clay hook, with a shader-based matte clay grain. Drag to turn, pinch or use the buttons to zoom, reset the view, and switch colors live.
- One WebGL renderer drives every 3D view on the page (drei `View`).
- Sections: hero, a pinned color run through all ten colorways, a configurator, a details section, the color collection, scroll typography, About and FAQ, and a footer.
- Cart drawer: add, change quantities, remove, see subtotal and total, then place an order request. No payment is taken online, and the cart is saved in the browser.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5199. `npm run build` creates the production build in `dist/`.

## Stack

React 19, TypeScript, Vite, Three.js with @react-three/fiber and @react-three/drei, Motion, and Lenis. The fonts (Schibsted Grotesk and Young Serif) are self-hosted via Fontsource.

Product notes are in `PRODUCT.md`; the design system is in `DESIGN.md`.
