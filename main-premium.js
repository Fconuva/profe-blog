/**
 * ===========================================
 * SISTEMA PREMIUM DE FUNCIONALIDADES
 * ===========================================
 *
 * Características:
 * ✅ Animaciones avanzadas
 * ✅ Sistema de temas
 * ✅ Interacciones premium
 * ✅ Optimización de rendimiento
 * ✅ Accesibilidad completa
 */

class PremiumSite {
  constructor() {
    this.init();
  }

  init() {
    console.log('[PREMIUM] Initializing PremiumSite...');
    this.setupAnimations();
    this.setupInteractions();
    this.setupScrollEffects();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
    this.setupStarRatings();
    console.log('[PREMIUM] Initialization complete');
  }

  // ===========================================
  // ANIMACIONES AVANZADAS
  // ===========================================

  setupAnimations() {
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.setupLoadingAnimations();
    this.setupTypingAnimation();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Hacer visible el elemento inmediatamente (para .reveal y .scroll-reveal)
          entry.target.classList.add('visible');
          entry.target.classList.add('revealed');
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    // Observar elementos con clase 'reveal' y 'scroll-reveal'
    document.querySelectorAll('.reveal:not(.accordion-collapse), .scroll-reveal:not(.accordion-collapse)').forEach(el => observer.observe(el));

    // Observar cards para animación especial
    document.querySelectorAll('.card-premium').forEach(el => observer.observe(el));

    // Fallback: hacer visibles todos los elementos scroll-reveal después de 2 segundos
    // para evitar problemas con el IntersectionObserver
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => {
        el.classList.add('visible');
        el.classList.add('revealed');
      });
    }, 2000);
  }

  setupHoverAnimations() {
    // Efectos de hover avanzados
    document.querySelectorAll('.card-premium').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createRippleEffect(e, card);
      });
    });

    // Efectos de texto
    document.querySelectorAll('.text-hover-effect').forEach(text => {
      text.addEventListener('mouseenter', () => {
        text.classList.add('animate-pulse-glow');
      });

      text.addEventListener('mouseleave', () => {
        text.classList.remove('animate-pulse-glow');
      });
    });
  }

  createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  setupLoadingAnimations() {
    // Simular carga inicial
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
      }, 100);
    });
  }

  setupTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-effect');

    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--accent)';

      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 500);
        }
      }, 100);
    });
  }

  // ===========================================
  // INTERACCIONES PREMIUM
  // ===========================================

  setupInteractions() {
    this.setupMagneticButtons();
    this.setupParallaxEffects();
    this.setupGestureSupport();
    this.setup3DTilt();
    this.setupCounterAnimation();
  }

  setup3DTilt() {
    const tiltCards = document.querySelectorAll('.card-3d-tilt');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        
        // Actualizar sombra dinámica
        const shadowX = (x - centerX) / 5;
        const shadowY = (y - centerY) / 5;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  setupCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const animateCounter = (element) => {
      const target = parseInt(element.getAttribute('data-counter'));
      const duration = 2000; // 2 segundos
      const increment = target / (duration / 16); // 60 FPS
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current) + (element.getAttribute('data-suffix') || '');
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + (element.getAttribute('data-suffix') || '');
        }
      };
      
      updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  }

  setupMagneticButtons() {
    document.querySelectorAll('.btn-premium, .card-premium').forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  setupParallaxEffects() {
    let ticking = false;
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    console.log('[PARALLAX] Found elements:', parallaxElements.length);

    const updateParallax = () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementVisible = scrolled + window.innerHeight > elementTop && scrolled < elementTop + rect.height;

        if (elementVisible) {
          let rate = 0;
          if (element.classList.contains('parallax-slow')) {
            rate = (scrolled - elementTop) * 0.15;
          } else if (element.classList.contains('parallax-medium')) {
            rate = (scrolled - elementTop) * 0.25;
          } else if (element.classList.contains('parallax-fast')) {
            rate = (scrolled - elementTop) * 0.35;
          }
          
          element.style.transform = `translateY(${rate}px)`;
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    // Crear partículas flotantes
    this.createFloatingParticles();
  }

  createFloatingParticles() {
    const heroSection = document.querySelector('.hero-modern');
    console.log('[PARTICLES] Hero section found:', heroSection);
    if (!heroSection) {
      console.warn('[PARTICLES] No hero-modern section found!');
      return;
    }

    const particleContainer = document.createElement('div');
    particleContainer.className = 'absolute inset-0 overflow-hidden pointer-events-none';
    particleContainer.style.zIndex = '1';

    // Crear 15 partículas con posiciones aleatorias
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particleContainer.appendChild(particle);
    }

    heroSection.insertBefore(particleContainer, heroSection.firstChild);
    console.log('[PARTICLES] Added 15 particles to hero');
  }

  setupStarRatings() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    console.log('[STARS] Found testimonials:', testimonials.length);
    
    testimonials.forEach(card => {
      const starsContainer = document.createElement('div');
      starsContainer.className = 'star-rating flex justify-center mb-4';
      
      for (let i = 0; i < 5; i++) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        star.setAttribute('class', 'star-icon');
        star.setAttribute('fill', 'currentColor');
        star.setAttribute('viewBox', '0 0 20 20');
        star.innerHTML = '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>';
        starsContainer.appendChild(star);
      }
      
      const firstParagraph = card.querySelector('blockquote');
      if (firstParagraph) {
        firstParagraph.parentNode.insertBefore(starsContainer, firstParagraph);
      }
    });

    // Animar estrellas cuando entran en viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const stars = entry.target.querySelectorAll('.star-icon');
          stars.forEach(star => star.classList.add('filled'));
          entry.target.dataset.animated = 'true';
        }
      });
    }, { threshold: 0.5 });

    testimonials.forEach(card => observer.observe(card));
  }

  setupGestureSupport() {
    // Soporte para gestos en móviles
    let startY = 0;
    let startX = 0;

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    });

    document.addEventListener('touchmove', (e) => {
      if (!startY || !startX) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = startY - currentY;
      const diffX = startX - currentX;

      // Detectar swipe
      if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 50) {
          // Swipe up
          this.handleSwipe('up');
        } else if (diffY < -50) {
          // Swipe down
          this.handleSwipe('down');
        }
      }
    });
  }

  handleSwipe(direction) {
    // Implementar navegación por swipe
    console.log(`Swipe ${direction} detected`);
  }

  // ===========================================
  // EFECTOS DE SCROLL
  // ===========================================

  setupScrollEffects() {
    this.setupScrollProgress();
    this.setupStickyElements();
    this.setupScrollTriggeredAnimations();
  }

  setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--gradient-primary);
      z-index: 1000;
      transition: width 0.1s ease;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  setupStickyElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sticky-active');
        } else {
          entry.target.classList.remove('sticky-active');
        }
      });
    });

    document.querySelectorAll('.sticky-element').forEach(el => observer.observe(el));
  }

  setupScrollTriggeredAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animation || 'fade-in-up';
          entry.target.classList.add(`animate-${animationType}`);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('[data-animation]').forEach(el => observer.observe(el));
  }

  // ===========================================
  // OPTIMIZACIONES DE RENDIMIENTO
  // ===========================================

  setupPerformanceOptimizations() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.debounceScrollEvents();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('loading-shimmer');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('loading-shimmer');
      imageObserver.observe(img);
    });
  }

  setupImageOptimization() {
    // Implementar responsive images
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  debounceScrollEvents() {
    let timeout;
    const debounce = (func, wait) => {
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Aplicar debounce a eventos de scroll intensivos
    window.addEventListener('scroll', debounce(() => {
      // Lógica de scroll optimizada
    }, 16));
  }

  // ===========================================
  // ACCESIBILIDAD
  // ===========================================

  setupAccessibility() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
  }

  setupKeyboardNavigation() {
    // Navegación por teclado mejorada
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupScreenReaderSupport() {
    // Soporte básico para lectores de pantalla
  }

  setupFocusManagement() {
    // Gestionar foco en modales y overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Cerrar modales, menús, etc.
        this.closeOpenElements();
      }
    });
  }

  closeOpenElements() {
    // Cerrar elementos abiertos (menús móviles, modales, etc.)
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      if (mobileMenuButton) {
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    }
  }
}

// ===========================================
// INICIALIZACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si el usuario prefiere movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!prefersReducedMotion.matches) {
    // Inicializar sistema premium solo si el usuario no prefiere movimiento reducido
    new PremiumSite();
  } else {
    // Versión básica sin animaciones para usuarios con preferencia de movimiento reducido
    console.log('Modo de movimiento reducido detectado. Animaciones deshabilitadas.');
  }
});

// ===========================================
// UTILIDADES GLOBALES
// ===========================================

// Función para detectar soporte de WebP
function supportsWebP() {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('webp') > -1;
}

// Función para detectar conexión lenta
function isSlowConnection() {
  return navigator.connection &&
         (navigator.connection.effectiveType === 'slow-2g' ||
          navigator.connection.effectiveType === '2g');
}

// Función para precargar recursos críticos
function preloadCriticalResources() {
  const criticalResources = [
    '/css/premium-styles.css',
    '/main-premium.js'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
}

// Precargar recursos críticos
preloadCriticalResources();
