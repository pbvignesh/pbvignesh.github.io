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
let artRotationInterval;
let ctxH;
let w, h;
const heroParticles = [];


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
    `,

    'experiments': `
        <div class="fade-in">
            <header class="content-header">
                <h2>Experiments & Thoughts</h2>
            </header>
            <div class="timeline-container">
                <!-- Timeline Item 1 -->
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content card" data-spa="true">
                        <span class="timeline-date">Jan 2026</span>
                        <a href="pages/antigravity.html" data-spa="true"><h3>My Experiments with Google Antigravity</h3></a>
                        <p>A deep dive into building agentic workflows and reviewing code with AI.</p>
                    </div>
                </div>
            </div>
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
        if (targetKey === 'notes' || targetKey === 'experiments') {
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
    if (artRotationInterval) clearInterval(artRotationInterval);

    ctxH = heroCanvas.getContext('2d');

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
    // heroParticles defined globally
    heroParticles.length = 0; // Clear existing particles on re-init
    const spacing = 12; // Grid spacing
    let currentArtIndex = 0;

    function updateHeroTargets(imageSrc) {
        if (!imageSrc) return;

        const faceImg = new Image();
        faceImg.src = imageSrc;

        faceImg.onload = () => {
            // Image Processing to get Targets
            const offCanvas = document.createElement('canvas');
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

            // 1. Scan Face Points with STOCHASTIC DITHERING
            const facePoints = [];
            const gap = 3;
            for (let y = 0; y < h; y += gap) {
                for (let x = 0; x < w; x += gap) {
                    const index = (y * w + x) * 4;
                    const r = imgData[index];
                    const g = imgData[index + 1];
                    const b = imgData[index + 2];
                    const brightness = (r + g + b) / 3;

                    if (brightness > 20) {
                        const prob = Math.min(1, Math.pow(brightness / 255, 0.8) * 1.5);
                        if (Math.random() < prob) {
                            facePoints.push({ x: x, y: y });
                        }
                    }
                }
            }
            // Shuffle face points
            facePoints.sort(() => Math.random() - 0.5);

            // Re-use or Create Particles
            const gridCols = Math.ceil(w / spacing);
            const gridRows = Math.ceil(h / spacing);
            const totalGridPoints = gridCols * gridRows;

            // Ensure we have enough particles for the new face
            const requiredParticles = Math.max(facePoints.length, totalGridPoints);

            // Add new particles if needed
            if (heroParticles.length < requiredParticles) {
                for (let i = heroParticles.length; i < requiredParticles; i++) {
                    const gx = (i % gridCols) * spacing;
                    const gy = Math.floor(i / gridCols) * spacing;
                    heroParticles.push({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        baseX: gx,
                        baseY: gy,
                        tx: gx,
                        ty: gy,
                        isFace: false,
                        vx: 0,
                        vy: 0,
                        size: 2,
                        speed: 0.05
                    });
                }
            }

            // Assign Targets
            heroParticles.forEach((p, i) => {
                if (i < facePoints.length) {
                    // It's a face particle
                    p.tx = facePoints[i].x;
                    p.ty = facePoints[i].y;
                    p.isFace = true;
                } else {
                    // It's a grid/background particle
                    // If it was previously a face, send it back to base
                    // Use modulo to wrap grid positions if we have excess particles
                    const gridIndex = i % totalGridPoints;
                    const gx = (gridIndex % gridCols) * spacing;
                    const gy = Math.floor(gridIndex / gridCols) * spacing;

                    p.tx = gx;
                    p.ty = gy;
                    p.isFace = false;
                }
            });
        };
    }





    // cleanup previous if any
    if (heroAnimationId) cancelAnimationFrame(heroAnimationId);
    if (artRotationInterval) clearInterval(artRotationInterval);

    ctxH = heroCanvas.getContext('2d');

    resizeHero();
    window.addEventListener('resize', resizeHero);

    // Re-verify size after a moment for layout settlement
    setTimeout(resizeHero, 50);

    // Particle System
    heroParticles.length = 0; // Clear existing particles on re-init

    // Start Animation Loop
    animateHero();

    // Initial load (Single Image - Face)
    if (typeof faceBase64 !== 'undefined') {
        updateHeroTargets(faceBase64);
    }
}

function animateHero() {
    if (!ctxH) return;

    ctxH.clearRect(0, 0, w, h);

    for (let i = 0; i < heroParticles.length; i++) {
        const p = heroParticles[i];

        // Move
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.x += dx * p.speed;
        p.y += dy * p.speed;

        // Draw
        if (!p.isFace) continue;

        ctxH.beginPath();
        ctxH.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctxH.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctxH.fill();
    }

    heroAnimationId = requestAnimationFrame(animateHero);
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
                <button onclick="loadSection('experiments')" class="btn-back">← Back to Experiments</button>
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
