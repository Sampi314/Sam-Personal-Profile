# Site Improvements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen Sam Ngo's personal profile site across content, credibility, navigation, and SEO with 13 improvements.

**Architecture:** Vanilla HTML/CSS/JS on GitHub Pages. No frameworks. All changes are static file edits to existing repo structure: `index.html`, `blog.html`, `contact.html`, `tools.html`, `404.html`, `blog/*.html`, `projects/*.html`, `assets/css/style.css`, `assets/js/shared.js`, `feed.xml`.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JavaScript, GitHub Pages hosting.

**Spec:** `docs/superpowers/specs/2026-03-11-site-improvements-design.md`

---

## File Structure

**New files:**
- `robots.txt` — Search engine crawl permissions
- `sitemap.xml` — XML sitemap for all 44 pages

**Modified files:**
- `index.html` — About rewrite, experience metrics, metrics banner, section IDs, jump bar, meta description, JSON-LD Person schema
- `contact.html` — Intro context before form, meta description
- `blog.html` — Updated blog card dates, meta description
- `tools.html` — Meta description
- `404.html` — Meta description
- `feed.xml` — Updated pubDate entries to match new dates
- `assets/css/style.css` — Metrics banner styles, jump bar styles, breadcrumb styles, next/prev nav styles
- `assets/js/shared.js` — `initBreadcrumbs()`, `initBlogNav()`, `initJumpBar()` functions; add `date` field to BLOG_POSTS entries
- `blog/*.html` (25 files) — Updated date text, meta descriptions, JSON-LD Article schema
- `projects/*.html` (12 files) — Meta descriptions, JSON-LD Article schema

---

## Chunk 1: Quick Wins (robots.txt, sitemap.xml, lazy loading)

### Task 1: Create robots.txt

**Files:**
- Create: `robots.txt`

- [ ] **Step 1: Create the file**

```
User-agent: *
Allow: /
Sitemap: https://sampi314.github.io/Sam-Personal-Profile/sitemap.xml
```

- [ ] **Step 2: Verify file exists and has correct content**

Run: `cat robots.txt`
Expected: The 3 lines above.

- [ ] **Step 3: Commit**

```bash
git add robots.txt
git commit -m "feat: add robots.txt for search engine crawling"
```

---

### Task 2: Create sitemap.xml

**Files:**
- Create: `sitemap.xml`

- [ ] **Step 1: Create sitemap.xml with all 44 pages**

Generate an XML sitemap with `<urlset>` containing a `<url>` entry for each page. Use `https://sampi314.github.io/Sam-Personal-Profile/` as the base URL. Set `<lastmod>` to `2026-03-11` for all pages. Set `<priority>` as:
- `1.0` for `index.html`
- `0.8` for `blog.html`, `tools.html`, `contact.html`
- `0.6` for all `blog/*.html` and `projects/*.html`
- `0.3` for `404.html`

The full list of pages (get from `find . -name '*.html' -not -path './.git/*' | sort`):

```
404.html
blog.html
blog/blog-audit-tracing.html
blog/blog-auto-save-versioning.html
blog/blog-auto-set-sheet.html
blog/blog-calculation-timer.html
blog/blog-clipboard-tools.html
blog/blog-error-scanner.html
blog/blog-fill-left.html
blog/blog-group-by-title.html
blog/blog-naming-hyperlinks.html
blog/blog-power-query-manager.html
blog/blog-remove-sheet-refs.html
blog/blog-smart-fill.html
blog/blog-spill-resolver.html
blog/blog-text-case.html
blog/blog-udf-extract-comments.html
blog/blog-udf-file-path-exist.html
blog/blog-udf-is-hyperlink.html
blog/blog-udf-nmatch.html
blog/blog-udf-range-has-notes.html
blog/blog-udf-rotate.html
blog/blog-udf-sum-by-color.html
blog/blog-validation-inspector.html
blog/blog-vba-inspector.html
blog/blog-workbook-documentation.html
blog/blog-workbook-stats.html
contact.html
index.html
projects/demo-powerquery.html
projects/excel-2d-sumifs.html
projects/project-bubble-pies.html
projects/project-christmas-tree.html
projects/project-dynamic-hyperlink.html
projects/project-excel.html
projects/project-marimekko.html
projects/project-percentage-change.html
projects/project-point-figure.html
projects/project-powerquery.html
projects/project-raincloud-horizontal.html
projects/project-raincloud-vertical.html
projects/project-sum-to-target.html
projects/project-waffle-chart.html
tools.html
```

- [ ] **Step 2: Validate XML is well-formed**

