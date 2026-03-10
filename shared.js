/* ========================================
   Theme Toggle
   ======================================== */
function initTheme() {
    // One-time migration: old site used 'dark' value, new site defaults to dark
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        localStorage.removeItem('theme');
    }
    // Dark is default (no data-theme attribute). Only set light explicitly.
    if (localStorage.getItem('theme') === 'light') {
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

/* ========================================
   Sticky Navbar Scroll Effect
   ======================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile hamburger
    const hamburger = document.querySelector('.nav-hamburger');
    const links = document.querySelector('.nav-links');
    if (hamburger && links) {
        hamburger.addEventListener('click', () => {
            links.classList.toggle('open');
        });
        // Close on link click
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('open'));
        });
    }
}

/* ========================================
   Scroll-in Animations
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* ========================================
   Contact Form Handler
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Open mailto as fallback
        const mailtoLink = `mailto:nkhoihue@gmail.com?subject=${encodeURIComponent(subject || 'Website Contact')}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        window.location.href = mailtoLink;

        // Show confirmation
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.textContent;
        btn.textContent = 'Opening email client...';
        setTimeout(() => { btn.textContent = originalText; }, 3000);
    });
}

/* ========================================
   Hero Particle Animation
   ======================================== */
function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let paused = false;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const area = canvas.width * canvas.height;
        const count = Math.min(Math.floor(area / 12000), 60);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.2
            });
        }
    }

    function draw() {
        if (paused) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const lineDistance = 120;

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < lineDistance) {
                    const opacity = (1 - dist / lineDistance) * 0.08;
                    ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
            ctx.fill();
        }

        animId = requestAnimationFrame(draw);
    }

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            paused = true;
            cancelAnimationFrame(animId);
        } else {
            paused = false;
            draw();
        }
    });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            createParticles();
        }, 200);
    });

    resize();
    createParticles();
    draw();
}

/* ========================================
   Card Thumbnail SVG Generator
   ======================================== */
function generateCardThumbnails() {
    const cards = document.querySelectorAll('[data-card-theme]');
    cards.forEach(card => {
        const theme = card.getAttribute('data-card-theme');
        const svg = createThemeSVG(theme);
        if (svg) {
            const thumb = document.createElement('div');
            thumb.className = 'card-thumbnail';
            thumb.innerHTML = svg;
            // Insert at the beginning of the card, before any other content
            card.insertBefore(thumb, card.firstChild);
        }
    });
}

