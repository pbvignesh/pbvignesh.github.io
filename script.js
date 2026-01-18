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

// Content Templates (Hardcoded for simplicity, usually these would be loaded or generated)
// We already have "About" in the HTML. Let's define the others.

const contentViews = {
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

// Store default 'about' content into the contentViews object correctly
// (We already did it above, but let's make sure we can switch back to it)

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
        // Re-attach listeners for SPA links if we loaded the 'notes' section
        if (targetKey === 'notes') {
            attachSPAListeners();
        }
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
