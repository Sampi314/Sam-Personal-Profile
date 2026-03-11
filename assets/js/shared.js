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
                // Animate skill bars when section becomes visible
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 80px 0px' });

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
function initParticleCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let animId;
    let paused = false;
    let scrollY = 0;

    // Three depth layers: back, mid, front
    const layers = [
        { particles: [], speed: 0.12, size: [0.5, 1.2], alpha: [0.15, 0.3],  lineAlpha: 0.08, lineDist: 100, parallax: 0.02, color: '245, 158, 11' },
        { particles: [], speed: 0.25, size: [1.0, 2.2], alpha: [0.35, 0.6],  lineAlpha: 0.18, lineDist: 130, parallax: 0.05, color: '245, 158, 11' },
        { particles: [], speed: 0.45, size: [1.8, 3.5], alpha: [0.55, 0.85], lineAlpha: 0.30, lineDist: 160, parallax: 0.10, color: '245, 158, 11' },
    ];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        const area = canvas.width * canvas.height;
        // Back layer: many small particles. Mid: moderate. Front: fewer large ones.
        const counts = [
            Math.min(Math.floor(area / 18000), 50),
            Math.min(Math.floor(area / 22000), 35),
            Math.min(Math.floor(area / 35000), 20),
        ];
        layers.forEach((layer, i) => {
            layer.particles = [];
            for (let n = 0; n < counts[i]; n++) {
                layer.particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * layer.speed,
                    vy: (Math.random() - 0.5) * layer.speed,
                    r: Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0],
                    alpha: Math.random() * (layer.alpha[1] - layer.alpha[0]) + layer.alpha[0],
                });
            }
        });
    }

    function draw() {
        if (paused) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const layer of layers) {
            const offsetY = scrollY * layer.parallax;

            // Draw connecting lines for this layer
            for (let i = 0; i < layer.particles.length; i++) {
                for (let j = i + 1; j < layer.particles.length; j++) {
                    const a = layer.particles[i];
                    const b = layer.particles[j];
                    const ay = a.y - offsetY;
                    const by = b.y - offsetY;
                    const dx = a.x - b.x;
                    const dy = ay - by;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < layer.lineDist) {
                        const opacity = (1 - dist / layer.lineDist) * layer.lineAlpha;
                        ctx.strokeStyle = `rgba(${layer.color}, ${opacity})`;
                        ctx.lineWidth = layer === layers[2] ? 1.0 : layer === layers[1] ? 0.7 : 0.4;
                        ctx.beginPath();
                        ctx.moveTo(a.x, ay);
                        ctx.lineTo(b.x, by);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles for this layer
            for (const p of layer.particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                const drawY = p.y - offsetY;
                ctx.beginPath();
                ctx.arc(p.x, drawY, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${layer.color}, ${p.alpha})`;
                ctx.fill();

                // Glow on front layer particles
                if (layer === layers[2] && p.r > 2.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, drawY, p.r * 2.5, 0, Math.PI * 2);
                    const glow = ctx.createRadialGradient(p.x, drawY, p.r * 0.5, p.x, drawY, p.r * 2.5);
                    glow.addColorStop(0, `rgba(${layer.color}, ${p.alpha * 0.3})`);
                    glow.addColorStop(1, `rgba(${layer.color}, 0)`);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }
            }
        }

        animId = requestAnimationFrame(draw);
    }

    // Track scroll for parallax
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            paused = true;
            cancelAnimationFrame(animId);
        } else {
            paused = false;
            draw();
        }
    });

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

function initHeroParticles() {
    document.querySelectorAll('.hero-canvas').forEach(initParticleCanvas);
}

/* ========================================
   Card Thumbnail SVG Generator
   ======================================== */
function generateCardThumbnails() {
    const cards = document.querySelectorAll('[data-card-theme]:not(.featured-card)');
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
   Back to Top Button
   ======================================== */
function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   Footer Logo
   ======================================== */
function initFooterLogo() {
    var el = document.querySelector('.footer-logo');
    if (!el) return;
    el.innerHTML = getSNLogoSVG(24);
}

/* ========================================
   Blog Post Registry (for Related Posts)
   ======================================== */
var BLOG_POSTS = [
    { url: 'blog-udf-sum-by-color.html', title: 'fn_Sum_by_Color: Sum Cells by Fill Color', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-01' },
    { url: 'blog-udf-range-has-notes.html', title: 'fn_Range_Has_Notes: Detect Cell Comments', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-01' },
    { url: 'blog-udf-extract-comments.html', title: 'fn_Extract_Comments_Thread: Export Threaded Comments', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-01' },
    { url: 'blog-udf-nmatch.html', title: 'fn_NMATCH: Find the Nth Occurrence', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-02' },
    { url: 'blog-udf-rotate.html', title: 'fn_ROTATE: Rotate a 2D Range', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-02' },
    { url: 'blog-udf-file-path-exist.html', title: 'fn_Does_File_Path_Exist: Check File Paths', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-02' },
    { url: 'blog-udf-is-hyperlink.html', title: 'fn_Is_Hyperlink: Detect Hyperlinks', tags: ['Excel','VBA','UDF'], theme: 'formulas', date: '2026-02' },
    { url: 'blog-calculation-timer.html', title: 'Formula Calculation Timer', tags: ['VBA','Performance'], theme: 'vba', date: '2025-01' },
    { url: 'blog-naming-hyperlinks.html', title: 'Mass Naming & Hyperlink Tools', tags: ['VBA','Named Ranges'], theme: 'vba', date: '2025-01' },
    { url: 'blog-smart-fill.html', title: 'Smart Fill in All Four Directions', tags: ['VBA','Data Cleaning'], theme: 'vba', date: '2025-02' },
    { url: 'blog-vba-inspector.html', title: 'VBA Code Inspector', tags: ['VBA','Development'], theme: 'vba', date: '2025-05' },
    { url: 'blog-auto-save-versioning.html', title: 'Auto Save & Version Control', tags: ['VBA','Automation'], theme: 'vba', date: '2025-04' },
    { url: 'blog-group-by-title.html', title: 'Auto-Grouping Rows by Title Hierarchy', tags: ['VBA','Outlining'], theme: 'vba', date: '2025-02' },
    { url: 'blog-spill-resolver.html', title: 'Dynamic Array Spill Resolver', tags: ['VBA','Dynamic Arrays'], theme: 'vba', date: '2025-11' },
    { url: 'blog-text-case.html', title: 'Text Case Transformations', tags: ['VBA','Text'], theme: 'vba', date: '2025-03' },
    { url: 'blog-workbook-stats.html', title: 'Workbook Statistics Report', tags: ['VBA','Analytics'], theme: 'vba', date: '2025-12' },
    { url: 'blog-error-scanner.html', title: 'Workbook Error Scanner', tags: ['VBA','Error Handling'], theme: 'vba', date: '2025-10' },
    { url: 'blog-power-query-manager.html', title: 'Power Query Manager', tags: ['VBA','Power Query'], theme: 'vba', date: '2025-06' },
    { url: 'blog-validation-inspector.html', title: 'Data Validation Inspector', tags: ['VBA','Data Validation'], theme: 'vba', date: '2025-08' },
    { url: 'blog-workbook-documentation.html', title: 'Workbook Documentation Suite', tags: ['VBA','Documentation'], theme: 'vba', date: '2025-07' },
    { url: 'blog-audit-tracing.html', title: 'Audit & Formula Tracing Tools', tags: ['VBA','Auditing'], theme: 'vba', date: '2025-09' },
    { url: 'blog-clipboard-tools.html', title: 'Clipboard Power Tools', tags: ['VBA','Clipboard'], theme: 'vba', date: '2025-03' },
    { url: 'blog-remove-sheet-refs.html', title: 'Removing Same-Sheet References', tags: ['VBA','Automation'], theme: 'vba', date: '2024-09' },
    { url: 'blog-fill-left.html', title: 'Fill Blank Cells to the Left', tags: ['VBA','Automation'], theme: 'vba', date: '2024-11' },
    { url: 'blog-auto-set-sheet.html', title: 'Automating Sheet Setup', tags: ['VBA','Automation'], theme: 'vba', date: '2024-09' },
    { url: 'project-bubble-pies.html', title: 'Bubble Pies Chart', tags: ['Excel','Charting','VBA'], theme: 'charting', date: '2025-03' },
    { url: 'project-marimekko.html', title: 'Marimekko Chart', tags: ['Excel','Charting','Market Analysis'], theme: 'charting', date: '2025-04' },
    { url: 'project-percentage-change.html', title: 'Percentage Change Column Chart', tags: ['Excel','Charting','VBA'], theme: 'charting', date: '2025-05' },
    { url: 'project-waffle-chart.html', title: 'Waffle Charts in Excel', tags: ['Excel','Charting','VBA'], theme: 'charting', date: '2025-06' },
    { url: 'project-raincloud-horizontal.html', title: 'Horizontal RainCloud Charts', tags: ['Excel','Statistics','VBA'], theme: 'statistics', date: '2025-08' },
    { url: 'project-raincloud-vertical.html', title: 'Vertical RainCloud Charts', tags: ['Excel','Statistics','VBA'], theme: 'statistics', date: '2025-09' },
    { url: 'project-point-figure.html', title: 'Point & Figure Chart', tags: ['Excel','Finance','VBA'], theme: 'finance', date: '2025-11' },
    { url: 'project-christmas-tree.html', title: 'Christmas Tree Light Generator', tags: ['Excel','Fun','VBA'], theme: 'fun', date: '2024-12' },
    { url: 'project-excel.html', title: 'Matrix Manipulation Formula Engine', tags: ['Excel','Formulas','Interactive'], theme: 'excel', date: '2026-01' },
    { url: 'project-sum-to-target.html', title: 'Subset Sum Problem with Formulas', tags: ['Excel','Algorithms','Dynamic Arrays'], theme: 'algorithms', date: '2026-02' },
    { url: 'project-dynamic-hyperlink.html', title: 'Dynamic Hyperlinks That Never Break', tags: ['Excel','Formulas','Navigation'], theme: 'navigation', date: '2026-03' }
];

/* ========================================
   Related Posts
   ======================================== */
function initRelatedPosts() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || '';
    if (!page.startsWith('blog-') && !page.startsWith('project-')) return;

    const container = document.querySelector('.related-posts');
    if (!container) return;

    // Get current page tags
    const currentTags = new Set();
    document.querySelectorAll('.overview-prominent .card-tag').forEach(t => {
        currentTags.add(t.textContent.trim());
    });
    if (currentTags.size === 0) return;

    // Score each post by tag overlap
    const scored = BLOG_POSTS
        .filter(p => p.url !== page)
        .map(p => {
            const overlap = p.tags.filter(t => currentTags.has(t)).length;
            return { ...p, score: overlap };
        })
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (scored.length === 0) {
        container.remove();
        return;
    }

    let html = '<h2>Related Posts</h2><div class="related-grid">';
    scored.forEach(p => {
        const tagsHtml = p.tags.map(t => `<span class="card-tag">${t}</span>`).join('');
        html += `<a href="${p.url}" class="card" data-card-theme="${p.theme || 'excel'}">
            <h3>${p.title}</h3>
            <div class="card-tags">${tagsHtml}</div>
        </a>`;
    });
    html += '</div>';
    container.innerHTML = html;

    // Generate thumbnails for the new cards
    container.querySelectorAll('[data-card-theme]').forEach(card => {
        const theme = card.getAttribute('data-card-theme');
        const svg = createThemeSVG(theme);
        if (svg) {
            const thumb = document.createElement('div');
            thumb.className = 'card-thumbnail';
            thumb.innerHTML = svg;
            card.insertBefore(thumb, card.firstChild);
        }
    });
}

/* ========================================
   Table of Contents (Blog/Project Posts)
   ======================================== */
function initTOC() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || '';
    if (!page.startsWith('blog-') && !page.startsWith('project-')) return;

    const headings = document.querySelectorAll('main section h2');
    if (headings.length < 3) return;

    const sidebar = document.createElement('nav');
    sidebar.className = 'toc-sidebar';
    sidebar.setAttribute('aria-label', 'Table of contents');

    const title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = 'Contents';
    sidebar.appendChild(title);

    headings.forEach((h, i) => {
        const id = 'section-' + i;
        h.closest('section').id = id;

        const link = document.createElement('a');
        link.className = 'toc-link';
        link.href = '#' + id;
        link.textContent = h.textContent;
        sidebar.appendChild(link);
    });

    document.body.appendChild(sidebar);

    // Highlight current section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                sidebar.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    headings.forEach(h => {
        const section = h.closest('section');
        if (section) observer.observe(section);
    });
}

/* ========================================
   Blog Tag Filtering
   ======================================== */
function initTagFilter() {
    const bar = document.querySelector('.tag-filter-bar');
    if (!bar) return;

    // Collect all filterable items: cards, featured cards, sub-cards, hero card
    const allItems = document.querySelectorAll('.card-grid .card, .blog-featured .blog-hero-card, .blog-featured .blog-sub-card');
    const dividers = document.querySelectorAll('.blog-divider');
    const grids = document.querySelectorAll('.card-grid');

    // Extract unique tags
    const tagSet = new Set();
    allItems.forEach(item => {
        item.querySelectorAll('.card-tag').forEach(tag => {
            tagSet.add(tag.textContent.trim());
        });
    });

    const tags = Array.from(tagSet).sort();

    // Create "All" pill
    const allPill = document.createElement('button');
    allPill.className = 'tag-pill active';
    allPill.textContent = 'All';
    bar.appendChild(allPill);

    // Create tag pills
    tags.forEach(tag => {
        const pill = document.createElement('button');
        pill.className = 'tag-pill';
        pill.textContent = tag;
        pill.setAttribute('data-tag', tag);
        bar.appendChild(pill);
    });

    let activeTag = null;

    bar.addEventListener('click', (e) => {
        const pill = e.target.closest('.tag-pill');
        if (!pill) return;

        bar.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        activeTag = pill.getAttribute('data-tag') || null;
        applyBlogFilters();
    });

    // Expose for search integration
    window._blogActiveTag = () => activeTag;
    window._applyBlogFilters = applyBlogFilters;
    window._blogAllItems = allItems;
    window._blogDividers = dividers;
    window._blogGrids = grids;

    function applyBlogFilters() {
        const searchTerm = (document.querySelector('.blog-search-input')?.value || '').toLowerCase().trim();
        const tag = window._blogActiveTag ? window._blogActiveTag() : activeTag;

        let anyVisible = false;

        allItems.forEach(item => {
            const itemTags = Array.from(item.querySelectorAll('.card-tag')).map(t => t.textContent.trim());
            const title = (item.querySelector('h3')?.textContent || '').toLowerCase();
            const desc = (item.querySelector('p')?.textContent || '').toLowerCase();
            const tagText = itemTags.join(' ').toLowerCase();

            const matchesTag = !tag || itemTags.includes(tag);
            const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || tagText.includes(searchTerm);

            if (matchesTag && matchesSearch) {
                item.classList.remove('blog-item-hidden');
                anyVisible = true;
            } else {
                item.classList.add('blog-item-hidden');
            }
        });

        // Hide sections with no visible cards
        grids.forEach(grid => {
            const visibleCards = grid.querySelectorAll('.card:not(.blog-item-hidden)');
            grid.style.display = visibleCards.length ? '' : 'none';
        });

        // Hide featured section if all featured items hidden
        const featured = document.querySelector('.blog-featured');
        if (featured) {
            const visFeatured = featured.querySelectorAll('.blog-hero-card:not(.blog-item-hidden), .blog-sub-card:not(.blog-item-hidden)');
            featured.style.display = visFeatured.length ? '' : 'none';
        }

        // Hide dividers when their next grid is hidden
        dividers.forEach(div => {
            const nextGrid = div.nextElementSibling;
            div.style.display = (nextGrid && nextGrid.style.display === 'none') ? 'none' : '';
        });

        // No results message
        let noResults = document.querySelector('.blog-no-results');
        if (!anyVisible) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'blog-no-results';
                noResults.textContent = 'No posts found.';
                document.querySelector('main').appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }
}

/* ========================================
   Blog Search
   ======================================== */
function initBlogSearch() {
    const input = document.querySelector('.blog-search-input');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (window._applyBlogFilters) window._applyBlogFilters();
        }, 200);
    });
}

/* ========================================
   Scroll Progress Bar
   ======================================== */
function initScrollProgress() {
    const container = document.createElement('div');
    container.className = 'scroll-progress';
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    container.appendChild(bar);
    document.body.appendChild(container);

    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
        bar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ========================================
   Syntax Highlighting (Highlight.js)
   ======================================== */
function initSyntaxHighlight() {
    const pres = document.querySelectorAll('pre');
    if (pres.length === 0) return;

    // Wrap bare pre content in <code> tags with language class if not already wrapped
    pres.forEach(pre => {
        if (!pre.querySelector('code')) {
            const code = document.createElement('code');
            const lang = pre.getAttribute('data-lang') || 'vba';
            code.className = 'language-' + lang;
            code.textContent = pre.textContent;
            pre.textContent = '';
            pre.appendChild(code);
        }
    });

    // Load Highlight.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    script.onload = function() {
        // Load VBA language support
        const vbaScript = document.createElement('script');
        vbaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vbnet.min.js';
        vbaScript.onload = function() {
            if (window.hljs) {
                hljs.registerAliases('vba', { languageName: 'vbnet' });
                hljs.configure({ ignoreUnescapedHTML: true });
                document.querySelectorAll('pre code').forEach(block => {
                    hljs.highlightElement(block);
                });
            }
        };
        document.head.appendChild(vbaScript);
    };
    document.head.appendChild(script);
}

/* ========================================
   Code Copy Button
   ======================================== */
function initCodeCopy() {
    const blocks = document.querySelectorAll('pre');
    blocks.forEach(pre => {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', () => {
            const code = pre.querySelector('code') || pre;
            navigator.clipboard.writeText(code.textContent).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
        pre.appendChild(btn);
    });
}

/* ========================================
   Reading Time Estimate
   ======================================== */
function initReadingTime() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || '';
    if (!page.startsWith('blog-') && !page.startsWith('project-')) return;

    const main = document.querySelector('main');
    if (!main) return;

    const text = main.textContent || '';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));

    const header = document.querySelector('.page-header-inner');
    if (!header) return;

    const badge = document.createElement('span');
    badge.className = 'reading-time';
    badge.textContent = `${minutes} min read`;
    header.appendChild(badge);
}

/* ========================================
   Screenshot Gallery & Lightbox
   ======================================== */
function initGallery() {
    const galleries = document.querySelectorAll('.gallery');
    if (!galleries.length) return;

    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&lsaquo;</button>' +
        '<img src="" alt="">' +
        '<button class="lightbox-nav lightbox-next" aria-label="Next">&rsaquo;</button>';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    let currentGallery = [];
    let currentIndex = 0;

    function openLightbox(gallery, index) {
        currentGallery = Array.from(gallery.querySelectorAll('.gallery-item img'));
        currentIndex = index;
        lbImg.src = currentGallery[currentIndex].src;
        lbImg.alt = currentGallery[currentIndex].alt;
        lightbox.classList.add('open');
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
    }

    function navigate(dir) {
        currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
        lbImg.src = currentGallery[currentIndex].src;
        lbImg.alt = currentGallery[currentIndex].alt;
    }

    galleries.forEach(gallery => {
        gallery.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.addEventListener('click', () => openLightbox(gallery, i));
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
}

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

/* ========================================
   Blog Next/Previous Navigation
   ======================================== */
function initBlogNav() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || '';
    if (!page.startsWith('blog-') && !page.startsWith('project-')) return;

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

    var related = document.querySelector('.related-posts');
    if (related) {
        related.parentNode.insertBefore(nav, related);
    } else {
        var main = document.querySelector('main');
        if (main) main.appendChild(nav);
    }
}

/* ========================================
   Breadcrumbs
   ======================================== */
function initBreadcrumbs() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || '';
    var dir = path.split('/').slice(-2, -1)[0] || '';

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

    var header = document.querySelector('.page-header');
    if (header && header.nextSibling) {
        header.parentNode.insertBefore(nav, header.nextSibling);
    }
}

/* ========================================
   Print Preparation
   ======================================== */
window.addEventListener('beforeprint', () => {
    // Make all fade-in sections visible for print
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    // Set skill bar widths so they render filled
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
    });
});

/* ========================================
   Init All
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavLogo();
    initFooterLogo();
    initNavbar();
    initScrollAnimations();
    initContactForm();
    initHeroParticles();
    initBackToTop();
    generateCardThumbnails();
    generateProjectPlaceholders();
    initIframeLoading();
    initScrollProgress();
    initSyntaxHighlight();
    initCodeCopy();
    initReadingTime();
    initTagFilter();
    initBlogSearch();
    initTOC();
    initRelatedPosts();
    initGallery();
    initJumpBar();
    initBlogNav();
    initBreadcrumbs();
});
