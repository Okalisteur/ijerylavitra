/* i-Jery Lavitra — main.js (Mobile-first complete) */

// ─── PAGE LOAD FADE IN ───────────────────────
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.6s ease';
  document.body.style.opacity = '1';
});

// ─── MARQUEE / BANNER BUILDERS ───────────────
const topItems = [
  'Jeunesse Malgache','Vision & Avenir','Solidarité & Engagement',
  'Éducation Citoyenne','Protection de l\'Environnement','Acteurs du Changement',
  '500+ Jeunes Formés','Développement Durable','Altruisme & Communauté',
];
const b1Items = ['Éducation Citoyenne','Solidarité','Environnement','Engagement','Altruisme','Jeunesse','Madagascar','Avenir','Vision','Responsabilité'];
const b2Items = ['Formation','Innovation','Communauté','Développement Durable','Citoyenneté','Culture','Partage','Action'];
const b3Items = ['500+ Jeunes Formés','25+ Projets Réalisés','10+ Communautés','100% Engagement','Fondé 2024','Antsirabe · Madagascar'];

function buildMarquee(el, items) {
  if (!el) return;
  el.innerHTML = [...items,...items].map(i => `<span class="marquee-item"><span class="m-dot"></span>${i}</span>`).join('');
}
function buildBanner(el, items) {
  if (!el) return;
  el.innerHTML = [...items,...items].map(i => `<span class="banner-item"><span class="banner-sep"></span>${i}<span class="banner-star">★</span></span>`).join('');
}

buildMarquee(document.getElementById('topMarquee'), topItems);
buildBanner(document.getElementById('banner1'), b1Items);
buildBanner(document.getElementById('banner2'), b2Items);
buildBanner(document.getElementById('banner3'), b3Items);
buildBanner(document.getElementById('banner4'), [...b1Items].reverse());

// ─── MOBILE NAVIGATION ───────────────────────
const mobileMenu = document.getElementById('mobileMenu');
const navLinks   = document.getElementById('navLinks');

mobileMenu?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior:'smooth' });
      navLinks.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-expanded','false');
    }
  });
});

document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
    navLinks.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-expanded','false');
  }
});

// ─── SCROLL REVEAL ───────────────────────────
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold:0.08 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ─── STATS COUNTER ───────────────────────────
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = target === 100 ? '%' : '+';
      let current = 0;
      const increment = target / 80;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 22);
    });
    statsObs.unobserve(entry.target);
  });
}, { threshold:0.5 });
const impactSection = document.querySelector('.impact-section');
if (impactSection) statsObs.observe(impactSection);

// ─── FLOATING BG NUMBERS ─────────────────────
const fnContainer = document.getElementById('floatingNums');
if (fnContainer) {
  ['500','25+','10','100%','2024'].forEach((val, idx) => {
    for (let i = 0; i < 2; i++) {
      const fn = document.createElement('div');
      fn.className = 'fnum';
      fn.textContent = val;
      fn.style.left   = (Math.random() * 90) + '%';
      fn.style.fontSize = (Math.random() * 50 + 30) + 'px';
      fn.style.animationDuration  = (Math.random() * 20 + 15) + 's';
      fn.style.animationDelay     = (Math.random() * 15) + 's';
      fnContainer.appendChild(fn);
    }
  });
}

// ─── KEYBOARD / KEYCAP ───────────────────────
const keycaps   = document.querySelectorAll('.keycap');
const detailEmpty = document.getElementById('detailEmpty');

function setActiveKey(keyId) {
  keycaps.forEach(k => { k.classList.remove('active'); k.setAttribute('aria-pressed','false'); });
  document.querySelectorAll('.detail-screen').forEach(d => d.classList.remove('active'));
  if (!keyId) { if (detailEmpty) detailEmpty.style.display='flex'; return; }
  const key    = document.querySelector(`.keycap[data-key="${keyId}"]`);
  const screen = document.getElementById('detail-' + keyId);
  if (key)    { key.classList.add('active'); key.setAttribute('aria-pressed','true'); key.focus({ preventScroll:true }); }
  if (detailEmpty) detailEmpty.style.display='none';
  if (screen)  screen.classList.add('active');
}

keycaps.forEach(keycap => {
  keycap.addEventListener('pointerdown', () => keycap.classList.add('down'));
  ['pointerup','pointercancel','pointerleave'].forEach(ev => keycap.addEventListener(ev, () => keycap.classList.remove('down')));
  keycap.addEventListener('click', () => {
    const wasActive = keycap.classList.contains('active');
    setActiveKey(wasActive ? null : keycap.dataset.key);
  });
  keycap.addEventListener('keydown', e => {
    if (e.key==='Enter'||e.key===' ') { e.preventDefault(); keycap.click(); }
  });
});

