/* ============================================================
   MAIN APPLICATION - Initialization & Event Orchestration
   Dark Cyberpunk Anti-Gravity DevSecOps Payment Gateway
   Control Temple
   ============================================================ */

(function () {
    'use strict';

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', () => {
        console.log('%c⬡ PAYMENT GATEWAY CONTROL TEMPLE INITIALIZING...',
            'color: #00ff88; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00ff88;');
        console.log('%c⚠ AUTHORIZED CYBERSECURITY TRAINING ENVIRONMENT',
            'color: #ffd700; font-size: 12px; font-weight: bold;');
        console.log('%c  DEVSECOPS PAYMENT GATEWAY SIMULATION MODE',
            'color: #ffd700; font-size: 11px;');

        // Initialize engines
        let canvasEngine, particleEngine, uiController;

        try {
            canvasEngine = new CanvasEngine();
            console.log('%c  ✓ Canvas Engine Online', 'color: #00ff88;');
        } catch (e) {
            console.error('Canvas Engine failed:', e);
        }

        try {
            particleEngine = new ParticleEngine();
            console.log('%c  ✓ Particle Engine Online', 'color: #00ff88;');
        } catch (e) {
            console.error('Particle Engine failed:', e);
        }

        try {
            uiController = new UIController(particleEngine);
            console.log('%c  ✓ UI Controller Online', 'color: #00ff88;');
        } catch (e) {
            console.error('UI Controller failed:', e);
        }

        let cartEngine;
        try {
            cartEngine = new CartEngine();
            window.cartEngine = cartEngine;
            window.particleEngine = particleEngine;
            console.log('%c  ✓ Cart Engine Online', 'color: #00ff88;');
        } catch (e) {
            console.error('Cart Engine failed:', e);
        }

        console.log('%c⬡ ALL SYSTEMS NOMINAL',
            'color: #00ff88; font-size: 14px; font-weight: bold;');

        // ---- AMBIENT SOUND HEARTBEAT (visual only) ---- //
        let heartbeatPhase = 0;
        setInterval(() => {
            heartbeatPhase += 0.1;
            // Sync status dot pulses to a heartbeat rhythm
            const dots = document.querySelectorAll('.status-dot.green');
            const scale = 1 + Math.sin(heartbeatPhase * 2) * 0.15;
            dots.forEach(d => {
                d.style.transform = `scale(${scale})`;
            });
        }, 50);

        // ---- DIGITAL STATIC BURSTS ---- //
        setInterval(() => {
            const crtFlicker = document.getElementById('crt-flicker');
            if (crtFlicker && Math.random() > 0.95) {
                crtFlicker.style.opacity = '0.05';
                crtFlicker.style.background = `rgba(${Math.random() > 0.5 ? '0, 255, 136' : '255, 34, 68'}, 0.02)`;
                setTimeout(() => {
                    crtFlicker.style.opacity = '0';
                }, 50 + Math.random() * 100);
            }
        }, 200);

        // ---- SKULL WATERMARK INSIGNIAS (background grid) ---- //
        // Stylized digital skull patterns in the background - non-violent symbolic
        const addSkullPatterns = () => {
            const ctx = canvasEngine?.contexts?.['bg-neural-grid'];
            if (!ctx) return;
            // These are drawn as part of the neural grid's animation loop
            // The skull insignias are geometric/digital abstractions
        };

        // ---- KEYBOARD SHORTCUTS ---- //
        document.addEventListener('keydown', (e) => {
            const modules = ['transaction-flow', 'cicd-pipeline', 'blockchain', 'neural-net', 'threat-intel', 'cloud-infra'];
            const key = parseInt(e.key);
            if (key >= 1 && key <= 6) {
                const idx = key - 1;
                uiController?.switchModule(modules[idx]);
                document.querySelectorAll('.nav-ring').forEach((b, i) => {
                    b.classList.toggle('active', i === idx);
                });
            }

            // Space bar: trigger action for current module
            if (e.key === ' ') {
                e.preventDefault();
                switch (uiController?.activeModule) {
                    case 'transaction-flow':
                        uiController.initiateTransaction();
                        break;
                    case 'cicd-pipeline':
                        uiController.runPipeline();
                        break;
                    case 'blockchain':
                        uiController.forgeBlock();
                        break;
                    case 'neural-net':
                        uiController.activateNeuralScan();
                        break;
                    case 'threat-intel':
                        uiController.launchPenTest();
                        break;
                }
            }

            // R key: trigger red alert test
            if (e.key === 'r' || e.key === 'R') {
                uiController?.triggerRedAlert();
                if (particleEngine) {
                    particleEngine.addCrimsonShockwave(window.innerWidth / 2, window.innerHeight / 2);
                }
                document.getElementById('app')?.classList.add('camera-shake');
                setTimeout(() => {
                    document.getElementById('app')?.classList.remove('camera-shake');
                }, 500);
            }
        });

        // ---- INTERACTIVE LIGHTING REACTIVITY ---- //
        // Higher transaction volume = brighter glow
        let transactionGlow = 0;
        setInterval(() => {
            transactionGlow = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
            document.documentElement.style.setProperty(
                '--neon-emerald-glow',
                `rgba(0, 255, 136, ${0.2 + transactionGlow * 0.2})`
            );
        }, 100);

        // ---- ANTI-GRAVITY FLOAT EFFECT ON UI PANELS ---- //
        const floatPanels = document.querySelectorAll('.tier-panel, .pipeline-container, .k8s-cluster-panel, .vuln-scanner-panel');
        let floatTime = 0;
        const animateFloat = () => {
            floatTime += 0.016;
            floatPanels.forEach((panel, i) => {
                const y = Math.sin(floatTime * 0.5 + i * 0.8) * 3;
                const x = Math.cos(floatTime * 0.3 + i * 0.5) * 1.5;
                panel.style.transform = `translate(${x}px, ${y}px)`;
            });
            requestAnimationFrame(animateFloat);
        };
        animateFloat();

        // ---- HOVER MAGNETIC ATTRACTION ---- //
        document.querySelectorAll('.process-node, .pipeline-stage, .nav-ring').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const maxShift = 5;
                const shiftX = (x / rect.width) * maxShift;
                const shiftY = (y / rect.height) * maxShift;
                el.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });

        // ---- AUTO-DEMONSTRATION ---- //
        // Periodically trigger events to keep the environment alive
        setInterval(() => {
            // Random background events
            const events = [
                () => {
                    // Random particle burst somewhere
                    if (particleEngine) {
                        particleEngine.addBurst(
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerHeight,
                            5, Math.random() > 0.8 ? 'crimson' : 'emerald'
                        );
                    }
                },
                () => {
                    // Subtle CRT glitch
                    const crt = document.getElementById('crt-flicker');
                    if (crt) {
                        crt.style.opacity = '0.03';
                        setTimeout(() => { crt.style.opacity = '0'; }, 30);
                    }
                },
                () => {
                    // Random ripple
                    if (particleEngine) {
                        particleEngine.addRipple(
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerHeight,
                            'emerald', 50
                        );
                    }
                }
            ];

            events[Math.floor(Math.random() * events.length)]();
        }, 3000);

        // ---- WINDOW FOCUS/BLUR EFFECTS ---- //
        window.addEventListener('blur', () => {
            document.body.style.filter = 'brightness(0.5)';
        });

        window.addEventListener('focus', () => {
            document.body.style.filter = '';
            // Re-entry glitch effect
            const app = document.getElementById('app');
            if (app) {
                app.classList.add('glitch-active');
                setTimeout(() => app.classList.remove('glitch-active'), 300);
            }
        });

        // ---- PREVENT RIGHT-CLICK (simulation environment) ---- //
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (particleEngine) {
                particleEngine.addCrimsonShockwave(e.clientX, e.clientY);
            }
        });

    });

})();
