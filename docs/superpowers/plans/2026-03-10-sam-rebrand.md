# Sam Personal Profile Rebrand Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the personal profile site from SumProduct-influenced styling to a distinct "Sam Style" with dark-first techy/modern aesthetic, orange/amber accents, SN monogram logo, and renamed Excel sample files.

**Architecture:** CSS variable swap for dark-first palette + new fonts. SN monogram SVG injected via shared.js and used as favicon. Theme toggle logic inverted (dark = default). All 23 HTML files get logo + favicon updates. Excel sample files renamed from SP to SN prefix with HTML link updates.

**Tech Stack:** HTML, CSS, vanilla JS. No build tools. Google Fonts (Space Mono, Outfit, JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-03-10-sam-rebrand-design.md`

---

## Chunk 1: Core Styling (CSS + JS)

### Task 1: Update Google Fonts import and typography

**Files:**
- Modify: `style.css:1-4` (fonts import)
- Modify: `style.css:74-82` (body font-family)
- Modify: `style.css:144-151` (nav-brand font)
- Modify: `style.css:329-336` (h1 font)
- Modify: `style.css:499-508` (section h2 font)
- Modify: `style.css:579-586` (experience h3 font)
- Modify: `style.css:945-951` (page-header h1 font)
- Modify: `style.css:1136-1142` (featured-card h3 font)
- Modify: `style.css:1235-1243` (blog-hero h3 font)
- Modify: `style.css:1316-1324` (blog-sub h3 font)

- [ ] **Step 1: Replace Google Fonts import**

In `style.css` line 4, replace the import:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

- [ ] **Step 2: Update body font-family**

In `style.css` line 75, change:
```css
font-family: 'Outfit', -apple-system, sans-serif;
```

- [ ] **Step 3: Update heading fonts from Playfair Display to Space Mono**

Replace all instances of `'Playfair Display', Georgia, serif` with `'Space Mono', monospace` in `style.css`. These are at:
- Line 145 (`.nav-brand`)
- Line 330 (`header h1`)
- Line 382 (`.profile-initials`)
- Line 500 (`section h2`)
- Line 946 (`.page-header h1`)
- Line 1236 (`.blog-hero-body h3`)

- [ ] **Step 4: Update body-text heading fonts from DM Sans to Outfit**

Replace all instances of `'DM Sans', sans-serif` with `'Outfit', sans-serif` in `style.css`. These are at:
- Line 403 (`.btn`)
- Line 581 (`.experience-item h3`)
- Line 791 (`.card h3`)
- Line 868 (`.form-group input/textarea`)
- Line 894 (`.btn-submit`)
- Line 1137 (`.featured-card-body h3`)
- Line 1317 (`.blog-sub-body h3`)

- [ ] **Step 5: Commit typography changes**

```bash
git add style.css
git commit -m "style: update typography to Space Mono headings + Outfit body"
```

### Task 2: Update color palette to dark-first with amber accents

**Files:**
- Modify: `style.css:9-33` (`:root` light theme variables)
- Modify: `style.css:35-59` (`[data-theme="dark"]` variables)

- [ ] **Step 1: Replace `:root` with dark-first palette**

Replace the entire `:root` block (lines 9-33) with:

```css
:root {
    --bg-primary: #0c0c12;
    --bg-card: #13131a;
    --bg-card-alt: #1a1a24;
    --text-primary: #e8e8ed;
    --text-secondary: #9ca3af;
    --text-muted: #6b7280;
    --accent: #f59e0b;
    --accent-glow: rgba(245, 158, 11, 0.15);
    --accent-hover: #fbbf24;
    --border: #1f1f2e;
    --border-strong: #2a2a3a;
    --tag-bg: #1a1a24;
    --tag-text: #f59e0b;
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.3);
    --nav-bg: rgba(12, 12, 18, 0.92);
    --nav-text: #e8e8ed;
    --code-bg: #1a1a24;
    --hero-bg: #0c0c12;
    --hero-text: #e8e8ed;
    --hero-muted: #6b7280;
    --timeline-line: #1f1f2e;
    --grain-opacity: 0.04;
}
```

- [ ] **Step 2: Replace `[data-theme="dark"]` with light theme**

Replace the `[data-theme="dark"]` block (lines 35-59) with `[data-theme="light"]`:

```css
[data-theme="light"] {
    --bg-primary: #f5f5f0;
    --bg-card: #ffffff;
    --bg-card-alt: #f0efe8;
    --text-primary: #1a1a1f;
    --text-secondary: #4a4a55;
    --text-muted: #8a8a95;
    --accent: #d97706;
    --accent-glow: rgba(217, 119, 6, 0.1);
    --accent-hover: #f59e0b;
    --border: #e8e6e1;
    --border-strong: #d0cdc6;
    --tag-bg: #f0ede6;
    --tag-text: #92400e;
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.08);
    --nav-bg: rgba(245, 245, 240, 0.92);
    --nav-text: #1a1a1f;
    --code-bg: #f0ede6;
    --hero-bg: #0c0c12;
    --hero-text: #f5f5f0;
    --hero-muted: #6b7280;
    --timeline-line: #e8e6e1;
    --grain-opacity: 0.03;
}
```

- [ ] **Step 3: Update hardcoded color values in style.css**

Search for all `rgba(184, 134, 11` (old gold) and replace with amber equivalents:
- Line 265: `header::before` border → `rgba(245, 158, 11, 0.12)`
- Line 278: `header::after` border → `rgba(245, 158, 11, 0.06)`
- Line 369: `.profile-pic` border → `rgba(245, 158, 11, 0.3)`
- Line 421: `.btn-primary:hover` box-shadow → `rgba(245, 158, 11, 0.3)`
- Line 433: `.btn-outline:hover` background → `rgba(245, 158, 11, 0.06)`
- Line 909: `.btn-submit:hover` box-shadow → `rgba(245, 158, 11, 0.25)`
- Line 935: `.page-header::before` border → `rgba(245, 158, 11, 0.08)`

- [ ] **Step 4: Commit color palette changes**

```bash
git add style.css
git commit -m "style: switch to dark-first palette with amber accents"
```

### Task 3: Update background texture and section header styling

**Files:**
- Modify: `style.css:84-96` (body::after grain texture)
- Modify: `style.css:499-512` (section h2)

- [ ] **Step 1: Replace grain texture with dot grid pattern**

Replace `body::after` (lines 84-96) with:

```css
/* Subtle dot grid pattern */
body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: var(--grain-opacity);
    background-image: radial-gradient(circle, var(--text-muted) 0.5px, transparent 0.5px);
    background-size: 24px 24px;
}
```

- [ ] **Step 2: Add `//` prefix to section h2**

