# Sam Ngo — Design System

A portable design spec for any repo that should match the visual identity of `sampi314.github.io`. Reference this file from another repo's `CLAUDE.md` so visual decisions stay consistent across projects.

> **For Claude in another repo:** treat the values in this document as binding constraints, not suggestions. If a request conflicts with these (e.g. "use a blue button"), surface the conflict before deviating.

---

## 1. Identity

- **Personality:** technical, precise, craft-focused. Reads as an engineer's portfolio, not a marketing site.
- **Voice:** outcome-first, jargon last. Headlines tell readers what they get from clicking, not what's inside.
- **Visual register:** dark canvas, single warm accent, no decorative gradients beyond the accent itself. Negative space is the primary layout tool.

## 2. Color Palette

The palette is **monochromatic with one accent**. All interactive elements (links, buttons, focus rings, badges, chart highlights) use the accent. Never introduce a second hue without a documented reason.

### Accent triplet

The system uses a **three-variable triplet** for every accent application:

```css
--accent          /* base color — solid fills, text, borders */
--accent-hover    /* brighter sibling — hover, active states */
--accent-glow     /* rgba with low alpha — halos, soft backgrounds */
```

When you need an alpha-channel composition (shadow, gradient, soft background), use `--accent-glow` rather than re-deriving an rgba from `--accent`. This keeps the alpha consistent across the system.

### Dark theme (default)

```css
:root {
    --bg-primary:    #000000;
    --bg-card:       #13131a;
    --bg-card-alt:   #1a1a24;
    --text-primary:  #e8e8ed;
    --text-secondary:#9ca3af;
    --text-muted:    #6b7280;

    --accent:        #FF6B00;
    --accent-hover:  #FF8C42;
    --accent-glow:   rgba(255, 107, 0, 0.15);

    --border:        #1f1f2e;
    --border-strong: #2a2a3a;
}
```

### Light theme

Light theme uses a **darker shade** of the same hue for legibility on cream backgrounds. The dark-mode `--accent-hover` doubles as the light-mode `--accent` — preserving the relationship.

```css
[data-theme="light"] {
    --bg-primary:    #f5f5f0;
    --bg-card:       #ffffff;
    --bg-card-alt:   #f0efe8;
    --text-primary:  #1a1a1f;
    --text-secondary:#4a4a55;
    --text-muted:    #8a8a95;

    --accent:        #D95A00;
    --accent-hover:  #FF6B00;
    --accent-glow:   rgba(217, 90, 0, 0.10);

    --border:        #e8e6e1;
    --border-strong: #d0cdc6;
}
```

### Forbidden

- Don't use yellow (`#f59e0b`, `#fbbf24`) — the brand recolored from amber to orange. Treat any yellow-amber in inherited code as a bug.
- Don't use multi-stop gradients except on the accent itself, and even then only as a subtle triplet `accent → accent-hover → accent`.
- Don't introduce blue/green/red for status (success/error). Use the accent for emphasis and `var(--text-muted)` for de-emphasis. If you absolutely need a status color, ask first.

## 3. Typography

Three font families, each with one job:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

| Family | Use for | Why |
|---|---|---|
| **Outfit** | All body copy, headings, UI text | Modern geometric sans with strong number glyphs — reads as analytical without being clinical |
| **Space Mono** | Brand marks, nav, callouts, tags | Adds technical texture; signals "this person codes" |
| **JetBrains Mono** | Code blocks, formulas, inline `code` | Designed for code; ligatures off |

### Scale

```css
html { font-size: 18px; }    /* base rem unit */
body { line-height: 1.65; }  /* generous for reading */

h1 { font-size: 2.5rem;  font-weight: 600; }
h2 { font-size: 1.75rem; font-weight: 600; }
h3 { font-size: 1.25rem; font-weight: 600; }
h4 { font-size: 1rem;    font-weight: 600; }

.meta  { font-size: 0.875rem; color: var(--text-secondary); }
.small { font-size: 0.75rem;  color: var(--text-muted); }
```

CJK characters (e.g. 吳 in the favicon) use a system stack to avoid web-font failures in sandboxed contexts:

```css
font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'Heiti TC', 'Hiragino Sans GB', sans-serif;
```

## 4. Spacing & Layout

- **Container max-width:** `1100px`, centered with `margin: 0 auto`.
- **Section padding:** `80px 32px` on desktop, `60px 20px` on mobile.
- **Vertical rhythm:** multiples of `8px`. Never use arbitrary values like `7px` or `13px`.
- **Border radius:** `4px` for small elements (badges, inputs), `8-12px` for cards, `4px` for the favicon canvas. Never `50px+` "pill" buttons except for focused CTAs.
- **Shadow philosophy:** shadows on dark backgrounds use the accent at low alpha (`var(--accent-glow)`), not black. Black shadows on black backgrounds are invisible; orange-tinted shadows give cards a warm halo.

## 5. Components

Minimal CSS skeletons. Compose, don't fork.

### Card

```css
.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 20px var(--accent-glow);
}
```

### Button — primary

