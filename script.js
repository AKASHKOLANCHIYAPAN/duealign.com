/* ═══════════════════════════════
   DUEALIGN — script.js v2
   ═══════════════════════════════ */
(function () {
  'use strict';

  /* ── Scroll Progress ── */
  const scrollBar = document.getElementById('scrollBar');
  window.addEventListener('scroll', () => {
    if (!scrollBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = ((window.scrollY / total) * 100) + '%';
  }, { passive: true });

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── Hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      mobileNav.setAttribute('aria-hidden', !open);
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  /* ── Scroll Reveal ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...(entry.target.parentElement?.querySelectorAll('[data-reveal]') || [])];
        const idx = Math.max(siblings.indexOf(entry.target), 0);
        entry.target.style.transitionDelay = (idx * 70) + 'ms';
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  const allReveal = document.querySelectorAll('[data-reveal]');
  allReveal.forEach(el => revealObs.observe(el));

  // Safety net: force-show anything still hidden after 400ms (handles elements in viewport at load)
  setTimeout(() => {
    allReveal.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.style.transitionDelay = '0ms';
        el.classList.add('visible');
      }
    });
  }, 400);

  /* ── Counter Animation ── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const dec = (target % 1 !== 0);
      const dur = 1600;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = target * ease;
        el.textContent = (dec ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = (dec ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ═══════════════════════════════
     PROJECT ESTIMATOR — 3-Step
  ═══════════════════════════════ */
  const steps = ['step1', 'step2', 'step3'];
  const dots  = ['dot1', 'dot2', 'dot3'];
  let estData = { service: null, size: null, urgency: null };
  let currentStep = 0;

  /* Estimation data table */
  const matrix = {
    website: {
      small:  { timeline: '3–5 days',   price: 'From ₹2k',  includes: 'Landing page, mobile-ready, contact form' },
      medium: { timeline: '1–2 weeks',  price: 'From ₹5k',  includes: 'Multi-page site, SEO optimized, fast loading' },
      large:  { timeline: '3–5 weeks',  price: 'From ₹15k', includes: 'Full web app, custom features, e-commerce' },
    },
    app: {
      small:  { timeline: '2–3 weeks',  price: 'From ₹8k',  includes: 'Basic Android/iOS app with core screens' },
      medium: { timeline: '4–6 weeks',  price: 'From ₹20k', includes: 'Full-featured app, backend, login, payments' },
      large:  { timeline: '8–12 weeks', price: 'From ₹50k', includes: 'Complex app with admin panel & integrations' },
    },
    ai: {
      small:  { timeline: '1 week',     price: 'From ₹5k',  includes: 'Simple chatbot or task automation' },
      medium: { timeline: '2–3 weeks',  price: 'From ₹12k', includes: 'Multi-step AI workflow, API integrations' },
      large:  { timeline: '4–6 weeks',  price: 'From ₹30k', includes: 'Full AI agent system, custom ML pipeline' },
    },
    design: {
      small:  { timeline: '2–4 days',   price: 'From ₹2k',  includes: 'Single screen or landing page design' },
      medium: { timeline: '1–2 weeks',  price: 'From ₹6k',  includes: 'Full UI kit, interactive Figma prototype' },
      large:  { timeline: '2–4 weeks',  price: 'From ₹15k', includes: 'Complete design system + UX audit' },
    },
    content: {
      small:  { timeline: '1–3 days',   price: 'From ₹1.5k', includes: '10 social posts or 2 blog articles' },
      medium: { timeline: '1 week',     price: 'From ₹4k',   includes: 'Monthly content plan + 20 pieces' },
      large:  { timeline: 'Ongoing',    price: 'From ₹8k/mo', includes: 'Full content strategy + weekly delivery' },
    },
    graphic: {
      small:  { timeline: '2–4 days',   price: 'From ₹2k',  includes: 'Logo + 2 brand colors + fonts' },
      medium: { timeline: '1–2 weeks',  price: 'From ₹5k',  includes: 'Full brand kit — logo, colors, typography' },
      large:  { timeline: '2–3 weeks',  price: 'From ₹12k', includes: 'Complete brand identity + all assets' },
    },
    fullpackage: {
      small:  { timeline: '1–2 weeks',  price: 'From ₹8k',  includes: 'Website + branding + basic content' },
      medium: { timeline: '3–5 weeks',  price: 'From ₹20k', includes: 'Web app + design + AI tool + content' },
      large:  { timeline: '6–10 weeks', price: 'Custom',    includes: 'End-to-end digital transformation' },
    },
  };


  /* Urgency adjustment messages */
  const urgencyNote = {
    asap:     ' (Rush delivery — we prioritize your project)',
    month:    ' (Comfortable timeline)',
    flexible: ' (We\'ll suggest the optimal schedule)',
  };

  function showStep(idx) {
    steps.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', i !== idx);
    });
    dots.forEach((id, i) => {
      const d = document.getElementById(id);
      if (d) d.classList.toggle('active', i <= idx);
    });
    const result = document.getElementById('estResult');
    if (result) result.classList.add('hidden');
  }

  function showResult() {
    steps.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    const result = document.getElementById('estResult');
    if (!result) return;
    result.classList.remove('hidden');

    const data = matrix[estData.service]?.[estData.size];
    if (!data) return;

    const note = urgencyNote[estData.urgency] || '';
    document.getElementById('resTimeline').textContent = data.timeline + (estData.urgency === 'asap' ? ' 🚀' : '');
    document.getElementById('resPrice').textContent    = data.price;
    document.getElementById('resIncludes').textContent = data.includes + note;
  }

  function handleOptionClick(optionsId, field, nextStep) {
    const container = document.getElementById(optionsId);
    if (!container) return;
    container.querySelectorAll('.est-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.est-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        estData[field] = btn.getAttribute('data-val');

        setTimeout(() => {
          if (nextStep !== null) {
            currentStep = nextStep;
            showStep(currentStep);
          } else {
            showResult();
          }
        }, 200);
      });
    });
  }

  handleOptionClick('serviceOptions', 'service', 1);
  handleOptionClick('sizeOptions',    'size',    2);
  handleOptionClick('urgencyOptions', 'urgency', null);

  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      estData = { service: null, size: null, urgency: null };
      currentStep = 0;
      document.querySelectorAll('.est-opt').forEach(b => b.classList.remove('selected'));
      showStep(0);
    });
  }

  showStep(0);

  /* ═══════════════════════════════
     TIER TOGGLE
  ═══════════════════════════════ */
  const togOne     = document.getElementById('togOne');
  const togMonthly = document.getElementById('togMonthly');

  const plansData = {
    one: [
      { tag: 'STARTER', name: 'Quick Sprint', desc: 'Perfect for a specific deliverable — a landing page, a logo, a social media kit, or a small automation. Get it done in days, not months.', feats: ['✓ Delivered in 3–7 days', '✓ One focused deliverable', '✓ 2 rounds of revisions', '✓ All source files included'], cta: 'Get Started →', featured: false },
      { tag: 'RECOMMENDED', name: 'Full Project', desc: 'For businesses that need a complete solution — a full website, a design system, or an AI tool built end-to-end. This is where we do our best work.', feats: ['✓ Complete end-to-end delivery', '✓ Regular progress check-ins', '✓ Unlimited revisions until you\'re happy', '✓ Post-launch support included', '✓ Full handover with documentation'], cta: 'Let\'s Build This →', featured: true },
      { tag: 'ENTERPRISE', name: 'Ongoing Partner', desc: 'For businesses that need a reliable team available every month — updates, new features, content, support, and strategy on a rolling basis.', feats: ['✓ Dedicated hours each month', '✓ Priority response always', '✓ Strategy + execution together', '✓ Flexible scope each month'], cta: 'Talk to Us →', featured: false },
    ],
    monthly: [
      { tag: 'BASIC', name: 'Essentials', desc: 'Regular maintenance, content updates, and small improvements to keep your digital presence fresh and working. Great for solo founders.', feats: ['✓ 10 hours of work/month', '✓ Priority email support', '✓ Monthly progress report', '✓ No long-term contract'], cta: 'Start Monthly →', featured: false },
      { tag: 'RECOMMENDED', name: 'Growth Squad', desc: 'A dedicated mini-team working on your project every single month — development, design, and content all covered. This is where real growth happens.', feats: ['✓ 40 hours of work/month', '✓ Developer + Designer included', '✓ Weekly calls & updates', '✓ Slack/WhatsApp communication', '✓ Flexible priorities each month'], cta: 'Get Your Squad →', featured: true },
      { tag: 'FULL SCALE', name: 'Total Partnership', desc: 'We become your outsourced tech and creative department. Everything from strategy to execution, handled every month without you having to manage it.', feats: ['✓ Unlimited scope discussions', '✓ Full team at your disposal', '✓ Custom SLA & reporting', '✓ Dedicated project manager'], cta: 'Talk to Us →', featured: false },
    ],
  };

  function renderPlans(type) {
    const grid = document.querySelector('.plans-grid');
    if (!grid) return;
    const data = plansData[type];
    grid.innerHTML = data.map(p => `
      <div class="plan-card ${p.featured ? 'plan-featured' : ''}" data-reveal tabindex="0">
        ${p.featured ? '<span class="plan-popular">Most Chosen</span>' : ''}
        <span class="plan-tag">${p.tag}</span>
        <h3 class="plan-name">${p.name}</h3>
        <p class="plan-desc">${p.desc}</p>
        <ul class="plan-feats">${p.feats.map(f => `<li>${f}</li>`).join('')}</ul>
        <a href="#contact" class="plan-btn ${p.featured ? 'plan-btn-fill' : ''}">${p.cta}</a>
      </div>
    `).join('');

    // Re-apply smooth scroll to new links
    grid.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      });
    });

    // Re-reveal
    grid.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => revealObs.observe(el), 50);
    });
  }

  if (togOne && togMonthly) {
    togOne.addEventListener('click', () => {
      togOne.classList.add('tog-active');
      togMonthly.classList.remove('tog-active');
      renderPlans('one');
    });
    togMonthly.addEventListener('click', () => {
      togMonthly.classList.add('tog-active');
      togOne.classList.remove('tog-active');
      renderPlans('monthly');
    });
  }

  /* ── Dev console signature ── */
  console.log('%c DueAlign Studio %c Two Minds, One Vision ', 'background:#2563EB;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px', 'background:#0A0A14;color:#fff;padding:4px 8px;border-radius:0 4px 4px 0');

})();
