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
  if (!reduced.matches && !(navigator.connection && navigator.connection.saveData)) {
    var interactions = document.createElement('script');
    interactions.src = '/js/home-interactions.bundle.js?v=20261022b';
    interactions.defer = true;
    document.head.appendChild(interactions);
  }
  // La figura de partículas del proceso se pide al acercarse; en equipos modestos quedan las ilustraciones.
  var process = document.getElementById('proceso');
  var modest = (navigator.deviceMemory && navigator.deviceMemory < 3) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  if (process && 'IntersectionObserver' in window && !reduced.matches && !modest && !(navigator.connection && navigator.connection.saveData)) {
    var near = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      near.disconnect();
      var particles = document.createElement('script');
      particles.src = '/js/home-process3d.js?v=20261022b';
      document.head.appendChild(particles);
    }, { rootMargin: '600px 0px' });
    near.observe(process);
  }
  function idle(fn) { if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1800 }); else setTimeout(fn, 500); }
  // El loop de luz llega después del póster; sin él (movimiento reducido o ahorro de datos) queda la imagen fija.
  var image = document.getElementById('hero-image');
  var video = document.getElementById('hero-video');
  var vertical = window.matchMedia('(max-aspect-ratio: 1/1)');
  var heroVisible = true;
  function loadVideo() {
    var name = vertical.matches ? 'luz-movil' : 'luz-escritorio';
    if (video.dataset.name === name) return;
    video.dataset.name = name;
    video.classList.remove('is-playing');
    video.innerHTML = '<source src="/imagenes/portada-2026/' + name + '.webm" type="video/webm"><source src="/imagenes/portada-2026/' + name + '.mp4" type="video/mp4">';
    video.load();
    if (heroVisible) video.play().catch(function () {});
  }
  if (video && !reduced.matches && !(navigator.connection && navigator.connection.saveData)) {
    video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    var imageReady = image && image.decode ? image.decode().catch(function () {}) : Promise.resolve();
    imageReady.then(function () { setTimeout(function () { idle(loadVideo); }, 300); });
    if (vertical.addEventListener) vertical.addEventListener('change', function () { if (video.dataset.name) loadVideo(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      if (!video.dataset.name) return;
      if (heroVisible && !document.hidden) video.play().catch(function () {}); else video.pause();
    }).observe(video);
    document.addEventListener('visibilitychange', function () {
      if (!video.dataset.name) return;
      if (document.hidden) video.pause(); else if (heroVisible) video.play().catch(function () {});
    });
  }
  idle(function () {
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
