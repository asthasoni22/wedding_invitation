/* =====================================================
   WEDDING INVITATION — SCRIPT.JS
   Astha & Neel
   ===================================================== */

'use strict';

/* ============================================================
   GOOGLE APPS SCRIPT URL
   Replace the placeholder below with your deployed Web App URL.
   See README.md → "Google Sheets Setup" for step-by-step instructions.
   ============================================================ */
const GOOGLE_SCRIPT_URL = '[YOUR_GOOGLE_APPS_SCRIPT_URL]';

/* ============================================================
   WEDDING DATE
   [WEDDING_DATE_PLACEHOLDER] — Update before publishing.
   Format: 'YYYY-MM-DDTHH:MM:SS' in local time.
   ============================================================ */
const WEDDING_DATE = new Date('2027-02-14T17:00:00');

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initCurtain();
  createPetals();
  initNav();
  initCarousel();
  initRSVP();
  initScrollReveal();
});

/* ============================================================
   CURTAIN REVEAL
   ============================================================ */
function initCurtain() {
  var overlay      = document.getElementById('curtain-overlay');
  var curtainL     = document.querySelector('.curtain-left');
  var curtainR     = document.querySelector('.curtain-right');
  var content      = document.querySelector('.curtain-content');
  var openBtn      = document.getElementById('open-invitation-btn');
  var mainContent  = document.getElementById('main-content');

  // Lock scroll while curtain is visible
  document.body.style.overflow = 'hidden';

  openBtn.addEventListener('click', openCurtain);

  // Also allow keyboard users to open with Enter/Space (button already handles this,
  // but be explicit for clarity)
  openBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCurtain();
    }
  });

  function openCurtain() {
    openBtn.disabled = true;

    // Step 1: fade out center text
    content.classList.add('fade-out');

    // Step 2: slide curtains apart after a brief pause
    setTimeout(function () {
      curtainL.classList.add('open');
      curtainR.classList.add('open');
    }, 280);

    // Step 3: show main content, unlock scroll, start countdown
    setTimeout(function () {
      overlay.style.display = 'none';
      mainContent.removeAttribute('aria-hidden');
      document.body.style.overflow = '';

      // Trigger hero element animations with stagger
      var heroEls = document.querySelectorAll('.animate-in');
      heroEls.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('visible');
        }, i * 160);
      });

      // Start live countdown
      updateCountdown();
      setInterval(updateCountdown, 1000);

    }, 2050); // curtain transition is 1.8s + 280ms head-start = ~2.08s
  }
}

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
function updateCountdown() {
  var now  = new Date();
  var diff = WEDDING_DATE - now;

  if (diff <= 0) {
    // Wedding day has arrived!
    setCountdown(0, 0, 0, 0);
    return;
  }

  var days    = Math.floor(diff / 86400000);
  var hours   = Math.floor((diff % 86400000) / 3600000);
  var minutes = Math.floor((diff % 3600000) / 60000);
  var seconds = Math.floor((diff % 60000) / 1000);

  setCountdown(days, hours, minutes, seconds);
}

function setCountdown(d, h, m, s) {
  var pad = function (n) { return String(n).padStart(2, '0'); };
  document.getElementById('cd-days').textContent    = pad(d);
  document.getElementById('cd-hours').textContent   = pad(h);
  document.getElementById('cd-minutes').textContent = pad(m);
  document.getElementById('cd-seconds').textContent = pad(s);
}

/* ============================================================
   ROSE PETAL ANIMATION
   Petals are created once via JS with random inline styles.
   The actual animation is pure CSS (petal-drift keyframe).
   ============================================================ */
function createPetals() {
  var container  = document.getElementById('petals-container');
  var count      = 26;
  var colors     = [
    'hsl(0,  62%, 84%)',
    'hsl(350,58%, 82%)',
    'hsl(5,  55%, 80%)',
    'hsl(355,60%, 86%)',
    'hsl(345,50%, 88%)',
    'hsl(10, 65%, 83%)',
  ];

  for (var i = 0; i < count; i++) {
    var petal = document.createElement('div');
    petal.classList.add('petal');

    var size      = 10 + Math.random() * 13;            // 10–23 px
    var ratio     = 1.35 + Math.random() * 0.45;        // height ratio
    var left      = Math.random() * 100;                 // % across
    var duration  = 9 + Math.random() * 14;             // 9–23 s
    var delay     = -Math.random() * duration;           // negative = already in progress
    var drift     = (Math.random() - 0.5) * 130;        // –65 to +65 px horizontal
    var color     = colors[Math.floor(Math.random() * colors.length)];

    petal.style.cssText = [
      'left:'               + left.toFixed(1) + '%',
      'width:'              + size.toFixed(1) + 'px',
      'height:'             + (size * ratio).toFixed(1) + 'px',
      'background:'         + color,
      'animation-name:petal-drift',
      'animation-duration:' + duration.toFixed(1) + 's',
      'animation-delay:'    + delay.toFixed(2) + 's',
      '--drift:'            + drift.toFixed(1) + 'px',
    ].join(';');

    container.appendChild(petal);
  }
}

