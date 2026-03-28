// ============================
// NEXOFLOW - 3D Brain with Three.js
// Professional wireframe neural network
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // ============================
    // THREE.JS SETUP
    // ============================
    const container = document.getElementById('brainContainer');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.02);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // ============================
    // BRAIN GEOMETRY
    // ============================
    
    // Create brain group
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);
    
    // Brain material - cyan wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // Inner core material
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    // Left hemisphere (slightly flattened sphere)
    const leftGeo = new THREE.SphereGeometry(2.2, 32, 32);
    // Deform to look like brain hemisphere
    const leftPos = leftGeo.attributes.position;
    for (let i = 0; i < leftPos.count; i++) {
        const x = leftPos.getX(i);
        const y = leftPos.getY(i);
        const z = leftPos.getZ(i);
        
        // Flatten sides
        if (x > 0) leftPos.setX(i, x * 0.3);
        
        // Add some noise/wrinkles
        const noise = Math.sin(y * 3) * Math.cos(z * 2) * 0.1;
        leftPos.setX(i, leftPos.getX(i) + noise);
    }
    leftGeo.computeVertexNormals();
    
    const leftHemisphere = new THREE.Mesh(leftGeo, wireframeMaterial);
    leftHemisphere.position.x = -1.1;
    brainGroup.add(leftHemisphere);
    
    // Right hemisphere
    const rightGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const rightPos = rightGeo.attributes.position;
    for (let i = 0; i < rightPos.count; i++) {
        const x = rightPos.getX(i);
        const y = rightPos.getY(i);
        const z = rightPos.getZ(i);
        
        if (x < 0) rightPos.setX(i, x * 0.3);
        
        const noise = Math.sin(y * 3) * Math.cos(z * 2) * 0.1;
        rightPos.setX(i, rightPos.getX(i) + noise);
    }
    rightGeo.computeVertexNormals();
    
    const rightHemisphere = new THREE.Mesh(rightGeo, wireframeMaterial);
    rightHemisphere.position.x = 1.1;
    brainGroup.add(rightHemisphere);
    
    // Inner core (smaller sphere inside)
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
    brainGroup.add(coreMesh);
    
    // ============================
    // NEURAL CONNECTIONS (Lines)
    // ============================
    
    const connectionsGroup = new THREE.Group();
    brainGroup.add(connectionsGroup);
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.4
    });
    
    // Create random connections between points
    const connectionCount = 150;
    const connectionLines = [];
    
    for (let i = 0; i < connectionCount; i++) {
        const points = [];
        
        // Random start point on sphere surface
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = 2 + Math.random() * 0.5;
        
        const x1 = r * Math.sin(theta) * Math.cos(phi);
        const y1 = r * Math.sin(theta) * Math.sin(phi);
        const z1 = r * Math.cos(theta);
        
        points.push(new THREE.Vector3(x1, y1, z1));
        
        // Random end point
        const phi2 = phi + (Math.random() - 0.5) * 1;
        const theta2 = theta + (Math.random() - 0.5) * 1;
        const r2 = r + (Math.random() - 0.5) * 1;
        
        const x2 = r2 * Math.sin(theta2) * Math.cos(phi2);
        const y2 = r2 * Math.sin(theta2) * Math.sin(phi2);
        const z2 = r2 * Math.cos(theta2);
        
        points.push(new THREE.Vector3(x2, y2, z2));
        
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMaterial);
        
        line.userData = {
            originalOpacity: 0.2 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1
        };
        
        connectionsGroup.add(line);
        connectionLines.push(line);
    }
    
    // ============================
    // PARTICLES (Neural nodes)
    // ============================
    
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = 1.8 + Math.random() * 1.2;
        
        particlePositions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        particlePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        particlePositions[i * 3 + 2] = r * Math.cos(theta);
        
        particleSizes[i] = 0.03 + Math.random() * 0.05;
        particlePhases[i] = Math.random() * Math.PI * 2;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeo, particleMaterial);
    brainGroup.add(particles);
    
    // ============================
    // GLOW EFFECT (Sprite)
    // ============================
    
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext('2d');
    
    const gradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
    gradient.addColorStop(0.4, 'rgba(0, 212, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 128, 128);
    
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(12, 12, 1);
    brainGroup.add(glowSprite);
    
    // ============================
    // LIGHTS
    // ============================
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x0099cc, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // ============================
    // MOUSE INTERACTION
    // ============================
    
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    
    // ============================
    // SCROLL CONTROL
    // ============================
    
    let scrollProgress = 0;
    let targetScrollRotation = 0;
    
    ScrollTrigger.create({
        trigger: '.hero-3d',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
            scrollProgress = self.progress;
            targetScrollRotation = scrollProgress * Math.PI * 2; // Full rotation on scroll
        }
    });
    
    // ============================
    // ANIMATION LOOP
    // ============================
    
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.01;
        
        // Auto rotation
        brainGroup.rotation.y += 0.002;
        
        // Scroll rotation (adds to auto rotation)
        brainGroup.rotation.y += (targetScrollRotation - brainGroup.rotation.y) * 0.05;
        
        // Mouse interaction (subtle tilt)
        targetRotationX = mouseY * 0.2;
        targetRotationY = mouseX * 0.2;
        
        brainGroup.rotation.x += (targetRotationX - brainGroup.rotation.x) * 0.05;
        brainGroup.rotation.z += (targetRotationY - brainGroup.rotation.z) * 0.05;
        
        // Animate connections (pulsing opacity)
        connectionLines.forEach((line, i) => {
            const pulse = Math.sin(time * line.userData.speed + line.userData.phase);
            line.material.opacity = line.userData.originalOpacity + pulse * 0.2;
        });
        
        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const phase = particlePhases[i];
            const pulse = Math.sin(time * 2 + phase) * 0.1;
            
            // Subtle movement
            positions[i * 3 + 1] += pulse * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Pulse the glow
        glowSprite.material.opacity = 0.3 + Math.sin(time) * 0.1;
        
        // Rotate core
        coreMesh.rotation.x += 0.005;
        coreMesh.rotation.y += 0.003;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // ============================
    // RESIZE HANDLER
    // ============================
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
    
    // ============================
    // UI ANIMATIONS
    // ============================
    
    // Nav scroll effect
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '.nav' }
    });
    
    // Hero text animations
    gsap.to('.title-line:first-child', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        onStart: function() {
            document.querySelector('.title-line:first-child').classList.add('visible');
        }
    });
    
    gsap.to('.title-line:last-child', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
        onStart: function() {
            document.querySelector('.title-line:last-child').classList.add('visible');
        }
    });
    
    gsap.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out',
        onStart: function() {
            document.querySelector('.hero-subtitle').classList.add('visible');
        }
    });
    
    gsap.to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1,
        ease: 'power3.out',
        onStart: function() {
            document.querySelector('.hero-buttons').classList.add('visible');
        }
    });
    
    // Services animations
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
    
    // CTA animation
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
    // CONSOLE
    // ============================
    console.log(
        '%c⚡ nexoflow %c| Three.js 3D Brain Active',
        'background: linear-gradient(135deg, #00d4ff, #0099cc); color: #050508; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'color: #00d4ff; font-weight: 500;'
    );
    console.log('%c200 particles | 150 connections | Real-time rendering', 'color: #666;');
});