Update `section h2` styles (around line 499) — add a `::before` pseudo-element:

```css
section h2 {
    font-family: 'Space Mono', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
    letter-spacing: -0.02em;
}

section h2::before {
    content: '// ';
    color: var(--accent);
    font-weight: 400;
}

section h2::after {
    display: none;
}
```

- [ ] **Step 3: Commit visual element changes**

```bash
git add style.css
git commit -m "style: add dot grid background and code-comment section headers"
```

### Task 4: Enhance card hover effects and skill tag styling

**Files:**
- Modify: `style.css:773-782` (card hover)
- Modify: `style.css:629-646` (skill-tag)
- Modify: `style.css:1102-1111` (featured-card hover)

- [ ] **Step 1: Update card hover to amber glow**

Replace `.card:hover` (line 773):

```css
.card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 20px var(--accent-glow), var(--shadow-hover);
    transform: translateY(-4px);
    color: inherit;
}
```

Update `.featured-card:hover` (line 1102):

```css
.featured-card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 20px var(--accent-glow), var(--shadow-hover);
    transform: translateY(-4px);
    color: inherit;
}
```

- [ ] **Step 2: Update skill-tag to terminal-badge style**

Replace `.skill-tag` (line 629):

```css
.skill-tag {
    font-family: 'JetBrains Mono', monospace;
    background: var(--tag-bg);
    color: var(--tag-text);
    padding: 6px 14px;
    border-radius: 2px;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 1px solid var(--border);
    transition: all 0.2s ease;
    box-shadow: 0 0 8px transparent;
}

.skill-tag:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
    box-shadow: 0 0 12px var(--accent-glow);
}
```

- [ ] **Step 3: Commit card and tag enhancements**

```bash
git add style.css
git commit -m "style: add amber glow cards and terminal-badge skill tags"
```

