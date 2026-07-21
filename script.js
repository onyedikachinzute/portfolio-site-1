/* ==========================================================================
   Portfolio interactivity
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const navList = document.getElementById('navList');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const yearEl = document.getElementById('yr');
  const heroSection = document.querySelector('[data-animate-hero]');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* trigger hero corner/tag entrance */
  if (heroSection) {
    requestAnimationFrame(() => heroSection.classList.add('loaded'));
  }

  /* -------------------------
     Mobile menu toggle
     ------------------------- */
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.classList.toggle('is-open', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------
     Smooth scroll with header offset
     ------------------------- */
  const headerHeight = () => header ? header.offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* -------------------------
     Active nav link on scroll
     (rootMargin band near the top of the viewport, rather than
     requiring 50% of a section's area to be visible — tall sections
     like Featured Projects never reach that threshold otherwise)
     ------------------------- */
  if (sections.length) {
    const firstLink = document.querySelector('.nav-link[href="#home"]');
    if (firstLink) firstLink.classList.add('active');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
          if (link) link.classList.add('active');
        }
      });
    }, { root: null, rootMargin: `-${headerHeight() + 20}px 0px -55% 0px`, threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* -------------------------
     Header hide/show + back-to-top
     ------------------------- */
  let lastScroll = window.pageYOffset || 0;
  const showBackToTopThreshold = 300;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || 0;

    if (backToTop) {
      if (currentScroll > showBackToTopThreshold) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }

    if (header) {
      if (currentScroll <= 10) header.classList.remove('hide');
      else if (currentScroll > lastScroll + 10) header.classList.add('hide');
      else if (currentScroll < lastScroll - 10) header.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });

  /* -------------------------
     Scroll-triggered reveal animations
     ------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* stagger project cards specifically */
  document.querySelectorAll('.project-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 90}ms`;
  });

  /* -------------------------
     GitHub live stats (public API, no auth)
     ------------------------- */
  const ghRepos = document.getElementById('ghRepos');
  const ghSince = document.getElementById('ghSince');

  if (ghRepos) {
    fetch('https://api.github.com/users/onyedikachinzute')
      .then(res => {
        if (!res.ok) throw new Error('GitHub API request failed');
        return res.json();
      })
      .then(data => {
        animateCount(ghRepos, data.public_repos ?? 0);
        if (ghSince && data.created_at) {
          ghSince.textContent = new Date(data.created_at).getFullYear();
        }
      })
      .catch(() => {
        [ghRepos, ghSince].forEach(el => {
          if (el) el.textContent = '—';
        });
      });
  }

  function animateCount(el, target) {
    if (!el) return;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* -------------------------
     Light / dark theme toggle
     (initial theme is already applied by the inline head script
     to avoid a flash of the wrong theme; this just wires the button)
     ------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const root = document.documentElement;
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      themeToggle.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

});
