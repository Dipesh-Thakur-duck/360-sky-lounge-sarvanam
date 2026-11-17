// Hero slideshow
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
let current = 0, timer;

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Show slide ' + (i + 1));
  b.addEventListener('click', () => { show(i); restart(); });
  dotsBox.appendChild(b);
});
const dots = dotsBox.querySelectorAll('button');

function show(i) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = i;
  void slides[current].offsetWidth; // restart the zoom animation
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function restart() { clearInterval(timer); timer = setInterval(() => show((current + 1) % slides.length), 5500); }
dots[0].classList.add('active');
restart();

// Food and drink slideshow
const tasteSlider = document.getElementById('taste-slider');
if (tasteSlider) {
  const tasteSlides = Array.from(tasteSlider.querySelectorAll('.taste-slide'));
  const thumbnails = tasteSlider.querySelector('.taste-thumbnails');
  const pauseButton = tasteSlider.querySelector('.taste-pause');
  let tasteCurrent = 0;
  let tasteTimer;
  let manuallyPaused = false;
  let isFocused = false;
  let isInView = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  tasteSlides.forEach((slide, index) => {
    const image = slide.querySelector('img');
    const button = document.createElement('button');
    const thumbnailImage = document.createElement('img');
    const number = document.createElement('span');

    button.type = 'button';
    button.className = 'taste-thumb';
    button.setAttribute('aria-label', `Show slide ${index + 1}: ${slide.querySelector('h3').textContent}`);
    button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    thumbnailImage.src = image.getAttribute('src');
    thumbnailImage.alt = '';
    thumbnailImage.loading = 'lazy';
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(thumbnailImage, number);
    button.addEventListener('click', () => {
      showTasteSlide(index);
      restartTasteTimer();
    });
    thumbnails.appendChild(button);
  });

  const tasteThumbs = Array.from(thumbnails.querySelectorAll('.taste-thumb'));

  function showTasteSlide(index) {
    tasteSlides[tasteCurrent].classList.remove('is-active');
    tasteSlides[tasteCurrent].setAttribute('aria-hidden', 'true');
    tasteThumbs[tasteCurrent].setAttribute('aria-current', 'false');
    tasteCurrent = (index + tasteSlides.length) % tasteSlides.length;
    tasteSlides[tasteCurrent].classList.add('is-active');
    tasteSlides[tasteCurrent].setAttribute('aria-hidden', 'false');
    tasteThumbs[tasteCurrent].setAttribute('aria-current', 'true');
  }

  function syncTasteTimer() {
    clearInterval(tasteTimer);
    if (manuallyPaused || isFocused || !isInView || document.hidden || reducedMotion.matches) return;
    tasteTimer = setInterval(() => showTasteSlide(tasteCurrent + 1), 6500);
  }

  function restartTasteTimer() {
    syncTasteTimer();
  }

  tasteSlider.querySelector('.taste-prev').addEventListener('click', () => {
    showTasteSlide(tasteCurrent - 1);
    restartTasteTimer();
  });
  tasteSlider.querySelector('.taste-next').addEventListener('click', () => {
    showTasteSlide(tasteCurrent + 1);
    restartTasteTimer();
  });
  pauseButton.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    pauseButton.setAttribute('aria-pressed', String(manuallyPaused));
    pauseButton.setAttribute('aria-label', manuallyPaused ? 'Resume slideshow' : 'Pause slideshow');
    pauseButton.innerHTML = `<i class="fa-solid ${manuallyPaused ? 'fa-play' : 'fa-pause'}" aria-hidden="true"></i>`;
    syncTasteTimer();
  });

  tasteSlider.addEventListener('focusin', (event) => {
    isFocused = event.target.matches(':focus-visible');
    syncTasteTimer();
  });
  tasteSlider.addEventListener('focusout', (event) => {
    if (!tasteSlider.contains(event.relatedTarget)) {
      isFocused = false;
      syncTasteTimer();
    }
  });
  document.addEventListener('visibilitychange', syncTasteTimer);
  reducedMotion.addEventListener('change', syncTasteTimer);
  new IntersectionObserver(([entry]) => {
    isInView = entry.isIntersecting;
    syncTasteTimer();
  }, { threshold: 0.2 }).observe(tasteSlider);
}

// Navbar background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll); onScroll();

// Close mobile menu after tapping a link
document.querySelectorAll('#menu .nav-link').forEach(l => l.addEventListener('click', () => {
  const m = document.getElementById('menu');
  if (m.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(m).hide();
}));

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 120) + 'ms';
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