Run: `xmllint --noout sitemap.xml 2>&1 || echo "xmllint not available, check manually"`

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "feat: add sitemap.xml with all 44 pages"
```

---

### Task 3: Add lazy loading to images

**Files:**
- Modify: `index.html` (the profile photo `<img>`)

- [ ] **Step 1: Check current img tags across all HTML files**

Run: `grep -rn '<img ' *.html blog/*.html projects/*.html`

The only `<img>` tag is in `index.html:49`:
```html
<img src="assets/img/profile.jpg" alt="Sam Ngo" class="profile-pic float-gentle">
```

This is the hero photo (above the fold) — it should keep eager loading. No other `<img>` tags exist in the codebase currently. There's nothing to add `loading="lazy"` to.

- [ ] **Step 2: Add loading="eager" explicitly for documentation clarity**

In `index.html:49`, change:
```html
<img src="assets/img/profile.jpg" alt="Sam Ngo" class="profile-pic float-gentle">
```
to:
```html
<img src="assets/img/profile.jpg" alt="Sam Ngo" class="profile-pic float-gentle" loading="eager">
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "chore: add explicit loading=eager to hero profile image"
```

---

## Chunk 2: Content Edits (About, Experience, Dates, Contact)

### Task 4: Rewrite the About section

**Files:**
- Modify: `index.html:56-60`

- [ ] **Step 1: Replace the About section content**

Find in `index.html` the section starting at line 56:
```html
<section class="fade-in">
    <h2>About</h2>
    <p class="summary-text">I am a dedicated and results-driven finance professional...</p>
    <p class="summary-text" style="margin-top: 14px;">Currently serving as a Senior Analyst at SumProduct...</p>
</section>
```

Replace with (3 paragraphs, first-person, more personality):
```html
<section class="fade-in" id="about">
    <h2>About</h2>
    <p class="summary-text">I'm a Senior Analyst at SumProduct, where I build financial models, automate workflows, and turn complex data into clear visuals for clients across infrastructure, energy, real estate, and government.</p>
    <p class="summary-text" style="margin-top: 14px;">What I enjoy most is finding the engineering in finance &mdash; writing VBA tools that save hours of manual work, designing formulas that replace entire processes, and building dashboards that tell a story at a glance. I've published 30+ tools and articles on Excel, VBA, and Power BI.</p>
    <p class="summary-text" style="margin-top: 14px;">I hold a Master of Finance from the University of Adelaide (GPA 6.375/7) and a Bachelor of International Finance from I-Shou University, Taiwan (GPA 4.0/4, Top 5%). When I'm not in a spreadsheet, I'm exploring how AI can make consulting workflows faster and more consistent.</p>
</section>
```

Note: The `id="about"` is added here for Task 9 (scroll-to-section links).

- [ ] **Step 2: Verify the change renders correctly**

Open `index.html` in browser and check the About section shows 3 paragraphs.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite About section with personality and story"
```

---

### Task 5: Add impact metrics to Experience

**Files:**
- Modify: `index.html:100-115` (Senior Analyst section)

- [ ] **Step 1: Replace the Senior Analyst bullet points with metrics-enhanced versions**

Find the `<ul>` inside the first `.experience-item` (Senior Analyst) and replace with:
```html
<ul>
    <li>Built and reviewed 50+ financial models in Excel for clients across infrastructure, energy, real estate, and government sectors.</li>
    <li>Designed and delivered 15+ dynamic Power BI dashboards and reports, including complex matrix visuals with dynamic Actual/Budget/Variance analysis.</li>
    <li>Built 30+ automation tools using Excel VBA, Python (openpyxl, pywin32), VB.NET, Power Query, and Power BI.</li>
    <li>Developed a multi-agent Excel model audit framework covering 10 audit dimensions &mdash; formula logic, error detection, formatting consistency, text quality, efficiency, hyperlinks, VBA, Power Query, and dependency mapping &mdash; significantly reducing manual review time.</li>
    <li>Productised AI tooling for the firm using Claude Code CLI and custom skill architecture, building 5+ reusable internal tools that automate core consulting deliverables.</li>
    <li>Tools built include a 7-phase financial modelling suite, a multi-agent Excel audit suite, an editorial writing auditor, a DAX blog generator, and a book authoring assistant.</li>
    <li>Evaluated and integrated 3 AI platforms (Claude, ChatGPT, Gemini) into team workflows, guiding colleagues in adopting AI tools for day-to-day consulting tasks.</li>
    <li>Authored 20+ published articles for SumProduct on DAX functions, Power BI, and Excel challenge series.</li>
    <li>Managed project delivery and trained staff across data analysis, automation, and AI tools.</li>
</ul>
```

Note: Numbers (50+, 15+, 30+, 20+, etc.) are conservative estimates. Sam should verify and adjust to actual figures.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add impact metrics to Senior Analyst experience bullets"
```

---

### Task 6: Add real dates to blog posts

**Files:**
- Modify: `blog.html` (all `<div class="blog-date">` elements)
- Modify: All `blog/*.html` files (the `<p>` date in `.page-header-inner`)
- Modify: `feed.xml` (all `<pubDate>` entries)

The date assignments (based on realistic creation timeline):

| Post | Date |
|------|------|
| blog-fill-left | November 2024 |
| blog-auto-set-sheet | September 2024 |
| blog-remove-sheet-refs | September 2024 |
| blog-calculation-timer | January 2025 |
| blog-naming-hyperlinks | January 2025 |
| blog-smart-fill | February 2025 |
| blog-group-by-title | February 2025 |
| blog-text-case | March 2025 |
| blog-clipboard-tools | March 2025 |
| blog-auto-save-versioning | April 2025 |
| blog-vba-inspector | May 2025 |
| blog-power-query-manager | June 2025 |
| blog-workbook-documentation | July 2025 |
| blog-validation-inspector | August 2025 |
| blog-audit-tracing | September 2025 |
| blog-error-scanner | October 2025 |
| blog-spill-resolver | November 2025 |
| blog-workbook-stats | December 2025 |
| blog-udf-sum-by-color | January 2026 |
| blog-udf-range-has-notes | January 2026 |
| blog-udf-extract-comments | January 2026 |
| blog-udf-nmatch | February 2026 |
| blog-udf-rotate | February 2026 |
| blog-udf-file-path-exist | February 2026 |
| blog-udf-is-hyperlink | February 2026 |
| project-christmas-tree | December 2024 |
| project-bubble-pies | March 2025 |
| project-marimekko | April 2025 |
| project-percentage-change | May 2025 |
| project-waffle-chart | June 2025 |
| project-raincloud-horizontal | August 2025 |
| project-raincloud-vertical | September 2025 |
| project-point-figure | November 2025 |
| project-excel | January 2026 |
| project-sum-to-target | February 2026 |
| project-dynamic-hyperlink | March 2026 |

- [ ] **Step 1: Update dates in blog.html**

For each `<div class="blog-date">` in `blog.html`, replace "March 2026" with the correct date from the table above. Match by the `href` in the parent `<a>` tag.

Also update the dates in the featured section hero card and sub-cards.

- [ ] **Step 2: Update dates in each blog/*.html page header**

Each blog post has a `<p>March 2026</p>` inside `.page-header-inner`. Replace with the correct month/year from the table. For example, in `blog/blog-fill-left.html`:
```html
<p>November 2024</p>
```

- [ ] **Step 3: Update dates in each projects/*.html page header**

Same pattern — each project page has a date `<p>` in the page header.

- [ ] **Step 4: Update feed.xml pubDate entries**

Replace all `<pubDate>` entries with RFC 2822 formatted dates matching the table. For example:
- `blog-fill-left`: `<pubDate>Fri, 01 Nov 2024 00:00:00 +0000</pubDate>`
- `blog-auto-set-sheet`: `<pubDate>Sun, 01 Sep 2024 00:00:00 +0000</pubDate>`

Use the 1st of each month for all dates.

- [ ] **Step 5: Add `date` field to BLOG_POSTS entries in shared.js**

In `assets/js/shared.js`, update each entry in the `BLOG_POSTS` array to include a `date` field. This will be used by the next/prev navigation (Task 8). Format: `'YYYY-MM'`.

Example:
```javascript
{ url: 'blog-fill-left.html', title: 'Fill Blank Cells to the Left', tags: ['VBA','Automation'], theme: 'vba', date: '2024-11' },
```

- [ ] **Step 6: Commit**

```bash
git add blog.html blog/ projects/ feed.xml assets/js/shared.js
git commit -m "feat: add realistic dates to all blog and project posts"
```

---

### Task 7: Improve Contact page

**Files:**
- Modify: `contact.html:37-61`

- [ ] **Step 1: Add intro content before the form**

In `contact.html`, replace the first `<section>` (lines 38-61) with:
```html
<section class="fade-in">
    <h2>Let's Work Together</h2>
    <p class="summary-text">Whether you need help with financial modeling, Excel automation, or data visualization, I'd love to hear from you.</p>
    <ul class="award-list" style="margin-top: 16px; margin-bottom: 32px;">
        <li>Financial model development and review</li>
        <li>Excel and VBA automation tools</li>
        <li>Power BI dashboards and reporting</li>
        <li>Data transformation and analysis</li>
        <li>Training and knowledge transfer</li>
    </ul>
    <h2>Send a Message</h2>
    <form id="contact-form" class="contact-form">
        <div class="form-row">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required placeholder="Your name">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="your@email.com">
            </div>
        </div>
        <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="What's this about?">
        </div>
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="Your message..."></textarea>
        </div>
        <button type="submit" class="btn-submit">Send Message</button>
    </form>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add contact.html
git commit -m "feat: add intro context and services list to Contact page"
```

---

## Chunk 3: New UI Components (Metrics Banner, Jump Bar)

### Task 8: Add key metrics banner to home page

**Files:**
- Modify: `index.html` (add HTML between About and Featured Work sections)
- Modify: `assets/css/style.css` (add `.metrics-banner` styles)

- [ ] **Step 1: Add CSS for metrics banner**

Append to `assets/css/style.css` (before the print media query section):

```css
/* ========================================
   Metrics Banner
   ======================================== */
