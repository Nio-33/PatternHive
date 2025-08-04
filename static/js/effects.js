/**
 * PatternHive - Visual Effects
 * Three.js 3D background and particle systems optimized for white background
 */

class VisualEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometricShapes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        // Particle trail system
        this.trailParticles = [];
        this.maxTrailParticles = 50;
        
        this.init();
    }
    
    init() {
        this.setupThreeJS();
        this.createGeometricShapes();
        this.createFloatingParticles();
        this.setupEventListeners();
        this.setupParticleTrail();
        this.animate();
        
        console.log('Visual effects initialized');
    }
    
    setupThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 1, 1000);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.z = 400;
        
        // Renderer
        const canvas = document.getElementById('bg-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0xffffff, 0);
    }
    
    createGeometricShapes() {
        const shapes = [
            { geometry: new THREE.TetrahedronGeometry(20, 0), count: 8 },
            { geometry: new THREE.OctahedronGeometry(15, 0), count: 6 },
            { geometry: new THREE.IcosahedronGeometry(12, 0), count: 4 },
            { geometry: new THREE.BoxGeometry(25, 25, 25), count: 5 }
        ];
        
        shapes.forEach(({ geometry, count }) => {
            for (let i = 0; i < count; i++) {
                // Create wireframe material with darker colors for white background
                const material = new THREE.MeshBasicMaterial({
                    color: this.getRandomAccentColor(),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                
                // Random position
                mesh.position.x = (Math.random() - 0.5) * 1000;
                mesh.position.y = (Math.random() - 0.5) * 1000;
                mesh.position.z = (Math.random() - 0.5) * 1000;
                
                // Random rotation
                mesh.rotation.x = Math.random() * Math.PI;
                mesh.rotation.y = Math.random() * Math.PI;
                mesh.rotation.z = Math.random() * Math.PI;
                
                // Store original position for floating animation
                mesh.userData = {
                    originalX: mesh.position.x,
                    originalY: mesh.position.y,
                    originalZ: mesh.position.z,
                    floatSpeed: 0.01 + Math.random() * 0.02,
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    }
                };
                
                this.scene.add(mesh);
                this.geometricShapes.push(mesh);
            }
        });
    }
    
    createFloatingParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color1 = new THREE.Color(0x0891b2); // Primary accent - darker for white bg
        const color2 = new THREE.Color(0x3b82f6); // Secondary accent - darker for white bg
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 1000;
            
            // Color (interpolate between accent colors)
            const mixRatio = Math.random();
            const color = color1.clone().lerp(color2, mixRatio);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = 2 + Math.random() * 3;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Particle material - adjusted for white background
        const material = new THREE.PointsMaterial({
            size: 3,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.NormalBlending,
            sizeAttenuation: true
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        this.scene.add(particleSystem);
        this.particles.push(particleSystem);
        
        // Store original positions for animation
        particleSystem.userData = {
            originalPositions: positions.slice()
        };
    }
    
    setupEventListeners() {
        // Mouse movement for camera interaction
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - this.windowHalfX) * 0.5;
            this.mouseY = (event.clientY - this.windowHalfY) * 0.5;
        });
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Performance monitoring
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }
    
    setupParticleTrail() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Style the canvas
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        document.addEventListener('mousemove', (e) => {
            // Add new particle at mouse position
            if (this.trailParticles.length < this.maxTrailParticles) {
                this.trailParticles.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    decay: 0.02 + Math.random() * 0.02,
                    size: 2 + Math.random() * 3
                });
            }
        });
        
        // Animate particle trail
        const animateTrail = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = this.trailParticles.length - 1; i >= 0; i--) {
                const particle = this.trailParticles[i];
                
                // Update particle
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= particle.decay;
                
                // Remove dead particles
                if (particle.life <= 0) {
                    this.trailParticles.splice(i, 1);
                    continue;
                }
                
                // Draw particle with darker color for white background
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = '#0891b2';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#0891b2';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            
            requestAnimationFrame(animateTrail);
        };
        
        animateTrail();
        
        // Resize handler for particle canvas
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateCamera();
        this.updateGeometricShapes();
        this.updateParticles();
        this.render();
    }
    
    updateCamera() {
        // Smooth camera movement based on mouse position
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
    }
    
    updateGeometricShapes() {
        const time = Date.now() * 0.001;
        
        this.geometricShapes.forEach((shape, index) => {
            // Floating animation
            const userData = shape.userData;
            shape.position.y = userData.originalY + Math.sin(time * userData.floatSpeed + index) * 20;
            shape.position.x = userData.originalX + Math.cos(time * userData.floatSpeed * 0.7 + index) * 15;
            
            // Rotation animation
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            shape.rotation.z += userData.rotationSpeed.z;
            
            // Opacity pulsing - adjusted for white background
            const opacity = 0.3 + Math.sin(time * 2 + index) * 0.15;
            shape.material.opacity = Math.max(0.2, opacity);
            
            // Color shifting
            if (Math.random() < 0.001) {
                shape.material.color.setHex(this.getRandomAccentColor());
            }
        });
    }
    
    updateParticles() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach((particleSystem, systemIndex) => {
            const positions = particleSystem.geometry.attributes.position.array;
            const originalPositions = particleSystem.userData.originalPositions;
            
            for (let i = 0; i < positions.length; i += 3) {
                const index = i / 3;
                
                // Floating animation
                positions[i] = originalPositions[i] + Math.sin(time * 0.5 + index * 0.1) * 10;
                positions[i + 1] = originalPositions[i + 1] + Math.cos(time * 0.3 + index * 0.1) * 8;
                positions[i + 2] = originalPositions[i + 2] + Math.sin(time * 0.4 + index * 0.1) * 12;
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
            
            // Rotate entire particle system
            particleSystem.rotation.y = time * 0.1;
        });
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    getRandomAccentColor() {
        const colors = [0x0891b2, 0x3b82f6, 0x10b981, 0xf59e0b];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    pauseAnimations() {
        // Reduce animation intensity when tab is not visible
        this.geometricShapes.forEach(shape => {
            shape.userData.rotationSpeed.x *= 0.1;
            shape.userData.rotationSpeed.y *= 0.1;
            shape.userData.rotationSpeed.z *= 0.1;
        });
    }
    
    resumeAnimations() {
        // Restore normal animation speed
        this.geometricShapes.forEach(shape => {
            shape.userData.rotationSpeed.x *= 10;
            shape.userData.rotationSpeed.y *= 10;
            shape.userData.rotationSpeed.z *= 10;
        });
    }
    
    // Public methods for interaction
    addBurst(x, y) {
        // Create a burst of particles at specific coordinates
        const burstCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(burstCount * 3);
        const velocities = [];
        
        // Convert screen coordinates to world coordinates
        const vector = new THREE.Vector3(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1,
            0.5
        );
        vector.unproject(this.camera);
        
        for (let i = 0; i < burstCount; i++) {
            const i3 = i * 3;
            positions[i3] = vector.x;
            positions[i3 + 1] = vector.y;
            positions[i3 + 2] = vector.z;
            
            velocities.push({
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                z: (Math.random() - 0.5) * 100
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x0891b2,
            size: 5,
            transparent: true,
            opacity: 1,
            blending: THREE.NormalBlending
        });
        
        const burst = new THREE.Points(geometry, material);
        burst.userData = { velocities, life: 1 };
        
        this.scene.add(burst);
        
        // Animate and remove burst
        const animateBurst = () => {
            const positions = burst.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const index = i / 3;
                const velocity = velocities[index];
                
                positions[i] += velocity.x * 0.01;
                positions[i + 1] += velocity.y * 0.01;
                positions[i + 2] += velocity.z * 0.01;
            }
            
            burst.geometry.attributes.position.needsUpdate = true;
            burst.userData.life -= 0.02;
            burst.material.opacity = burst.userData.life;
            
            if (burst.userData.life > 0) {
                requestAnimationFrame(animateBurst);
            } else {
                this.scene.remove(burst);
                geometry.dispose();
                material.dispose();
            }
        };
        
        animateBurst();
    }
    
    dispose() {
        // Clean up Three.js resources
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.renderer.dispose();
    }
}

// Initialize visual effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for WebGL support
    if (window.WebGLRenderingContext) {
        try {
            window.visualEffects = new VisualEffects();
        } catch (error) {
            console.warn('WebGL effects disabled:', error);
        }
    } else {
        console.warn('WebGL not supported, visual effects disabled');
    }
});

// Add click burst effect
document.addEventListener('click', (e) => {
    if (window.visualEffects && typeof window.visualEffects.addBurst === 'function') {
        window.visualEffects.addBurst(e.clientX, e.clientY);
    }
});