```css
.btn-primary {
    background: var(--accent);
    color: #0a0a0f;          /* black-on-orange, not white */
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-weight: 600;
}
.btn-primary:hover {
    background: var(--accent-hover);
    box-shadow: 0 4px 20px rgba(255, 107, 0, 0.3);
}
```

**Why black text on orange, not white:** orange and white have insufficient contrast (~2.8:1 on `#FF6B00`). Black on orange passes WCAG AA (~9:1). Don't switch to white text on accent buttons.

### Tag / badge

```css
.tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    background: var(--tag-bg);
    color: var(--tag-text);
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}
```

### Hero — see §6, this pattern is load-bearing across every site

## 6. Hero Section — required on every site

The hero is the **signature surface** of the visual identity. Every site in this system has one with the same anatomy. Don't omit it, don't replace it with a stock illustration, and don't flatten the layered composition into a single image-on-background.

### Anatomy (four stacked z-layers)

```
z: 0   <header> background — solid theme color
z: 0   ::before / ::after — two animated orbit rings (decorative)
z: 0   <canvas> — particle layer (JS-driven, optional but characteristic)
z: 1   .hero-inner — content grid (text + photo)
```

Skipping the orbits or the particle layer flattens the look and the hero stops feeling like *this* identity. Keep all four.

### HTML scaffold

```html
<header>
    <canvas id="hero-particles" class="hero-canvas"></canvas>
    <div class="hero-inner">
        <div class="hero-text">
            <div class="hero-label">Senior Analyst</div>     <!-- eyebrow w/ dash rule -->
            <h1>Sam <em>Ngo</em></h1>                         <!-- accent on surname -->
            <p class="headline">One-sentence value statement.</p>
            <p class="location">Sydney, NSW — Australia</p>
            <div class="header-actions">
                <a class="btn btn-primary">Primary CTA</a>
                <a class="btn btn-outline">Secondary</a>
                <a class="btn btn-outline">Tertiary</a>
            </div>
            <div class="contact-bar">
                <a href="mailto:...">email@domain.com</a>
            </div>
        </div>
        <div class="hero-photo">
            <img src="profile.jpg" alt="..." class="profile-pic" loading="eager">
        </div>
    </div>
</header>
```

### CSS recipe

```css
/* Layer 1: the header itself */
header {
    background: var(--hero-bg);
    color: var(--hero-text);
    padding: 140px 32px 80px;     /* 140px top accounts for fixed nav */
    position: relative;
    overflow: hidden;              /* clip orbit rings */
}

/* Layer 2: animated orbit rings — defining decoration */
header::before {
    content: '';
    position: absolute;
    top: -120px; right: -80px;
    width: 400px; height: 400px;
    border: 1px solid var(--hero-orbit);
    border-radius: 50%;
    animation: orbit-slow 25s linear infinite;
    pointer-events: none;
}
header::after {
    content: '';
    position: absolute;
    bottom: -200px; left: -100px;
    width: 500px; height: 500px;
    border: 1px solid var(--hero-orbit-lg);
    border-radius: 50%;
    animation: orbit-slow 35s linear infinite reverse;
    pointer-events: none;
}
@keyframes orbit-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

/* Layer 3: canvas particle field (see assets/js/shared.js for behavior) */
.hero-canvas {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 0;
}

/* Layer 4: content grid */
.hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;    /* text takes remaining, photo fits */
    gap: 48px;
    align-items: center;
    position: relative; z-index: 1;     /* sit above orbits + canvas */
}

/* Eyebrow label with horizontal dash rule */
.hero-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
}
.hero-label::before {                   /* the signature 24px dash before label */
    content: '';
    width: 24px; height: 1px;
    background: var(--accent);
}

/* H1 — Space Mono, massive, accent-italic on the last token */
header h1 {
    font-family: 'Space Mono', monospace;
    font-size: clamp(2.8rem, 6vw, 4.2rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin-bottom: 16px;
}
header h1 em {                          /* the split-emphasis trick */
    font-style: italic;
    color: var(--accent);
}

/* Headline — short value statement, no bigger than 1.1rem */
header p.headline {
    font-size: 1.1rem;
    color: var(--hero-muted);
    max-width: 440px;
    line-height: 1.6;
}

/* Location — small monospace, low-key */
header p.location {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: var(--hero-muted);
    margin-top: 8px;
    letter-spacing: 0.02em;
}

/* Profile photo — rounded square, accent border, soft orange halo */
.profile-pic {
    width: 200px; height: 200px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid rgba(255, 107, 0, 0.4);
    box-shadow: var(--hero-pic-shadow);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.profile-pic:hover {
    transform: scale(1.02);
    box-shadow: var(--hero-pic-shadow-hover);
}

/* Mobile: stack vertically, photo on TOP */
@media (max-width: 768px) {
    header { padding: 110px 20px 60px; }
    .hero-inner {
        grid-template-columns: 1fr;
        gap: 32px;
    }
    .hero-photo { order: -1; }          /* photo above text on mobile */
    .profile-pic { width: 120px; height: 120px; }
}
```

### Required variables (in addition to §2)

