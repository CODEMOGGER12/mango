---
name: MANGO
description: A warm studio-gray storefront where a live, hand-lumpy clay object is the only image and each colorway drenches whole viewports.
colors:
  ink: "#1c1613"
  ink-2: "#4e4540"
  paper: "#e4dfd7"
  paper-2: "#ece8e1"
  paper-3: "#d8d1c7"
  rule: "rgba(28, 22, 19, 0.16)"
  rule-strong: "rgba(28, 22, 19, 0.38)"
  dark: "#1b1411"
  on-dark: "#ede5da"
  on-dark-2: "#b3a89c"
  rule-dark: "rgba(237, 229, 218, 0.18)"
  vanilla-base: "#383533"
  vanilla-top: "#EFE8DA"
  vanilla-field: "#26231F"
  vanilla-ink: "#EFE8DA"
  matcha-base: "#9CAF88"
  matcha-top: "#EEE6D2"
  matcha-field: "#B8C6A6"
  matcha-ink: "#1F2A18"
  strawberry-base: "#F2B6BC"
  strawberry-top: "#D6323B"
  strawberry-field: "#F8D0D3"
  strawberry-ink: "#7E151C"
  ocean-base: "#2E6DB2"
  ocean-top: "#A9DDDA"
  ocean-field: "#235895"
  ocean-ink: "#D5F1EE"
  lavender-base: "#7A5DA6"
  lavender-top: "#CFBBE7"
  lavender-field: "#9178BA"
  lavender-ink: "#EFE4FA"
  sunset-base: "#EE6E5C"
  sunset-top: "#F6A13B"
  sunset-field: "#F58D70"
  sunset-ink: "#3B120B"
  peach-base: "#F3AC78"
  peach-top: "#F6D923"
  peach-field: "#F7C69E"
  peach-ink: "#4A2A0E"
  midnight-base: "#1F2A4D"
  midnight-top: "#F3F2EE"
  midnight-field: "#151C35"
  midnight-ink: "#F3F2EE"
  lemon-base: "#F4D23A"
  lemon-top: "#EF8723"
  lemon-field: "#F8E074"
  lemon-ink: "#6B2E05"
  cocoa-base: "#6A4431"
  cocoa-top: "#D9C3A4"
  cocoa-field: "#523323"
  cocoa-ink: "#F0E1CB"
typography:
  display:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(64px, 17.5vw, 340px)"
    fontWeight: 560
    lineHeight: 0.84
    letterSpacing: "-0.04em"
    fontFeature: "'ss01' on"
  headline:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(48px, 6.6vw, 112px)"
    fontWeight: 560
    lineHeight: 0.86
    letterSpacing: "-0.04em"
    fontFeature: "'ss01' on"
  title:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(40px, 4.4vw, 72px)"
    fontWeight: 560
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontFeature: "'ss01' on"
  wordmark:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "-0.05em"
  statement:
    fontFamily: "'Young Serif', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.7rem, 3.3vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.015em"
  serif-title:
    fontFamily: "'Young Serif', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(26px, 2.4vw, 38px)"
    fontWeight: 400
    lineHeight: 1
  serif-note:
    fontFamily: "'Young Serif', Georgia, 'Times New Roman', serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.18
  body:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 420
    lineHeight: 1.45
  small:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 420
    lineHeight: 1.35
  label:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  circle: "50%"
spacing:
  gutter: "clamp(16px, 1.45vw, 24px)"
  stack: "14px"
  intro: "96px"
  section: "140px"
  section-compact: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "#000000"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "56px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  stepper:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "44px"
    width: "132px"
  tool-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "44px"
  tool-button-hover:
    backgroundColor: "{colors.paper-3}"
  swatch:
    rounded: "{rounded.circle}"
  nav-solid:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "60px"
    padding: "0 clamp(16px, 1.45vw, 24px)"
  config-stage:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.none}"
  buy-widget:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "300px"
  cart-drawer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "min(460px, 100vw)"
  details-section:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.on-dark}"
    padding: "120px clamp(16px, 1.45vw, 24px) 140px"
