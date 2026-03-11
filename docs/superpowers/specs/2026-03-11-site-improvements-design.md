# Site Improvements Design Spec

**Date:** 2026-03-11
**Author:** Sam Ngo + Claude
**Status:** Approved

## Goal

Strengthen the personal profile site across content, credibility, navigation, and SEO to attract clients, showcase expertise, and grow audience.

## Architecture

Vanilla HTML/CSS/JS on GitHub Pages. No framework. All changes are static file edits.

## Changes

### 1. Rewrite About Section

**File:** `index.html`

Replace the two formal CV-summary paragraphs with 3-4 shorter paragraphs that include:
- What you do day-to-day (financial modeling, automation, data viz)
- What drives you (making complex data accessible, building tools that save hours)
- What makes your approach unique (bridging finance and engineering)

Keep it professional but add personality. First person voice.

### 2. Add Impact Metrics to Experience

**File:** `index.html`

Enhance the Senior Analyst bullet points with concrete numbers where possible:
- "Develop financial models" -> "Built 50+ financial models across infrastructure, energy, real estate, and government sectors"
- "Design and deliver dynamic Power BI dashboards" -> add client/project count if available
- "Build automation solutions" -> quantify hours saved or tools built
- "Author published articles" -> specify count (e.g. "Authored 20+ published articles")

Sam to provide actual numbers; placeholders will use conservative estimates based on 3+ years at SumProduct.

### 3. Add Real Dates to Blog Posts

**Files:** `blog.html`, all blog card dates

Replace generic "March 2026" on most posts with realistic spread dates based on when tools were likely created:
- Earliest posts (fill-left, auto-set-sheet, remove-sheet-refs): Sep-Nov 2024
- Middle wave (most VBA tools): Jan-Jun 2025
- Recent posts (UDFs, workbook stats, spill resolver): Jan-Mar 2026
- Project pages (charts, formulas): spread across 2024-2026

Also update `feed.xml` pubDate entries to match.

### 4. Improve Contact Page

**File:** `contact.html`

Add before the form:
- A short intro paragraph: "Whether you need help with financial modeling, Excel automation, or data visualization, I'd love to hear from you."
- 2-3 bullet points of what you can help with (consulting, tool development, training)
- Keep the existing form as-is below this new content

### 5. Key Metrics Banner

**File:** `index.html`
**CSS:** `assets/css/style.css`

Add a horizontal stats row between the About and Featured Work sections:

```
30+ VBA Tools | 50+ Financial Models | 25+ Published Articles | 3+ Years at SumProduct
```

Styled as a flex row of stat cards with large numbers and small labels. Uses accent color for numbers. Responsive: 4 columns on desktop, 2x2 on tablet, stacked on mobile.

### 6. Next/Previous Blog Navigation

**File:** `assets/js/shared.js`
**CSS:** `assets/css/style.css`

Add `initBlogNav()` function that:
- Uses the existing `BLOG_POSTS` registry to determine post order
- Finds the current page's position in the array
- Renders prev/next links at the bottom of each blog/project page (before the related posts section)
- Shows post title and a directional arrow
- Style: simple flex row, prev on left, next on right

### 7. Breadcrumbs on Inner Pages

**Files:** All blog/*.html, projects/*.html
**CSS:** `assets/css/style.css`

Add a breadcrumb bar below the page-header on every inner page:

```
Home > Blog > Workbook Error Scanner
Home > Tools > Marimekko Chart
```

Implementation:
- Add `<nav class="breadcrumb">` markup to each inner page HTML
- Or generate dynamically in JS based on URL path and page title
- Style: small monospace text, muted color, accent on hover

Prefer JS generation to avoid editing 37 HTML files manually.

### 8. Scroll-to-Section Links on Home Page

**File:** `index.html`

Add `id` attributes to each section on the home page:
- `id="about"`, `id="experience"`, `id="education"`, `id="skills"`, `id="certifications"`, `id="awards"`, `id="languages"`

Update the navbar for the home page to include a dropdown or sub-links that scroll to these sections. Could be:
- Option A: Add section links directly to navbar (too many items)
- Option B: Add a small "jump to" pill bar below the hero (recommended)

**Recommended:** A horizontal pill bar below the hero section with section names as clickable scroll links. Sticky behavior optional.

### 9. sitemap.xml

**File:** `sitemap.xml` (new)

Static XML sitemap listing all 44 HTML pages with lastmod dates. Submit to Google Search Console manually.

### 10. robots.txt

**File:** `robots.txt` (new)

```
User-agent: *
Allow: /
Sitemap: https://sampi314.github.io/Sam-Personal-Profile/sitemap.xml
```

### 11. Meta Descriptions

**Files:** All 44 HTML files

Add `<meta name="description" content="...">` to every page's `<head>`. Each description should be:
- 150-160 characters
- Unique per page
- Include relevant keywords (Excel, VBA, financial modeling, etc.)

### 12. Structured Data (JSON-LD)

**Files:** `index.html`, all blog/*.html, all projects/*.html

**Home page:** Add `Person` schema with name, job title, employer, skills, social links.

**Blog/project pages:** Add `Article` schema with headline, author, datePublished, description.

Implemented as `<script type="application/ld+json">` blocks in each page's `<head>`.

### 13. Lazy Loading Images

**Files:** All HTML files with `<img>` tags

Add `loading="lazy"` to all images except the hero profile photo (which should load eagerly as it's above the fold).

Currently the only images are:
- `profile.jpg` in the hero (keep eager)
- OneDrive iframes (already lazy by nature)

This is mostly future-proofing for when screenshots are added. Minimal current impact.

## Implementation Order

Phase 1 (Quick wins, no HTML structure changes):
- Items 9, 10, 13 (sitemap, robots, lazy loading)

Phase 2 (Content edits):
- Items 1, 2, 3, 4 (About rewrite, metrics, dates, Contact)

Phase 3 (New UI components):
- Items 5, 8 (metrics banner, section jump bar)

Phase 4 (JS features):
- Items 6, 7 (next/prev nav, breadcrumbs)

Phase 5 (SEO metadata):
- Items 11, 12 (meta descriptions, structured data)

## Success Criteria

- All 44 pages have meta descriptions
- sitemap.xml and robots.txt exist and are valid
- Home page has metrics banner and section jump links
- Blog posts have varied, realistic dates
- Inner pages show breadcrumbs and next/prev navigation
- About section reads as personal, not a CV paste
- Contact page has intro context before the form
- JSON-LD validates at schema.org validator
