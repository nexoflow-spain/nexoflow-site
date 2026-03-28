// ============================
// NEXOFLOW - Scroll-Controlled Brain Animation
// GSAP ScrollTrigger with scrub
// ============================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // ============================
    // Navigation
    // ============================
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '.nav' }
    });
    
    // ============================
    // Hero Animations (auto-play)
    // ============================
    gsap.fromTo('.hero-badge', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    );
    
    gsap.fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
    );
    
    gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
    );
    
    gsap.fromTo('.hero-cta',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' }
    );
    
    gsap.fromTo('.hero-stats',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
    );
    
    // ============================
    // SCROLL-CONTROLLED BRAIN
    // ============================
    
    const brainSection = document.querySelector('.brain-scroll-section');
    const brainWrapper = document.querySelector('.brain-wrapper');
    const progressBar = document.querySelector('.progress-bar::after') || document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-percent');
    
    // Text panels
    const panel1 = document.querySelector('.panel-1');
    const panel2 = document.querySelector('.panel-2');
    const panel3 = document.querySelector('.panel-3');
    
    // Brain layers
    const layerBg = document.querySelector('.layer-bg');
    const layerConnections = document.querySelector('.layer-connections');
    const layerMain = document.querySelector('.layer-main');
    const layerActive = document.querySelector('.layer-active');
    
    // Brain elements
    const leftHemisphere = document.querySelector('.brain-hemisphere.left');
    const rightHemisphere = document.querySelector('.brain-hemisphere.right');
    const brainDetails = document.querySelectorAll('.brain-detail');
    const brainCore = document.querySelector('.brain-core');
    const brainCoreInner = document.querySelector('.brain-core-inner');
    const activeNodes = document.querySelectorAll('.active-node');
    const connLines = document.querySelectorAll('.conn-line');
    const bgNodes = document.querySelectorAll('.bg-node');
    
    // Create main timeline with scrub
    const brainTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.brain-scroll-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: '.brain-scroll-container',
            pinSpacing: true,
            onUpdate: (self) => {
                // Update progress indicator
                const progress = Math.round(self.progress * 100);
                if (progressText) {
                    progressText.textContent = progress + '%';
                }
                if (progressBar) {
                    progressBar.style.setProperty('--progress', progress + '%');
                    // Direct style manipulation for pseudo-element workaround
                    const bar = document.querySelector('.progress-bar');
                    if (bar) {
                        bar.innerHTML = `<div style="height: 100%; width: ${progress}%; background: linear-gradient(90deg, #a855f7, #6366f1); transition: width 0.1s linear;"></div>`;
                    }
                }
                
                // Activate text panels based on progress
                if (panel1 && panel2 && panel3) {
                    panel1.classList.toggle('active', progress < 33);
                    panel2.classList.toggle('active', progress >= 33 && progress < 66);
                    panel3.classList.toggle('active', progress >= 66);
                }
            }
        }
    });
    
    // PHASE 1: Background nodes appear (0% - 20%)
    brainTl.fromTo(bgNodes, 
        { opacity: 0, scale: 0 },
        { 
            opacity: 0.3, 
            scale: 1, 
            duration: 0.2,
            stagger: 0.02,
            ease: 'back.out(1.7)'
        },
        0
    );
    
    // Background layer parallax
    brainTl.fromTo(layerBg,
        { rotateY: -30, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
        0
    );
    
    // PHASE 2: Connection lines draw (15% - 35%)
    connLines.forEach((line, i) => {
        const length = line.getTotalLength ? line.getTotalLength() : 300;
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        
        brainTl.to(line, {
            strokeDashoffset: 0,
            opacity: 0.6,
            duration: 0.15,
            ease: 'power2.inOut'
        }, 0.15 + (i * 0.02));
    });
    
    // Connection layer movement
    brainTl.fromTo(layerConnections,
        { rotateY: 20, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.2, ease: 'power2.out' },
        0.15
    );
    
    // PHASE 3: Brain hemispheres draw (30% - 50%)
    if (leftHemisphere) {
        const leftLength = leftHemisphere.getTotalLength ? leftHemisphere.getTotalLength() : 1000;
        leftHemisphere.style.strokeDasharray = leftLength;
        leftHemisphere.style.strokeDashoffset = leftLength;
        
        brainTl.to(leftHemisphere, {
            strokeDashoffset: 0,
            duration: 0.15,
            ease: 'power2.inOut'
        }, 0.3);
    }
    
    if (rightHemisphere) {
        const rightLength = rightHemisphere.getTotalLength ? rightHemisphere.getTotalLength() : 1000;
        rightHemisphere.style.strokeDasharray = rightLength;
        rightHemisphere.style.strokeDashoffset = rightLength;
        
        brainTl.to(rightHemisphere, {
            strokeDashoffset: 0,
            duration: 0.15,
            ease: 'power2.inOut'
        }, 0.35);
    }
    
    // Main layer entrance with 3D rotation
    brainTl.fromTo(layerMain,
        { rotateY: -45, scale: 0.8, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 0.2, ease: 'power3.out' },
        0.3
    );
    
    // PHASE 4: Inner details appear (45% - 60%)
    brainDetails.forEach((detail, i) => {
        const length = detail.getTotalLength ? detail.getTotalLength() : 200;
        detail.style.strokeDasharray = length;
        detail.style.strokeDashoffset = length;
        
        brainTl.to(detail, {
            strokeDashoffset: 0,
            opacity: 0.8,
            duration: 0.1,
            ease: 'power2.inOut'
        }, 0.45 + (i * 0.02));
    });
    
    // PHASE 5: Core activates (55% - 70%)
    if (brainCore) {
        brainTl.fromTo(brainCore,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.1, ease: 'back.out(2)' },
            0.55
        );
    }
    
    if (brainCoreInner) {
        brainTl.fromTo(brainCoreInner,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 0.9, duration: 0.08, ease: 'back.out(2)' },
            0.6
        );
    }
    
    // PHASE 6: Active nodes light up (65% - 85%)
    activeNodes.forEach((node, i) => {
        brainTl.fromTo(node,
            { opacity: 0, scale: 0 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.03,
                ease: 'back.out(2)'
            },
            0.65 + (i * 0.015)
        );
    });
    
    // Active layer with forward z-position
    brainTl.fromTo(layerActive,
        { rotateY: 30, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
        0.65
    );
    
    // PHASE 7: Full rotation and glow intensity (80% - 100%)
    brainTl.to(brainWrapper, {
        rotateY: 15,
        rotateX: 5,
        duration: 0.2,
        ease: 'power2.inOut'
    }, 0.8);
    
    // Intensify glow on all elements
    brainTl.to('.brain-hemisphere', {
        filter: 'drop-shadow(0 0 20px currentColor)',
        duration: 0.1
    }, 0.85);
    
    brainTl.to('.active-node', {
        scale: 1.2,
        duration: 0.1,
        stagger: 0.01,
        yoyo: true,
        repeat: 1
    }, 0.9);
    
    // ============================
    // Services Animations
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
            }
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
                }
            }
        );
    });
    
    // ============================
    // CTA Animation
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
            }
        }
    );
    
    // ============================
    // Magnetic Buttons
    // ============================
    document.querySelectorAll('.btn-primary, .btn-cta').forEach(btn => {
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
    // Console
    // ============================
    console.log(
        '%c⚡ nexoflow %c| Scroll-Controlled Brain Active',
        'background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'color: #a855f7; font-weight: 500;'
    );
    console.log('%cScroll to assemble the neural network', 'color: #666;');
});