// ─── ACTIONS SCROLL DOTS ─────────────────────
const actionsWrap = document.getElementById('actionsScrollWrap');
const actionsDots = document.querySelectorAll('.adot');

if (actionsWrap && actionsDots.length) {
  actionsWrap.addEventListener('scroll', () => {
    const cards  = actionsWrap.querySelectorAll('.acard');
    const wrapLeft = actionsWrap.getBoundingClientRect().left;
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - wrapLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    actionsDots.forEach((d, i) => d.classList.toggle('active', i === closest));
  }, { passive:true });
}

// ─── MEMBERS CAROUSEL ────────────────────────
let currentSlide = 0;
const cards = document.querySelectorAll('.mcard');
const dots  = document.querySelectorAll('.dot');
const total = cards.length;
let autoPlay = null;
const AUTOPLAY_MS = 5200;

function updateCarousel() {
  cards.forEach((card, i) => {
    card.classList.remove('active','prev','next');
    if      (i === currentSlide)                      card.classList.add('active');
    else if (i === (currentSlide-1+total) % total)    card.classList.add('prev');
    else if (i === (currentSlide+1) % total)           card.classList.add('next');
  });
  dots.forEach((d, i) => d.classList.toggle('active', i===currentSlide));
}
function nextSlide() { currentSlide=(currentSlide+1)%total; updateCarousel(); }
function prevSlide() { currentSlide=(currentSlide-1+total)%total; updateCarousel(); }
function stopAutoplay()    { if(autoPlay) clearInterval(autoPlay); autoPlay=null; }
function startAutoplay()   { stopAutoplay(); if(total<=1) return; autoPlay=setInterval(nextSlide,AUTOPLAY_MS); }
function restartAutoplay() { startAutoplay(); }

document.getElementById('nextBtn')?.addEventListener('click', () => { nextSlide(); restartAutoplay(); });
document.getElementById('prevBtn')?.addEventListener('click', () => { prevSlide(); restartAutoplay(); });
dots.forEach((d,i) => d.addEventListener('click', () => { currentSlide=i; updateCarousel(); restartAutoplay(); }));

updateCarousel();
startAutoplay();

const carouselWrap = document.querySelector('.carousel-wrap');
carouselWrap?.addEventListener('mouseenter', stopAutoplay);
carouselWrap?.addEventListener('mouseleave', startAutoplay);

// Touch swipe for carousel
let cTouchX = 0;
carouselWrap?.addEventListener('touchstart', e => { cTouchX=e.changedTouches[0].screenX; }, { passive:true });
carouselWrap?.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].screenX - cTouchX;
  if (dx < -50) nextSlide();
  if (dx > 50)  prevSlide();
  restartAutoplay();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoplay(); else startAutoplay();
});

// ─── 3D TILT on action + stat cards ──────────
document.querySelectorAll('.acard, .stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX-rect.left)/rect.width - 0.5;
    const y = (e.clientY-rect.top)/rect.height  - 0.5;
    card.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-rect.top)/rect.height*100)+'%');
    card.style.transform = `translateY(-8px) rotateX(${-y*7}deg) rotateY(${x*7}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform=''; });
});

// ─── HERO CARD 3D TILT ────────────────────────
const primeCard   = document.getElementById('primeCard');
const heroSection = document.querySelector('.hero');
let heroTiltRaf;

if (primeCard && heroSection) {
  heroSection.addEventListener('mousemove', e => {
    cancelAnimationFrame(heroTiltRaf);
    heroTiltRaf = requestAnimationFrame(() => {
      const rect = primeCard.getBoundingClientRect();
      if (rect.width === 0) return;
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX-cx) / (window.innerWidth  * 0.4)));
      const dy = Math.max(-1, Math.min(1, (e.clientY-cy) / (window.innerHeight * 0.4)));
      primeCard.style.animationPlayState = 'paused';
      primeCard.style.transform = `translateY(${-8 - dy*6}px) rotateX(${dy*-5}deg) rotateY(${dx*6}deg)`;
    });
  });
  heroSection.addEventListener('mouseleave', () => {
    cancelAnimationFrame(heroTiltRaf);
    primeCard.style.animationPlayState = '';
    primeCard.style.transform = '';
  });
}

// ─── HERO FLOOR PARALLAX ─────────────────────
const heroFloor = document.querySelector('.hero-floor');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (heroFloor) {
        heroFloor.style.transform = `perspective(600px) rotateX(60deg) translateY(${window.scrollY*0.2}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive:true });

// ─── HERO VISUAL (desktop only) ──────────────
// Styles for the prime card visual are in style.css
// Card-glow, orbit tags, pillar bars, card-caption
// These rules still apply from previous CSS block