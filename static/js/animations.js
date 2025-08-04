/**
 * PatternHive - GSAP Animations
 * Advanced animations and micro-interactions
 */

class AnimationManager {
    constructor() {
        this.isGSAPLoaded = typeof gsap !== 'undefined';
        this.scrollTrigger = this.isGSAPLoaded && typeof ScrollTrigger !== 'undefined';
        
        if (this.isGSAPLoaded) {
            if (this.scrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);
            }
            this.init();
        } else {
            console.warn('GSAP not loaded, using fallback animations');
            this.initFallbackAnimations();
        }
    }
    
    init() {
        this.setupPageLoadAnimations();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupButtonAnimations();
        this.setupCardAnimations();
        this.setupTextAnimations();
        
        console.log('GSAP animations initialized');
    }
    
    setupPageLoadAnimations() {
        if (!this.isGSAPLoaded) return;
        
        // Page load timeline
        const tl = gsap.timeline();
        
        // Header animation
        tl.from('.header', {
            duration: 1,
            y: -100,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.logo-icon', {
            duration: 0.8,
            scale: 0,
            rotation: 360,
            ease: 'back.out(1.7)'
        }, '-=0.5')
        .from('.logo-text', {
            duration: 0.6,
            opacity: 0,
            letterSpacing: '10px',
            ease: 'power2.out'
        }, '-=0.3')
        .from('.tagline', {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2');
        
        // Input section animation
        tl.from('.input-section', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            scale: 0.95,
            ease: 'power2.out'
        }, '-=0.3');
        
        // Tab buttons animation
        tl.from('.tab-btn', {
            duration: 0.5,
            x: -30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4');
        
        // Empty state animation
        tl.from('.empty-state', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2');
    }
    
    setupScrollAnimations() {\n        if (!this.scrollTrigger) return;\n        \n        // Reveal animations for sections\n        gsap.utils.toArray('.glass-card').forEach(card => {\n            gsap.from(card, {\n                scrollTrigger: {\n                    trigger: card,\n                    start: 'top 80%',\n                    end: 'bottom 20%',\n                    toggleActions: 'play none none reverse'\n                },\n                duration: 0.8,\n                y: 50,\n                opacity: 0,\n                scale: 0.95,\n                ease: 'power2.out'\n            });\n        });\n        \n        // Parallax effect for background elements\n        gsap.to('.background-canvas', {\n            scrollTrigger: {\n                trigger: 'body',\n                start: 'top top',\n                end: 'bottom top',\n                scrub: 1\n            },\n            y: -100,\n            ease: 'none'\n        });\n    }\n    \n    setupHoverAnimations() {\n        if (!this.isGSAPLoaded) return;\n        \n        // Glass cards hover effect\n        document.querySelectorAll('.glass-card').forEach(card => {\n            const tl = gsap.timeline({ paused: true });\n            \n            tl.to(card, {\n                duration: 0.3,\n                y: -8,\n                scale: 1.02,\n                boxShadow: '0 20px 40px rgba(74, 227, 236, 0.3)',\n                ease: 'power2.out'\n            });\n            \n            card.addEventListener('mouseenter', () => tl.play());\n            card.addEventListener('mouseleave', () => tl.reverse());\n        });\n        \n        // Stat cards 3D hover\n        document.querySelectorAll('.stat-card').forEach(card => {\n            card.addEventListener('mousemove', (e) => {\n                const rect = card.getBoundingClientRect();\n                const centerX = rect.left + rect.width / 2;\n                const centerY = rect.top + rect.height / 2;\n                const deltaX = (e.clientX - centerX) / (rect.width / 2);\n                const deltaY = (e.clientY - centerY) / (rect.height / 2);\n                \n                gsap.to(card, {\n                    duration: 0.3,\n                    rotationX: deltaY * 10,\n                    rotationY: deltaX * 10,\n                    transformPerspective: 1000,\n                    ease: 'power2.out'\n                });\n            });\n            \n            card.addEventListener('mouseleave', () => {\n                gsap.to(card, {\n                    duration: 0.5,\n                    rotationX: 0,\n                    rotationY: 0,\n                    ease: 'power2.out'\n                });\n            });\n        });\n    }\n    \n    setupButtonAnimations() {\n        if (!this.isGSAPLoaded) return;\n        \n        // Morphing button effects\n        document.querySelectorAll('.morphing-btn').forEach(btn => {\n            const tl = gsap.timeline({ paused: true });\n            \n            tl.to(btn, {\n                duration: 0.2,\n                scale: 1.05,\n                ease: 'power2.out'\n            })\n            .to(btn.querySelector('.btn-glow'), {\n                duration: 0.3,\n                opacity: 0.6,\n                scale: 1.2,\n                ease: 'power2.out'\n            }, 0);\n            \n            btn.addEventListener('mouseenter', () => tl.play());\n            btn.addEventListener('mouseleave', () => tl.reverse());\n            \n            // Click animation\n            btn.addEventListener('mousedown', () => {\n                gsap.to(btn, {\n                    duration: 0.1,\n                    scale: 0.95,\n                    ease: 'power2.out'\n                });\n            });\n            \n            btn.addEventListener('mouseup', () => {\n                gsap.to(btn, {\n                    duration: 0.2,\n                    scale: 1.05,\n                    ease: 'back.out(1.7)'\n                });\n            });\n        });\n    }\n    \n    setupCardAnimations() {\n        if (!this.isGSAPLoaded) return;\n        \n        // Result card entrance animations\n        this.animateResultCards = (cards) => {\n            gsap.from(cards, {\n                duration: 0.6,\n                y: 30,\n                opacity: 0,\n                scale: 0.9,\n                stagger: 0.1,\n                ease: 'back.out(1.7)'\n            });\n        };\n        \n        // Result card hover effects\n        document.addEventListener('mouseover', (e) => {\n            const card = e.target.closest('.result-card');\n            if (card) {\n                gsap.to(card, {\n                    duration: 0.3,\n                    y: -5,\n                    scale: 1.02,\n                    boxShadow: '0 15px 30px rgba(74, 227, 236, 0.2)',\n                    ease: 'power2.out'\n                });\n            }\n        });\n        \n        document.addEventListener('mouseout', (e) => {\n            const card = e.target.closest('.result-card');\n            if (card) {\n                gsap.to(card, {\n                    duration: 0.3,\n                    y: 0,\n                    scale: 1,\n                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',\n                    ease: 'power2.out'\n                });\n            }\n        });\n    }\n    \n    setupTextAnimations() {\n        if (!this.isGSAPLoaded) return;\n        \n        // Glitch text effect\n        document.querySelectorAll('.glitch').forEach(element => {\n            const text = element.getAttribute('data-text') || element.textContent;\n            \n            const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });\n            \n            glitchTimeline\n                .to(element, {\n                    duration: 0.1,\n                    skewX: 70,\n                    ease: 'power4.inOut'\n                })\n                .to(element, {\n                    duration: 0.04,\n                    skewX: 0,\n                    ease: 'power4.inOut'\n                })\n                .to(element, {\n                    duration: 0.04,\n                    opacity: 0,\n                    ease: 'power4.inOut'\n                })\n                .to(element, {\n                    duration: 0.04,\n                    opacity: 1,\n                    ease: 'power4.inOut'\n                })\n                .to(element, {\n                    duration: 0.04,\n                    x: -20,\n                    ease: 'power4.inOut'\n                })\n                .to(element, {\n                    duration: 0.04,\n                    x: 0,\n                    ease: 'power4.inOut'\n                });\n        });\n        \n        // Typing effect for notifications\n        this.typeText = (element, text, speed = 50) => {\n            element.textContent = '';\n            const chars = text.split('');\n            \n            gsap.to({}, {\n                duration: chars.length * speed / 1000,\n                ease: 'none',\n                onUpdate: function() {\n                    const progress = Math.floor(this.progress() * chars.length);\n                    element.textContent = chars.slice(0, progress).join('');\n                }\n            });\n        };\n    }\n    \n    // Counter animation\n    animateCounter(element, from, to, duration = 1) {\n        if (!this.isGSAPLoaded) {\n            element.textContent = to;\n            return;\n        }\n        \n        const obj = { value: from };\n        \n        gsap.to(obj, {\n            duration: duration,\n            value: to,\n            ease: 'power2.out',\n            onUpdate: () => {\n                element.textContent = Math.round(obj.value);\n            }\n        });\n    }\n    \n    // Progress bar animation\n    animateProgressBar(element, progress, duration = 1) {\n        if (!this.isGSAPLoaded) {\n            element.style.width = progress + '%';\n            return;\n        }\n        \n        gsap.to(element, {\n            duration: duration,\n            width: progress + '%',\n            ease: 'power2.out'\n        });\n    }\n    \n    // Confidence bar animation\n    animateConfidenceBar(element, confidence) {\n        if (!this.isGSAPLoaded) {\n            element.style.width = (confidence * 100) + '%';\n            return;\n        }\n        \n        gsap.from(element, {\n            duration: 0.8,\n            width: '0%',\n            ease: 'power2.out',\n            delay: Math.random() * 0.3\n        });\n    }\n    \n    // Notification animations\n    showNotification(element) {\n        if (!this.isGSAPLoaded) {\n            element.classList.add('show');\n            return;\n        }\n        \n        gsap.fromTo(element, \n            {\n                x: 300,\n                opacity: 0,\n                scale: 0.8\n            },\n            {\n                duration: 0.5,\n                x: 0,\n                opacity: 1,\n                scale: 1,\n                ease: 'back.out(1.7)'\n            }\n        );\n    }\n    \n    hideNotification(element) {\n        if (!this.isGSAPLoaded) {\n            element.classList.add('removing');\n            return;\n        }\n        \n        gsap.to(element, {\n            duration: 0.3,\n            x: 300,\n            opacity: 0,\n            scale: 0.8,\n            ease: 'back.in(1.7)',\n            onComplete: () => {\n                if (element.parentNode) {\n                    element.parentNode.removeChild(element);\n                }\n            }\n        });\n    }\n    \n    // Loading animations\n    showLoading(element) {\n        if (!this.isGSAPLoaded) {\n            element.classList.remove('hidden');\n            return;\n        }\n        \n        gsap.fromTo(element,\n            {\n                opacity: 0,\n                scale: 0.8\n            },\n            {\n                duration: 0.3,\n                opacity: 1,\n                scale: 1,\n                ease: 'power2.out'\n            }\n        );\n        \n        element.classList.remove('hidden');\n    }\n    \n    hideLoading(element) {\n        if (!this.isGSAPLoaded) {\n            element.classList.add('hidden');\n            return;\n        }\n        \n        gsap.to(element, {\n            duration: 0.3,\n            opacity: 0,\n            scale: 0.8,\n            ease: 'power2.in',\n            onComplete: () => {\n                element.classList.add('hidden');\n            }\n        });\n    }\n    \n    // Fallback animations for when GSAP is not available\n    initFallbackAnimations() {\n        // Add CSS-based animations for browsers without GSAP\n        const style = document.createElement('style');\n        style.textContent = `\n            .fallback-fade-in {\n                animation: fadeIn 0.5s ease-out forwards;\n            }\n            \n            .fallback-slide-up {\n                animation: slideInBottom 0.5s ease-out forwards;\n            }\n            \n            .fallback-bounce {\n                animation: bounceIn 0.6s ease-out forwards;\n            }\n        `;\n        document.head.appendChild(style);\n        \n        console.log('Fallback animations initialized');\n    }\n    \n    // Public utility methods\n    createTimeline(options = {}) {\n        if (this.isGSAPLoaded) {\n            return gsap.timeline(options);\n        }\n        return null;\n    }\n    \n    animate(target, properties, duration = 0.3) {\n        if (this.isGSAPLoaded) {\n            return gsap.to(target, { ...properties, duration });\n        } else {\n            // Fallback: apply properties directly\n            if (typeof target === 'string') {\n                target = document.querySelector(target);\n            }\n            if (target) {\n                Object.assign(target.style, properties);\n            }\n        }\n    }\n    \n    staggerFrom(targets, properties, stagger = 0.1) {\n        if (this.isGSAPLoaded) {\n            return gsap.from(targets, { ...properties, stagger });\n        } else {\n            // Fallback: animate each target with increasing delay\n            const elements = typeof targets === 'string' ? \n                document.querySelectorAll(targets) : targets;\n            \n            elements.forEach((el, index) => {\n                setTimeout(() => {\n                    el.classList.add('fallback-fade-in');\n                }, index * stagger * 1000);\n            });\n        }\n    }\n}\n\n// Initialize animations when DOM is loaded\ndocument.addEventListener('DOMContentLoaded', () => {\n    window.animationManager = new AnimationManager();\n});\n\n// Export for use in other modules\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = AnimationManager;\n}