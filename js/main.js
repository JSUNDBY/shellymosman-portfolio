/* ============================================
   SHELLY MOSMAN — SITE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- NAV SCROLL ---
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Hero zoom on load
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  }

  // --- MOBILE MENU ---
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- SCROLL REVEAL ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // --- LAZY LOAD IMAGES ---
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      imgObserver.observe(img);
    });
  }

  // --- LIGHTBOX ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__nav--prev');
  const lightboxNext = document.querySelector('.lightbox__nav--next');

  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    lightboxImg.src = currentImages[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
  }

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  // Gallery items -> lightbox
  document.querySelectorAll('.gallery').forEach(gallery => {
    const items = gallery.querySelectorAll('.gallery__item');
    const images = Array.from(items).map(item => {
      const img = item.querySelector('img');
      return img.dataset.full || img.dataset.src || img.src;
    });

    items.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(images, index));
    });
  });

  // --- SERIES FILTER ---
  const filterBtns = document.querySelectorAll('.series-nav__btn');
  const galleryItems = document.querySelectorAll('.gallery--filtered .gallery__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.series === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- CONTACT FORM ---
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Portfolio Inquiry: ${data.get('type') || 'General'}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nType: ${data.get('type')}\n\n${data.get('message')}`
      );
      window.location.href = `mailto:shelly@shellymosman.com?subject=${subject}&body=${body}`;
    });
  }

});