### Task 5: Update theme toggle logic in shared.js

**Files:**
- Modify: `shared.js:1-30` (theme functions)

- [ ] **Step 1: Invert theme toggle to dark-first**

Replace `initTheme()`, `toggleTheme()`, and `updateThemeIcon()` (lines 4-30):

```javascript
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    updateThemeIcon();
}

function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    btn.textContent = isLight ? '\u263E' : '\u2600';
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}
```

- [ ] **Step 2: Update particle colors to amber**

In `shared.js`, replace the two hardcoded particle color lines:
- Line 154: `ctx.strokeStyle = \`rgba(245, 158, 11, ${opacity})\`;`
- Line 177: `ctx.fillStyle = \`rgba(245, 158, 11, ${p.alpha})\`;`

- [ ] **Step 3: Commit theme toggle and particle changes**

```bash
git add shared.js
git commit -m "feat: dark-first theme toggle and amber particle colors"
```

### Task 6: Create SN monogram logo in shared.js

**Files:**
- Modify: `shared.js` (add logo function before DOMContentLoaded init)

- [ ] **Step 1: Add SN monogram SVG function**

Add before the `document.addEventListener('DOMContentLoaded'` block (before line 520):

```javascript
/* ========================================
   SN Monogram Logo
   ======================================== */
function getSNLogoSVG(size = 28) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="31" height="31" rx="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
        <text x="16" y="22" text-anchor="middle" font-family="'Space Mono', monospace" font-size="14" font-weight="700" fill="currentColor">SN</text>
    </svg>`;
}