/* ============================================================
   NAVIGATION
   – Hamburger toggle
   – Scroll-spy (active link)
   – Scrolled class for backdrop
   ============================================================ */
function initNav() {
  var nav       = document.getElementById('main-nav');
  var hamburger = document.getElementById('hamburger-btn');
  var navLinks  = document.getElementById('nav-links-list');
  var allLinks  = navLinks.querySelectorAll('a[href^="#"]');
  var sections  = document.querySelectorAll('section[id]');

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    var expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  allLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Scroll events: backdrop + active link
  window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll() {
    // Backdrop
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link spy
    var scrollPos = window.scrollY + 110;
    var current   = '';

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) {
        current = sec.id;
      }
    });

    allLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  onScroll(); // run once on load
}

/* ============================================================
   GALLERY CAROUSEL
   Touch-swipe support, dot indicators, keyboard arrow keys.
   ============================================================ */
function initCarousel() {
  var track      = document.getElementById('carousel-track');
  var dotsWrap   = document.getElementById('carousel-dots');
  var prevBtn    = document.querySelector('.carousel-prev');
  var nextBtn    = document.querySelector('.carousel-next');

  if (!track) return;

  var slides     = track.querySelectorAll('.carousel-slide');
  var total      = slides.length;
  var current    = 0;

  // Build dot buttons
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';

    dotsWrap.querySelectorAll('.carousel-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  // Keyboard: left/right arrows when carousel is focused or visible
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch / swipe
  var touchStartX = 0;
  var touchStartY = 0;
  var isDragging  = false;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = true;
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    // Prevent vertical scroll hijacking while swiping horizontally
    var dx = Math.abs(e.touches[0].clientX - touchStartX);
    var dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > dy) e.preventDefault();
  }, { passive: false });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    isDragging = false;
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL (Intersection Observer)
   ============================================================ */
function initScrollReveal() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(function (el) { observer.observe(el); });

  // Stagger detail cards
  document.querySelectorAll('.detail-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.1) + 's';
  });

  // Stagger timeline items slightly
  document.querySelectorAll('.tl-item').forEach(function (item, i) {
    item.style.transitionDelay = (i * 0.08) + 's';
  });
}

/* ============================================================
   RSVP FORM
   Submits to Google Apps Script Web App via fetch (no-cors).
   See README.md for full setup instructions.
   ============================================================ */
function initRSVP() {
  var form       = document.getElementById('rsvp-form');
  var submitBtn  = document.getElementById('submit-btn');
  var successEl  = document.getElementById('rsvp-success');
  var errorEl    = document.getElementById('rsvp-error');
  var guestsRow  = document.getElementById('guests-row');
  var nameInput  = document.getElementById('guest-name');

  if (!form) return;

  // Hide/show guest count based on attendance
  document.querySelectorAll('[name="attending"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      guestsRow.style.display = this.value === 'yes' ? 'block' : 'none';
    });
  });

  // Clear error state on input
  nameInput.addEventListener('input', function () {
    nameInput.classList.remove('error');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name       = nameInput.value.trim();
    var attending  = form.querySelector('[name="attending"]:checked');
    var guests     = form.querySelector('[name="guests"]').value;
    var message    = form.querySelector('[name="message"]').value.trim();

    // Simple client-side validation
    var valid = true;

    if (!name) {
      nameInput.classList.add('error');
      nameInput.focus();
      valid = false;
    }

    if (!attending) {
      // Flash the toggle pills to signal required selection
      var pills = form.querySelectorAll('.toggle-pill span');
      pills.forEach(function (pill) {
        pill.style.borderColor = '#c0392b';
        setTimeout(function () { pill.style.borderColor = ''; }, 1800);
      });
      valid = false;
    }

    if (!valid) return;

    var payload = {
      name:      name,
      attending: attending.value,
      guests:    attending.value === 'yes' ? guests : '0',
      message:   message,
      timestamp: new Date().toISOString()
    };

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Guard: if URL is still a placeholder, show success demo mode
    if (GOOGLE_SCRIPT_URL === '[YOUR_GOOGLE_APPS_SCRIPT_URL]') {
      simulateSuccess();
      return;
    }

    fetch(GOOGLE_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',       // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(function () {
      // Response is opaque with no-cors — assume success if no network error
      showSuccess();
    })
    .catch(function () {
      showError();
    });
  });

  function simulateSuccess() {
    // Demo mode when GOOGLE_SCRIPT_URL is not yet configured
    setTimeout(showSuccess, 900);
  }

  function showSuccess() {
    form.style.display = 'none';
    successEl.removeAttribute('aria-hidden');
    successEl.classList.add('visible');
    submitBtn.classList.remove('loading');
  }

  function showError() {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    errorEl.removeAttribute('aria-hidden');
    errorEl.classList.add('visible');

    setTimeout(function () {
      errorEl.classList.remove('visible');
      errorEl.setAttribute('aria-hidden', 'true');
    }, 6000);
  }
}
