(() => {
  'use strict';

  const video = document.getElementById('heroVideo');
  const toggle = document.getElementById('heroMotionToggle');
  const hero = video && video.closest('.hero');
  if (!video || !toggle || !hero) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = false;
  let visible = true;
  let failed = false;

  function updateToggle() {
    toggle.textContent = video.paused ? 'Reproducir fondo' : 'Pausar fondo';
  }

  function syncPlayback() {
    if (failed || reduced.matches || document.hidden || !visible || pausedByUser) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) {
      video.muted = true;
      video.src = video.dataset.src;
    }
    video.play().catch(() => {
      // La imagen sigue visible si el navegador bloquea la reproducción automática.
      toggle.hidden = failed || reduced.matches;
      updateToggle();
    });
  }

  video.addEventListener('playing', () => {
    hero.classList.add('video-listo');
    toggle.hidden = reduced.matches;
    updateToggle();
  });
  video.addEventListener('pause', updateToggle);
  video.addEventListener('error', () => {
    failed = true;
    hero.classList.remove('video-listo');
    toggle.hidden = true;
  });
  toggle.addEventListener('click', () => {
    pausedByUser = !video.paused;
    syncPlayback();
  });
  reduced.addEventListener('change', () => {
    toggle.hidden = reduced.matches || failed;
    if (reduced.matches) hero.classList.remove('video-listo');
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }).observe(hero);
  }
  syncPlayback();
})();
