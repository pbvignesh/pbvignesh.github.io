// Canvas Setup
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;

// Resize Handler
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// Mouse Interaction
const mouse = {
    x: undefined,
    y: undefined,
    radius: 150 // Interaction radius
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1; // Size between 1 and 3
        this.speedX = (Math.random() * 1.5 - 0.75); // Speed between -0.75 and 0.75
        this.speedY = (Math.random() * 1.5 - 0.75);
        this.color = 'rgba(0, 243, 255, 0.5)'; // Cyan base
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > height || this.y < 0) {
            this.speedY = -this.speedY;
        }

        // Mouse Interaction - move away from mouse (optional, or just connect)
        // For this design, let's just connect, maybe slight repulsion?
        // Let's keep it simple: nodes drift, connections glow.
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Init Particles
let particlesArray = [];
const numberOfParticles = Math.min((width * height) / 9000, 150); // Density based on screen size

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
init();

// Handle re-init on huge resize (optional, but good for responsiveness)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(init, 100);
});

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and Draw Particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Connect Particles to each other
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }

        // Connect Particles to Mouse
        if (mouse.x != undefined) {
            const dx = particlesArray[i].x - mouse.x;
            const dy = particlesArray[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                ctx.beginPath();
                // Purple connection to mouse for contrast
                ctx.strokeStyle = `rgba(189, 0, 255, ${1 - distance / mouse.radius})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});