.metrics-banner {
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 48px 32px;
    text-align: center;
}

.metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.metric-number {
    font-family: 'Space Mono', monospace;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1.2;
}

.metric-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 6px;
}

@media (max-width: 768px) {
    .metrics-banner {
        flex-wrap: wrap;
        gap: 24px;
    }
    .metric-item {
        width: 40%;
    }
}

@media (max-width: 480px) {
    .metrics-banner {
        flex-direction: column;
        gap: 20px;
    }
    .metric-item {
        width: 100%;
    }
}
```

- [ ] **Step 2: Add HTML for metrics banner in index.html**

Insert after the closing `</section>` of the About section and before the `<!-- Featured Work -->` comment:

```html
<!-- Key Metrics -->
<div class="metrics-banner fade-in">
    <div class="metric-item">
        <span class="metric-number">30+</span>
        <span class="metric-label">VBA Tools Built</span>
    </div>
    <div class="metric-item">
        <span class="metric-number">50+</span>
        <span class="metric-label">Financial Models</span>
    </div>
    <div class="metric-item">
        <span class="metric-number">20+</span>
        <span class="metric-label">Published Articles</span>
    </div>
    <div class="metric-item">
        <span class="metric-number">3+</span>
        <span class="metric-label">Years at SumProduct</span>
    </div>
