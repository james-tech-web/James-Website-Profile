document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  const root = document.documentElement;
  if (!header) return;

  // Preferences
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // configuration
  const collapsePx = 140; // scroll range to fully collapse
  const maxScaleReduce = 0.14; // max scale reduction (14%)
  const revealClass = 'in-view';
  const headerRevealClass = 'content-reveal';
  const revealPulseMs = 620; // how long header reveal effect lasts

  // base measurement
  let baseH = header.getBoundingClientRect().height || header.offsetHeight || 0;
  let lastProgress = 0;

  function setBaseH() {
    baseH = header.getBoundingClientRect().height || header.offsetHeight || 0;
    updateHeaderVars(lastProgress);
  }

  function updateHeaderVars(progress) {
    const p = Math.max(0, Math.min(1, progress || 0));
    const scale = 1 - p * maxScaleReduce;
    const visualH = Math.round(baseH * scale);
    root.style.setProperty('--hp', String(p));
    root.style.setProperty('--header-h', visualH + 'px');
    lastProgress = p;
  }

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const p = Math.min(1, y / collapsePx);
    updateHeaderVars(p);
    if (y > 48) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    // back to top visibility
    const b = document.getElementById('back-to-top');
    if (b) {
      if (y > 360) b.classList.add('show'); else b.classList.remove('show');
    }
  }

  // Header initial entrance (slide down)
  if (!prefersReduced) {
    requestAnimationFrame(() => {
      // small delay for smoother paint
      setTimeout(() => header.classList.add('header-visible'), 60);
    });
  } else {
    header.classList.add('header-visible');
  }

  // observe header size changes
  window.addEventListener('resize', setBaseH, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(setBaseH).observe(header);

  // Stagger helper: find containers with data-stagger or .stagger
  (function applyStaggering() {
    const containers = document.querySelectorAll('[data-stagger], .stagger');
    containers.forEach(container => {
      const step = parseInt(container.getAttribute('data-stagger')) || 80; // ms
      const items = container.querySelectorAll('.reveal');
      items.forEach((it, i) => {
        it.style.setProperty('--delay', `${i * step}ms`);
      });
    });
  })();

  // Reveal observer for page content; align header animation when content reveals
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (prefersReduced) {
    // reveal all immediately
    revealEls.forEach(el => el.classList.add(revealClass));
  } else if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // add reveal class (page animation)
        // respect per-element delay set by CSS variable
        const delay = getComputedStyle(el).getPropertyValue('--delay') || '';
        if (delay) el.style.transitionDelay = delay;
        el.classList.add(revealClass);

        // special-case: counters and skill lists
        if (el.classList.contains('counters') || el.querySelectorAll && el.querySelectorAll('.counter .num').length) {
          runCounters(el);
        }
        if (el.classList.contains('skills-list') || el.querySelectorAll && el.querySelectorAll('.skill-fill').length) {
          runSkills(el);
        }

        // pulse header for visual alignment
        header.classList.add(headerRevealClass);
        setTimeout(() => header.classList.remove(headerRevealClass), revealPulseMs);
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(e => io.observe(e));
  } else {
    // fallback: reveal immediately
    revealEls.forEach(e => e.classList.add(revealClass));
  }

  // Counters animation (progressive numeric increment)
  function runCounters(rootEl) {
    const container = rootEl instanceof Element ? rootEl : document;
    const nums = container.querySelectorAll('.counter .num');
    if (!nums || nums.length === 0) return;
    nums.forEach(el => {
      const target = parseInt(el.getAttribute('data-target')) || parseInt(el.textContent) || 0;
      animateNumber(el, target, 800);
    });
  }

  function animateNumber(el, to, duration) {
    const start = performance.now();
    const from = 0;
    function step(ts) {
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = val;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Skill fills: set widths, rely on CSS transitions for smoothness
  function runSkills(rootEl) {
    const container = rootEl instanceof Element ? rootEl : document;
    const fills = container.querySelectorAll('.skill-fill');
    if (!fills || fills.length === 0) return;
    fills.forEach(f => {
      const p = f.getAttribute('data-percent') || f.dataset.percent || '0';
      // set width; CSS handles transition
      f.style.width = p + '%';
      f.setAttribute('aria-valuenow', String(p));
    });
  }

  // Footer reveal
  const footer = document.querySelector('footer');
  if (footer && 'IntersectionObserver' in window && !prefersReduced) {
    const fio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { footer.classList.add('in-view'); obs.unobserve(footer); } });
    }, { threshold: 0.06 });
    fio.observe(footer);
  } else if (footer) footer.classList.add('in-view');

  // Back to top button
  (function ensureBackToTop() {
    if (document.getElementById('back-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    // create a progress ring + arrow inside the button
    btn.innerHTML = `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="rgba(226,232,240,0.08)" stroke-width="3" fill="none"></circle>
        <circle id="bt-progress" cx="24" cy="24" r="18" stroke="rgba(0,43,58,0.9)" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="113.097" stroke-dashoffset="113.097" transform="rotate(-90 24 24)"></circle>
      </svg>
      <span class="bt-arrow">↑</span>
    `;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
  })();

  // Enhance footer links: add icons dynamically, ripple on click, and hover micro interactions
  (function enhanceFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Map simple icon svgs
    const svgs = {
      mail: '<svg class="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M21 8.5L12 14 3 8.5"/></svg>',
      link: '<svg class="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a3.5 3.5 0 0 1 0-5l1-1a3.5 3.5 0 0 1 5 5l-1 1"/><path d="M14 10a3.5 3.5 0 0 1 0 5l-1 1a3.5 3.5 0 0 1-5-5l1-1"/></svg>',
      github: '<svg class="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.5 1.5-4.5-2-6-2"/><path d="M20.5 14.5a3.5 3.5 0 0 0-.9-2.5c-2.2-2.4-5.2-2.4-7.6-2.4"/></svg>',
      arrow: '<svg class="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>'
    };

    const links = footer.querySelectorAll('a');
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      let icon = svgs.arrow;
      if (href.startsWith('mailto:')) icon = svgs.mail;
      else if (href.includes('linkedin')) icon = svgs.link;
      else if (href.includes('github')) icon = svgs.github;

      // add icon wrapper if not present
      if (!a.querySelector('.f-icon')) {
        a.insertAdjacentHTML('afterbegin', icon);
        const underline = document.createElement('span');
        underline.className = 'underline';
        a.appendChild(underline);
      }

      // ripple on click
      a.addEventListener('click', function (e) {
        const rect = a.getBoundingClientRect();
        const span = document.createElement('span');
        span.className = 'footer-ripple';
        span.style.left = (e.clientX - rect.left) + 'px';
        span.style.top = (e.clientY - rect.top) + 'px';
        a.appendChild(span);
        setTimeout(() => span.remove(), 600);
      });
    });

    // divider animation trigger on load (in case footer already in view)
    const div = footer.querySelector('.footer-divider');
    if (div && footer.classList.contains('in-view')) div.classList.add('animate');
  })();

  // Gallery click-to-enlarge lightbox with navigation
  (function galleryLightbox() {
    const grid = document.querySelector('.image-grid');
    if (!grid) return;

    // Create lightbox modal
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="lightbox-content">
        <div class="lightbox-image-wrapper">
          <img src="" alt="" />
        </div>
        <div class="lightbox-caption"></div>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">›</button>
        <button class="lightbox-close" aria-label="Close lightbox">×</button>
        <div class="lightbox-counter"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const caption = modal.querySelector('.lightbox-caption');
    const counter = modal.querySelector('.lightbox-counter');
    const prevBtn = modal.querySelector('.lightbox-prev');
    const nextBtn = modal.querySelector('.lightbox-next');
    const closeBtn = modal.querySelector('.lightbox-close');
    
    let currentIndex = 0;
    let images = [];
    let navigationDirection = 'next';
    let lastNavTime = 0;
    const NAV_THROTTLE = 600; // ms between navigations

    function open(index, direction = 'next') {
      const now = Date.now();
      const newIndex = Math.max(0, Math.min(index, images.length - 1));

      // If modal already open, throttle rapid navigation for smoothness
      if (modal.classList.contains('open') && now - lastNavTime < NAV_THROTTLE) return;

      // Only animate if we're actually changing images
      if (newIndex !== currentIndex) {
        lastNavTime = now;
        navigationDirection = direction;
        currentIndex = newIndex;

        const item = images[currentIndex];
        const img = item.querySelector('img');
        const cap = item.querySelector('figcaption');

        // Add exiting class to current image
        modalImg.classList.add('exiting');

        // Wait for exit animation then change image and add entering class
        setTimeout(() => {
          modalImg.src = img.src;
          modalImg.alt = img.alt || '';
          caption.textContent = cap ? cap.textContent : '';
          counter.textContent = `${currentIndex + 1} / ${images.length}`;

          modalImg.classList.remove('exiting');
          modalImg.classList.add('entering');
          if (direction === 'prev') modalImg.classList.add('prev');

          // Remove entering/prev classes after animation completes
          setTimeout(() => {
            modalImg.classList.remove('entering', 'prev');
          }, 600);
        }, 300);
      } else if (!modal.classList.contains('open')) {
        // Initial open (same index)
        lastNavTime = now;
        const item = images[currentIndex];
        const img = item.querySelector('img');
        const cap = item.querySelector('figcaption');

        modalImg.src = img.src;
        modalImg.alt = img.alt || '';
        caption.textContent = cap ? cap.textContent : '';
        counter.textContent = `${currentIndex + 1} / ${images.length}`;

        modalImg.classList.add('entering');
        setTimeout(() => {
          modalImg.classList.remove('entering');
        }, 600);
      }

      if (!modal.classList.contains('open')) {
        modal.classList.add('open');
        document.documentElement.style.overflow = 'hidden';
      }
    }

    function close() {
      modal.classList.remove('open');
      document.documentElement.style.overflow = '';
    }

    // Click on grid item opens lightbox
    grid.addEventListener('click', (e) => {
      const item = e.target.closest('.grid-item');
      if (!item) return;
      
      images = Array.from(grid.querySelectorAll('.grid-item'));
      currentIndex = images.indexOf(item);
      open(currentIndex);
    });

    // Navigation buttons
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      open(currentIndex - 1, 'prev');
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      open(currentIndex + 1, 'next');
    });

    // Close button and overlay click
    closeBtn.addEventListener('click', () => close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') open(currentIndex - 1, 'prev');
      else if (e.key === 'ArrowRight') open(currentIndex + 1, 'next');
    });

    // Wheel navigation for mouse and trackpad
    let wheelAccumulator = 0;
    modal.addEventListener('wheel', (e) => {
      if (!modal.classList.contains('open')) return;
      // Normalize delta (favor horizontal if larger)
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      // Accumulate and trigger once threshold is reached to avoid jitter on trackpads
      wheelAccumulator += delta;
      // small threshold to ignore light scrolls
      const THRESH = 80;
      if (Math.abs(wheelAccumulator) > THRESH) {
        if (wheelAccumulator > 0) open(currentIndex + 1, 'next');
        else open(currentIndex - 1, 'prev');
        wheelAccumulator = 0;
      }
      // reset accumulator after short idle to avoid carry-over
      clearTimeout(modal._wheelReset);
      modal._wheelReset = setTimeout(() => { wheelAccumulator = 0; }, 200);
    }, { passive: true });

    // Touch swipe navigation
    let touchStartX = 0;
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    modal.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) open(currentIndex + 1, 'next'); // swipe left
        else open(currentIndex - 1, 'prev'); // swipe right
      }
    });
  })();

  // Update progress ring on scroll (back-to-top)
  (function backToTopProgress() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    const prog = btn.querySelector('#bt-progress');
    const R = 18; const C = 2 * Math.PI * R;

    function update() {
      const scrolled = window.scrollY || window.pageYOffset;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(100, Math.round((scrolled / height) * 100)) : 0;
      const dash = C - (C * pct) / 100;
      if (prog) prog.setAttribute('stroke-dashoffset', String(dash));
      // floating effect when visible
      if (scrolled > 360) btn.classList.add('floating'); else btn.classList.remove('floating');
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  })();

  // Contact form: add loading and success classes to submit button if present
  (function enhanceContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector('.submit');
    if (!submitBtn) return;
    form.addEventListener('submit', function (e) {
      // allow existing handlers to run (do not preventDefault here)
      submitBtn.classList.add('loading');
      // safety timeout to remove loading and show success
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        setTimeout(() => submitBtn.classList.remove('success'), 1200);
      }, 900);
    });
  })();

  // Active section tracking and smooth scroll nav
  (function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    // Detect current page and set active nav link
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Check if this link matches current page
      const linkPage = href.split('/').pop() || 'index.html';
      if (linkPage === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
      
      // Add smooth scroll for hash links on same page
      if (href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          const target = document.querySelector(href);
          if (!target) return;
          
          e.preventDefault();
          const headerH = header.offsetHeight || baseH || 0;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
          
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        });
      }
    });

    // Section-based active detection (for pages with multiple sections)
    const sections = Array.from(navLinks)
      .filter(link => link.getAttribute('href').startsWith('#'))
      .map(link => {
        const href = link.getAttribute('href');
        return document.querySelector(href);
      })
      .filter(s => s);

    if (sections.length && 'IntersectionObserver' in window && !prefersReduced) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          if (!id) return;
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === '#' + id) {
                link.classList.add('active');
              } else if (href.startsWith('#')) {
                link.classList.remove('active');
              }
            });
          }
        });
      }, { threshold: [0.1, 0.5], rootMargin: '0px 0px -70% 0px' });

      sections.forEach(section => sectionObserver.observe(section));
    }
  })();

  // Start
  setBaseH();
  if (!prefersReduced) window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