```css
:root {
    --hero-bg:              #000000;
    --hero-text:            #e8e8ed;
    --hero-muted:           #6b7280;
    --hero-orbit:           rgba(255, 107, 0, 0.12);
    --hero-orbit-lg:        rgba(255, 107, 0, 0.06);
    --hero-btn-border:      rgba(255, 255, 255, 0.2);
    --hero-pic-shadow:      0 0 30px rgba(255, 107, 0, 0.15), 0 20px 60px rgba(0, 0, 0, 0.5);
    --hero-pic-shadow-hover:0 0 40px rgba(255, 107, 0, 0.25), 0 20px 60px rgba(0, 0, 0, 0.5);
}
[data-theme="light"] {
    --hero-bg:              #f5f5f0;
    --hero-text:            #1a1a1f;
    --hero-muted:           #6b7280;
    --hero-orbit:           rgba(217, 90, 0, 0.10);
    --hero-orbit-lg:        rgba(217, 90, 0, 0.05);
    --hero-btn-border:      rgba(26, 26, 31, 0.18);
    --hero-pic-shadow:      0 0 30px rgba(217, 90, 0, 0.12), 0 12px 40px rgba(0, 0, 0, 0.1);
    --hero-pic-shadow-hover:0 0 40px rgba(217, 90, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.12);
}
```

### Five rules the hero must follow

1. **The H1 uses split emphasis** — wrap the most personal/identifying token (surname, product name, key noun) in `<em>` so it renders accent-italic. This is the system's signature heading pattern.
2. **The eyebrow has a 24px dash rule before it.** Don't replace with an icon. The dash is a wordmark element.
3. **The orbit rings are non-negotiable.** They define the layered depth. If a project doesn't have a hero photo, the orbits still appear.
4. **Photo on top on mobile, not below.** `order: -1` on `.hero-photo` ensures the face is the first thing a phone visitor sees.
5. **The headline is one sentence, max ~25 words.** If you can't fit the value statement in one sentence, the value statement isn't sharp enough yet.

### Variations for non-portfolio sites

If the new repo isn't a personal portfolio (e.g. a tool, a docs site, a product), adapt as follows but keep the four-layer composition:

| Site type | Eyebrow | H1 split | Photo slot | CTA |
|---|---|---|---|---|
| Personal portfolio | Job title | Name (surname italic) | Profile photo | Download CV |
| Product / tool | Tagline ("Excel, sharpened") | Product name (key noun italic) | Product screenshot or icon | Try it / GitHub |
| Documentation | "Documentation" | Project name | Logo (or omit) | Get started |
| Blog | "Writing" | Author or blog name | Author photo (or omit) | Latest post |

## 7. Favicon / Icon Family

The icon family lives at `assets/img/`:

- `favicon.svg` — primary, SVG, ~32×32 viewBox. Renders in browser tab.
- `apple-touch-icon.png` — 180×180 raster, used by iOS home screen.
- `icon-192.png`, `icon-512.png` — PWA install icons declared in `manifest.json`.

**Design pattern:** black rounded square (`rx="4"`) + thin orange border + four corner accent dots + a single Chinese character (`吳`, Traditional, surname Wu) in the accent gradient + a small "CV" tagline below a thin divider.

The PNGs are downscaled from a single 512×512 render of the SVG using `qlmanage` + `sips` (macOS built-in). Production pipeline:

```bash
# In assets/img/
sed -E 's/width="32" height="32"/width="512" height="512"/' favicon.svg > tmp.svg
qlmanage -t -s 512 -o . tmp.svg
mv tmp.svg.png icon-512.png
sips -z 192 192 icon-512.png --out icon-192.png
sips -z 180 180 icon-512.png --out apple-touch-icon.png
rm tmp.svg
```

For new repos, copy this pattern but swap the character/label to that repo's identity.

## 8. Cache-Busting CSS

The site uses query-string versioning on stylesheet links:

```html
<link rel="stylesheet" href="assets/css/style.css?v=5">
```

Bump `?v=N` on every visual release so returning visitors don't see stale styles. Without this, browsers happily serve the old amber CSS for hours/days.

## 9. How to Apply This in Another Repo

When starting a new repo that should match this identity:

1. **Copy the variable triplet** (section 2) into the new repo's CSS. This is the most-load-bearing 30 lines of the system.
2. **Import the same fonts** (section 3). All three, even if you only use one — consistent fallback chains matter.
3. **Reference, don't restate.** Add a short note in the new repo's `CLAUDE.md`:
   ```md
   Visual identity follows the Sam Ngo design system:
   https://github.com/Sampi314/Sam-Personal-Profile/blob/main/design.md
   When generating UI code, use `var(--accent)` for emphasis and the dark/light variable
   triplet from that doc. Do not introduce non-system colors without flagging.
   ```
4. **For favicons,** swap the `吳` character to that repo's identity (an initial, a different glyph, etc.) but keep the same black/orange canvas + label pattern from section 6.

When in doubt, look at how `index.html` and `style.css` in this repo use a variable, and mirror that pattern. The system optimizes for *predictability across repos*, not novelty within one.

---

_Last updated: 2026-06-13. Update this file when the design system changes — it's the source of truth other repos pull from._