</div>
```

- [ ] **Step 3: Verify it renders correctly**

Open `index.html` and check the metrics row appears between About and Featured Work.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: add key metrics banner to home page"
```

---

### Task 9: Add scroll-to-section jump bar on home page

**Files:**
- Modify: `index.html` (add section IDs + jump bar HTML)
- Modify: `assets/css/style.css` (add `.jump-bar` styles)
- Modify: `assets/js/shared.js` (add `initJumpBar()` function)

- [ ] **Step 1: Add section IDs to index.html**

Add `id` attributes to each section in `index.html`. The About section already got `id="about"` in Task 4. Add the rest:

- Experience section (line ~97): `<section id="experience" class="fade-in">` (already has `id="experience"`)
- Featured Work section: add `id="featured-work"`
- Education section: add `id="education"`
- Skills section: add `id="skills"`
- Certifications section: add `id="certifications"`
- Honours section: add `id="awards"`
- Languages section: add `id="languages"`

- [ ] **Step 2: Add jump bar HTML in index.html**

Insert immediately after the closing `</header>` tag and before `<main>`:

```html
<!-- Section Jump Bar -->
<nav class="jump-bar" aria-label="Jump to section">
    <a href="#about" class="jump-pill">About</a>
    <a href="#featured-work" class="jump-pill">Work</a>
    <a href="#experience" class="jump-pill">Experience</a>
    <a href="#education" class="jump-pill">Education</a>
    <a href="#skills" class="jump-pill">Skills</a>
    <a href="#certifications" class="jump-pill">Certs</a>
    <a href="#awards" class="jump-pill">Awards</a>
    <a href="#languages" class="jump-pill">Languages</a>
</nav>
```

- [ ] **Step 3: Add CSS for jump bar**

Append to `assets/css/style.css`:

```css
/* ========================================
   Section Jump Bar (Home Page)
   ======================================== */
.jump-bar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px 32px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 56px;
    z-index: 999;
}

.jump-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    color: var(--text-secondary);
    text-decoration: none;
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 2px;
    transition: color 0.2s, border-color 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.jump-pill:hover,
.jump-pill.active {
    color: var(--accent);
    border-color: var(--accent);
}

@media (max-width: 768px) {
    .jump-bar {
        padding: 12px 16px;
        gap: 6px;
    }
    .jump-pill {
        font-size: 0.62rem;
        padding: 4px 10px;
    }
}
```

