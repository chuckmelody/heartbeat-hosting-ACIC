export default class GSAPManager {
    constructor() {
        if (GSAPManager.instance) {
            return GSAPManager.instance;
        }
        GSAPManager.instance = this;
    }

    /**
     * Fades in the main page container and its primary child elements.
     * @param {HTMLElement} container - The main view container (e.g., #router-view).
     */
    fadeInPage(container) {
        if (!container || !gsap) return;

        // Animate the container itself to fade in
        gsap.to(container, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // Animate the primary children of the view for a staggered effect
        const elementsToAnimate = container.querySelectorAll('.page-title, .content-card, .donate-container, .news-grid, .event-controls, .event-grid, .partner-grid, .tools-hero-card, .tools-grid, #header-auth-container');
        if (elementsToAnimate.length) {
            gsap.from(elementsToAnimate, {
                opacity: 0,
                y: 30, // Start 30px down
                duration: 0.6,
                stagger: 0.1, // Animate each element 0.1s after the previous one
                ease: 'power2.out'
            });
        }
    }

    /**
     * Fades out the main page container before new content is loaded.
     * @param {HTMLElement} container - The main view container (e.g., #router-view).
     * @returns {Promise} A promise that resolves when the animation is complete.
     */
    fadeOutPage(container) {
        if (!container || !gsap) return Promise.resolve();

        return new Promise(resolve => {
            gsap.to(container, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: resolve // Resolve the promise when the animation finishes
            });
        });
    }

    /**
     * Smoothly scrolls the window to a specific vertical position.
     * @param {number} yPos - The vertical position to scroll to.
     */
    scrollTo(yPos) {
        if (typeof gsap === 'undefined' || typeof gsap.to !== 'function' || !gsap.plugins.scrollTo) {
            console.warn('GSAP or ScrollToPlugin not loaded. Falling back to instant scroll.');
            window.scrollTo(0, yPos);
            return;
        }

        // Use GSAP to animate the scroll position of the window
        gsap.to(window, { duration: 1, scrollTo: yPos, ease: 'power2.inOut' });
    }

    animateToastIn(element) {
        if (!element || typeof gsap === 'undefined') return;
        gsap.fromTo(element,
            { autoAlpha: 0, x: 40 },
            { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
    }

    animateToastOut(element, onComplete) {
        if (!element || typeof gsap === 'undefined') {
            if (typeof onComplete === 'function') onComplete();
            return;
        }
        gsap.to(element, {
            autoAlpha: 0,
            x: 60,
            duration: 0.25,
            ease: 'power2.in',
            onComplete,
        });
    }
}
