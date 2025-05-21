document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    const progressBar = preloader.querySelector('.progress-bar');

    // Simulate loading time, or replace with actual asset loading checks
    let loadProgress = 0;
    const progressInterval = setInterval(() => {
        loadProgress += 10; // Or some other increment
        if (progressBar) progressBar.style.width = loadProgress + '%';
        if (loadProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                if (preloader) preloader.classList.add('loaded');
            }, 500); // Delay for progress bar to complete visually
        }
    }, 150); // Adjust timing

    window.addEventListener('load', () => { // Fallback if DOMContentLoaded is too early
        clearInterval(progressInterval);
        if (progressBar) progressBar.style.width = '100%';
         setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
        }, 500);
    });


    // --- Smooth scroll for internal links ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetId && targetId.length > 1 && targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align to top, can be 'center'
                });

                // Optional: Update active nav link (basic example)
                document.querySelectorAll('nav .nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- Update copyright year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Intersection Observer for fade-in animations on scroll ---
    const animatedElements = document.querySelectorAll('.card, header h1, nav ul li, footer, .section-title, .card p, .button-group, .social-links li');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Use utility class for animation
                // If using .animate-fade-in-up:
                // entry.target.style.opacity = '1';
                // entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        // Add the initial state class if using utility classes
        el.classList.add('animate-fade-in-up'); // Example: all elements get this
        observer.observe(el);
    });


    // --- Interactive Card Glow Effect ---
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        if (glow) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glow.style.setProperty('--mouse-x', `${x}px`);
                glow.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    });

    // --- Text Reveal Animation (Staggered) ---
    // You'd apply .text-reveal class to an element like <h2> or <p>
    // and its children <span>s will be animated.
    document.querySelectorAll('.text-reveal').forEach(textElement => {
        const text = textElement.textContent.trim();
        textElement.innerHTML = ''; // Clear existing content
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
            span.style.animationDelay = `${index * 0.05}s`; // Stagger delay
            textElement.appendChild(span);
        });
    });

    // --- Parallax Background Scroll Effect (Simple CSS version) ---
    // For more advanced parallax, you'd use scroll event listeners and update transform more dynamically.
    // This example assumes the CSS animations for .bg-layer are sufficient for a subtle effect.
    // If you want JS-driven parallax:
    /*
    const parallaxLayers = document.querySelectorAll('.parallax-bg .bg-layer');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.1; // Adjust speed factor per layer
            // Example: Layer 1 (farthest) moves slower
            // Layer 1: speed = 0.1, Layer 2: speed = 0.2, Layer 3: speed = 0.3
            const yPos = -(scrollTop * speed);
            // layer.style.transform = `translateY(${yPos}px) scale(1.1)`; // Ensure scale covers movement
        });
    });
    */
    // Note: JS parallax can be jittery if not optimized (e.g., using requestAnimationFrame)
    // The current CSS version uses animations for movement, which is smoother but not scroll-tied.
});