---

# Design System: MANGO

## Overview

**Creative North Star: "The Studio Floor"**

MANGO is a warm, gray studio ground with one thing on it: a small clay piece, rendered live in WebGL, soft and slightly lopsided. The page photographs nothing. The object does every job a product photo usually does: it fronts the hero, turns in the configurator, re-colors through the color run and sits in each collection tile. The UI around it is printed, not built. Huge tight uppercase grotesk, a soft serif speaking voice, hairline rules, square edges, and no cards, so the only volume and the only shadow on the page belong to the clay.

Color works by drenching. The neutral ground stays quiet until a colorway takes over: the color run pins a full viewport and swaps its whole field and type color through all ten colorways as you scroll, and the selected colorway also tints the wordmark's clay "O", the sliding band and the buy widget's thumbnail. A colorway is never a small accent on a white card. It owns the region it touches.

Density is editorial. Sections breathe (140px vertical padding on desktop), headlines run edge to edge, and supporting copy sits in narrow columns on a 12-column grid. Motion is slow and eased: lines rise out of their own masks, words ink in with scroll, and clay colors ease between colorways rather than snapping.

**Key Characteristics:**
- One live 3D clay object as the only imagery; matte, grained, hand-irregular, never glossy.
- Warm studio-gray paper ground with brown-black ink; one dark section for contrast.
- Ten colorways, each a four-part set (base, top, field, ink) that drenches whole regions.
- Schibsted Grotesk set huge, uppercase and tight; Young Serif for the soft human voice.
- Hairline rules and inset 1px strokes instead of borders, cards or elevation.
- Square UI chrome; roundness belongs to the clay and its swatch portraits.

## Colors

A warm neutral ground with brown-black ink, interrupted by ten saturated clay colorways that arrive as full-bleed fields.