function createThemeSVG(theme) {
    const w = 400;
    const h = 72;
    const themes = {
        excel: () => {
            // Green grid pattern
            let cells = '';
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 16; c++) {
                    const opacity = 0.08 + Math.random() * 0.18;
                    const x = c * 26 + 4;
                    const y = r * 18 + 3;
                    cells += `<rect x="${x}" y="${y}" width="22" height="15" rx="1" fill="rgba(34,139,34,${opacity})" />`;
                }
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${cells}</svg>`;
        },
        vba: () => {
            // Blue code bracket pattern
            let elems = '';
            const blues = ['rgba(59,130,246,0.12)', 'rgba(59,130,246,0.08)', 'rgba(59,130,246,0.18)'];
            for (let i = 0; i < 8; i++) {
                const x = 20 + i * 48;
                const y = 10 + (i % 3) * 8;
                const col = blues[i % 3];
                elems += `<text x="${x}" y="${y + 22}" font-family="monospace" font-size="28" fill="${col}" opacity="0.7">{ }</text>`;
            }
            // Subtle horizontal lines like code
            for (let i = 0; i < 5; i++) {
                const y = 12 + i * 13;
                const x1 = 30 + Math.random() * 40;
                const w1 = 40 + Math.random() * 80;
                elems += `<rect x="${x1}" y="${y}" width="${w1}" height="3" rx="1.5" fill="rgba(59,130,246,0.06)" />`;
                elems += `<rect x="${x1 + w1 + 8}" y="${y}" width="${w1 * 0.6}" height="3" rx="1.5" fill="rgba(59,130,246,0.04)" />`;
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        powerbi: () => {
            // Amber chart bars
            let bars = '';
            const heights = [28, 45, 35, 55, 42, 50, 30, 48, 38, 52, 25, 44, 58, 33, 47, 40];
            for (let i = 0; i < 16; i++) {
                const x = 12 + i * 24;
                const bh = heights[i];
                const opacity = 0.1 + (bh / 58) * 0.15;
                bars += `<rect x="${x}" y="${h - bh}" width="18" height="${bh}" rx="1" fill="rgba(212,160,32,${opacity})" />`;
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${bars}</svg>`;
        },
        charting: () => {
            // Colorful data viz shapes
            let shapes = '';
            const colors = [
                'rgba(212,160,32,0.18)', 'rgba(34,139,34,0.15)',
                'rgba(59,130,246,0.15)', 'rgba(220,38,38,0.12)',
                'rgba(168,85,247,0.12)', 'rgba(14,165,133,0.15)'
            ];
            // Scatter dots
            for (let i = 0; i < 20; i++) {
                const cx = 20 + Math.random() * 360;
                const cy = 10 + Math.random() * 52;
                const r = 3 + Math.random() * 6;
                shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors[i % colors.length]}" />`;
            }
            // Line chart trace
            let path = 'M 10 50';
            for (let i = 1; i <= 12; i++) {
                path += ` L ${10 + i * 32} ${20 + Math.random() * 35}`;
            }
            shapes += `<path d="${path}" fill="none" stroke="rgba(212,160,32,0.15)" stroke-width="2" />`;
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${shapes}</svg>`;
        },
        powerquery: () => {
            // Teal flow arrows
            let elems = '';
            for (let i = 0; i < 6; i++) {
                const x = 20 + i * 66;
                const y = 22;
                elems += `<rect x="${x}" y="${y}" width="40" height="28" rx="4" fill="rgba(14,165,133,${0.08 + i * 0.02})" stroke="rgba(14,165,133,0.12)" stroke-width="1" />`;
                if (i < 5) {
                    elems += `<path d="M ${x + 44} ${y + 14} l 14 0 l -5 -5 m 5 5 l -5 5" fill="none" stroke="rgba(14,165,133,0.2)" stroke-width="1.5" />`;
                }
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        finance: () => {
            // Gold line chart with area
            let path = 'M 0 55';
            let area = 'M 0 55';
            const pts = [55, 42, 48, 30, 35, 22, 28, 18, 25, 20, 15, 22, 12, 18];
            for (let i = 0; i < pts.length; i++) {
                const x = i * 30;
                path += ` L ${x} ${pts[i]}`;
                area += ` L ${x} ${pts[i]}`;
            }
            area += ` L ${(pts.length - 1) * 30} ${h} L 0 ${h} Z`;
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <path d="${area}" fill="rgba(184,134,11,0.06)" />
                <path d="${path}" fill="none" stroke="rgba(184,134,11,0.2)" stroke-width="1.5" />
            </svg>`;
        },
        statistics: () => {
            // Purple distribution curve
            let elems = '';
            // Bell curve
            let curvePath = 'M 40 65';
            for (let i = 0; i <= 40; i++) {
                const x = 40 + i * 8;
                const gauss = Math.exp(-0.5 * Math.pow((i - 20) / 8, 2));
                const y = 65 - gauss * 52;
                curvePath += ` L ${x} ${y}`;
            }
            curvePath += ` L 360 65`;
            elems += `<path d="${curvePath}" fill="rgba(168,85,247,0.07)" stroke="rgba(168,85,247,0.2)" stroke-width="1.5" />`;
            // Scatter dots
            for (let i = 0; i < 25; i++) {
                const x = 80 + Math.random() * 240;
                const dist = (x - 200) / 120;
                const y = 60 - Math.exp(-0.5 * dist * dist) * 45 + Math.random() * 12;
                elems += `<circle cx="${x}" cy="${y}" r="2" fill="rgba(168,85,247,0.15)" />`;
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        fun: () => {
            // Festive colored dots and stars
            let elems = '';
            const festiveColors = [
                'rgba(220,38,38,0.2)', 'rgba(34,139,34,0.2)',
                'rgba(212,160,32,0.2)', 'rgba(59,130,246,0.15)',
                'rgba(168,85,247,0.15)'
            ];
            for (let i = 0; i < 30; i++) {
                const cx = 10 + Math.random() * 380;
                const cy = 5 + Math.random() * 62;
                const r = 2 + Math.random() * 5;
                elems += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${festiveColors[i % festiveColors.length]}" />`;
            }
            // A few star shapes
            for (let i = 0; i < 4; i++) {
                const cx = 60 + i * 90;
                const cy = 25 + (i % 2) * 20;
                elems += `<text x="${cx}" y="${cy}" font-size="16" fill="rgba(212,160,32,0.2)">&#9733;</text>`;
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        algorithms: () => {
            // Cyan binary/matrix pattern
            let elems = '';
            const chars = '01';
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 28; c++) {
                    const ch = chars[Math.floor(Math.random() * 2)];
                    const opacity = 0.06 + Math.random() * 0.1;
                    elems += `<text x="${6 + c * 14}" y="${14 + r * 17}" font-family="monospace" font-size="11" fill="rgba(6,182,212,${opacity})">${ch}</text>`;
                }
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        formulas: () => {
            // Green matrix dots (like a spreadsheet)
            let elems = '';
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 18; c++) {
                    const opacity = 0.05 + Math.random() * 0.15;
                    const size = 3 + Math.random() * 4;
                    elems += `<circle cx="${14 + c * 22}" cy="${10 + r * 17}" r="${size}" fill="rgba(34,139,34,${opacity})" />`;
                }
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        automation: () => {
            // Blue gear/flow pattern
            let elems = '';
            // Flow lines
            for (let i = 0; i < 5; i++) {
                const y = 10 + i * 14;
                elems += `<line x1="20" y1="${y}" x2="${350 + Math.random() * 30}" y2="${y}" stroke="rgba(59,130,246,0.06)" stroke-width="1" />`;
            }
            // Gear-like circles at intersections
            for (let i = 0; i < 7; i++) {
                const cx = 40 + i * 52;
                const cy = 18 + (i % 3) * 18;
                const r = 8 + Math.random() * 4;
                elems += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(59,130,246,0.12)" stroke-width="1.5" />`;
                elems += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="rgba(59,130,246,0.1)" />`;
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        navigation: () => {
            // Link/arrow pattern
            let elems = '';
            for (let i = 0; i < 6; i++) {
                const x = 30 + i * 60;
                const y = 20 + (i % 2) * 16;
                elems += `<rect x="${x}" y="${y}" width="36" height="22" rx="3" fill="rgba(34,139,34,${0.06 + i * 0.015})" stroke="rgba(34,139,34,0.1)" stroke-width="1" />`;
                if (i < 5) {
                    elems += `<path d="M ${x + 40} ${y + 11} l 12 0" stroke="rgba(34,139,34,0.12)" stroke-width="1" stroke-dasharray="3 2" />`;
                }
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        },
        dax: () => {
            // Amber measure/KPI pattern
            let elems = '';
            // KPI card outlines
            for (let i = 0; i < 4; i++) {
                const x = 15 + i * 98;
                elems += `<rect x="${x}" y="12" width="82" height="48" rx="3" fill="rgba(212,160,32,0.04)" stroke="rgba(212,160,32,0.1)" stroke-width="1" />`;
                // Mini bar inside
                const bh = 12 + Math.random() * 20;
                elems += `<rect x="${x + 10}" y="${60 - bh}" width="16" height="${bh}" rx="1" fill="rgba(212,160,32,0.1)" />`;
                elems += `<rect x="${x + 30}" y="${60 - bh * 0.7}" width="16" height="${bh * 0.7}" rx="1" fill="rgba(212,160,32,0.07)" />`;
                elems += `<rect x="${x + 50}" y="${60 - bh * 0.85}" width="16" height="${bh * 0.85}" rx="1" fill="rgba(212,160,32,0.08)" />`;
            }
            return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
        }
    };

    const fn = themes[theme];
    return fn ? fn() : null;
}

/* Larger SVG for featured cards and hero cards */
function createThemeSVGLarge(theme) {
    // Use the same patterns but in a taller viewport
    const small = createThemeSVG(theme);
    if (!small) return null;
    // Replace viewBox height to fill larger containers naturally
    return small;
}

/* ========================================
   Project Placeholder SVG Generator
   ======================================== */
function generateProjectPlaceholders() {
    const placeholders = document.querySelectorAll('.project-placeholder[data-placeholder-theme]');
    placeholders.forEach(el => {
        const theme = el.getAttribute('data-placeholder-theme');
        const svg = createPlaceholderSVG(theme);
        if (svg) el.innerHTML = svg;
    });
}

function createPlaceholderSVG(theme) {
    const w = 400;
    const h = 160;
    const themeColors = {
        excel: { primary: 'rgba(34,139,34,', accent: 'rgba(34,100,34,' },
        charting: { primary: 'rgba(212,160,32,', accent: 'rgba(59,130,246,' },
        finance: { primary: 'rgba(184,134,11,', accent: 'rgba(184,134,11,' },
        vba: { primary: 'rgba(59,130,246,', accent: 'rgba(59,130,246,' },
        powerbi: { primary: 'rgba(212,160,32,', accent: 'rgba(212,160,32,' },
        statistics: { primary: 'rgba(168,85,247,', accent: 'rgba(168,85,247,' },
        algorithms: { primary: 'rgba(6,182,212,', accent: 'rgba(6,182,212,' },
        fun: { primary: 'rgba(220,38,38,', accent: 'rgba(34,139,34,' }
    };

    const c = themeColors[theme] || themeColors.excel;
    let elems = '';

    // Decorative spreadsheet-like grid
    for (let r = 0; r < 6; r++) {
        for (let col = 0; col < 12; col++) {
            const x = 40 + col * 28;
            const y = 20 + r * 22;
            const opacity = 0.04 + Math.random() * 0.08;
            elems += `<rect x="${x}" y="${y}" width="24" height="18" rx="2" fill="${c.primary}${opacity})" />`;
        }
    }

    // Central icon suggestion
    elems += `<circle cx="200" cy="80" r="28" fill="${c.primary}0.06)" stroke="${c.primary}0.12)" stroke-width="1.5" />`;
    elems += `<text x="200" y="86" text-anchor="middle" font-family="serif" font-size="18" fill="${c.primary}0.25)">fx</text>`;

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${elems}</svg>`;
}

/* ========================================
   Iframe loading state
   ======================================== */
function initIframeLoading() {
    const iframes = document.querySelectorAll('.demo-container iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', () => {
            iframe.classList.add('loaded');
        });
    });
}

/* ========================================
   SN Monogram Logo
   ======================================== */
function getSNLogoSVG(size) {
    size = size || 28;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0.5" y="0.5" width="31" height="31" rx="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>' +
        '<text x="16" y="22" text-anchor="middle" font-family="\'Space Mono\', monospace" font-size="14" font-weight="700" fill="currentColor">SN</text>' +
    '</svg>';
}

function initNavLogo() {
    var brand = document.querySelector('.nav-brand');
    if (!brand) return;
    brand.innerHTML = getSNLogoSVG(28);
}

/* ========================================
   Init All
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavLogo();
    initNavbar();
    initScrollAnimations();
    initContactForm();
    initHeroParticles();
    generateCardThumbnails();
    generateProjectPlaceholders();
    initIframeLoading();
});