function initNavLogo() {
    const brand = document.querySelector('.nav-brand');
    if (!brand) return;
    brand.innerHTML = getSNLogoSVG(28) + ' <span class="nav-brand-text">Sam Ngo</span>';
    brand.style.display = 'inline-flex';
    brand.style.alignItems = 'center';
    brand.style.gap = '8px';
}
```

- [ ] **Step 2: Call `initNavLogo()` in the DOMContentLoaded handler**

Add `initNavLogo();` as the first call inside the DOMContentLoaded callback (after line 521).

- [ ] **Step 3: Add nav-brand-text CSS**

Add to `style.css` after the `.nav-brand` block (after line 151):

```css
.nav-brand {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 1.15rem;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.nav-brand svg {
    color: var(--accent);
    flex-shrink: 0;
}

.nav-brand-text {
    font-size: 0.95rem;
    color: var(--nav-text);
}
```

- [ ] **Step 4: Commit SN logo**

```bash
git add shared.js style.css
git commit -m "feat: add SN monogram logo to navbar"
```

## Chunk 2: HTML File Updates

### Task 7: Add favicon to all HTML files

**Files:**
- Modify: All 23 HTML files (in `<head>` section, after `<link rel="stylesheet" href="style.css">`)

- [ ] **Step 1: Create favicon.svg**

Create `favicon.svg` in the project root:

```svg
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="31" height="31" rx="6" fill="#0c0c12" stroke="#f59e0b" stroke-width="1"/>
    <text x="16" y="22" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#f59e0b">SN</text>
</svg>
```

- [ ] **Step 2: Add favicon link to all 23 HTML files**

In each HTML file, add after `<link rel="stylesheet" href="style.css">`:

```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
```

The 23 files are:
`index.html`, `blog.html`, `blog-auto-set-sheet.html`, `blog-fill-left.html`, `blog-remove-sheet-refs.html`, `contact.html`, `tools.html`, `demo-powerbi.html`, `demo-powerquery.html`, `excel-2d-sumifs.html`, `project-bubble-pies.html`, `project-christmas-tree.html`, `project-dynamic-hyperlink.html`, `project-excel.html`, `project-marimekko.html`, `project-percentage-change.html`, `project-point-figure.html`, `project-powerbi.html`, `project-powerquery.html`, `project-raincloud-horizontal.html`, `project-raincloud-vertical.html`, `project-sum-to-target.html`, `project-waffle-chart.html`

- [ ] **Step 3: Commit favicon**

```bash
git add favicon.svg index.html blog.html blog-auto-set-sheet.html blog-fill-left.html blog-remove-sheet-refs.html contact.html tools.html demo-powerbi.html demo-powerquery.html excel-2d-sumifs.html project-bubble-pies.html project-christmas-tree.html project-dynamic-hyperlink.html project-excel.html project-marimekko.html project-percentage-change.html project-point-figure.html project-powerbi.html project-powerquery.html project-raincloud-horizontal.html project-raincloud-vertical.html project-sum-to-target.html project-waffle-chart.html
git commit -m "feat: add SN monogram favicon to all pages"
```

### Task 8: Update page titles

**Files:**
- Modify: `index.html:6` (title tag)

- [ ] **Step 1: Update index.html title**

Change `<title>Sam Ngo - Senior Analyst at SumProduct</title>` to:
```html
<title>Sam Ngo - Finance & Data Professional</title>
```

- [ ] **Step 2: Commit title update**

```bash
git add index.html
git commit -m "style: update page title to personal branding"
```

## Chunk 3: File Renames

### Task 9: Rename Excel sample files from SP to SN prefix

**Files:**
- Rename: 7 files in `Samples/`
- Modify: 7 HTML files with download links

- [ ] **Step 1: Rename the sample files**

```bash
cd Samples
mv "SP Bubble Pies.xlsm" "SN Bubble Pies.xlsm"
mv "SP Horizontal RainCloud Chart - Complete.xlsm" "SN Horizontal RainCloud Chart.xlsm"
mv "SP Marimekko Chart.xlsm" "SN Marimekko Chart.xlsm"
mv "SP Percentage Change Chart.xlsm" "SN Percentage Change Chart.xlsm"
mv "SP Point and Figure Chart with Bollinger Band- Complete.xlsm" "SN Point and Figure Chart.xlsm"
mv "SP Vertical RainCloud Chart - Complete.xlsm" "SN Vertical RainCloud Chart.xlsm"
mv "SP-ChristmasTree.xlsm" "SN Christmas Tree.xlsm"
cd ..
```

- [ ] **Step 2: Update download links in HTML files**

Update the `href` attributes in these files:

| File | Old href | New href |
|------|----------|----------|
| `project-bubble-pies.html:43` | `Samples/SP%20Bubble%20Pies.xlsm` | `Samples/SN%20Bubble%20Pies.xlsm` |
| `project-raincloud-horizontal.html:43` | `Samples/SP%20Horizontal%20RainCloud%20Chart%20-%20Complete.xlsm` | `Samples/SN%20Horizontal%20RainCloud%20Chart.xlsm` |
| `project-marimekko.html:42` | `Samples/SP%20Marimekko%20Chart.xlsm` | `Samples/SN%20Marimekko%20Chart.xlsm` |
| `project-percentage-change.html:42` | `Samples/SP%20Percentage%20Change%20Chart.xlsm` | `Samples/SN%20Percentage%20Change%20Chart.xlsm` |
| `project-point-figure.html:43` | `Samples/SP%20Point%20and%20Figure%20Chart%20with%20Bollinger%20Band-%20Complete.xlsm` | `Samples/SN%20Point%20and%20Figure%20Chart.xlsm` |
| `project-raincloud-vertical.html:43` | `Samples/SP%20Vertical%20RainCloud%20Chart%20-%20Complete.xlsm` | `Samples/SN%20Vertical%20RainCloud%20Chart.xlsm` |
| `project-christmas-tree.html:43` | `Samples/SP-ChristmasTree.xlsm` | `Samples/SN%20Christmas%20Tree.xlsm` |

- [ ] **Step 3: Commit file renames and link updates**

```bash
git add -A Samples/
git add project-bubble-pies.html project-raincloud-horizontal.html project-marimekko.html project-percentage-change.html project-point-figure.html project-raincloud-vertical.html project-christmas-tree.html
git commit -m "chore: rename Excel samples from SP to SN prefix and update links"
```

### Task 10: Final verification

- [ ] **Step 1: Open site locally and verify**

Open `index.html` in a browser and check:
- Dark theme loads by default
- SN monogram logo appears in navbar
- Amber accent colors throughout
- Space Mono headings, Outfit body text
- `//` prefix on section headers
- Dot grid background pattern
- Cards glow amber on hover
- Theme toggle switches to light mode and back
- Favicon shows SN monogram

- [ ] **Step 2: Verify sample file links work**

Check each project page's download button links to the renamed file.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: final rebrand polish and fixes"
```
