/* ============================================================
   PARTICLE ENGINE - Interactive particle effects
   Cursor ripples, hover bursts, gravitational fields
   ============================================================ */

class ParticleEngine {
    constructor() {
        this.canvas = document.getElementById('bg-particles');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.fgCanvas = document.getElementById('fg-interactions');
        this.fgCtx = this.fgCanvas ? this.fgCanvas.getContext('2d') : null;

        this.particles = [];
        this.ripples = [];
        this.bursts = [];
        this.gravitationalWaves = [];
        this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 };
        this.time = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.running = true;

        this.initCanvas();
        this.createAmbientParticles();
        this.bindEvents();
        this.startLoop();
    }

    initCanvas() {
        if (this.canvas && this.ctx) {
            this.canvas.width = window.innerWidth * this.dpr;
            this.canvas.height = window.innerHeight * this.dpr;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
            this.ctx.scale(this.dpr, this.dpr);
        }
        if (this.fgCanvas && this.fgCtx) {
            this.fgCanvas.width = window.innerWidth * this.dpr;
            this.fgCanvas.height = window.innerHeight * this.dpr;
            this.fgCanvas.style.width = window.innerWidth + 'px';
            this.fgCanvas.style.height = window.innerHeight + 'px';
            this.fgCtx.scale(this.dpr, this.dpr);
        }

        window.addEventListener('resize', () => this.initCanvas());
    }

    createAmbientParticles() {
        const count = 80;
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(x, y) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        return {
            x: x !== undefined ? x : Math.random() * w,
            y: y !== undefined ? y : Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            life: 1,
            decay: 0,
            maxLife: 1,
            color: Math.random() > 0.85 ? 'crimson' : 'emerald',
            type: 'ambient',
            pulsePhase: Math.random() * Math.PI * 2
        };
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.prevX = this.mouse.x;
            this.mouse.prevY = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.speed = Math.sqrt(
                Math.pow(this.mouse.x - this.mouse.prevX, 2) +
                Math.pow(this.mouse.y - this.mouse.prevY, 2)
            );

            // Create gravitational ripple on movement
            if (this.mouse.speed > 3) {
                this.addRipple(e.clientX, e.clientY, 'emerald', 40 + this.mouse.speed * 2);
            }

            // Spawn trail particles
            if (this.mouse.speed > 2 && Math.random() > 0.5) {
                const p = this.createParticle(e.clientX, e.clientY);
                p.type = 'trail';
                p.decay = 0.02;
                p.size = 1 + Math.random() * 2;
                p.vx = (Math.random() - 0.5) * 2;
                p.vy = (Math.random() - 0.5) * 2;
                this.particles.push(p);
            }

            // Update cursor visual
            const cursor = document.getElementById('cursor-ripple');
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });

        document.addEventListener('click', (e) => {
            this.addBurst(e.clientX, e.clientY, 20, 'emerald');
            this.addRipple(e.clientX, e.clientY, 'emerald', 100);
        });

        // Hover burst on interactive elements
        document.querySelectorAll('.action-btn, .nav-ring, .process-node, .pipeline-stage, .metric-card').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                this.addBurst(cx, cy, 8, 'emerald');
            });
        });
    }

    addRipple(x, y, color = 'emerald', maxRadius = 60) {
        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius,
            opacity: 0.4,
            color,
            lineWidth: 2
        });
    }

    addBurst(x, y, count = 15, color = 'emerald') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
            const speed = 1 + Math.random() * 4;
            const p = this.createParticle(x, y);
            p.type = 'burst';
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.decay = 0.015 + Math.random() * 0.01;
            p.size = 1 + Math.random() * 3;
            p.color = color;
            this.particles.push(p);
        }
    }

    addShockwave(x, y) {
        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius: 300,
            opacity: 0.6,
            color: 'emerald',
            lineWidth: 3
        });
        this.addBurst(x, y, 30, 'emerald');
    }

    addCrimsonShockwave(x, y) {
        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius: 250,
            opacity: 0.5,
            color: 'crimson',
            lineWidth: 3
        });
        this.addBurst(x, y, 25, 'crimson');
    }

    update() {
        this.time += 0.016;

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Apply mouse gravity
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200 && dist > 10 && p.type === 'ambient') {
                const force = 0.02 * (1 - dist / 200);
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // Anti-gravity float
            if (p.type === 'ambient') {
                p.vy -= 0.005 * Math.sin(this.time + p.pulsePhase);
                p.vx += 0.003 * Math.cos(this.time * 0.7 + p.pulsePhase);
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.vy *= 0.99;

            if (p.decay > 0) {
                p.life -= p.decay;
            }

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                if (p.type === 'ambient') {
                    this.particles.push(this.createParticle());
                }
                continue;
            }

            // Wrap ambient particles
            if (p.type === 'ambient') {
                const w = window.innerWidth;
                const h = window.innerHeight;
                if (p.x < -20) p.x = w + 20;
                if (p.x > w + 20) p.x = -20;
                if (p.y < -20) p.y = h + 20;
                if (p.y > h + 20) p.y = -20;
            }
        }

        // Update ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const r = this.ripples[i];
            r.radius += 3;
            r.opacity -= 0.008;
            r.lineWidth *= 0.97;
            if (r.opacity <= 0 || r.radius >= r.maxRadius) {
                this.ripples.splice(i, 1);
            }
        }
    }

    draw() {
        if (!this.ctx || !this.fgCtx) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.ctx.clearRect(0, 0, w, h);
        this.fgCtx.clearRect(0, 0, w, h);

        // Draw particles
        this.particles.forEach(p => {
            const ctx = p.type === 'ambient' ? this.ctx : this.fgCtx;
            const pulse = Math.sin(this.time * 2 + p.pulsePhase) * 0.3 + 0.7;
            const alpha = p.life * (p.type === 'ambient' ? 0.4 * pulse : 0.8);

            const isEmerald = p.color === 'emerald';
            const r = isEmerald ? 0 : 255;
            const g = isEmerald ? 255 : 34;
            const b = isEmerald ? 136 : 68;

            // Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.1})`;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fill();
        });

        // Draw ripples on foreground
        this.ripples.forEach(r => {
            const isEmerald = r.color === 'emerald';
            const color = isEmerald ? '0, 255, 136' : '255, 34, 68';

            this.fgCtx.beginPath();
            this.fgCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            this.fgCtx.strokeStyle = `rgba(${color}, ${r.opacity})`;
            this.fgCtx.lineWidth = r.lineWidth;
            this.fgCtx.stroke();

            // Secondary ring
            if (r.radius > 10) {
                this.fgCtx.beginPath();
                this.fgCtx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
                this.fgCtx.strokeStyle = `rgba(${color}, ${r.opacity * 0.3})`;
                this.fgCtx.lineWidth = r.lineWidth * 0.5;
                this.fgCtx.stroke();
            }
        });

        // Mouse gravitational field visualization
        if (this.mouse.speed > 1) {
            const gSize = 30 + this.mouse.speed * 2;
            const gGrad = this.fgCtx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, gSize
            );
            gGrad.addColorStop(0, 'rgba(0, 255, 136, 0.05)');
            gGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
            this.fgCtx.fillStyle = gGrad;
            this.fgCtx.beginPath();
            this.fgCtx.arc(this.mouse.x, this.mouse.y, gSize, 0, Math.PI * 2);
            this.fgCtx.fill();
        }
    }

    startLoop() {
        const loop = () => {
            if (!this.running) return;
            this.update();
            this.draw();
            requestAnimationFrame(loop);
        };
        loop();
    }

    destroy() {
        this.running = false;
    }
}

window.ParticleEngine = ParticleEngine;
