// ============================
// NEXOFLOW - Interactive Scripts
// Scroll animations + Effects
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const nav = document.querySelector('.nav');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // ============================
    // Navigation Scroll Effect
    // ============================
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for nav background
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // ============================
    // Scroll Reveal Animation
    // ============================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on element's position in parent
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const elementIndex = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${elementIndex * 0.1}s`;
                }
                
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // ============================
    // Smooth Scroll for Nav Links
    // ============================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================
    // Parallax Effect for Background
    // ============================
    const bgGradient = document.querySelector('.bg-gradient');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (bgGradient) {
            bgGradient.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
    
    // ============================
    // Service Card Hover Tilt Effect
    // ============================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // ============================
    // Magnetic Button Effect
    // ============================
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-cta');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
    
    // ============================
    // Step Number Counter Animation
    // ============================
    const stepNumbers = document.querySelectorAll('.step-number');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                entry.target.offsetHeight; // Trigger reflow
                entry.target.style.animation = 'numberPulse 0.6s var(--ease-out-expo)';
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stepNumbers.forEach(num => numberObserver.observe(num));
    
    // ============================
    // Stat Number Animation
    // ============================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                // Check if it's a number or text
                if (!isNaN(parseInt(text))) {
                    // It's a number, animate it
                    const finalNumber = parseInt(text);
                    const suffix = text.replace(/[0-9]/g, '');
                    let current = 0;
                    const increment = finalNumber / 30;
                    const duration = 1000;
                    const stepTime = duration / 30;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= finalNumber) {
                            target.textContent = finalNumber + suffix;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + suffix;
                        }
                    }, stepTime);
                }
                
                statObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statObserver.observe(stat));
    
    // ============================
    // Text Scramble Effect for Hero Title
    // ============================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Apply scramble effect to subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        const fx = new TextScramble(heroSubtitle);
        
        setTimeout(() => {
            fx.setText(originalText);
        }, 1000);
    }
    
    // ============================
    // Console Easter Egg
    // ============================
    console.log(
        '%c⚡ nexoflow %c| Transformando empresas con IA',
        'background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'color: #a855f7; font-weight: 500;'
    );
    console.log('%c¿Interesado en trabajar con nosotros? hola@nexoflow.ai', 'color: #666;');
});

// ============================
// CSS Animation Keyframes Injection
// ============================
const style = document.createElement('style');
style.textContent = `
    @keyframes numberPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .scramble-char {
        color: #a855f7;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
