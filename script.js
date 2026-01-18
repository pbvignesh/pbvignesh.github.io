// Canvas Setup
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// Subtle Particle Animation
const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
        this.opacity = Math.random() * 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// --- SPA Navigation Logic ---
const mainContent = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');
let heroAnimationId; // Animation ID for cleanup


// Content Templates (Hardcoded for simplicity, usually these would be loaded or generated)
// We already have "About" in the HTML. Let's define the others.

const contentViews = {
    // New Home View (Default)
    'home': `
        <div id="home-container" style="width:100%; height:100%; position:relative; overflow:hidden;">
            <canvas id="hero-canvas"></canvas>
        </div>
    `,

    'about': document.getElementById('default-view').innerHTML,

    'notes': `
        <div class="fade-in">
            <header class="content-header">
                <h2>Notes & Articles</h2>
            </header>
            <div class="grid">
                <a href="pages/voice_agents.html" class="card" data-spa="true"><h3>Voice Agents</h3></a>
                <a href="pages/concurrency_python.html" class="card" data-spa="true"><h3>Concurrency in Python</h3></a>
                <a href="pages/cqrs.html" class="card" data-spa="true"><h3>CQRS</h3></a>
                <a href="pages/python_virtual_environment.html" class="card" data-spa="true"><h3>Python Venv</h3></a>
                <a href="pages/nodejs.html" class="card" data-spa="true"><h3>Node JS</h3></a>
                <a href="pages/overcoming_io_overhead.html" class="card" data-spa="true"><h3>IO Overhead</h3></a>
                <a href="pages/elastic_search.html" class="card" data-spa="true"><h3>Elastic Search</h3></a>
                <a href="pages/sqlalchemy.html" class="card" data-spa="true"><h3>SQLAlchemy</h3></a>
                <a href="pages/typeorm.html" class="card" data-spa="true"><h3>TypeORM</h3></a>
                <a href="pages/database_backups.html" class="card" data-spa="true"><h3>DB Backups</h3></a>
                <a href="pages/dunder.html" class="card" data-spa="true"><h3>Dunder Methods</h3></a>
                <a href="pages/terraform.html" class="card" data-spa="true"><h3>Terraform</h3></a>
                <a href="pages/docker.html" class="card" data-spa="true"><h3>Docker</h3></a>
                <a href="pages/aws.html" class="card" data-spa="true"><h3>AWS</h3></a>
                <a href="pages/grafana.html" class="card" data-spa="true"><h3>Grafana</h3></a>
                <a href="pages/prompt_templates.html" class="card" data-spa="true"><h3>LLM Prompts</h3></a>
                <a href="pages/tmux.html" class="card" data-spa="true"><h3>Tmux</h3></a>
                <a href="pages/z3.html" class="card" data-spa="true"><h3>Z3 Prover</h3></a>
            </div>
        </div>
    `,

    'roadmap': `
         <div class="fade-in">
            <header class="content-header">
                <h2>Learning Roadmap</h2>
            </header>
            <article class="content-body">
                <p>Technologies I'm planning to explore next:</p>
                <ul>
                    <li>VPN & Wi-Fi</li>
                    <li>Solr / Splunk / Marklogic</li>
                    <li>Homebrew & Composer</li>
                </ul>
            </article>
        </div>
    `,

    'resources': `
        <div class="fade-in">
            <header class="content-header">
                <h2>Useful Resources</h2>
            </header>
            <article class="content-body">
                <ul>
                    <li><a href="https://db-engines.com/en/" target="_blank">DB Engines</a></li>
                    <li><a href="https://stackoverflow.com/questions/15694724/shards-and-replicas-in-elasticsearch" target="_blank">ES Shards & Replicas</a></li>
                    <li><a href="https://www.susanrigetti.com/math" target="_blank">Susan Fowler's Math Guide</a></li>
                    <li><a href="https://www.youtube.com/watch?v=8aGhZQkoFbQ" target="_blank">Event Loop Explained</a></li>
                    <li><a href="https://mlabonne.github.io/blog/posts/2023-06-07-Decoding_strategies.html" target="_blank">LLM Decoding</a></li>
                    <li><a href="https://eatonphil.com/blogs.html" target="_blank">Phil Eaton's Blog</a></li>
                </ul>
            </article>
        </div>
    `
};


// Navigation Click Handler
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Update Active State
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // Load Content
        const target = item.getAttribute('data-target');
        loadSection(target);
    });
});


function loadSection(targetKey) {
    if (contentViews[targetKey]) {
        mainContent.innerHTML = contentViews[targetKey];

        // Specific logic per view
        if (targetKey === 'notes') {
            attachSPAListeners();
        } else if (targetKey === 'home') {
            initHeroAnimation();
        }
    }
}

// --- Hero Face Animation Logic ---
// heroAnimationId defined globally above


