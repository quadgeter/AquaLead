/* ============================================================
   AquaLead — site.js
   Calendly booking, GA4 analytics, scroll animations
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CONFIG — single source of truth
     ---------------------------------------------------------- */
  var CONFIG = {
    calendly: {
      url: 'https://calendly.com/johng-aqualead/30min'
    },
    ga4: {
      measurementId: 'G-292QMX42K6'
    }
  };

  /* ----------------------------------------------------------
     2. GA4 INITIALIZATION
     ---------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', CONFIG.ga4.measurementId);

  /* ----------------------------------------------------------
     3. ANALYTICS HELPERS
     ---------------------------------------------------------- */
  function trackEvent(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  }

  // Section visibility observer — fires section_view once per section
  function initSectionTracking() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var sectionObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackEvent('section_view', {
            section_name: entry.target.id
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ----------------------------------------------------------
     4. CALENDLY BOOKING HANDLER
     ---------------------------------------------------------- */
  function initBooking() {
    var buttons = document.querySelectorAll('[data-booking]');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();

        trackEvent('cta_click', {
          section_name: btn.getAttribute('data-section') || '',
          cta_text: btn.textContent.trim()
        });

        if (window.Calendly) {
          Calendly.initPopupWidget({ url: CONFIG.calendly.url });
        } else {
          window.open(CONFIG.calendly.url, '_blank', 'noopener');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     5. SCROLL ANIMATIONS (moved from inline <script>)
     ---------------------------------------------------------- */
  function initFadeIn() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initFadeIn();
    initBooking();
    initSectionTracking();
  });
})();
