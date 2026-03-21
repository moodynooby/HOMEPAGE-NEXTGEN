# Design System: The Editorial Monograph

## 1. Overview & Creative North Star
**Creative North Star: "The Living Archive"**

This design system is not merely a "vintage theme"—it is a high-end digital broadsheet that translates the tactile authority of 1920s print journalism into a premium web experience. We reject the "template" look of modern SaaS by embracing intentional asymmetry, dense information hierarchies, and a "paper-first" philosophy. 

The system moves beyond the flat screen by treating the UI as a series of physical, ink-pressed layers. We break the rigid digital grid through the use of multi-column editorial layouts, varying headline weights, and "The Masthead" header logic. Every interaction should feel like an intentional act of curation—authoritative, human, and deeply historical.

## 2. Colors
Our palette is rooted in the chemistry of early 20th-century printing: iron-gall ink and wood-pulp parchment. 

### The Palette Logic
*   **Background & Surfaces:** We use a spectrum of warm neutrals (#fdffda to #eae9d9) to simulate aging paper. Use `surface` for the primary canvas and `surface-container` tiers to create subtle, ink-wash depth.
*   **Primary/Ink:** `primary` (#5f5e5e) and `on-surface` (#38392e) act as our "Ink Black." These are never true hex #000; they retain a slight organic softness to avoid digital eye strain.
*   **Secondary/Sepia:** `secondary` (#7d5d53) provides the warmth of a vintage photograph or a wax seal. Use this for accents that require a human touch.

### The "No-Line" & "Ghost Border" Rules
Standard 1px solid borders are strictly prohibited for sectioning content. 
*   **Tonal Definition:** Use `surface-container-low` sections against a `surface` background to define boundaries. 
*   **The Ghost Border:** If a boundary is required for accessibility, use the `outline-variant` token at **10% opacity**. It should feel like a faint indentation in the paper, not a digital stroke.

### Signature Textures
While the colors provide the base, apply a subtle noise texture (grain) to `surface` backgrounds. For primary CTAs, use a linear gradient transitioning from `primary` to `primary-dim` to simulate the slight unevenness of a heavy ink press.

## 3. Typography
Typography is the backbone of this system. It is the primary tool for conveying hierarchy, replacing the need for heavy UI containers.

*   **Display (Newsreader):** Our "Masthead" font. Use `display-lg` for high-impact editorial moments. It should feel loud yet sophisticated.
*   **Headline (Newsreader):** Used for article titles and section headers. High-contrast serif evokes the "Golden Age" of broadsheets.
*   **Title & Body (Noto Serif):** Our "Workhorse." This provides the legibility of a classic book. `body-lg` is your standard reading weight.
*   **Label (Work Sans):** A subtle nod to the sans-serif typefaces used in early 20th-century classifieds and telegrams. Use this for metadata, captions, and functional UI elements to provide a modern, legible contrast to the serif-heavy layout.

## 4. Elevation & Depth
In a newspaper, depth is created by stacking sheets. In this system, we use **Tonal Layering** instead of shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-high` section. The shift in "paper age" (brightness) creates a natural lift.
*   **Ambient Shadows:** If an element must "float" (like a dropdown or modal), use a wide, diffused shadow (32px+ blur) at 5% opacity using the `on-surface` tint. 
*   **Glassmorphism (The "Vellum" Effect):** For floating navigation or tooltips, use `surface` at 85% opacity with a `12px` backdrop-blur. This simulates semi-transparent vellum paper, allowing the underlying "newsprint" to bleed through.

## 5. Components

### Buttons
*   **Primary:** High-contrast `on-primary` text on `primary` background. Sharp 0px corners. No shadows.
*   **Secondary:** `outline` frame (at 20% opacity) with `primary` text.
*   **Tertiary:** Pure text with `label-md` styling and a 1px `primary` underline (the "Hairline Rule") that expands on hover.

### Cards & Lists
*   **Forbid Divider Lines:** Separate list items using `1.75rem` (Spacing 8) of vertical white space or a subtle shift to `surface-container-lowest`.
*   **Layout:** Use multi-column text flows within cards to mimic newspaper snippets.

### Input Fields
*   **Styling:** A bottom-only "Hairline Rule" using the `outline` token. No containers. 
*   **State:** On focus, the line transitions to `primary` and the label (using `label-sm`) shifts to a subtle `secondary` sepia.

### The "Masthead" Component
A mandatory top-level component. It must use `display-lg` typography, centered, with two horizontal "Hairline Rules" (`outline-variant` at 20%) above and below, containing the date and edition (metadata) in `label-sm`.

### Additional Component: The "Pull Quote"
A stylized container for emphasized content. Use `headline-sm`, italicized, with a heavy `secondary` left-border (3px) to draw the eye without cluttering the page.

## 6. Do's and Don'ts

### Do:
*   **Embrace Whitespace:** Use the spacing scale (specifically `20` and `24`) to let the "ink" breathe.
*   **Use Asymmetry:** Balance a heavy headline on the left with a lighter multi-column body block on the right.
*   **Type-First Hierarchy:** Always try to solve a layout problem with typography scale before adding a box or a background color.

### Don't:
*   **No Rounded Corners:** `0px` is the absolute rule. Rounded corners break the "cut paper" aesthetic.
*   **No Heavy Shadows:** Shadows are a modern digital crutch. Use color shifts instead.
*   **No Pure Black:** Avoid `#000000`. Use the `on-surface` (#38392e) to keep the "organic ink" feel.
*   **No Center-Alignment for Body Text:** Always left-align or justify (with high-quality hyphenation) to maintain the editorial grid.