(function () {
  const slides = [...document.querySelectorAll('.slide')];
  const previous = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const progress = document.querySelector('.progress i');
  let current = Math.max(0, Math.min(slides.length - 1, Number(new URLSearchParams(location.search).get('slide') || 1) - 1));
  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, position) => slide.classList.toggle('active', position === current));
    counter.textContent = `${current + 1} / ${slides.length}`;
    progress.style.width = `${(current + 1) / slides.length * 100}%`;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    history.replaceState(null, '', `${location.pathname}?slide=${current + 1}`);
    slides[current].querySelector('.slide-inner')?.scrollTo(0, 0);
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  document.getElementById('fullscreen').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  document.addEventListener('keydown', event => {
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    if (event.key === 'Home') show(0);
    if (event.key === 'End') show(slides.length - 1);
  });
  let touchStart = 0;
  document.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', event => { const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 70) show(current + (delta < 0 ? 1 : -1)); }, { passive: true });
  show(current);
})();
