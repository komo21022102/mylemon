// ─── Custom cursor ───────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.background = 'var(--warm)';
      cursorRing.style.width = '60px'; cursorRing.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--ink)';
      cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
    });
  });
}

// ─── Nav scroll progress bar ─────────────────────────────────────────────────
const navProgress = document.getElementById('navProgress');
if (navProgress) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    navProgress.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

// ─── Scroll reveal ───────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal, .timeline-item, .edu-item, .stack-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// ─── Smooth nav scroll ───────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── Mobile menu ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
}

document.querySelectorAll('.nav-links > li:not(.has-dropdown) a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('.dropdown a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

const worksDropdown = document.querySelector('.has-dropdown');
if (worksDropdown) {
  const worksLink = worksDropdown.querySelector(':scope > a');
  if (worksLink) {
    worksLink.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        worksDropdown.classList.toggle('active');
      }
    });
  }
}

// ─── Back to Top button ──────────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Force scroll to top on load ─────────────────────────────────────────────
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

function scrollToTopForce() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

scrollToTopForce();

window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) { target.scrollIntoView(); return; }
  }
  setTimeout(scrollToTopForce, 0);
  setTimeout(scrollToTopForce, 100);
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) scrollToTopForce();
});

// ─── Lightbox (work detail pages) ────────────────────────────────────────────
function initLightbox() {
  const stackImages = document.querySelectorAll('.stack-item img');
  if (!stackImages.length) return;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <div class="lb-overlay"></div>
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-prev" aria-label="Previous image">←</button>
    <button class="lb-next" aria-label="Next image">→</button>
    <div class="lb-content">
      <img class="lb-img" src="" alt="">
      <p class="lb-caption"></p>
      <span class="lb-counter"></span>
    </div>
  `;
  document.body.appendChild(lb);

  const images = Array.from(stackImages);
  let current = 0;

  function show(index) {
    const img = lb.querySelector('.lb-img');
    const cap = lb.querySelector('.lb-caption');
    const counter = lb.querySelector('.lb-counter');
    img.style.opacity = '0';
    img.style.transform = 'scale(0.97)';
    setTimeout(() => {
      img.src = images[index].src;
      img.alt = images[index].alt || '';
      img.onload = () => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      };
    }, 80);
    const captionEl = images[index].closest('.stack-item').querySelector('.stack-caption');
    cap.textContent = captionEl ? captionEl.textContent : '';
    counter.textContent = (index + 1) + ' / ' + images.length;
    lb.querySelector('.lb-prev').style.opacity = index === 0 ? '0.25' : '1';
    lb.querySelector('.lb-prev').disabled = index === 0;
    lb.querySelector('.lb-next').style.opacity = index === images.length - 1 ? '0.25' : '1';
    lb.querySelector('.lb-next').disabled = index === images.length - 1;
  }

  function open(index) {
    current = index;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    show(current);
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  stackImages.forEach((img, i) => {
    img.closest('.stack-item').style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(i));
  });

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-overlay').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => {
    if (current > 0) show(--current);
  });
  lb.querySelector('.lb-next').addEventListener('click', () => {
    if (current < images.length - 1) show(++current);
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft' && current > 0) show(--current);
    if (e.key === 'ArrowRight' && current < images.length - 1) show(++current);
  });
}

initLightbox();
