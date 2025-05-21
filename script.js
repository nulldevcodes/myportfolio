document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- === Smooth Scroll & Active Nav === ---
    const navLinks = document.querySelectorAll('nav .nav-link, .footer-nav a');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Basic active class handling (more robust with Intersection Observer)
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                    // Close mobile menu if open (you'd need a mobile menu system first)
                }
            }
        });
    });

    // Update active nav on scroll (more robust)
    const sections = document.querySelectorAll('main section[id]');
    const scrollActiveNav = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (window.innerHeight / 3) ) { // Adjust offset
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', scrollActiveNav);


    // --- === Copyright Year === ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();


    // --- === Intersection Observer for Animations === ---
    const animatedElements = document.querySelectorAll('.dynamic-reveal');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Animate skill bars if this is the skills section
                if (entry.target.id === 'skills-section' || entry.target.classList.contains('skills-bars-placeholder')) {
                    entry.target.querySelectorAll('.skill-level-fill').forEach(fill => {
                        fill.style.width = fill.parentElement.parentElement.style.getPropertyValue('--skill-level') || '0%';
                    });
                }
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animatedElements.forEach(el => observer.observe(el));


    // --- === Interactive Card 3D Tilt Effect === ---
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        const wrapper3D = card.querySelector('.card-3d-wrapper');
        const glow = card.querySelector('.card-glow');

        if (wrapper3D) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7; // Max rotation 7deg
                const rotateY = ((x - centerX) / centerX) * 7;  // Max rotation 7deg

                wrapper3D.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;

                if (glow) {
                    glow.style.setProperty('--mouse-x', `${x}px`);
                    glow.style.setProperty('--mouse-y', `${y}px`);
                }
            });

            card.addEventListener('mouseleave', () => {
                wrapper3D.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        }
    });

    // --- === Button Particle Effect === ---
    document.querySelectorAll('.futuristic-btn').forEach(button => {
        const particleContainer = button.querySelector('.btn-particles');
        if (particleContainer) {
            button.addEventListener('mouseenter', () => {
                // Create and animate particles
                for (let i = 0; i < 8; i++) { // Match number of <i> tags
                    const p = particleContainer.children[i];
                    if (p) {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * 30 + 20; // Travel distance
                        p.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                        p.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                        // CSS handles the animation via :hover on parent
                    }
                }
            });
        }
    });

    // --- === Magnetic Elements (Conceptual - Needs a library or more complex math) === ---
    // This is a simplified placeholder. Real magnetic effects are complex.
    document.querySelectorAll('.magnetic-link, .social-magnetic, .btn-magnetic, .magnetic-link-sm').forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Simple movement, real magnetic is non-linear
            this.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.05)`;
            if (this.classList.contains('social-magnetic') || this.classList.contains('btn-magnetic')) {
                 this.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) scale(1.1) translateZ(10px)`;
            }
        });
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0,0) scale(1) translateZ(0)';
        });
    });


    // --- === Parallax Background (Simple JS version if CSS alone isn't enough) === ---
    const parallaxLayers = document.querySelectorAll('.parallax-bg .bg-layer');
    if (parallaxLayers.length > 0 && !isTouchDevice()){ // Don't run on touch for performance
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.style.getPropertyValue('--parallax-speed')) || 2; // Get speed from CSS custom prop or default
                const yPos = -(scrollTop / speed);
                layer.style.transform = `translateY(${yPos}px) scale(${layer.style.transform.includes('scale') ? layer.style.transform.split('scale(')[1].split(')')[0] : '1'})`; // Maintain existing scale
            });
        });
    }

    // --- === Scroll to Top Button === ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        // Click event handled by href="#preloader" or similar top anchor
    }

    // --- === Matrix Background Canvas (for .matrix-bg-v2) === ---
    const matrixCanvases = document.querySelectorAll('.matrix-bg-v2');
    matrixCanvases.forEach(container => {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()*&^%+-/~{[|`?..<!';
        const fontSize = 12;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function drawMatrix() {
            ctx.fillStyle = 'rgba(25, 26, 33, 0.1)'; // Fading effect, matches --background-main
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(var(--accent-color-rgb), 0.7)'; // Green characters
            ctx.font = `${fontSize}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-code').trim() || 'monospace'}`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        let matrixInterval = setInterval(drawMatrix, 50); // Adjust speed

        // Resize handling (basic)
        window.addEventListener('resize', () => {
            clearInterval(matrixInterval);
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            // Recalculate columns and drops if necessary
            const newColumns = canvas.width / fontSize;
            drops.length = 0; // Clear old drops
            for(let i=0; i < Math.floor(newColumns); i++) drops.push(1); // Reinitialize
            matrixInterval = setInterval(drawMatrix, 50);
        });
    });


    // --- Helper: Check for touch device ---
    function isTouchDevice() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    }

    // Initial scroll to handle active nav if page loads on a hash
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => { // Allow layout to settle
                 targetElement.scrollIntoView({ behavior: 'auto', block: 'start' }); // 'auto' for initial load
                 scrollActiveNav(); // Update nav
            }, 100); // Small delay
        }
    } else {
        scrollActiveNav(); // Check active nav for top of page
    }

}); // End DOMContentLoaded
