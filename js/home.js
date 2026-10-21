(function () {
  'use strict';
  var menuButton = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('main-nav');
  function closeMenu() { menu.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-enabled');
    var reveals = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); entry.target.classList.add('is-revealed'); reveals.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (element) { element.classList.add('is-pending'); reveals.observe(element); });
    reduced.addEventListener('change', function (event) { if (event.matches) { document.documentElement.classList.remove('motion-enabled'); reveals.disconnect(); } });
  }
  function idle(fn) { if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1800 }); else setTimeout(fn, 500); }
  idle(function () {
    // La imagen y todos los textos funcionan sin descargar el motor 3D.
    var connection = navigator.connection;
    if (!reduced.matches && window.innerWidth >= 900 && !(connection && connection.saveData)) {
      var motion = document.createElement('script');
      motion.src = '/js/home-motion.bundle.js?v=20261021';
      motion.defer = true;
      document.head.appendChild(motion);
    }
    // Mantener el estado de sesión existente sin retrasar el primer render.
    function script(src) { return new Promise(function (resolve, reject) { var el = document.createElement('script'); el.src = src; el.onload = resolve; el.onerror = reject; document.head.appendChild(el); }); }
    script('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
      .then(function () { return script('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js'); })
      .then(function () { return script('/js/firebase-config.js'); })
      .then(function () {
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        firebase.auth().onAuthStateChanged(function (user) {
          ['nav-login', 'nav-register', 'hero-cta-register'].forEach(function (id) { document.getElementById(id).hidden = !!user; });
          ['nav-dashboard', 'nav-logout', 'hero-cta-dashboard'].forEach(function (id) { document.getElementById(id).hidden = !user; });
        });
        document.getElementById('nav-logout').addEventListener('click', function () { firebase.auth().signOut().then(function () { window.location.reload(); }); });
      }).catch(function () { /* Los enlaces de acceso siguen disponibles si falla la red. */ });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw-home.js', { scope: '/' }).catch(function () {});
  });
  var installPrompt;
  var install = document.getElementById('install-app');
  window.addEventListener('beforeinstallprompt', function (event) { event.preventDefault(); installPrompt = event; install.hidden = false; });
  install.addEventListener('click', function () { if (installPrompt) { installPrompt.prompt(); installPrompt = null; install.hidden = true; } });
})();
