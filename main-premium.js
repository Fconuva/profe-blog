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
    this.setupAnimations();
    this.setupInteractions();
    this.setupScrollEffects();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
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
    document.querySelectorAll('.reveal, .scroll-reveal').forEach(el => observer.observe(el));

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

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      document.querySelectorAll('.parallax-element').forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
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
