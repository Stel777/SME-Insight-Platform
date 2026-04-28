# DESIGN.md — SME Insight Platform

A design system specification for the SME Insight Platform.
Audience: PwC colleagues + university supervisor. Tone: authoritative, editorial, data-forward.

---

## Identity

**Project:** SME Insight Platform
**Brand mark:** "by Stel" — lowercase, badge treatment, right of logo
**Tagline:** Greek SME Market Intelligence
**Aesthetic:** Editorial intelligence — think The Economist meets a premium data product. Structured, confident, no decoration for decoration's sake.

---

## Color Palette

```css
--accent:       #F85519;   /* Orange — primary action, active state, brand accent */
--ink:          #111111;   /* Near-black — primary text, headings */
--ink-2:        #444444;   /* Secondary text, metadata */
--ink-3:        #888888;   /* Muted text, labels */
--border:       #E8E8E8;   /* Subtle borders, dividers */
--bg:           #FFFFFF;   /* Page background */
--bg-soft:      #F6F6F4;   /* Card/panel background (warm white) */
--bg-panel:     #F0EEE9;   /* Slightly deeper panel (sidebar, inspector) */
--success:      #1A7A4A;   /* Positive indicators */
--warning:      #D4820A;   /* Caution, tariff/risk signals */
```

**Accent usage rule:** Orange (`--accent`) is used only for:
- Active tab indicator
- CTA buttons and links
- Data highlights worth calling out
- Brand mark
Never use orange for decorative elements or backgrounds.

---

## Typography

```css
font-family: 'Inter', system-ui, sans-serif;  /* Body, UI, metadata */
```

**Scale:**
| Role | Size | Weight | Line-height |
|------|------|--------|-------------|
| Page title | 28px | 700 | 1.2 |
| Section heading | 18px | 600 | 1.3 |
| Card headline | 15px | 600 | 1.4 |
| Body / paragraph | 14px | 400 | 1.6 |
| Metadata / caption | 12px | 400 | 1.5 |
| Data callout (KPI) | 32–40px | 700 | 1.0 |
| Tag / label | 11px | 500 | — |

**Rules:**
- No text below 11px
- Headlines never wrap beyond 2 lines in card contexts
- All-caps used only for section labels/tags (letter-spacing: 0.06em)
- Data callout numbers use tabular-nums

---

## Spacing

```css
--space-xs:   4px;
--space-sm:   8px;
--space-md:   16px;
--space-lg:   24px;
--space-xl:   40px;
--space-2xl:  64px;
```

**Principles:**
- Cards: 20px internal padding
- Section gaps: 32–40px
- Topbar: 56px height
- Sidebar/Inspector: 310px width

---

## Elevation & Depth

No drop shadows on cards — use border (`1px solid var(--border)`) instead.
Active/hover states use `box-shadow: 0 2px 12px rgba(0,0,0,0.08)` sparingly.
Inspector panel: `background: var(--bg-panel)`, subtle left border in accent on active node.

---

## Components

### Tabs
- Inactive: `color: var(--ink-3)`, no underline
- Active: `color: var(--ink)`, `border-bottom: 2px solid var(--accent)`
- Hover: `color: var(--ink-2)`
- Tab bar: `border-bottom: 1px solid var(--border)`

### Cards
- Background: `var(--bg-soft)`
- Border: `1px solid var(--border)`
- Border-radius: `10px`
- Padding: `20px`
- No shadows by default

### KPI / Metric Tiles
- Large number (32–40px, 700 weight) in `var(--ink)`
- Label below in 12px, `var(--ink-3)`
- Trend indicator: coloured dot or arrow, never text-heavy
- Max 3 KPIs per row

### Tags / Badges
- Font: 11px, 500 weight, all-caps, letter-spacing 0.06em
- Background: semi-transparent tint of tag colour (0.12 alpha)
- Border-radius: 4px
- Padding: 2px 7px

### Buttons
- Primary: `background: var(--accent)`, white text, `border-radius: 6px`, `padding: 8px 18px`
- Ghost: transparent, `border: 1px solid var(--border)`, `color: var(--ink-2)`
- Active/hover primary: slight darkening via `filter: brightness(0.92)`

### Ticker (Market Insights)
- Dark background strip (`#111`)
- White text, orange source labels
- Fades to transparent at edges via gradient mask
- 55s linear infinite scroll

### Article Grid
- 3 columns desktop, 2 at 1100px, 1 at 780px
- Cards: white bg, border, 10px radius
- Footer: source, date, tag — muted styling

---

## Motion

**Principles:**
- Prefer CSS transitions over JS animation
- Duration: 150ms for micro (hover), 250ms for panels, 350ms for page-level
- Easing: `ease-out` for entrances, `ease-in` for exits
- Never animate layout shifts (no `width`/`height` in transitions)

**Allowed animations:**
- Ticker: `ticker-move` keyframe (CSS, 55s linear infinite)
- Tab switch: content fade-in `opacity 0→1`, 200ms
- Inspector open: slide-in from right, 250ms ease-out
- KPI tiles: staggered fade on first load (animation-delay 0, 80ms, 160ms, 240ms)
- Hover on cards: `transform: translateY(-2px)`, 150ms ease-out

---

## Layout Grid

**Page structure:**
```
[Topbar 56px]
[Tab bar 48px]
[Main content area — fills remaining viewport]
```

**Dashboard Hero layout:**
```
[KPI row — 4 tiles, equal width]
[2-column: Opportunity Radar (60%) | Confidence tiles (40%)]
[Sector lens (full width, tabbed)]
```

**SME Brain layout:**
```
[Search bar — full width]
[2-column: Graph canvas (fluid) | Inspector (310px fixed)]
```

**Market Insights layout:**
```
[Ticker strip — full width]
[Category filter pills]
[3-column article grid]
```

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for all body text
- All interactive elements keyboard-focusable
- Focus ring: `outline: 2px solid var(--accent)`, `outline-offset: 2px`
- `aria-label` on icon-only buttons
- Colour never used as the only differentiator

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use orange sparingly as a signal | Use orange as a background fill |
| Let data breathe with whitespace | Cram multiple insights per card |
| Use `var(--border)` for structure | Use drop shadows for elevation |
| Keep body text at 14px / 400 | Use light font weights for body text |
| Tag with short all-caps labels | Write long descriptive tags |
| Stagger animations for hierarchy | Animate everything at once |
