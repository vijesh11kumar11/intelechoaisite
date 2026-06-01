/* =========================================
   moveAI — Main JavaScript
   ========================================= */

(function () {
  'use strict';

  // ── Navbar scroll behaviour ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── Mobile hamburger menu ────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Animate hamburger → X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ── FAQ accordion ────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all open items
      faqItems.forEach(function (el) {
        el.classList.remove('open');
      });

      // Open clicked item if it wasn't already open
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ── Billing toggle (monthly / annual) ───────────────────────
  const billingToggle = document.getElementById('billingToggle');

  if (billingToggle) {
    const labels = billingToggle.querySelectorAll('.pricing-toggle__label');
    const priceNumbers = document.querySelectorAll('.pricing-card__number[data-monthly]');

    function updatePrices(billing) {
      priceNumbers.forEach(function (el) {
        const val = billing === 'annual'
          ? el.getAttribute('data-annual')
          : el.getAttribute('data-monthly');
        if (val) el.textContent = val;
      });

      // Update billing notes
      const notes = document.querySelectorAll('.pricing-card__billing-note');
      notes.forEach(function (note) {
        if (billing === 'annual') {
          note.textContent = 'Billed annually (save 20%). Cancel anytime.';
        } else {
          note.textContent = 'Billed monthly. Cancel anytime.';
        }
      });
    }

    labels.forEach(function (label) {
      label.addEventListener('click', function () {
        labels.forEach(function (l) { l.classList.remove('active'); });
        label.classList.add('active');
        updatePrices(label.getAttribute('data-billing'));
      });
    });
  }

  // ── Intersection Observer — animate-in elements ──────────────
  const animateEls = document.querySelectorAll('.animate-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animateEls.forEach(function (el) {
      // Pause animation until element is in view
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  } else {
    // Fallback: just show all elements
    animateEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ── Smooth scroll for anchor links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile menu if open
        if (mobileMenu) mobileMenu.classList.remove('open');
      }
    });
  });

  // ── Escape key closes payment modal ──────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var modal   = document.getElementById('payModal');
      var overlay = document.getElementById('payOverlay');
      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        var form = document.getElementById('payForm');
        if (form) form.reset();
      }
    }
  });

  // ── Active nav link detection ────────────────────────────────
  (function setActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === current) {
        link.classList.add('active');
      }
    });
  }());

}());