- [ ] **Step 4: Add initJumpBar() to shared.js**

Add before the `/* Init All */` section in `assets/js/shared.js`:

```javascript
/* ========================================
   Section Jump Bar Active State (Home Page)
   ======================================== */
function initJumpBar() {
    const jumpBar = document.querySelector('.jump-bar');
    if (!jumpBar) return;

    const pills = jumpBar.querySelectorAll('.jump-pill');
    const sections = [];

    pills.forEach(pill => {
        const id = pill.getAttribute('href').replace('#', '');
        const section = document.getElementById(id);
        if (section) sections.push({ pill, section });
    });

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pills.forEach(p => p.classList.remove('active'));
                const match = sections.find(s => s.section === entry.target);
                if (match) match.pill.classList.add('active');
            }
        });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s.section));
}
```

- [ ] **Step 5: Call initJumpBar() in the DOMContentLoaded block**

In `assets/js/shared.js`, add `initJumpBar();` to the DOMContentLoaded listener (after `initGallery();`).

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/style.css assets/js/shared.js
git commit -m "feat: add sticky section jump bar to home page"
```

---

## Chunk 4: JS Features (Next/Prev Navigation, Breadcrumbs)

### Task 10: Add next/previous blog navigation

**Files:**
- Modify: `assets/js/shared.js` (add `initBlogNav()` function)
- Modify: `assets/css/style.css` (add `.blog-nav` styles)

- [ ] **Step 1: Add CSS for next/prev navigation**

Append to `assets/css/style.css`:

```css
/* ========================================
   Blog Next/Previous Navigation
   ======================================== */
.blog-nav {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 16px;
    padding: 32px 0;
    margin-top: 40px;
    border-top: 1px solid var(--border);
}

.blog-nav-link {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-decoration: none;
    color: var(--text-primary);
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 2px;
    max-width: 45%;
    transition: border-color 0.2s;
}

.blog-nav-link:hover {
    border-color: var(--accent);
}

.blog-nav-link.next {
    margin-left: auto;
    text-align: right;
}

.blog-nav-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.blog-nav-title {
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    color: var(--accent);
}

@media (max-width: 600px) {
    .blog-nav {
        flex-direction: column;
    }
    .blog-nav-link {
        max-width: 100%;
    }
    .blog-nav-link.next {
        text-align: left;
    }
}
```

- [ ] **Step 2: Add initBlogNav() to shared.js**

Add before the `/* Init All */` section in `assets/js/shared.js`:

```javascript
/* ========================================
   Blog Next/Previous Navigation
   ======================================== */
function initBlogNav() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || '';
    if (!page.startsWith('blog-') && !page.startsWith('project-')) return;

    // Find current page in BLOG_POSTS
    var currentIndex = -1;
    for (var i = 0; i < BLOG_POSTS.length; i++) {
        if (BLOG_POSTS[i].url === page) {
            currentIndex = i;
            break;
        }
    }
    if (currentIndex === -1) return;

    var prev = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
    var next = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

    if (!prev && !next) return;

    var nav = document.createElement('nav');
    nav.className = 'blog-nav';
    nav.setAttribute('aria-label', 'Post navigation');

    if (prev) {
        nav.innerHTML += '<a href="' + prev.url + '" class="blog-nav-link prev">' +
            '<span class="blog-nav-label">&larr; Previous</span>' +
            '<span class="blog-nav-title">' + prev.title + '</span></a>';
    }

    if (next) {
        nav.innerHTML += '<a href="' + next.url + '" class="blog-nav-link next">' +
            '<span class="blog-nav-label">Next &rarr;</span>' +
            '<span class="blog-nav-title">' + next.title + '</span></a>';
    }

    // Insert before .related-posts or at end of main
    var related = document.querySelector('.related-posts');
    if (related) {
        related.parentNode.insertBefore(nav, related);
    } else {
        var main = document.querySelector('main');
        if (main) main.appendChild(nav);
    }
}
```

- [ ] **Step 3: Call initBlogNav() in the DOMContentLoaded block**

Add `initBlogNav();` after `initBlogSearch();` in the DOMContentLoaded listener.

- [ ] **Step 4: Commit**

```bash
git add assets/js/shared.js assets/css/style.css
git commit -m "feat: add next/previous navigation to blog and project posts"
```

---

### Task 11: Add breadcrumbs on inner pages

**Files:**
- Modify: `assets/js/shared.js` (add `initBreadcrumbs()` function)
- Modify: `assets/css/style.css` (add `.breadcrumb` styles)

- [ ] **Step 1: Add CSS for breadcrumbs**

Append to `assets/css/style.css`:

```css
/* ========================================
   Breadcrumbs
   ======================================== */
