/* ============================================================
   CANVAS ENGINE - Background Rendering Layers
   Deep Space, Fog Beams, Neural Grid, Matrix Rain, Vault Core
   ============================================================ */

class CanvasEngine {
  constructor() {
    this.canvases = {};
    this.contexts = {};
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.time = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.running = true;

    this.initCanvases();
    this.bindEvents();
    this.startLoop();
  }

  initCanvases() {
    const ids = ['bg-deep-space', 'bg-fog-beams', 'bg-neural-grid', 'bg-matrix-rain', 'bg-vault-core', 'bg-particles', 'fg-interactions'];
    ids.forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        this.canvases[id] = canvas;
        this.contexts[id] = ctx;
        this.resizeCanvas(canvas, ctx);
      }
    });

    // Initialize layer-specific state
    this.initDeepSpace();
    this.initFogBeams();
    this.initNeuralGrid();
    this.initMatrixRain();
    this.initVaultCore();
  }

  resizeCanvas(canvas, ctx) {
    canvas.width = window.innerWidth * this.dpr;
    canvas.height = window.innerHeight * this.dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      Object.keys(this.canvases).forEach(id => {
        this.resizeCanvas(this.canvases[id], this.contexts[id]);
      });
      this.initMatrixRain();
      this.initDeepSpace();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  // ---- DEEP SPACE LAYER ---- //
  initDeepSpace() {
    this.stars = [];
    this.gothicPillars = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Distant stars
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        brightness: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    // Gothic pillars (distant background)
    for (let i = 0; i < 8; i++) {
      this.gothicPillars.push({
        x: (w / 8) * i + (w / 16),
        width: 30 + Math.random() * 40,
        height: h * 0.6 + Math.random() * h * 0.3,
        opacity: 0.03 + Math.random() * 0.04
      });
    }
  }

  drawDeepSpace() {
    const ctx = this.contexts['bg-deep-space'];
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
    grad.addColorStop(0, 'rgba(10, 5, 20, 1)');
    grad.addColorStop(0.5, 'rgba(5, 2, 10, 1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Gothic pillars parallax (layer 7)
    const parallaxX = (this.mouse.x - w / 2) * 0.01;
    const parallaxY = (this.mouse.y - h / 2) * 0.005;

    this.gothicPillars.forEach(p => {
      const px = p.x + parallaxX * 3;
      ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
      // Pillar body
      ctx.fillRect(px - p.width / 2, h - p.height + parallaxY * 3, p.width, p.height);
      // Gothic arch top
      ctx.beginPath();
      ctx.arc(px, h - p.height + parallaxY * 3, p.width / 2, Math.PI, 0);
      ctx.fill();
      // Energy veins on pillars
      ctx.strokeStyle = `rgba(0, 255, 136, ${p.opacity * 1.5 + Math.sin(this.time * 2 + px) * p.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, h - p.height + parallaxY * 3);
      ctx.lineTo(px + Math.sin(this.time + px) * 5, h);
      ctx.stroke();
    });

    // Stars with twinkle
    this.stars.forEach(s => {
      const sx = s.x + parallaxX * 5;
      const sy = s.y + parallaxY * 5;
      const twinkle = Math.sin(this.time * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.3 + 0.7;
      const brightness = s.brightness * twinkle;
      ctx.beginPath();
      ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${brightness})`;
      ctx.fill();
      if (s.size > 1) {
        ctx.beginPath();
        ctx.arc(sx, sy, s.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${brightness * 0.1})`;
        ctx.fill();
      }
    });

    // Crimson energy fractures
    for (let i = 0; i < 3; i++) {
      const fx = w * 0.2 + i * w * 0.3;
      const fy = h * 0.3 + Math.sin(this.time + i * 2) * 50;
      const intensity = Math.sin(this.time * 0.5 + i) * 0.3 + 0.1;
      if (intensity > 0.15) {
        ctx.strokeStyle = `rgba(255, 34, 68, ${intensity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        for (let j = 0; j < 6; j++) {
          ctx.lineTo(
            fx + (Math.random() - 0.5) * 100,
            fy + j * 30 + Math.random() * 20
          );
        }
        ctx.stroke();
        // Glow
        ctx.shadowColor = 'rgba(255, 34, 68, 0.5)';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  }

  // ---- FOG BEAMS LAYER ---- //
  initFogBeams() {
    this.fogBeams = [];
    for (let i = 0; i < 5; i++) {
      this.fogBeams.push({
        x: Math.random() * window.innerWidth,
        angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.8,
        width: 60 + Math.random() * 100,
        opacity: 0.02 + Math.random() * 0.03,
        speed: 0.0002 + Math.random() * 0.0003
      });
    }
  }

  drawFogBeams() {
    const ctx = this.contexts['bg-fog-beams'];
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    const parallaxX = (this.mouse.x - w / 2) * 0.02;

    this.fogBeams.forEach(beam => {
      beam.angle += beam.speed;
      const x = beam.x + parallaxX * 2 + Math.sin(this.time * 0.3) * 30;
      const endX = x + Math.cos(beam.angle) * h * 1.5;
      const endY = h;

      const grad = ctx.createLinearGradient(x, 0, endX, endY);
      grad.addColorStop(0, `rgba(0, 255, 136, ${beam.opacity})`);
      grad.addColorStop(0.5, `rgba(0, 255, 136, ${beam.opacity * 0.5})`);
      grad.addColorStop(1, 'rgba(0, 255, 136, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x - beam.width / 2, 0);
      ctx.lineTo(endX - beam.width, endY);
      ctx.lineTo(endX + beam.width, endY);
      ctx.lineTo(x + beam.width / 2, 0);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    // Volumetric fog particles
    for (let i = 0; i < 20; i++) {
      const fx = (Math.sin(this.time * 0.1 + i * 1.3) * 0.5 + 0.5) * w;
      const fy = (Math.cos(this.time * 0.08 + i * 0.9) * 0.5 + 0.5) * h;
      const size = 50 + Math.sin(this.time * 0.2 + i) * 30;
      const opacity = 0.01 + Math.sin(this.time * 0.15 + i * 0.7) * 0.008;
      
      const fogGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, size);
      fogGrad.addColorStop(0, `rgba(0, 255, 136, ${opacity})`);
      fogGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(fx - size, fy - size, size * 2, size * 2);
    }
  }

  // ---- NEURAL GRID LAYER ---- //
  initNeuralGrid() {
    this.gridNodes = [];
    const spacing = 80;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let x = 0; x < w; x += spacing) {
      for (let y = 0; y < h; y += spacing) {
        this.gridNodes.push({
          x: x + Math.random() * 20,
          y: y + Math.random() * 20,
          baseX: x,
          baseY: y,
          phase: Math.random() * Math.PI * 2,
          active: Math.random() > 0.8
        });
      }
    }
  }

  drawNeuralGrid() {
    const ctx = this.contexts['bg-neural-grid'];
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    const parallaxX = (this.mouse.x - w / 2) * 0.008;
    const parallaxY = (this.mouse.y - h / 2) * 0.008;

    // Draw connections
    ctx.lineWidth = 0.5;
    this.gridNodes.forEach((node, i) => {
      const nx = node.baseX + Math.sin(this.time * 0.5 + node.phase) * 5 + parallaxX * 4;
      const ny = node.baseY + Math.cos(this.time * 0.3 + node.phase) * 5 + parallaxY * 4;
      node.x = nx;
      node.y = ny;

      // Connect to nearby nodes
      for (let j = i + 1; j < this.gridNodes.length; j++) {
        const other = this.gridNodes[j];
        const dx = nx - other.x;
        const dy = ny - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.04;
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      // Draw active nodes
      if (node.active) {
        const pulse = Math.sin(this.time * 2 + node.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(nx, ny, 2 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${0.1 + pulse * 0.15})`;
        ctx.fill();
      }
    });

    // Synaptic firing effect (random flashes along connections)
    if (Math.random() > 0.93) {
      const idx = Math.floor(Math.random() * this.gridNodes.length);
      const node = this.gridNodes[idx];
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.fill();
    }
  }

  // ---- MATRIX RAIN LAYER ---- //
  initMatrixRain() {
    this.matrixColumns = [];
    const fontSize = 14;
    const columns = Math.ceil(window.innerWidth / fontSize);
    for (let i = 0; i < columns; i++) {
      this.matrixColumns.push({
        x: i * fontSize,
        y: Math.random() * window.innerHeight,
        speed: 0.5 + Math.random() * 2,
        chars: [],
        charCount: 5 + Math.floor(Math.random() * 15),
        fontSize: fontSize,
        drift: Math.random() * 0.5 - 0.25
      });
    }
    // Pre-generate chars
    this.matrixChars = '0123456789ABCDEFabcdef⟐⟁⬡◆▲▼⚡🔐⟠◈₿Ξ∞∮∇∂∑∏≈≡';
  }

  drawMatrixRain() {
    const ctx = this.contexts['bg-matrix-rain'];
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Semi-transparent clear for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, w, h);

    const gravitationalDrift = (this.mouse.x - w / 2) * 0.0003;

    ctx.font = '12px "Share Tech Mono", monospace';

    this.matrixColumns.forEach(col => {
      col.y += col.speed;
      col.x += col.drift + gravitationalDrift;

      if (col.y > h + 100) {
        col.y = -col.charCount * col.fontSize;
        col.x = col.x % w;
        if (col.x < 0) col.x += w;
      }

      for (let j = 0; j < col.charCount; j++) {
        const cy = col.y - j * col.fontSize;
        if (cy < -20 || cy > h + 20) continue;
        const alpha = (1 - j / col.charCount) * 0.3;
        const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
        
        if (j === 0) {
          ctx.fillStyle = `rgba(180, 255, 200, ${alpha + 0.3})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        }
        ctx.fillText(char, col.x, cy);
      }
    });
  }

  // ---- VAULT CORE LAYER ---- //
  initVaultCore() {
    this.vaultAngle = 0;
    this.orbitalNodes = [];
    for (let i = 0; i < 12; i++) {
      this.orbitalNodes.push({
        angle: (Math.PI * 2 / 12) * i,
        radius: 120 + Math.random() * 60,
        speed: 0.002 + Math.random() * 0.003,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.7 ? 'crimson' : 'emerald',
        trail: []
      });
    }
    // Floating hash rings
    this.hashRings = [];
    for (let i = 0; i < 3; i++) {
      this.hashRings.push({
        radius: 80 + i * 50,
        angle: i * Math.PI * 0.667,
        speed: 0.005 + i * 0.002,
        tilt: 0.3 + i * 0.15,
        glyphs: 'a7f3b9c4e2d8f1a6b3c9e5d2f8a1b7c3e4d9f6a2b8c1e7d5'.split('')
      });
    }
  }

  drawVaultCore() {
    const ctx = this.contexts['bg-vault-core'];
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const parallaxX = (this.mouse.x - cx) * 0.015;
    const parallaxY = (this.mouse.y - cy) * 0.015;

    this.vaultAngle += 0.002;

    // Central vault sun glow
    const sunPulse = Math.sin(this.time) * 0.15 + 0.85;
    const sunGrad = ctx.createRadialGradient(
      cx + parallaxX, cy + parallaxY, 0,
      cx + parallaxX, cy + parallaxY, 150 * sunPulse
    );
    sunGrad.addColorStop(0, 'rgba(0, 255, 136, 0.15)');
    sunGrad.addColorStop(0.3, 'rgba(0, 255, 136, 0.05)');
    sunGrad.addColorStop(0.6, 'rgba(0, 200, 100, 0.02)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx + parallaxX, cy + parallaxY, 150 * sunPulse, 0, Math.PI * 2);
    ctx.fill();

    // Inner vault core
    ctx.beginPath();
    ctx.arc(cx + parallaxX, cy + parallaxY, 15, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 136, ${0.4 + sunPulse * 0.3})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(0, 255, 136, ${0.6})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hash rings (floating DevOps rings)
    this.hashRings.forEach(ring => {
      ring.angle += ring.speed;
      ctx.save();
      ctx.translate(cx + parallaxX, cy + parallaxY);
      ctx.rotate(ring.angle);

      // Draw elliptical ring
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.radius, ring.radius * ring.tilt, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 136, 0.08)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hash glyphs along ring
      const glyphCount = ring.glyphs.length;
      ctx.font = '8px "Share Tech Mono", monospace';
      for (let i = 0; i < glyphCount; i++) {
        const ga = (Math.PI * 2 / glyphCount) * i;
        const gx = Math.cos(ga) * ring.radius;
        const gy = Math.sin(ga) * ring.radius * ring.tilt;
        const alpha = 0.15 + Math.sin(this.time + i) * 0.1;
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        ctx.fillText(ring.glyphs[i], gx, gy);
      }

      ctx.restore();
    });

    // Orbital microservice nodes
    this.orbitalNodes.forEach(node => {
      node.angle += node.speed;
      const nx = cx + Math.cos(node.angle) * node.radius + parallaxX * 2;
      const ny = cy + Math.sin(node.angle) * node.radius * 0.6 + parallaxY * 2;

      // Trail
      node.trail.push({ x: nx, y: ny, alpha: 0.4 });
      if (node.trail.length > 15) node.trail.shift();
      node.trail.forEach((t, i) => {
        t.alpha *= 0.9;
        const tSize = node.size * (i / node.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(t.x, t.y, tSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color === 'emerald'
          ? `rgba(0, 255, 136, ${t.alpha * 0.3})`
          : `rgba(255, 34, 68, ${t.alpha * 0.3})`;
        ctx.fill();
      });

      // Node itself
      ctx.beginPath();
      ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
      const nodeColor = node.color === 'emerald'
        ? `rgba(0, 255, 136, 0.8)`
        : `rgba(255, 34, 68, 0.8)`;
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(nx, ny, node.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = node.color === 'emerald'
        ? `rgba(0, 255, 136, 0.05)`
        : `rgba(255, 34, 68, 0.05)`;
      ctx.fill();

      // Magnetic field line to center
      const distToMouse = Math.sqrt(
        Math.pow(this.mouse.x - nx, 2) + Math.pow(this.mouse.y - ny, 2)
      );
      if (distToMouse < 200) {
        ctx.strokeStyle = `rgba(0, 255, 136, ${(1 - distToMouse / 200) * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.quadraticCurveTo(
          (nx + this.mouse.x) / 2 + Math.sin(this.time * 3) * 20,
          (ny + this.mouse.y) / 2 + Math.cos(this.time * 3) * 20,
          this.mouse.x, this.mouse.y
        );
        ctx.stroke();
      }
    });

    // Infrastructure rings orbiting vault
    for (let i = 0; i < 2; i++) {
      const ringRadius = 200 + i * 80;
      const ringAngle = this.vaultAngle * (i % 2 === 0 ? 1 : -1) + i * Math.PI / 3;
      ctx.save();
      ctx.translate(cx + parallaxX, cy + parallaxY);
      ctx.rotate(ringAngle);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius, ringRadius * 0.25, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 136, ${0.04 + Math.sin(this.time + i) * 0.02})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([10, 20]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Plasma data packets (luminous orbs along field lines)
    const packetCount = 6;
    for (let i = 0; i < packetCount; i++) {
      const pa = this.time * 0.8 + (Math.PI * 2 / packetCount) * i;
      const pr = 140 + Math.sin(this.time * 2 + i) * 30;
      const px = cx + Math.cos(pa) * pr + parallaxX;
      const py = cy + Math.sin(pa) * pr * 0.4 + parallaxY;

      // Plasma orb
      const orbGrad = ctx.createRadialGradient(px, py, 0, px, py, 8);
      orbGrad.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
      orbGrad.addColorStop(0.5, 'rgba(0, 255, 136, 0.3)');
      orbGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---- MAIN RENDER LOOP ---- //
  startLoop() {
    const render = () => {
      if (!this.running) return;
      this.time += 0.016;

      this.drawDeepSpace();
      this.drawFogBeams();
      this.drawNeuralGrid();
      this.drawMatrixRain();
      this.drawVaultCore();

      requestAnimationFrame(render);
    };
    render();
  }

  destroy() {
    this.running = false;
  }
}

// Export
window.CanvasEngine = CanvasEngine;
