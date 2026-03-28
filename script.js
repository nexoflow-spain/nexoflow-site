// ============================
// NEXOFLOW - Professional Neural Network Animation
// GSAP + Canvas - Industry Standard
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // ============================
    // Navigation Scroll Effect
    // ============================
    const nav = document.querySelector('.nav');
    
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: nav }
    });
    
    // ============================
    // Hero Animations
    // ============================
    const heroElements = [
        '.hero-badge',
        '.hero-title', 
        '.hero-subtitle',
        '.hero-cta',
        '.hero-stats'
    ];
    
    heroElements.forEach((el, i) => {
        const element = document.querySelector(el);
        if (element) {
            gsap.fromTo(element, 
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: 'power3.out',
                    onStart: () => element.classList.add('visible')
                }
            );
        }
    });
    
    // ============================
    // PROFESSIONAL NEURAL NETWORK
    // ============================
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');
    
    if (canvas) {
        let width, height;
        let particles = [];
        let connections = [];
        let animationId;
        let isVisible = false;
        let scrollProgress = 0;
        
        // Configuration
        const config = {
            particleCount: 60,
            connectionDistance: 120,
            particleSpeed: 0.3,
            particleRadius: { min: 2, max: 5 },
            colors: [
                { r: 168, g: 85, b: 247 },   // Purple
                { r: 99, g: 102, b: 241 },   // Indigo
                { r: 59, g: 130, b: 246 },   // Blue
                { r: 244, g: 114, b: 182 }   // Pink
            ]
        };
        
        // Resize canvas
        function resize() {
            const container = canvas.parentElement;
            width = container.offsetWidth;
            height = container.offsetHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        
        resize();
        window.addEventListener('resize', resize, { passive: true });
        
        // Particle Class
        class Particle {
            constructor() {
                this.reset();
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            }
            
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.particleSpeed;
                this.vy = (Math.random() - 0.5) * config.particleSpeed;
                this.radius = config.particleRadius.min + Math.random() * (config.particleRadius.max - config.particleRadius.min);
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                this.alpha = 0;
                this.targetAlpha = 0.6 + Math.random() * 0.4;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.02 + Math.random() * 0.02;
            }
            
            update() {
                // Movement
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                
                // Keep in bounds
                this.x = Math.max(0, Math.min(width, this.x));
                this.y = Math.max(0, Math.min(height, this.y));
                
                // Pulse effect
                this.pulsePhase += this.pulseSpeed;
                
                // Fade in on scroll
                if (isVisible && this.alpha < this.targetAlpha) {
                    this.alpha += 0.02;
                }
            }
            
            draw() {
                const pulse = 1 + Math.sin(this.pulsePhase) * 0.2;
                const radius = this.radius * pulse;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
                ctx.fill();
                
                // Glow effect
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, radius * 3
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
        
        // Initialize particles
        function initParticles() {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        initParticles();
        
        // Draw connections between nearby particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.connectionDistance) {
                        const opacity = (1 - distance / config.connectionDistance) * p1.alpha * p2.alpha * 0.5;
                        
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Data flow effect
        let dataFlows = [];
        
        function createDataFlow() {
            if (Math.random() > 0.95 && isVisible) {
                const p1 = particles[Math.floor(Math.random() * particles.length)];
                const p2 = particles[Math.floor(Math.random() * particles.length)];
                
                if (p1 !== p2) {
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.connectionDistance * 1.5) {
                        dataFlows.push({
                            x: p1.x,
                            y: p1.y,
                            targetX: p2.x,
                            targetY: p2.y,
                            progress: 0,
                            speed: 0.03 + Math.random() * 0.02
                        });
                    }
                }
            }
        }
        
        function updateDataFlows() {
            createDataFlow();
            
            dataFlows = dataFlows.filter(flow => {
                flow.progress += flow.speed;
                
                if (flow.progress >= 1) {
                    return false;
                }
                
                const x = flow.x + (flow.targetX - flow.x) * flow.progress;
                const y = flow.y + (flow.targetY - flow.y) * flow.progress;
                
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(6, 182, 212, ${1 - flow.progress})`;
                ctx.fill();
                
                // Trail
                ctx.beginPath();
                ctx.arc(x - (flow.targetX - flow.x) * 0.1, y - (flow.targetY - flow.y) * 0.1, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(6, 182, 212, ${(1 - flow.progress) * 0.5})`;
                ctx.fill();
                
                return true;
            });
        }
        
        // Central brain node
        let brainPulse = 0;
        
        function drawBrainCenter() {
            const centerX = width / 2;
            const centerY = height / 2;
            
            brainPulse += 0.03;
            const pulseSize = 1 + Math.sin(brainPulse) * 0.15;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, 80 * pulseSize
            );
            gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
            gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, 80 * pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20 * pulseSize, 0, Math.PI * 2);
            const coreGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, 20 * pulseSize
            );
            coreGradient.addColorStop(0, '#f472b6');
            coreGradient.addColorStop(0.5, '#a855f7');
            coreGradient.addColorStop(1, '#6366f1');
            ctx.fillStyle = coreGradient;
            ctx.fill();
            
            // Connect center to nearby particles
            particles.forEach(p => {
                const dx = p.x - centerX;
                const dy = p.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * p.alpha * 0.8;
                    
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(p.x, p.y);
                    ctx.strokeStyle = `rgba(244, 114, 182, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        }
        
        // Animation loop
        let frameCount = 0;
        
        function animate() {
            if (!isVisible) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            // Clear with trail effect
            ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
            ctx.fillRect(0, 0, width, height);
            
            // Optimize: only draw connections every 2nd frame
            if (frameCount % 2 === 0) {
                drawConnections();
            }
            
            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            // Data flows
            updateDataFlows();
            
            // Brain center
            drawBrainCenter();
            
            frameCount++;
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // Visibility detection with ScrollTrigger
        ScrollTrigger.create({
            trigger: '.neural-section',
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => { isVisible = true; },
            onLeave: () => { isVisible = false; },
            onEnterBack: () => { isVisible = true; },
            onLeaveBack: () => { isVisible = false; }
        });
        
        // Text animations
        gsap.fromTo('.neural-text', 
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.neural-section',
                    start: 'top 70%'
                }
            }
        );
        
        // Counter animation for stats
        const counters = document.querySelectorAll('.n-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const isDecimal = target % 1 !== 0;
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerHTML: isDecimal ? 0.1 : 1 },
                        onUpdate: function() {
                            const val = parseFloat(counter.innerHTML);
                            counter.innerHTML = isDecimal ? val.toFixed(target < 1 ? 3 : 1) : Math.floor(val);
                        }
                    });
                },
                once: true
            });
        });
    }
    
    // ============================
    // Services Section Animations
    // ============================
    gsap.fromTo('.section-header',
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.services',
                start: 'top 75%'
            },
            onStart: () => document.querySelector('.section-header')?.classList.add('visible')
        }
    );
    
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                onStart: () => card.classList.add('visible')
            }
        );
    });
    
    // ============================
    // Process Section Animations
    // ============================
    gsap.utils.toArray('.step').forEach((step, i) => {
        gsap.fromTo(step,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%'
                },
                onStart: () => step.classList.add('visible')
            }
        );
    });
    
    // ============================
    // CTA Section Animation
    // ============================
    gsap.fromTo('.cta-content',
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.cta',
                start: 'top 75%'
            },
            onStart: () => document.querySelector('.cta-content')?.classList.add('visible')
        }
    );
    
    // ============================
    // Magnetic Button Effect
    // ============================
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-cta');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
    
    // ============================
    // Console Easter Egg
    // ============================
    console.log(
        '%c⚡ nexoflow %c| Neural Network Visualization Active',
        'background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'color: #a855f7; font-weight: 500;'
    );
    console.log('%cPowered by GSAP + Canvas | 60 particles | Real-time connections', 'color: #666;');
});
