document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para el Menú Móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Lógica para el Carrusel de Imágenes (Hero) ---
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    
    if (slides.length > 1 && prevBtn && nextBtn) {
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        // Carrusel automático cada 5 segundos
        setInterval(() => {
            nextBtn.click();
        }, 5000);

        showSlide(0); // Muestra la primera imagen al cargar
    }
});