function initHeroAnimation() {
    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) return;

    // cleanup previous if any
    if (heroAnimationId) cancelAnimationFrame(heroAnimationId);

    const ctxH = heroCanvas.getContext('2d');
    let w, h;

    function resizeHero() {
        const rect = heroCanvas.parentElement.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        const dpr = window.devicePixelRatio || 1;
        heroCanvas.width = w * dpr;
        heroCanvas.height = h * dpr;
        ctxH.scale(dpr, dpr);
        heroCanvas.style.width = w + 'px';
        heroCanvas.style.height = h + 'px';
    }
    resizeHero();
    // Re-verify size after a moment for layout settlement
    setTimeout(resizeHero, 50);

    // Particle System
    const heroParticles = [];
    const spacing = 12; // Grid spacing

    // Load Image for Face Targets
    const faceImg = new Image();
    if (typeof faceBase64 !== 'undefined') {
        faceImg.src = faceBase64;
    } else {
        console.warn('faceBase64 is undefined. Animation will not load.');
        return;
    }
    faceImg.onload = () => {
        // Image Processing to get Targets
        // Draw image to offscreen canvas to read pixels
        const offCanvas = document.createElement('canvas');
        // scale image to fit canvas or specific size
        // We want the face to be centered and reasonable size
        const faceW = Math.min(w * 0.8, 600); // Max 600px wide
        const scale = faceW / faceImg.width;
        const faceH = faceImg.height * scale;

        offCanvas.width = w;
        offCanvas.height = h;
        const offCtx = offCanvas.getContext('2d');

        // Center the image
        const imgX = (w - faceW) / 2;
        const imgY = (h - faceH) / 2;

        offCtx.drawImage(faceImg, imgX, imgY, faceW, faceH);

        const imgData = offCtx.getImageData(0, 0, w, h).data;

        // Initialize Particles
        // We need enough particles to fill the grid AND form the face.
        // Strategy: Create particles in a Grid.
        // Then assign "Target" coordinates to them based on the face map.
        // If there are more face points than grid points, creates more.
        // If fewer, some stay in grid or float away.

        heroParticles.length = 0;

        // 1. Scan Face Points with STOCHASTIC DITHERING
        const facePoints = [];
        const gap = 3; // Reduced gap for higher density
        for (let y = 0; y < h; y += gap) {
            for (let x = 0; x < w; x += gap) {
                const index = (y * w + x) * 4;
                const r = imgData[index];
                const g = imgData[index + 1];
                const b = imgData[index + 2];
                const brightness = (r + g + b) / 3;

                // Boost probability: make mid-tones more likely to spawn particles
                // If brightness > 20 (dark grey), give it a chance.
                // Power curve (brightness^0.8) might help lift shadows

                if (brightness > 20) {
                    const prob = Math.min(1, Math.pow(brightness / 255, 0.8) * 1.5);
                    if (Math.random() < prob) {
                        facePoints.push({ x: x, y: y });
                    }
                }
            }
        }

        // Shuffle face points to prevent "scanline" filling effect
        facePoints.sort(() => Math.random() - 0.5);

        // 2. Create Initial Grid (The "Atom Sea")
        // We want enough particles for the face, or a nice grid.
        // Let's create particles based on the grid spacing first.
        const gridCols = Math.ceil(w / spacing);
        const gridRows = Math.ceil(h / spacing);

        let pIndex = 0;

        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                const px = i * spacing;
                const py = j * spacing;

                let target = null;
                // Assign a face target if available
                if (pIndex < facePoints.length) {
                    target = facePoints[pIndex];
                } else {
                    // Extra particles go to random edge or stay grid
                    // Let's make them float away or stay as background
                    target = { x: Math.random() * w, y: Math.random() * h, alpha: 0 };
                }

                heroParticles.push({
                    x: px,
                    y: py,
                    baseX: px,
                    baseY: py,
                    tx: target ? target.x : px,
                    ty: target ? target.y : py,
                    isFace: !!target && target.alpha !== 0,
                    size: Math.random() * 1.5 + 0.5,
                    speed: Math.random() * 0.05 + 0.02
                });
                pIndex++;
            }
        }

        // If we have MORE face points than grid points (likely), add more particles starting at random positions
        while (pIndex < facePoints.length) {
            const target = facePoints[pIndex];
            heroParticles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                baseX: Math.random() * w,
                baseY: Math.random() * h,
                tx: target.x,
                ty: target.y,
                isFace: true,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.05 + 0.02
            });
            pIndex++;
        }

        // Start Animation Loop once loaded
        animateHero();
    };

    function animateHero() {
        ctxH.clearRect(0, 0, w, h);

        for (let i = 0; i < heroParticles.length; i++) {
            const p = heroParticles[i];

            // Move
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            p.x += dx * p.speed;
            p.y += dy * p.speed;

            // Draw
            ctxH.beginPath();
            ctxH.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            let alpha = p.isFace ? 0.9 : 0.05;

            ctxH.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctxH.fill();
        }

        heroAnimationId = requestAnimationFrame(animateHero);
    }
}



