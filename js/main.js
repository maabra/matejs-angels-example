/* ================================================================
   MATEJ'S ANGELS KENNEL — Main JavaScript
   ================================================================ */

/* ---- DIAGONAL BACKGROUND PATTERN ---- */
(function () {
  const el = document.createElement('div');
  el.className = 'bg-kennel-pattern';
  el.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(el, document.body.firstChild);
})();

/* ---- NAVBAR: scroll effect + mobile toggle ---- */
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }
})();

/* ---- ACTIVE NAV LINK ---- */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.endsWith(href.replace(/^.*\//, ''))) {
      a.classList.add('active');
    }
  });
})();

/* ---- LIGHTBOX ---- */
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const lbImg     = lb.querySelector('#lb-img');
  const lbCaption = lb.querySelector('#lb-caption');
  const lbClose   = lb.querySelector('#lb-close');
  const lbPrev    = lb.querySelector('#lb-prev');
  const lbNext    = lb.querySelector('#lb-next');

  let items = [];
  let current = 0;

  function open(index) {
    current = index;
    const item = items[current];
    lbImg.src = item.src;
    lbImg.alt = item.alt || '';
    if (lbCaption) lbCaption.textContent = item.caption || item.alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function navigate(dir) {
    current = (current + dir + items.length) % items.length;
    open(current);
  }

  // Collect all gallery items
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    const img = el.querySelector('img');
    if (!img) return;
    items.push({
      src: img.src,
      alt: img.alt,
      caption: el.dataset.caption || img.alt
    });
    el.addEventListener('click', () => open(i));
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', e => { if (e.key === 'Enter') open(i); });
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev)  lbPrev.addEventListener('click',  () => navigate(-1));
  if (lbNext)  lbNext.addEventListener('click',  () => navigate(1));

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')    close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight')navigate(1);
  });
})();

/* ---- FAQ ACCORDION ---- */
(function () {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = btn.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-q.open').forEach(b => {
        b.classList.remove('open');
        b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
      });

      // open clicked if it was closed
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
})();

/* ---- TAB PANELS (dog profile) ---- */
(function () {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.dog-tabs') || document.querySelector('.dog-tabs');
      const target = btn.dataset.tab;

      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = group.querySelector(`#tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ---- SCROLL ANIMATIONS ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));
})();

/* ---- CONTACT FORM (basic client-side validation) ---- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]');
    const email   = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;

    [name, email, message].forEach(f => {
      if (f && !f.value.trim()) {
        f.style.borderColor = '#f44336';
        valid = false;
      } else if (f) {
        f.style.borderColor = '';
      }
    });

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = '✓ Message Sent!';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 3000);
      }
    }
  });
})();

/* ---- LOGO IMG FALLBACK ---- */
document.querySelectorAll('.nav-logo img, .index-logo-wrap img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const fallback = this.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  });
});
