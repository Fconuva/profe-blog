document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para el Menú Móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.classList.toggle('hidden');
        });
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Reveal on scroll (prefers-reduced-motion aware) ---
    const supportsReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!supportsReduced) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach((el) => {
            observer.observe(el);
        });
    } else {
        // If user prefers reduced motion, reveal immediately
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    // API Key Demo
    const apiKeyButton = document.getElementById('showApiKey');
    if (apiKeyButton) {
        apiKeyButton.addEventListener('click', () => {
            const apiKey = apiKeyButton.dataset.apiKey;
            const resultElement = document.getElementById('apiKeyResult');
            if (apiKey && apiKey !== 'undefined' && apiKey !== '') {
                resultElement.innerHTML = `<div class="alert alert-success"><strong>GROK_API_KEY:</strong> ${apiKey}</div>`;
            } else {
                resultElement.innerHTML = `<div class="alert alert-danger"><strong>GROK_API_KEY no encontrada.</strong> Asegúrate de que la variable de entorno GROK_API_KEY esté configurada en tu archivo <code>.env</code> y que Eleventy se haya reiniciado.</div>`;
            }
        });
    }
});
