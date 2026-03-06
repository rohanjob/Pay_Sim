/* ============================================================
   UI CONTROLLER - Module animations, transaction flows,
   CI/CD pipeline, blockchain, neural net, threat intel
   ============================================================ */

class UIController {
    constructor(particleEngine) {
        this.particles = particleEngine;
        this.activeModule = 'transaction-flow';
        this.time = 0;
        this.txCount = 0;
        this.settledCount = 0;
        this.pendingCount = 0;
        this.flaggedCount = 0;
        this.chainHeight = 0;
        this.synapseCount = 0;
        this.anomalyCount = 0;
        this.pipelineRunning = false;
        this.penTestRunning = false;
        this.sparklineData = [];
        this.blockchainBlocks = [];
        this.neuralNodes = [];
        this.threatMarkers = [];
        this.cloudNodes = [];

        this.initModuleCanvases();
        this.bindNavigation();
        this.bindActions();
        this.startMetricUpdates();
        this.startSIEMLog();
        this.startAnimationLoops();
    }

    // ---- NAVIGATION ---- //
    bindNavigation() {
        document.querySelectorAll('.nav-ring').forEach(btn => {
            btn.addEventListener('click', () => {
                const module = btn.dataset.module;
                this.switchModule(module);

                document.querySelectorAll('.nav-ring').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchModule(moduleName) {
        // Glitch transition
        const container = document.getElementById('module-container');
        container.classList.add('glitch-active');
        setTimeout(() => container.classList.remove('glitch-active'), 300);

        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
        const target = document.getElementById(`module-${moduleName}`);
        if (target) {
            setTimeout(() => target.classList.add('active'), 150);
        }
        this.activeModule = moduleName;
    }

    // ---- ACTION BINDINGS ---- //
    bindActions() {
        // Initiate Transaction
        const txBtn = document.getElementById('btn-initiate-tx');
        if (txBtn) {
            txBtn.addEventListener('click', () => this.initiateTransaction());
        }

        // Pipeline Trigger
        const pipelineBtn = document.getElementById('btn-trigger-pipeline');
        if (pipelineBtn) {
            pipelineBtn.addEventListener('click', () => this.runPipeline());
        }

        // Forge Block
        const forgeBtn = document.getElementById('btn-forge-block');
        if (forgeBtn) {
            forgeBtn.addEventListener('click', () => this.forgeBlock());
        }

        // Neural Scan
        const neuralBtn = document.getElementById('btn-scan-neural');
        if (neuralBtn) {
            neuralBtn.addEventListener('click', () => this.activateNeuralScan());
        }

        // Pen Test
        const penBtn = document.getElementById('btn-pen-test');
        if (penBtn) {
            penBtn.addEventListener('click', () => this.launchPenTest());
        }
    }

    // ---- TRANSACTION FLOW ---- //
    initiateTransaction() {
        const isFraud = Math.random() > 0.8;
        this.txCount++;
        this.pendingCount++;

        // Update stats
        this.updateElement('stat-pending', this.pendingCount);
        this.updateTxStatus('PROCESSING TRANSACTION...');

        // Shockwave
        const txCanvas = document.getElementById('tx-flow-canvas');
        if (txCanvas && this.particles) {
            const rect = txCanvas.getBoundingClientRect();
            this.particles.addShockwave(rect.left + rect.width / 2, rect.top + 50);
        }

        // Camera shake
        document.getElementById('app').classList.add('camera-shake');
        setTimeout(() => document.getElementById('app').classList.remove('camera-shake'), 500);

        // Sequential node activation
        const nodes = ['node-api-gateway', 'node-load-balancer', 'node-jwt-auth', 'node-tokenizer', 'node-fraud-detect'];
        const nodeNames = ['API Gateway', 'Load Balancer', 'JWT Auth', 'Tokenizer', 'Fraud AI'];

        nodes.forEach((nodeId, i) => {
            setTimeout(() => {
                this.activateNode(nodeId);
                this.updateTxStatus(`${nodeNames[i].toUpperCase()} PROCESSING...`);
            }, (i + 1) * 600);
        });

        // Result
        setTimeout(() => {
            this.pendingCount--;
            if (isFraud) {
                this.flaggedCount++;
                this.updateElement('stat-flagged', this.flaggedCount);
                this.updateTxStatus('⚠ SUSPICIOUS TRANSACTION FLAGGED ⚠');
                this.triggerRedAlert();
                this.deactivateAllNodes('alert');

                // Crimson shockwave
                if (this.particles) {
                    const rect = document.getElementById('tx-flow-canvas').getBoundingClientRect();
                    this.particles.addCrimsonShockwave(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }

                setTimeout(() => {
                    this.deactivateAllNodes();
                    this.updateTxStatus('AWAITING TRANSACTION');
                }, 3000);
            } else {
                this.settledCount++;
                this.updateElement('stat-settled', this.settledCount);
                this.updateTxStatus('✓ TRANSACTION APPROVED & SETTLED');

                // Emerald cascade
                if (this.particles) {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            this.particles.addBurst(
                                window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                                window.innerHeight / 2 + (Math.random() - 0.5) * 100,
                                15, 'emerald'
                            );
                        }, i * 200);
                    }
                }

                setTimeout(() => {
                    this.deactivateAllNodes();
                    this.updateTxStatus('AWAITING TRANSACTION');
                }, 2000);
            }
            this.updateElement('stat-pending', this.pendingCount);
        }, nodes.length * 600 + 500);
    }

    activateNode(nodeId) {
        const node = document.getElementById(nodeId);
        if (node) {
            const status = node.querySelector('.node-status');
            if (status) {
                status.textContent = 'ACTIVE';
                status.className = 'node-status active';
            }
        }
    }

    deactivateAllNodes(state = 'idle') {
        const nodes = document.querySelectorAll('.process-node .node-status');
        nodes.forEach(n => {
            n.textContent = state === 'alert' ? 'ALERT' : 'IDLE';
            n.className = `node-status ${state}`;
        });
    }

    updateTxStatus(text) {
        const el = document.querySelector('.tx-status-text');
        if (el) el.textContent = text;
    }

    triggerRedAlert() {
        const threatValue = document.querySelector('.threat-value');
        if (threatValue) {
            threatValue.textContent = 'ELEVATED';
            threatValue.dataset.level = 'high';
            setTimeout(() => {
                threatValue.textContent = 'NOMINAL';
                threatValue.dataset.level = 'low';
            }, 5000);
        }

        // Camera shake
        document.getElementById('app').classList.add('camera-shake');
        setTimeout(() => document.getElementById('app').classList.remove('camera-shake'), 500);
    }

    // ---- CI/CD PIPELINE ---- //
    runPipeline() {
        if (this.pipelineRunning) return;
        this.pipelineRunning = true;

        const stages = ['build', 'scan', 'audit', 'harden', 'compliance', 'deploy'];
        const stageNames = ['BUILD', 'STATIC SCAN', 'DEPENDENCY AUDIT', 'CONTAINER HARDENING', 'COMPLIANCE SEAL', 'DEPLOY'];

        // Reset all stages
        stages.forEach(s => {
            const el = document.getElementById(`stage-${s}`);
            if (el) {
                el.classList.remove('completed', 'processing', 'failed');
                el.querySelector('.stage-status').textContent = 'READY';
            }
        });

        const vulnLog = document.getElementById('vuln-log');

        stages.forEach((stage, i) => {
            // Start processing
            setTimeout(() => {
                const el = document.getElementById(`stage-${stage}`);
                if (el) {
                    el.classList.add('processing');
                    el.querySelector('.stage-status').textContent = 'PROCESSING';
                }
                this.addLog(vulnLog, `[${stageNames[i]}] Executing stage...`, 'info');

                if (this.particles) {
                    const rect = el.getBoundingClientRect();
                    this.particles.addBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12, 'emerald');
                }
            }, i * 1500);

            // Complete processing
            setTimeout(() => {
                const el = document.getElementById(`stage-${stage}`);
                const hasVuln = stage === 'scan' && Math.random() > 0.6;

                if (el) {
                    el.classList.remove('processing');
                    if (hasVuln) {
                        el.classList.add('failed');
                        el.querySelector('.stage-status').textContent = 'VULN FOUND';
                        this.addLog(vulnLog, `[${stageNames[i]}] ⚠ Vulnerability CVE-2026-${Math.floor(Math.random() * 9999)} detected!`, 'error');
                        this.addLog(vulnLog, `[${stageNames[i]}] Auto-patching applied. Continuing...`, 'warn');
                        setTimeout(() => {
                            el.classList.remove('failed');
                            el.classList.add('completed');
                            el.querySelector('.stage-status').textContent = 'PATCHED';
                        }, 800);
                    } else {
                        el.classList.add('completed');
                        el.querySelector('.stage-status').textContent = '✓ PASS';
                        this.addLog(vulnLog, `[${stageNames[i]}] ✓ Stage completed successfully`, 'success');
                    }
                }

                // Deploy animation: pods launch upward
                if (stage === 'deploy') {
                    this.addLog(vulnLog, '[DEPLOY] 🚀 Pods launching with anti-gravity lift beams...', 'success');
                    this.addLog(vulnLog, '[DEPLOY] ✓ Deployment successful. All systems nominal.', 'success');

                    if (this.particles) {
                        for (let j = 0; j < 5; j++) {
                            setTimeout(() => {
                                this.particles.addBurst(
                                    window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                                    window.innerHeight * 0.6,
                                    20, 'emerald'
                                );
                            }, j * 200);
                        }
                    }

                    this.pipelineRunning = false;
                }
            }, i * 1500 + 1200);
        });
    }

    // ---- BLOCKCHAIN LEDGER ---- //
    forgeBlock() {
        this.chainHeight++;
        const hash = this.generateHash();
        const prevHash = this.blockchainBlocks.length > 0
            ? this.blockchainBlocks[this.blockchainBlocks.length - 1].hash
            : '0000000000';

        const block = {
            height: this.chainHeight,
            hash: hash,
            prevHash: prevHash,
            timestamp: Date.now(),
            x: 100 + (this.chainHeight - 1) * 120,
            y: 100 + Math.sin(this.chainHeight) * 30,
            scale: 0,
            sealed: false
        };

        this.blockchainBlocks.push(block);

        // Update UI
        this.updateElement('chain-height', this.chainHeight);
        this.updateElement('hash-rate', `${Math.floor(Math.random() * 500 + 100)} H/s`);

        const blockLog = document.getElementById('block-log');
        this.addLog(blockLog, `[FORGE] Block #${this.chainHeight} forging... Hash: ${hash.substring(0, 16)}...`, 'info');

        // Shockwave
        if (this.particles) {
            const canvas = document.getElementById('blockchain-canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                this.particles.addShockwave(
                    rect.left + Math.min(block.x, rect.width - 50),
                    rect.top + block.y
                );
            }
        }

        setTimeout(() => {
            block.sealed = true;
            this.addLog(blockLog, `[SEAL] Block #${this.chainHeight} sealed with hash lock ring ✓`, 'success');
            this.addLog(blockLog, `[REPLICATE] Syncing to ${5} replica nodes...`, 'info');
        }, 1000);
    }

    generateHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    // ---- NEURAL NETWORK ---- //
    activateNeuralScan() {
        this.synapseCount += Math.floor(Math.random() * 50 + 20);
        this.updateElement('synapse-count', this.synapseCount);

        // Random anomaly detection
        if (Math.random() > 0.7) {
            this.anomalyCount++;
            this.updateElement('anomaly-count', this.anomalyCount);
            this.triggerRedAlert();
        }

        // Burst effect
        if (this.particles) {
            const canvas = document.getElementById('neural-canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.particles.addBurst(
                            rect.left + Math.random() * rect.width,
                            rect.top + Math.random() * rect.height,
                            10, Math.random() > 0.7 ? 'crimson' : 'emerald'
                        );
                    }, i * 200);
                }
            }
        }
    }

    // ---- PEN TEST ---- //
    launchPenTest() {
        if (this.penTestRunning) return;
        this.penTestRunning = true;

        const siem = document.getElementById('siem-log');
        const shieldFill = document.getElementById('shield-fill');
        const shieldPercent = document.getElementById('shield-percent');
        let shield = 100;

        // Attack phases
        const attacks = [
            { name: 'SQL Injection', type: 'error', damage: 15 },
            { name: 'XSS Payload', type: 'error', damage: 10 },
            { name: 'CSRF Token Bypass', type: 'error', damage: 20 },
            { name: 'API Rate Limit Test', type: 'warn', damage: 5 },
            { name: 'JWT Forgery Attempt', type: 'error', damage: 25 },
            { name: 'Path Traversal Scan', type: 'warn', damage: 8 },
        ];

        this.addLog(siem, '[PENTEST] ⚔️ Simulated attack sequence initiated...', 'critical');

        attacks.forEach((attack, i) => {
            setTimeout(() => {
                this.addLog(siem, `[ATTACK] Executing: ${attack.name}`, attack.type);

                shield -= attack.damage;
                if (shield < 30) shield = 30;
                shieldFill.style.width = shield + '%';
                shieldPercent.textContent = shield + '%';

                if (this.particles) {
                    this.particles.addCrimsonShockwave(
                        window.innerWidth * 0.75,
                        window.innerHeight * 0.5 + i * 30
                    );
                }

                // Defense response
                setTimeout(() => {
                    shield += attack.damage * 0.7;
                    if (shield > 100) shield = 100;
                    shieldFill.style.width = shield + '%';
                    shieldPercent.textContent = Math.round(shield) + '%';
                    this.addLog(siem, `[DEFENSE] ${attack.name} blocked. Shield adapting...`, 'success');
                }, 500);

            }, (i + 1) * 1200);
        });

        setTimeout(() => {
            shield = 100;
            shieldFill.style.width = '100%';
            shieldPercent.textContent = '100%';
            this.addLog(siem, '[PENTEST] ✓ Attack simulation complete. All vectors defended.', 'success');
            this.penTestRunning = false;
        }, attacks.length * 1200 + 1500);
    }

    // ---- MODULE-SPECIFIC CANVAS ANIMATIONS ---- //
    initModuleCanvases() {
        // Initialize neural nodes
        for (let i = 0; i < 40; i++) {
            this.neuralNodes.push({
                x: Math.random() * 600 + 50,
                y: Math.random() * 400 + 50,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 3 + Math.random() * 4,
                suspicious: Math.random() > 0.85,
                connections: [],
                phase: Math.random() * Math.PI * 2
            });
        }

        // Initialize cloud nodes
        const cloudTypes = ['VM', 'DB', 'LB', 'CDN', 'FW', 'DNS', 'K8S', 'API', 'CACHE', 'MQ'];
        for (let i = 0; i < 10; i++) {
            this.cloudNodes.push({
                x: 100 + (i % 5) * 120 + Math.random() * 40,
                y: 80 + Math.floor(i / 5) * 150 + Math.random() * 40,
                type: cloudTypes[i],
                size: 20,
                connections: [],
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Initialize threat markers
        for (let i = 0; i < 15; i++) {
            this.threatMarkers.push({
                x: Math.random() * 700 + 50,
                y: Math.random() * 350 + 50,
                severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    drawTransactionFlow(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // Central energy shield
        const shieldPulse = Math.sin(this.time * 2) * 0.15 + 0.85;
        for (let i = 3; i >= 0; i--) {
            ctx.beginPath();
            ctx.arc(cx, cy, 40 + i * 25, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.04 + (3 - i) * 0.03})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Rotating shield segments
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + this.time;
            ctx.beginPath();
            ctx.arc(cx, cy, 60 * shieldPulse, angle, angle + 0.5);
            ctx.strokeStyle = `rgba(0, 255, 136, 0.3)`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Data flow lines (top to bottom)
        for (let i = 0; i < 3; i++) {
            const x = cx - 80 + i * 80;
            const flowY = (this.time * 100 + i * 50) % h;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.strokeStyle = `rgba(0, 255, 136, 0.03)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Data packet
            const grad = ctx.createRadialGradient(x, flowY, 0, x, flowY, 8);
            grad.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
            grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, flowY, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // JWT crypto rings
        for (let i = 0; i < 3; i++) {
            const ringAngle = this.time * (1 + i * 0.3);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(ringAngle);
            ctx.beginPath();
            ctx.ellipse(0, 0, 80 + i * 15, 30 + i * 5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 + i * 0.03})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
        }

        // Fractal tokenization visual
        const fractalDepth = 4;
        this.drawFractal(ctx, cx + 100, cy - 60, 25, fractalDepth, this.time);
    }

    drawFractal(ctx, x, y, size, depth, time) {
        if (depth <= 0 || size < 2) return;
        const alpha = 0.1 + (depth / 4) * 0.15;
        ctx.strokeStyle = `rgba(176, 0, 255, ${alpha})`;
        ctx.lineWidth = 0.5;

        // Draw hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + time * 0.5;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Recursive children
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i + time * 0.3;
            this.drawFractal(
                ctx,
                x + Math.cos(angle) * size * 0.8,
                y + Math.sin(angle) * size * 0.8,
                size * 0.45,
                depth - 1,
                time
            );
        }
    }

    drawBlockchain(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        const blockSize = 50;
        const startX = 60;

        // Draw blockchain
        const visibleBlocks = this.blockchainBlocks.slice(-Math.floor(w / 120));

        visibleBlocks.forEach((block, i) => {
            const bx = startX + i * 110;
            const by = h / 2 + Math.sin(this.time + i) * 15;

            // Animate scale in
            if (block.scale < 1) block.scale += 0.05;

            const s = Math.min(block.scale, 1);

            ctx.save();
            ctx.translate(bx + blockSize / 2, by + blockSize / 2);
            ctx.scale(s, s);
            ctx.translate(-(bx + blockSize / 2), -(by + blockSize / 2));

            // Block body (obsidian cube)
            ctx.fillStyle = block.sealed
                ? 'rgba(0, 255, 136, 0.08)'
                : 'rgba(255, 215, 0, 0.08)';
            ctx.strokeStyle = block.sealed
                ? 'rgba(0, 255, 136, 0.4)'
                : 'rgba(255, 215, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.fillRect(bx, by, blockSize, blockSize);
            ctx.strokeRect(bx, by, blockSize, blockSize);

            // Hash lock ring
            if (block.sealed) {
                ctx.beginPath();
                ctx.arc(bx + blockSize / 2, by + blockSize / 2, 30, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Rotating lock
                const lockAngle = this.time * 2 + i;
                ctx.beginPath();
                ctx.arc(bx + blockSize / 2, by + blockSize / 2, 30,
                    lockAngle, lockAngle + Math.PI * 0.5);
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Block number
            ctx.font = '10px "Orbitron", sans-serif';
            ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
            ctx.textAlign = 'center';
            ctx.fillText(`#${block.height}`, bx + blockSize / 2, by + blockSize / 2 + 4);

            ctx.restore();

            // Chain link to next block
            if (i < visibleBlocks.length - 1) {
                const nextBx = startX + (i + 1) * 110;
                const nextBy = h / 2 + Math.sin(this.time + i + 1) * 15;
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(bx + blockSize, by + blockSize / 2);
                ctx.lineTo(nextBx, nextBy + blockSize / 2);
                ctx.stroke();

                // Energy pulse along chain
                const pulsePos = ((this.time * 2 + i) % 1);
                const px = bx + blockSize + (nextBx - bx - blockSize) * pulsePos;
                const py = by + blockSize / 2 + (nextBy - by) * pulsePos;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
                ctx.fill();
            }
        });

        // If no blocks, show genesis
        if (this.blockchainBlocks.length === 0) {
            ctx.font = '12px "Share Tech Mono", monospace';
            ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.textAlign = 'center';
            ctx.fillText('FORGE BLOCKS TO BUILD THE IMMUTABLE CHAIN', w / 2, h / 2);
        }
    }

    drawNeuralNet(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        // Update and draw neural nodes
        this.neuralNodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce
            if (node.x < 10 || node.x > w - 10) node.vx *= -1;
            if (node.y < 10 || node.y > h - 10) node.vy *= -1;

            // Clamp
            node.x = Math.max(10, Math.min(w - 10, node.x));
            node.y = Math.max(10, Math.min(h - 10, node.y));

            // Connections
            this.neuralNodes.forEach((other, j) => {
                if (i >= j) return;
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.2;
                    const isSuspConn = node.suspicious || other.suspicious;
                    ctx.strokeStyle = isSuspConn
                        ? `rgba(255, 34, 68, ${alpha})`
                        : `rgba(0, 255, 136, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();

                    // Synapse firing
                    if (Math.random() > 0.998) {
                        const midX = (node.x + other.x) / 2;
                        const midY = (node.y + other.y) / 2;
                        ctx.beginPath();
                        ctx.arc(midX, midY, 5, 0, Math.PI * 2);
                        ctx.fillStyle = isSuspConn
                            ? 'rgba(255, 34, 68, 0.5)'
                            : 'rgba(0, 255, 136, 0.5)';
                        ctx.fill();
                    }
                }
            });

            // Draw node
            const pulse = Math.sin(this.time * 2 + node.phase) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);

            if (node.suspicious) {
                ctx.fillStyle = `rgba(255, 34, 68, ${0.5 + pulse * 0.3})`;
                // Distortion ripple
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size * 3 + Math.sin(this.time * 3) * 5, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 34, 68, ${0.1 + pulse * 0.1})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            } else {
                ctx.fillStyle = `rgba(0, 255, 136, ${0.4 + pulse * 0.2})`;
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
            ctx.fill();
        });

        // Probability arcs between suspicious nodes
        const suspNodes = this.neuralNodes.filter(n => n.suspicious);
        for (let i = 0; i < suspNodes.length; i++) {
            for (let j = i + 1; j < suspNodes.length; j++) {
                const a = suspNodes[i];
                const b = suspNodes[j];
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.quadraticCurveTo(
                    (a.x + b.x) / 2, (a.y + b.y) / 2 - 40 - Math.sin(this.time) * 20,
                    b.x, b.y
                );
                ctx.strokeStyle = 'rgba(255, 34, 68, 0.15)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 10]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    drawHeatmap(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        // Organic breathing circuitry
        const cellSize = 8;
        for (let x = 0; x < w; x += cellSize) {
            for (let y = 0; y < h; y += cellSize) {
                const noise = Math.sin(x * 0.05 + this.time) * Math.cos(y * 0.05 + this.time * 0.7);
                const intensity = (noise + 1) / 2;
                const r = Math.floor(intensity * 255 * (intensity > 0.6 ? 1 : 0));
                const g = Math.floor(intensity * 255 * (intensity > 0.3 ? 0.8 : 0.2));
                const b = Math.floor(intensity * 100);
                ctx.fillStyle = `rgba(${r > 180 ? 255 : 0}, ${g > 150 ? 255 : intensity * 180}, ${b > 50 ? 136 : 50}, ${intensity * 0.4})`;
                ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
            }
        }
    }

    drawThreatMap(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        // World map outline (simplified)
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
        ctx.lineWidth = 1;

        // Grid
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Data flow currents
        for (let i = 0; i < 5; i++) {
            const startX = Math.sin(this.time * 0.2 + i * 1.5) * w * 0.3 + w * 0.3;
            const startY = Math.cos(this.time * 0.15 + i) * h * 0.3 + h * 0.4;
            const endX = Math.sin(this.time * 0.18 + i * 0.8 + 2) * w * 0.3 + w * 0.6;
            const endY = Math.cos(this.time * 0.12 + i * 1.2 + 1) * h * 0.3 + h * 0.5;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(
                (startX + endX) / 2 + Math.sin(this.time + i) * 50,
                (startY + endY) / 2 + Math.cos(this.time + i) * 30,
                endX, endY
            );
            ctx.strokeStyle = `rgba(0, 229, 255, 0.15)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Flow particles
            const t = (this.time * 0.5 + i * 0.2) % 1;
            const px = startX + (endX - startX) * t;
            const py = startY + (endY - startY) * t + Math.sin(t * Math.PI) * 20;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
            ctx.fill();
        }

        // Threat markers
        this.threatMarkers.forEach(marker => {
            const pulse = Math.sin(this.time * 3 + marker.pulse) * 0.3 + 0.7;
            const color = marker.severity === 'high' ? '255, 34, 68'
                : marker.severity === 'medium' ? '255, 215, 0'
                    : '0, 255, 136';
            const size = marker.severity === 'high' ? 6 : marker.severity === 'medium' ? 4 : 3;

            // Spectral pattern
            ctx.beginPath();
            ctx.arc(marker.x, marker.y, size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${0.5 + pulse * 0.3})`;
            ctx.fill();

            // Ripple
            ctx.beginPath();
            ctx.arc(marker.x, marker.y, size * 3 * pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${color}, 0.15)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    drawCloud(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        // 3D constellation layout
        this.cloudNodes.forEach((node, i) => {
            const floatY = Math.sin(this.time + node.pulse) * 8;

            // Protective dome
            ctx.beginPath();
            ctx.arc(node.x, node.y + floatY, node.size * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.05 + Math.sin(this.time + i) * 0.03})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y + floatY, node.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, 0.1)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(0, 255, 136, 0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label
            ctx.font = '9px "Orbitron", sans-serif';
            ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
            ctx.textAlign = 'center';
            ctx.fillText(node.type, node.x, node.y + floatY + 4);

            // Connections to other nodes
            this.cloudNodes.forEach((other, j) => {
                if (i >= j) return;
                if (Math.abs(i - j) > 3 && !(i === 0 && j === 5)) return;

                ctx.beginPath();
                ctx.moveTo(node.x, node.y + floatY);
                ctx.lineTo(other.x, other.y + Math.sin(this.time + other.pulse) * 8);
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        });

        // Zero Trust concentric barriers (visual background)
        const cx = w / 2;
        const cy = h / 2;
        for (let i = 0; i < 4; i++) {
            const r = 50 + i * 50;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            const colors = ['rgba(0, 255, 136, 0.03)', 'rgba(0, 229, 255, 0.03)', 'rgba(176, 0, 255, 0.03)', 'rgba(255, 34, 68, 0.03)'];
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 15]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    drawBiometric(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // Iris scan
        const scanAngle = this.time * 1.5;

        // Outer iris
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Iris pattern
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i + scanAngle;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * 15, cy + Math.sin(angle) * 15);
            ctx.lineTo(cx + Math.cos(angle) * 33, cy + Math.sin(angle) * 33);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 + Math.sin(this.time * 3 + i) * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Pupil
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Scan line
        ctx.beginPath();
        ctx.moveTo(cx - 40, cy + Math.sin(this.time * 4) * 30);
        ctx.lineTo(cx + 40, cy + Math.sin(this.time * 4) * 30);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // MFA rings
        for (let i = 0; i < 3; i++) {
            const r = 42 + i * 8;
            const startAngle = this.time * (1 + i * 0.5);
            ctx.beginPath();
            ctx.arc(cx, cy, r, startAngle, startAngle + Math.PI * 0.8);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 - i * 0.03})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Fingerprint lattice (right side)
        const fpX = cx + 70;
        const fpY = cy;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.ellipse(fpX, fpY, 15 + i * 4, 20 + i * 5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.08 + (6 - i) * 0.02})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    drawK8s(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * this.dpr;
        canvas.height = h * this.dpr;
        ctx.scale(this.dpr, this.dpr);
        ctx.clearRect(0, 0, w, h);

        // K8s cluster visualization
        const cx = w / 2;
        const cy = h / 2;

        // Cluster nodes
        const nodePositions = [
            { x: cx, y: cy - 50, label: 'MASTER' },
            { x: cx - 80, y: cy + 40, label: 'WORKER-1' },
            { x: cx + 80, y: cy + 40, label: 'WORKER-2' },
        ];

        // Draw connections
        nodePositions.forEach((node, i) => {
            nodePositions.forEach((other, j) => {
                if (i >= j) return;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        });

        // Draw node circles
        nodePositions.forEach((node, i) => {
            const pulse = Math.sin(this.time * 2 + i) * 3;

            ctx.beginPath();
            ctx.arc(node.x, node.y, 22 + pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.05)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.font = '7px "Orbitron", sans-serif';
            ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 3);

            // Orbiting pods
            const podCount = i === 0 ? 4 : 3;
            for (let p = 0; p < podCount; p++) {
                const pa = this.time * 1.5 + (Math.PI * 2 / podCount) * p;
                const pr = 35;
                const px = node.x + Math.cos(pa) * pr;
                const py = node.y + Math.sin(pa) * pr;

                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
                ctx.fill();
            }
        });

        // 3D rotation effect
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.time * 0.1);
        ctx.beginPath();
        ctx.ellipse(0, 0, 100, 30, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    // ---- HELPER METHODS ---- //
    addLog(container, text, type = 'info') {
        if (!container) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = text;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;

        // Limit log entries
        while (container.children.length > 50) {
            container.removeChild(container.firstChild);
        }
    }

    updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // ---- METRIC UPDATES ---- //
    startMetricUpdates() {
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        setInterval(() => {
            // TPS
            const tps = Math.floor(Math.random() * 500 + 100);
            const tpsEl = document.querySelector('#metric-tps .metric-value');
            if (tpsEl) tpsEl.textContent = tps;
            const tpsFill = document.querySelector('#metric-tps .metric-fill');
            if (tpsFill) tpsFill.style.width = (tps / 600 * 100) + '%';

            // Latency
            const latency = Math.floor(Math.random() * 30 + 5);
            const latEl = document.querySelector('#metric-latency .metric-value');
            if (latEl) latEl.innerHTML = latency + '<span class="metric-unit">ms</span>';

            // Sparkline
            this.sparklineData.push(latency);
            if (this.sparklineData.length > 30) this.sparklineData.shift();
            this.drawSparkline();

            // TLS
            const tlsCount = Math.floor(Math.random() * 100 + 50);
            const tlsEl = document.querySelector('#metric-ssl .metric-value');
            if (tlsEl) tlsEl.textContent = tlsCount;

            // System load
            const load = Math.floor(Math.random() * 40 + 15);
            this.updateElement('sys-load', load + '%');

        }, 2000);

        // Clock
        setInterval(() => {
            const now = new Date();
            const time = now.toTimeString().split(' ')[0];
            this.updateElement('sysClock', time);
        }, 1000);

        // Uptime
        const startTime = Date.now();
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
            const mins = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
            const secs = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
            this.updateElement('uptime', `${hours}:${mins}:${secs}`);
        }, 1000);
    }

    drawSparkline() {
        const canvas = document.querySelector('#metric-latency .sparkline-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w * 2;
        canvas.height = h * 2;
        ctx.scale(2, 2);
        ctx.clearRect(0, 0, w, h);

        if (this.sparklineData.length < 2) return;

        const max = Math.max(...this.sparklineData);
        const min = Math.min(...this.sparklineData);
        const range = max - min || 1;
        const step = w / (this.sparklineData.length - 1);

        // Gradient fill
        ctx.beginPath();
        ctx.moveTo(0, h);
        this.sparklineData.forEach((v, i) => {
            const x = i * step;
            const y = h - ((v - min) / range) * (h - 4) - 2;
            ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0, 255, 136, 0.15)');
        grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        this.sparklineData.forEach((v, i) => {
            const x = i * step;
            const y = h - ((v - min) / range) * (h - 4) - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // ---- SIEM LOG STREAM ---- //
    startSIEMLog() {
        const siem = document.getElementById('siem-log');
        const messages = [
            { text: '[SCAN] Port scan detected from 192.168.{0}.{1}', type: 'warn' },
            { text: '[AUTH] Failed login attempt #{0} from unknown IP', type: 'error' },
            { text: '[FW] Blocked suspicious payload from {0}.{1}.{2}.{3}', type: 'warn' },
            { text: '[SSL] Certificate rotation completed for domain #{0}', type: 'success' },
            { text: '[IDS] Anomaly score: {0}/100 - within threshold', type: 'info' },
            { text: '[WAF] SQL injection attempt blocked (rule #{0})', type: 'error' },
            { text: '[AUDIT] User access review completed', type: 'success' },
            { text: '[NET] Bandwidth utilization: {0}%', type: 'info' },
            { text: '[K8S] Pod auto-scaled: payment-service replica #{0}', type: 'success' },
            { text: '[SIEM] Correlation rule triggered: pattern #{0}', type: 'warn' },
        ];

        setInterval(() => {
            if (this.activeModule !== 'threat-intel') return;
            const msg = messages[Math.floor(Math.random() * messages.length)];
            let text = msg.text;
            text = text.replace(/\{(\d+)\}/g, () => Math.floor(Math.random() * 255));
            this.addLog(siem, text, msg.type);
        }, 2500);
    }

    // ---- ANIMATION LOOPS ---- //
    startAnimationLoops() {
        const animate = () => {
            this.time += 0.016;

            // Draw module-specific canvases
            switch (this.activeModule) {
                case 'transaction-flow':
                    this.drawTransactionFlow(document.getElementById('tx-flow-canvas'));
                    break;
                case 'cicd-pipeline':
                    this.drawK8s(document.getElementById('k8s-canvas'));
                    break;
                case 'blockchain':
                    this.drawBlockchain(document.getElementById('blockchain-canvas'));
                    break;
                case 'neural-net':
                    this.drawNeuralNet(document.getElementById('neural-canvas'));
                    this.drawHeatmap(document.getElementById('heatmap-canvas'));
                    break;
                case 'threat-intel':
                    this.drawThreatMap(document.getElementById('threat-map-canvas'));
                    break;
                case 'cloud-infra':
                    this.drawCloud(document.getElementById('cloud-canvas'));
                    this.drawBiometric(document.getElementById('biometric-canvas'));
                    break;
            }

            requestAnimationFrame(animate);
        };
        animate();
    }
}

window.UIController = UIController;
