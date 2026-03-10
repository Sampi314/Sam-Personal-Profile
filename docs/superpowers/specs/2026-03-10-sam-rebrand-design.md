# Sam Personal Profile — Rebrand Design Spec

## Goal

Remove SumProduct visual branding from the site and Excel sample files. Create a distinct "Sam Style" identity with a techy/modern aesthetic, dark theme, orange/amber accents, and an SN monogram logo. SumProduct text references in content (experience, descriptions) remain unchanged.

## Approach: Bold Refresh

Restyle via CSS + new logo SVG + developer-inspired visual elements + file renames. Preserve existing HTML structure with targeted modifications.

## 1. SN Monogram Logo

- Inline SVG monogram: geometric/angular "S" and "N" sharing a vertical stroke
- Rendered in amber accent color
- Sits in a subtle rounded-square container with 1px amber border (badge feel)
- Replaces the text "Sam Ngo" in `.nav-brand` across all 21 HTML files
- Same SVG used as favicon via `<link rel="icon" type="image/svg+xml">`

## 2. Color Palette

Dark-first design. Default theme is dark; light becomes secondary.

### Dark theme (default — `:root`)

| Token | Value |
|-------|-------|
| `--bg-primary` | `#0c0c12` |
| `--bg-card` | `#13131a` |
| `--bg-card-alt` | `#1a1a24` |
| `--text-primary` | `#e8e8ed` |
| `--text-secondary` | `#9ca3af` |
| `--text-muted` | `#6b7280` |
| `--accent` | `#f59e0b` |
| `--accent-glow` | `rgba(245, 158, 11, 0.15)` |
| `--accent-hover` | `#fbbf24` |
| `--border` | `#1f1f2e` |
| `--border-strong` | `#2a2a3a` |
| `--tag-bg` | `#1a1a24` |
| `--tag-text` | `#f59e0b` |
| `--nav-bg` | `rgba(12, 12, 18, 0.92)` |
| `--nav-text` | `#e8e8ed` |
| `--code-bg` | `#1a1a24` |
| `--hero-bg` | `#0c0c12` |
| `--hero-text` | `#e8e8ed` |
| `--hero-muted` | `#6b7280` |

### Light theme (`[data-theme="light"]`)

| Token | Value |
|-------|-------|
| `--bg-primary` | `#f5f5f0` |
| `--bg-card` | `#ffffff` |
| `--bg-card-alt` | `#f0efe8` |
| `--text-primary` | `#1a1a1f` |
| `--text-secondary` | `#4a4a55` |
| `--text-muted` | `#8a8a95` |
| `--accent` | `#d97706` |
| `--accent-glow` | `rgba(217, 119, 6, 0.1)` |
| `--accent-hover` | `#f59e0b` |
| `--border` | `#e8e6e1` |
| `--border-strong` | `#d0cdc6` |
| `--tag-bg` | `#f0ede6` |
| `--tag-text` | `#92400e` |
| `--nav-bg` | `rgba(245, 245, 240, 0.92)` |
| `--nav-text` | `#1a1a1f` |
| `--code-bg` | `#f0ede6` |
| `--hero-bg` | `#0c0c12` |
| `--hero-text` | `#f5f5f0` |
| `--hero-muted` | `#6b7280` |

## 3. Typography

- **Display/headings:** `'Space Mono', monospace` — terminal/code feel
- **Body:** `'Outfit', sans-serif` — clean geometric sans, modern and readable
- **Code/tags:** `'JetBrains Mono', monospace` — already in use, keep
- Google Fonts import updated accordingly

## 4. Visual Elements

### Background
- Replace grain texture with a subtle **grid dot pattern** (SVG-based, engineering blueprint feel)
- Dots use `--border` color at low opacity

### Section Headers
- Add `//` prefix in accent color before `<h2>` text (CSS `::before` pseudo-element)
- Monospace font for the prefix

### Cards
- Amber glow border on hover (`box-shadow` using `--accent-glow`)
- Slight upward translate on hover (`translateY(-4px)`)

### Hero
- Large SN monogram as watermark behind hero text (low opacity, scaled up)
- Typing cursor effect on the headline subtitle
- Keep particle canvas but adjust particle color to amber

### Skill Tags
- Monospace font (`JetBrains Mono`)
- Border with subtle amber glow
- Terminal-badge styling

### Theme Toggle
- Flip logic: default is dark, toggle switches to light
- Update `localStorage` key: absence = dark, `theme=light` = light
- Update icon: sun for dark mode (click to go light), moon for light mode

## 5. File Renames

| Current filename | New filename |
|-----------------|-------------|
| `SP Bubble Pies.xlsm` | `SN Bubble Pies.xlsm` |
| `SP Horizontal RainCloud Chart - Complete.xlsm` | `SN Horizontal RainCloud Chart.xlsm` |
| `SP Marimekko Chart.xlsm` | `SN Marimekko Chart.xlsm` |
| `SP Percentage Change Chart.xlsm` | `SN Percentage Change Chart.xlsm` |
| `SP Point and Figure Chart with Bollinger Band- Complete.xlsm` | `SN Point and Figure Chart.xlsm` |
| `SP Vertical RainCloud Chart - Complete.xlsm` | `SN Vertical RainCloud Chart.xlsm` |
| `SP-ChristmasTree.xlsm` | `SN Christmas Tree.xlsm` |

All HTML references to these files updated with new filenames.

## 6. Files Modified

- `style.css` — color variables, typography, background pattern, section header styling, card effects, tag styling
- `shared.js` — theme toggle logic (dark-first), particle color, SN logo SVG function
- All 21 HTML files — nav-brand logo SVG, favicon link, Google Fonts import update
- `Samples/*.xlsm` — renamed files
- HTML files referencing sample files — updated links

## 7. Out of Scope

- Internal Excel file formatting/styling (user handles manually)
- SumProduct text references in content (kept as-is)
- Site structure or page additions
- New pages or features