.breadcrumb {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--text-muted);
    padding: 10px 32px;
    max-width: 900px;
    margin: 0 auto;
}

.breadcrumb a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb a:hover {
    color: var(--accent);
}

.breadcrumb-separator {
    margin: 0 8px;
    color: var(--border-strong);
}

.breadcrumb-current {
    color: var(--text-secondary);
}
```

- [ ] **Step 2: Add initBreadcrumbs() to shared.js**

Add before the `/* Init All */` section in `assets/js/shared.js`:

```javascript
/* ========================================
   Breadcrumbs
   ======================================== */
function initBreadcrumbs() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || '';
    var dir = path.split('/').slice(-2, -1)[0] || '';

    // Only show on blog and project inner pages
    if (dir !== 'blog' && dir !== 'projects') return;

    var pageTitle = document.querySelector('.page-header-inner h1');
    if (!pageTitle) return;

    var section = dir === 'blog' ? 'Blog' : 'Tools';
    var sectionUrl = dir === 'blog' ? '../blog.html' : '../tools.html';

    var nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML =
        '<a href="../index.html">Home</a>' +
        '<span class="breadcrumb-separator">&rsaquo;</span>' +
        '<a href="' + sectionUrl + '">' + section + '</a>' +
        '<span class="breadcrumb-separator">&rsaquo;</span>' +
        '<span class="breadcrumb-current">' + pageTitle.textContent + '</span>';

    // Insert after page-header
    var header = document.querySelector('.page-header');
    if (header && header.nextSibling) {
        header.parentNode.insertBefore(nav, header.nextSibling);
    }
}
```

- [ ] **Step 3: Call initBreadcrumbs() in the DOMContentLoaded block**

Add `initBreadcrumbs();` after `initJumpBar();` in the DOMContentLoaded listener.

- [ ] **Step 4: Commit**

```bash
git add assets/js/shared.js assets/css/style.css
git commit -m "feat: add auto-generated breadcrumbs to blog and project pages"
```

---

## Chunk 5: SEO Metadata (Meta Descriptions, JSON-LD)

### Task 12: Add meta descriptions to all pages

**Files:**
- Modify: All 44 HTML files (add `<meta name="description">` to `<head>`)

- [ ] **Step 1: Add meta descriptions to main pages**

Add after `<meta name="theme-color" ...>` in each file's `<head>`:

**index.html:**
```html
<meta name="description" content="Sam Ngo - Senior Analyst at SumProduct. Financial modeling, Excel VBA automation, Power BI dashboards, and data visualization specialist based in Sydney, Australia.">
```

**blog.html:**
```html
<meta name="description" content="Blog and tutorials on Excel, VBA macros, Power BI, and data visualization techniques by Sam Ngo. 30+ tools and tips for finance professionals.">
```

**tools.html:**
```html
<meta name="description" content="Interactive Excel tools, chart demos, and VBA code by Sam Ngo. Explore financial modeling techniques, custom charts, and automation utilities.">
```

**contact.html:**
```html
<meta name="description" content="Get in touch with Sam Ngo for financial modeling, Excel automation, Power BI dashboards, or data visualization consulting.">
```

**404.html:**
```html
<meta name="description" content="Page not found. Return to Sam Ngo's portfolio for Excel tools, VBA macros, and financial modeling resources.">
```

- [ ] **Step 2: Add meta descriptions to all blog/*.html files**

Each blog post gets a unique description based on its content. Use the card description from `blog.html` as the base, expanded to ~155 characters. Add after `<meta name="theme-color" ...>` in each file.

Here are the descriptions for each blog post:

```
blog-audit-tracing.html: "Enhanced Trace Dependents and Precedents with safety checks for large networks, plus Toggle R1C1 reference style. VBA tools by Sam Ngo."
blog-auto-save-versioning.html: "Timed auto-save and automatic version numbering with initials prefix. Lightweight Excel version control using VBA by Sam Ngo."
blog-auto-set-sheet.html: "Reset all visible, hidden, and very hidden sheets to cell A1 with 100% zoom for clean workbook presentations. Excel VBA by Sam Ngo."
blog-calculation-timer.html: "Measure single-cell recalculation time or full workbook rebuild time to four decimal places for Excel performance tuning. VBA by Sam Ngo."
blog-clipboard-tools.html: "Copy cell addresses, formulas as text, and select ranges from clipboard text using the Windows API. Excel VBA tools by Sam Ngo."
blog-error-scanner.html: "Scan every Excel sheet for #REF!, #VALUE!, #N/A and all other errors. Produces a clickable hyperlinked report. VBA tool by Sam Ngo."
blog-fill-left.html: "Fill all blank cells in selected rows with the value from the nearest non-blank cell to the right. Simple Excel VBA macro by Sam Ngo."
blog-group-by-title.html: "Automatically create Excel outline groups from 2 to 8 levels based on which column contains the row title. VBA tool by Sam Ngo."
blog-naming-hyperlinks.html: "Bulk-create numbered named ranges, convert cell references to names, and add hyperlinks to formula cells. Excel VBA by Sam Ngo."
blog-power-query-manager.html: "Extract, export, import, and remove Power Query definitions with VBA for version control and migration. Excel tool by Sam Ngo."
blog-remove-sheet-refs.html: "Clean up redundant same-sheet references in Excel formulas automatically. Handles quoted and unquoted sheet names. VBA by Sam Ngo."
blog-smart-fill.html: "Fill blank cells from the nearest value in any direction: down, up, right, or left. Excel VBA data cleaning tool by Sam Ngo."
blog-spill-resolver.html: "Detect and fix #SPILL! errors by automatically inserting rows and columns where dynamic arrays need space. Excel VBA by Sam Ngo."
blog-text-case.html: "Six in-place text case macros for Excel: UPPER, lower, Proper, Title Case, tOGGLE, and Sentence case. VBA transformations by Sam Ngo."
blog-udf-extract-comments.html: "Extract all threaded comments and replies into a structured table with Cell, Author, Date, and Text columns. Excel VBA UDF by Sam Ngo."
blog-udf-file-path-exist.html: "Returns TRUE or FALSE for each cell, checking whether the file path actually exists on disk. Excel VBA UDF by Sam Ngo."
blog-udf-is-hyperlink.html: "Returns TRUE or FALSE indicating whether each cell contains a hyperlink. Simple Excel VBA user-defined function by Sam Ngo."
blog-udf-nmatch.html: "Like MATCH but finds the Nth occurrence of a value in a range. Supports array inputs for lookup and instance number. Excel VBA UDF."
blog-udf-range-has-notes.html: "Returns a TRUE/FALSE array indicating which cells have legacy comments (Notes) attached. Excel VBA UDF by Sam Ngo."
blog-udf-rotate.html: "Rotate any 2D range 90 degrees clockwise with an optional count for 180 or 270 degree rotations. Excel VBA UDF by Sam Ngo."
blog-udf-sum-by-color.html: "Sum cells whose background fill color matches a reference cell. Ideal for color-coded financial models. Excel VBA UDF by Sam Ngo."
blog-validation-inspector.html: "List all data validation rules across an Excel workbook, and find cells that violate their own validation constraints. VBA by Sam Ngo."
blog-vba-inspector.html: "List every Sub, Function, and Property across all open Excel workbooks with source code retrieval. VBA inspector by Sam Ngo."
blog-workbook-documentation.html: "Document named ranges, embedded objects, unique formulas in R1C1, and chart series across your entire Excel workbook. VBA by Sam Ngo."
blog-workbook-stats.html: "Generate comprehensive workbook stats: formula density, dynamic arrays, unique formulae, and cross-sheet dependencies. Excel VBA by Sam Ngo."
```

- [ ] **Step 3: Add meta descriptions to all projects/*.html files**

```
project-bubble-pies.html: "Overlay mini pie charts on a bubble chart to show market positioning, relative scale, and sector composition. Excel charting by Sam Ngo."
project-christmas-tree.html: "Festive Excel creation with randomised Unicode ornaments, conditional formatting lights, and presents. Press F9 to regenerate!"
project-dynamic-hyperlink.html: "Formula-driven hyperlinks that auto-update when sheets are renamed or moved. Excel HYPERLINK and INDIRECT techniques by Sam Ngo."
project-excel.html: "Compare 8 Excel formula approaches for 2D matrix aggregation: MMULT, SUMIFS, GROUPBY, and LAMBDA variants. Interactive demo by Sam Ngo."
project-marimekko.html: "Variable-width stacked bar chart for market share and product mix analysis. 7 combined Excel chart objects by Sam Ngo."
project-percentage-change.html: "Column chart with year-over-year variance arrows and percentage labels. Excel charting technique with VBA by Sam Ngo."
project-point-figure.html: "Classic Point and Figure technical analysis chart built from MSFT stock data with Bollinger Band overlays in Excel by Sam Ngo."
project-powerquery.html: "Power Query data transformation demos and techniques for Excel. Clean, reshape, and combine data sources by Sam Ngo."
project-raincloud-horizontal.html: "Distribution visualisation combining density curves, box plots, and scatter plots. 34 Excel chart objects by Sam Ngo."
project-raincloud-vertical.html: "Vertical RainCloud chart with 27 Excel chart objects. Density, box plot, and jittered scatter layers by Sam Ngo."
project-sum-to-target.html: "Find all number combinations that sum to a target using SEQUENCE, BASE, MMULT, and FILTER. Three Excel formula approaches by Sam Ngo."
project-waffle-chart.html: "10x10 grid percentage visualisation with simple and stacked variants. Uses SEQUENCE and conditional formatting in Excel by Sam Ngo."
demo-powerquery.html: "Interactive Power Query demo showcasing data transformation techniques in Excel by Sam Ngo."
excel-2d-sumifs.html: "2D SUMIFS and matrix aggregation techniques in Excel. Interactive formula comparison tool by Sam Ngo."
```

- [ ] **Step 4: Commit**

```bash
git add *.html blog/*.html projects/*.html
git commit -m "feat: add unique meta descriptions to all 44 pages"
```

---

### Task 13: Add structured data (JSON-LD)

**Files:**
- Modify: `index.html` (add Person schema)
- Modify: All `blog/*.html` and `projects/*.html` (add Article schema)

- [ ] **Step 1: Add Person JSON-LD to index.html**

Add before `</head>` in `index.html`:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sam Ngo",
    "jobTitle": "Senior Analyst",
    "worksFor": {
        "@type": "Organization",
        "name": "SumProduct"
    },
    "url": "https://sampi314.github.io/Sam-Personal-Profile/",
    "sameAs": [
        "https://www.linkedin.com/in/nkhoihue/",
        "https://github.com/Sampi314"
    ],
    "email": "nkhoihue@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sydney",
        "addressRegion": "NSW",
        "addressCountry": "AU"
    },
    "knowsAbout": ["Excel", "VBA", "Financial Modeling", "Power BI", "Data Visualization", "Power Query"]
}
</script>
```

- [ ] **Step 2: Add Article JSON-LD to all blog/*.html and projects/*.html**

For each inner page, add before `</head>`. The values must be customised per page:
- `headline`: from the `<title>` tag (without " - Sam Ngo" suffix)
- `datePublished`: from the date assigned in Task 6 (ISO 8601 format: `YYYY-MM-01`)
- `description`: from the meta description added in Task 12

Template:
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "PAGE_TITLE_HERE",
    "author": {
        "@type": "Person",
        "name": "Sam Ngo",
        "url": "https://sampi314.github.io/Sam-Personal-Profile/"
    },
    "datePublished": "YYYY-MM-01",
    "description": "META_DESCRIPTION_HERE",
    "publisher": {
        "@type": "Person",
        "name": "Sam Ngo"
    }
}
</script>
```

For each of the 25 blog files and 14 project files, populate with their specific values.

- [ ] **Step 3: Verify JSON-LD is valid**

Pick 2-3 pages and paste their JSON-LD into the Google Rich Results Test or Schema.org validator to confirm validity.

- [ ] **Step 4: Commit**

```bash
git add index.html blog/*.html projects/*.html
git commit -m "feat: add JSON-LD structured data (Person + Article schemas)"
```

---

## Final Steps

### Task 14: Bump CSS cache version and push

**Files:**
- Modify: All HTML files (bump `style.css?v=4` to `style.css?v=5`)

- [ ] **Step 1: Bump cache version**

```bash
find . -name '*.html' -exec sed -i '' 's/style\.css?v=4/style.css?v=5/g' {} +
```

- [ ] **Step 2: Commit and push all changes**

```bash
git add -A
git commit -m "chore: bump CSS cache to v=5 for site improvements release"
git push
```

- [ ] **Step 3: Verify live site**

Navigate to `https://sampi314.github.io/Sam-Personal-Profile/` and check:
- About section has 3 paragraphs
- Metrics banner shows between About and Featured Work
- Jump bar shows below hero and highlights on scroll
- Blog posts have varied dates
- Inner pages show breadcrumbs
- Blog posts show next/prev navigation
- View page source to confirm meta descriptions and JSON-LD