### Primary
- **Studio Ink** (#1c1613): All primary text, the solid button fill, the selection highlight, the active swatch ring and pager marks. A brown-black, never pure black at rest.
- **Ink Secondary** (#4e4540): Muted text: secondary labels, fact-list terms, FAQ questions at rest, footer fine print, hints, and the scrollbar thumb.

### Secondary
The ten colorways. Each is a fixed quartet and the four parts are used together, never mixed across colorways:
- **base**: clay color of the rounded puck; also the wordmark "O" fill when selected.
- **top**: clay color of the rolled piece on top; also the stroke inside the wordmark "O".
- **field**: the full-bleed color when the colorway owns a region (color run, band, buy-widget and cart thumbnails, collection tile hover tint at 22% mixed into Paper Raised).
- **ink**: the type color that reads on that field; in the color run it also becomes the button fill, with the field as its label color.

Vanilla (charcoal / cream), Matcha (sage / cream), Strawberry (soft pink / red), Ocean (blue / pale aqua), Lavender (purple / lilac), Sunset (coral / orange), Peach (peach / yellow), Midnight (navy / white), Lemon (yellow / orange), Cocoa (brown / beige). Vanilla is the default selected colorway and seeds the live `--sel-*` properties before React takes over.

### Neutral
- **Studio Paper** (#e4dfd7): The page ground, solid nav, drawer, tool buttons and mobile menu. Also the browser theme color.
- **Paper Raised** (#ece8e1): The quiet raised ground under the configurator stage, the buy widget body and collection tiles at rest.
- **Paper Pressed** (#d8d1c7): Hover fill for stepper and tool buttons.
- **Hairline** (rgba(28, 22, 19, 0.16)): Dividers, list rules, nav underline when solid, inset strokes on tools and the FAQ icon box.
- **Hairline Strong** (rgba(28, 22, 19, 0.38)): Emphasized rules: the configurator name row, FAQ row borders, the stepper and buy-widget outlines. The same ink at the same alpha dims the page behind the cart drawer.
- **Kiln Dark** (#1b1411): The single dark section ("Nothing has to be perfect"), where the clay is shown close up.
- **On Dark** (#ede5da) and **On Dark Muted** (#b3a89c): Type on Kiln Dark; **Hairline Dark** (rgba(237, 229, 218, 0.18)) for its list rules.

### Named Rules
**The Drench Rule.** A colorway appears as a whole field with its own ink on top, or as clay. It never appears as a small accent chip on the neutral ground (the round swatch, which is a portrait of the clay, is the one exception).

**The Quartet Rule.** Base, top, field and ink travel together. Never set one colorway's ink on another colorway's field.

## Typography

**Display Font:** Schibsted Grotesk Variable (with Helvetica Neue, Arial)
**Body Font:** Schibsted Grotesk Variable (with Helvetica Neue, Arial)
**Serif Voice:** Young Serif (with Georgia, Times New Roman)

**Character:** A heavy-but-not-bold grotesk at weight 560, uppercase and squeezed to -0.04em with the `ss01` stylistic set, does the shouting at poster scale. Young Serif, round and a little lumpy itself, carries every sentence meant to sound like a person talking.

### Hierarchy
- **Display** (560, clamp(64px, 17.5vw, 340px), 0.84, uppercase): The hero line and the color-run names, spanning the full gutter-to-gutter width. The manifesto (clamp(56px, 13.6vw, 260px), 0.92) and the band (clamp(56px, 11vw, 200px)) use the same face at nearby sizes.
- **Headline** (560, clamp(48px, 6.6vw, 112px), 0.86, uppercase): Section titles in the dark details section and About. The color-run title sits slightly smaller (clamp(36px, 5.2vw, 88px)).
- **Title** (560, clamp(40px, 4.4vw, 72px), 0.9, uppercase): The selected colorway's name in the configurator.
- **Wordmark** (760, 28px in the nav, 24px on mobile, -0.05em): MANGO, with the final O replaced by a pressed pebble of clay in the live colorway. The footer repeats it at 25.4vw.
- **Statement** (Young Serif 400, clamp(1.7rem, 3.3vw, 3.2rem), 1.06, balanced wrap): Section intros and the soft lines of copy. Sentence case only.
- **Serif Title** (Young Serif 400, clamp(26px, 2.4vw, 38px), 1): Detail-list headings; FAQ questions use the same voice at clamp(24px, 2.6vw, 38px).
- **Serif Note** (Young Serif 400, 22px, 1.18): The colorway's one-line note in the configurator and color run.
- **Body** (420, 16px, 1.45): Running text. Long-form paragraphs cap at 52 to 60ch.
- **Small** (420, 14px, 1.35): Hints, counters, cart meta.
- **Label** (500, 14px, 0.01em, uppercase): Form-field labels only ("Color", "Quantity").

Prices and counters use tabular numerals throughout.

### Named Rules
**The Two Voices Rule.** Grotesk shouts in uppercase; the serif speaks in sentence case. Never set Young Serif in uppercase, never set a full sentence of body copy in the display style.

**The Edge-to-Edge Rule.** Display type is sized in viewport units so it spans the gutters; the live object is allowed to sit in front of it.

## Layout

A 12-column grid with a fluid gutter (clamp(16px, 1.45vw, 24px)) used as both column gap and page margin. Sections stack with 140px vertical padding (96px under 720px); section intros put a serif statement across columns 4 to 11 with 96px below (48px on mobile). Content splits are asymmetric: configurator stage 8 columns with a 4-column panel, about title 6 and body 6, footer tag 5 with three 2-column link groups.

The nav is a fixed 60px bar (56px on mobile), a three-column grid with links left, the wordmark centered and About and Cart right. It is transparent over the hero and turns solid paper with a hairline once the page scrolls past 24px.

Full-viewport moments use `100svh`: the hero (min 620px, max 1100px), the pinned color run (a 640vh scroll track holding one sticky viewport), and the dark details section. The configurator stage is sticky beside its panel on desktop. The collection is a horizontal scroll-snap track with 6px gaps showing three tiles (two under 1024px, 78vw tiles on mobile) and a Prev / bars / Next pager.

Breakpoints: at 1024px the asymmetric splits collapse to full width; at 720px the nav links fold into a Menu button with a full-width uppercase list, the buy widget stretches edge to edge, and display sizes switch to fixed vw values.

One WebGL canvas, fixed behind the page, draws every 3D view by scissoring into DOM-tracked regions, so any number of object views can appear without extra GL contexts.

## Elevation & Depth

The UI is flat. Depth on the page comes from exactly two sources: the clay object, lit as a studio still life, and the cart drawer's scrim. There are no drop shadows on any UI element. Where an edge is needed, a 1px hairline does it, usually as an inset box-shadow so it adds no layout weight.

The 3D stage uses a soft hemisphere light (#fff7ee sky, #7d736a ground, 1.35), one shadow-casting warm key (#fff4e8, 2.3) from upper left, a warm rim (#ffe6cf, 0.9) from behind right, and a faint cool fill (#f1f4ff, 0.4). The object sits on an invisible shadow-catching floor (shadow opacity 0.22 by default, 0.3 in the color run, 0.5 in the dark section) plus a radial contact blob at 0.32 opacity. Neutral tone mapping keeps the clay colors true to the colorway hex.

### Shadow Vocabulary
- **Hairline inset** (`box-shadow: inset 0 0 0 1px var(--rule)`): Tool buttons and the FAQ icon box.
- **Hairline inset strong** (`box-shadow: inset 0 0 0 1px var(--rule-strong)`): The stepper outline.
- **Ghost outline** (`box-shadow: inset 0 0 0 1px currentColor`): The ghost button.
- **Nav underline** (`box-shadow: 0 1px 0 var(--rule)`): The solid nav and mobile menu bottom edge.
- **Scrim** (`background: rgba(28, 22, 19, 0.38)`): Behind the cart drawer.

### Named Rules
**The Only Shadow Rule.** The clay casts the only shadows. UI surfaces separate by tone (Paper, Paper Raised, Kiln Dark) and hairlines, never by elevation.

## Shapes

UI chrome is square: buttons, tools, the stepper, the buy widget, the drawer, the configurator stage and collection tiles all have 0 radius. Roundness is reserved for the clay itself and for things that portray it: the round color swatches (a circle split diagonally into base and top at -35 degrees, with a faint ink ring) and their 1.5px selection ring, and the wordmark's clay "O". Icons are one family: 24px grid, 1.5 stroke, square caps, drawn inline.

The object geometry is procedural: a lathe-profiled puck pressed out of round with seeded noise, plus a thick rolled log swept along a bent curve, one end planted in the puck and the other cantilevered past its edge. Each colorway has its own seed, so no two pieces share a silhouette. The material is a matte physical clay (roughness 0.86, soft white sheen 0.55, low specular) with a shader-computed micro-surface of fine grain, soft ridges and the odd pit, applied without textures or UVs.

### Named Rules
**The Square Chrome Rule.** If it is interface, it has square corners. If it is clay, or a picture of clay, it is round and irregular.

## Components

### Buttons
Solid, square and calm, with the arrow doing the moving.
- **Shape:** Square (0px), minimum 56px tall (48 to 50px on mobile), 20px side padding, label left and icon right with space between.
- **Primary:** Studio Ink fill with Studio Paper label, weight 520, 16px.
- **Hover / Focus:** Fill deepens to black over 0.3s; the trailing arrow slides 4px right on the shared ease-out curve. Focus is a 2px currentColor outline at 3px offset, site-wide.
- **Ghost:** Transparent with a 1px currentColor inset outline; fills with ink on hover. Used for the empty-cart "Continue shopping" action.
- **Drenched (color run):** The button takes the colorway's ink as fill and its field as label color, cross-fading with the field over 0.8s.
- **Disabled:** 40% opacity.

### Text Links
- **Style:** Plain inherited text with a 1px underline drawn from the right and erased to the left over 0.45s on hover. Used for nav items, Cart (n), Close, Add to cart in the buy widget, pager controls and footer links.

### Chips (Color Swatches)
- **Style:** A 5-column grid of round clay portraits, each a circle of the base color with the top color filling a rotated half.
- **State:** Hover scales the swatch to 1.06; the selected swatch gets a 1.5px Studio Ink ring 4px outside it that scales in from 0.92. Arrow keys move selection (radiogroup).

### Cards / Containers
There are no cards. Regions are grounds, not boxes.
- **Corner Style:** Square (0px).
- **Background:** Paper Raised for the configurator stage and tile media; a colorway field for thumbnails.
- **Shadow Strategy:** None; see Elevation & Depth.
- **Border:** Hairline rules between list rows (configurator facts, detail list, cart lines, FAQ rows) rather than boxes around content.
- **Internal Padding:** Rows use 12 to 22px vertical padding and no horizontal padding.

### Inputs / Fields
- **Stepper:** Three 44px square cells (minus, count, plus) in a Hairline Strong inset outline; 56px tall beside the primary button in the configurator, 36px in the cart. Cells fill Paper Pressed on hover; disabled ends drop to 30% opacity.

### Navigation
- **Style:** Fixed 60px bar, 15px links, centered wordmark. Transparent over the hero, then solid Studio Paper with a hairline underline. The cart count hops 5px when an item is added.
- **Mobile:** Links collapse into a Menu / Close text button revealing a full-width list of 32px uppercase grotesk links separated by hairlines.

### Color Run (Signature)
A pinned, drenched viewport. As the visitor scrolls a 640vh track, the sticky viewport's background and type color cross-fade (0.8s, ease-in-out) through all ten colorway field and ink pairs while the object re-colors and turns up to one and a half revolutions. The colorway name rises in at display size from the bottom (40% travel, 0.9s) while the previous one exits upward. A row of ten 2px tick buttons (4px when current) jumps between colorways; the side column holds the serif note and the drenched add button.

### Buy Widget
A floating 300px square card pinned bottom-right: a 76px colorway-field thumbnail holding a flat side-view glyph of the object, then name, price and two text links (Close, Add to cart) on Paper Raised with a Hairline Strong outline. It rises in from 24px below over 0.5s and steps aside while the color run, configurator, details, collection, FAQ or footer is on screen, or the cart is open.

### Cart Drawer
A square panel up to 460px wide sliding in from the right over 0.65s on the shared ease-out curve, over a 38% ink scrim. Header matches the nav height; lines are hairline-separated rows with a field-colored square thumbnail, a small stepper and a tabular total.

## Do's and Don'ts

### Do:
- **Do** render the product only as the live clay object (or its flat glyph in small UI); let it overlap display type.
- **Do** use a colorway as a full field with its own ink (The Drench Rule), cross-fading over 0.8s with the ease-in-out curve when it changes.
- **Do** set headlines in Schibsted Grotesk 560, uppercase, -0.04em, sized in viewport units to span the gutters.
- **Do** give every human-sounding sentence to Young Serif in sentence case.
- **Do** separate content with 1px hairlines (Hairline or Hairline Strong) and tonal grounds.
- **Do** keep all interface corners square (0px) and icons in the single 1.5-stroke, square-cap family.
- **Do** reveal headlines line by line from their own masks (1.15s, 85ms stagger) and honor reduced motion by collapsing all durations.
- **Do** use tabular numerals for prices, counts and request numbers.

### Don't:
- **Don't** add drop shadows or elevation to UI; the clay casts the only shadows.
- **Don't** put content in rounded cards or pastel-gradient tiles; the build has no cards.
- **Don't** use photographs, downloaded models or pre-rendered images of the object.
- **Don't** make the clay glossy, smooth or perfectly symmetric; keep it matte and irregular.
- **Don't** mix one colorway's ink with another colorway's field (The Quartet Rule).
- **Don't** set Young Serif in uppercase, or body paragraphs in the display style.
- **Don't** use pure black or pure white as the page ground or text color at rest; use Studio Ink and Studio Paper.