// Function to handle clicking on an article card
function attachSPAListeners() {
    const spaLinks = document.querySelectorAll('a[data-spa="true"]');
    spaLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            await loadArticle(url);
        });
    });
}

// Content Fetcher
async function loadArticle(url) {
    try {
        // Show loading state
        mainContent.innerHTML = '<div class="fade-in"><p>Loading...</p></div>';

        const response = await fetch(url);
        const text = await response.text();

        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Extract content - assuming pages have a <main> or <body>
        // We will strip the header/footer from the original page if present.
        const articleContent = doc.querySelector('main') || doc.body;

        // Clean up "Click to go back" links if they exist in the fetched content
        const backLinks = articleContent.querySelectorAll('a[href="../index.html"]');
        backLinks.forEach(l => l.style.display = 'none');

        // Render
        mainContent.innerHTML = `
            <div class="fade-in">
                <button onclick="loadSection('notes')" class="btn-back">← Back to Notes</button>
                <div class="content-body article-view">
                    ${articleContent.innerHTML}
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error loading page:", error);
        mainContent.innerHTML = '<p>Error loading content.</p>';
    }
}

// Global styles for the back button injected via JS? Or add to CSS.
// Let's rely on CSS, but I'll add a class for it.


// --- Profile Card Animation (Atomic Grid Wave) ---
const cardCanvas = document.getElementById('card-canvas');
if (cardCanvas) {
    const ctxCard = cardCanvas.getContext('2d');
    let cardW, cardH;

    // Atomic Wave Animation
    const particles = [];
    const spacing = 18; // Tighter spacing for atomic look

    class Atom {
        constructor(x, y) {
            this.baseX = x;
            this.baseY = y;
            this.x = x;
            this.y = y;
            this.size = 1.2;
        }

        update(time) {
            // Wave equation parameters
            const amplitude = 4;
            // Diagonal wave flow: (x+y) creates diagonal bands
            const wave = Math.sin(time + (this.baseX * 0.01 + this.baseY * 0.01));

            // Movement: Atoms oscillate around base position
            this.x = this.baseX + wave * amplitude * 0.5; // Slight horizontal movement
            this.y = this.baseY + wave * amplitude;      // Main vertical oscillation


        }

        draw() {
            ctxCard.beginPath();
            ctxCard.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctxCard.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Subtle opacity
            ctxCard.fill();
        }
    }

    function initAtoms() {
        particles.length = 0;
        // Calculate rows/cols based on size + padding
        const cols = Math.ceil(cardW / spacing) + 4;
        const rows = Math.ceil(cardH / spacing) + 4;

        // Start from negative to cover edges during wave movement
        for (let i = -2; i < cols; i++) {
            for (let j = -2; j < rows; j++) {
                particles.push(new Atom(i * spacing, j * spacing));
            }
        }
    }

    function resizeCard() {
        const rect = cardCanvas.parentElement.getBoundingClientRect();
        cardW = rect.width;
        cardH = rect.height;
        // Handle high DPI displays for crisp circles
        const dpr = window.devicePixelRatio || 1;
        cardCanvas.width = cardW * dpr;
        cardCanvas.height = cardH * dpr;
        ctxCard.scale(dpr, dpr);
        cardCanvas.style.width = cardW + 'px';
        cardCanvas.style.height = cardH + 'px';

        initAtoms();
    }

    // Resize observer for the card element mainly
    new ResizeObserver(resizeCard).observe(cardCanvas.parentElement);
    resizeCard();

    // Time accumulator
    let time = 0;

    function animateCard() {
        ctxCard.clearRect(0, 0, cardW, cardH);
        time += 0.03; // Wave speed

        particles.forEach(p => {
            p.update(time);
            p.draw();
        });
        requestAnimationFrame(animateCard);
    }
    animateCard();
}

// --- Make Profile Card Clickable (Return to Home) ---
// Check for duplicate profile card listeners to avoid stacking if re-run
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    profileCard.style.cursor = 'pointer';
    // Remove old listener if possible (hard with anon functions), but ensuring this runs once is key.
    // Cloning creates a fresh element without listeners if we needed to clear them, 
    // but here we just want to ensure we don't attach multiple times if script reloads.
    // For now, standard add is fine as script usually runs once per page load.
    profileCard.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        loadSection('home');
        navItems.forEach(n => n.classList.remove('active'));
    });
}

// Initial Load Trigger
document.addEventListener('DOMContentLoaded', () => {
    loadSection('home');
});
