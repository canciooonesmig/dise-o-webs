(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (reduce) root.classList.add('reduced');

  /* ───── Smooth scroll ───── */
  let lenis = null;
  if (!reduce && hasGsap && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ lerp: 0.1, anchors: { offset: -80 }, autoRaf: false });
    lenis.on('scroll', window.ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ───── Navigation: hide on scroll down, show on scroll up ───── */
  const nav = $('.nav');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav && !root.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > 160);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ───── Mobile sheet ───── */
  const menuBtn = $('[data-menu-btn]');
  const sheet = $('#sheet');
  if (menuBtn && sheet) {
    sheet.inert = true;
    const setOpen = (open) => {
      root.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      $('[data-menu-label]', menuBtn).textContent = open ? 'Cerrar' : 'Menú';
      sheet.inert = !open;
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) setTimeout(() => $('a', sheet)?.focus(), 50);
    };
    menuBtn.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')));
    $$('a', sheet).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 62.0625em)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ───── Footer clock (Santiago) ───── */
  const clock = $('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Santiago' });
    const tick = () => { clock.textContent = `Santiago ${fmt.format(new Date())}`; };
    tick();
    setInterval(tick, 1000);
  }

  /* ───── Contact form → visitor's email client ───── */
  $$('[data-contact-form]').forEach((form) => {
    const status = $('[data-form-status]', form);
    const showError = (field, msg) => {
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = document.getElementById(field.getAttribute('aria-describedby'));
      if (err) err.textContent = msg;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      for (const f of $$('input, textarea', form)) {
        let msg = '';
        if (f.required && !f.value.trim()) msg = 'Completa este campo para continuar.';
        else if (f.type === 'email' && f.value && !f.checkValidity()) msg = 'Revisa el formato del correo, por ejemplo nombre@dominio.cl.';
        showError(f, msg);
        if (msg && !firstInvalid) firstInvalid = f;
      }
      if (firstInvalid) { firstInvalid.focus(); status.textContent = 'Revisa los campos marcados.'; return; }
      const d = Object.fromEntries(new FormData(form));
      const subject = `Contacto web — ${d.nombre} ${d.apellido}`.trim();
      const body = `${d.mensaje}\n\n${d.nombre} ${d.apellido}\n${d.correo}`;
      status.textContent = 'Abriendo tu aplicación de correo…';
      window.location.href = `mailto:contacto@afyvlegal.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    $$('input, textarea', form).forEach((f) => f.addEventListener('input', () => {
      if (f.getAttribute('aria-invalid') === 'true') showError(f, '');
    }));
  });

  /* ───── Chart tooltips (hover and keyboard focus) ───── */
  $$('[data-chart]').forEach((chart) => {
    const tip = $('.chart__tip', chart);
    const show = (seg, x, y) => {
      const [label, value] = seg.dataset.tip.split('|');
      tip.querySelector('strong').textContent = value;
      tip.querySelector('span').textContent = label;
      const r = chart.getBoundingClientRect();
      if (x === undefined) { const s = seg.getBoundingClientRect(); x = s.left + s.width / 2; y = s.top; }
      tip.style.left = `${Math.min(Math.max(x - r.left, 90), r.width - 90)}px`;
      tip.style.top = `${y - r.top}px`;
      tip.hidden = false;
    };
    $$('.seg', chart).forEach((seg) => {
      seg.addEventListener('pointermove', (e) => show(seg, e.clientX, e.clientY));
      seg.addEventListener('focus', () => show(seg));
      seg.addEventListener('pointerleave', () => { tip.hidden = true; });
      seg.addEventListener('blur', () => { tip.hidden = true; });
    });
  });

  /* ───── Pointer niceties (fine pointers, full motion) ───── */
  if (finePointer && !reduce) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, [data-cursor]'));
    });

    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('.tile').forEach((t) => t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`);
      t.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  }

  /* ───── Gentle 3D tilt on cards (fine pointers) ───── */
  if (finePointer && !reduce) {
    $$('[data-tilt]').forEach((card) => {
      let raf = 0;
      card.addEventListener('pointermove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateZ(0)`;
        });
      });
      card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); card.style.transition = 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms ease'; card.style.transform = ''; setTimeout(() => { card.style.transition = ''; }, 600); });
    });
  }

  /* ───── Page curtain ───── */
  const curtain = $('.curtain');
  const count = $('[data-count]');
  const lift = () => {
    if (!curtain || !hasGsap || reduce) { root.classList.remove('is-loading'); return Promise.resolve(); }
    return new Promise((resolve) => {
      const first = !sessionStorage.getItem('afyv-visited');
      try { sessionStorage.setItem('afyv-visited', '1'); } catch (e) { /* storage unavailable */ }
      const tl = gsap.timeline({ onComplete: () => { root.classList.remove('is-loading'); gsap.set(curtain, { clearProps: 'clipPath' }); resolve(); } });
      if (first && count) {
        const c = { v: 0 };
        tl.to(c, { v: 100, duration: 0.9, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(c.v)).padStart(3, '0'); } });
      }
      tl.fromTo(curtain, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut' });
    });
  };
  // Cover the page before leaving to another internal page
  if (curtain && hasGsap && !reduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target && a.target !== '_self') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || a.hasAttribute('download') || url.protocol.startsWith('mailto')) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      if (count) count.textContent = '';
      gsap.fromTo(curtain, { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.inOut',
        onComplete: () => { location.href = url.href; },
      });
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(curtain, { clipPath: 'inset(100% 0% 0% 0%)' }); });
  }

  /* ───── Tarifario: filter by line and toggle VAT ───── */
  const grid = $('[data-svc-grid]');
  if (grid) {
    if (hasGsap && window.Flip) gsap.registerPlugin(Flip);
    const cards = $$('.svc-card', grid);
    const buttons = $$('[data-filter]');
    const status = $('[data-tarifa-status]');
    const applyFilter = (key, animate = true) => {
      const state = animate && !reduce && window.Flip ? Flip.getState(cards) : null;
      buttons.forEach((b) => { const on = b.dataset.filter === key; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
      let shown = 0;
      cards.forEach((c) => { const show = key === 'all' || c.dataset.line === key; c.hidden = !show; if (show) shown += 1; });
      if (status) status.textContent = `${shown} servicios`;
      if (state) Flip.from(state, { duration: 0.6, ease: 'expo.out', scale: true, absolute: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5 }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }) });
    };
    buttons.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
    const syncHash = (animate) => {
      const key = location.hash.slice(1);
      if (buttons.some((b) => b.dataset.filter === key)) applyFilter(key, animate);
    };
    syncHash(false);
    window.addEventListener('hashchange', () => syncHash(true));

    const iva = $('.iva');
    const nf = new Intl.NumberFormat('es-CL');
    $$('[data-iva]').forEach((b) => b.addEventListener('click', () => {
      const mode = b.dataset.iva;
      iva.dataset.mode = mode;
      $$('[data-iva]').forEach((o) => { const on = o === b; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', String(on)); });
      $$('.price__num').forEach((n) => {
        const to = Number(mode === 'gross' ? n.dataset.gross : n.dataset.net);
        if (hasGsap && !reduce) {
          const from = Number(n.textContent.replace(/\D/g, '')) || 0;
          const o = { v: from };
          gsap.to(o, { v: to, duration: 0.7, ease: 'power3.out', onUpdate: () => { n.textContent = `$${nf.format(Math.round(o.v))}`; } });
        } else n.textContent = `$${nf.format(to)}`;
      });
      if (status) status.textContent = mode === 'gross' ? 'Precios con IVA' : 'Precios sin IVA';
    }));
  }

  /* Final (static) state of the illustrative scenes: used without GSAP or with reduced motion */
  const finalState = () => {
    $$('.doc').forEach((d) => { d.dataset.state = '3'; d.classList.add('is-verified', 'is-signed', 'is-noted', 'is-added'); });
    $$('.doc__line').forEach((l) => l.classList.add(l.classList.contains('doc__line--bad') ? 'is-struck' : 'is-ok'));
    $$('.doc__check, .checklist li').forEach((c) => c.classList.add('is-on'));
    $$('.review__step').forEach((s, i, a) => s.classList.toggle('is-active', i === a.length - 1));
    $$('.limit').forEach((l) => l.classList.add('is-locked'));
    $$('.clause').forEach((c) => c.classList.add('is-signed'));
    $$('[data-signed-count]').forEach((b) => { b.textContent = String($$('.clause', b.closest('[data-clauses]')).length); });
    $$('.clauses__rail span').forEach((r) => { r.style.transform = 'scaleY(1)'; });
    $$('.hero__ul path').forEach((p) => { p.style.strokeDashoffset = '0'; });
    $$('[data-consent-box]').forEach((b) => b.classList.add('is-on'));
  };

  /* ───── Scroll choreography ───── */
  if (!hasGsap || reduce) {
    $$('.method').forEach((m) => m.classList.add('no-pin'));
    finalState();
    lift();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  ['ScrambleTextPlugin', 'DrawSVGPlugin', 'Flip'].forEach((n) => { if (window[n]) gsap.registerPlugin(window[n]); });
  const ease = 'expo.out';

  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  ready.then(() => {
    const intro = gsap.timeline({ paused: true });

    // Lines rising out of masks
    $$('[data-split]').forEach((el) => {
      if (!window.SplitText) return;
      const inHero = !!el.closest('[data-intro]');
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit(self) {
          const tween = gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.25,
            ease,
            stagger: 0.09,
            paused: inHero,
            scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
          });
          if (inHero) intro.add(tween.play(), el.closest('.hero--v3') ? 0.75 : 0.1);
          return tween;
        },
      });
    });

    // Fade-up for everything else
    $$('[data-reveal]').forEach((el) => {
      const inHero = !!el.closest('[data-intro]');
      const tween = gsap.from(el, {
        y: 28, autoAlpha: 0, duration: 1.1, ease, delay: (Number(el.dataset.reveal) || 0) * 0.08,
        paused: inHero,
        scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 90%', once: true },
      });
      if (inHero) intro.add(tween.play(), 0.45 + (Number(el.dataset.reveal) || 0) * 0.08);
    });

    // Hero drifts away on scroll
    $$('[data-intro] .hero__inner').forEach((inner) => {
      gsap.to(inner, { yPercent: -18, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: inner.closest('[data-intro]'), start: 'top top', end: 'bottom top', scrub: true } });
    });

    // Manifesto words light up with scroll
    $$('[data-words], [data-words-light]').forEach((el) => {
      if (!window.SplitText) return;
      SplitText.create(el, {
        type: 'words',
        wordsClass: 'word',
        autoSplit: true,
        onSplit(self) {
          return gsap.to(self.words, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } });
        },
      });
    });

    // Stacked cards: each card sinks back as the next one arrives
    const cards = $$('.stack-card');
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (next) {
        gsap.matchMedia().add('(min-width: 60em)', () => {
          gsap.to(card, { scale: 0.95, filter: 'brightness(0.82)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true } });
        });
      }
      const paths = $$('.draw', card);
      paths.forEach((p) => { const len = p.getTotalLength ? p.getTotalLength() : 600; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
      if (paths.length) gsap.to(paths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.12, scrollTrigger: { trigger: card, start: 'top 70%', once: true } });
      const glows = $$('.art-glow', card);
      if (glows.length) gsap.from(glows, { scale: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)', stagger: 0.08, delay: 0.8, scrollTrigger: { trigger: card, start: 'top 70%', once: true } });
    });

    // Areas: rows slide in from the right edge
    $$('.area').forEach((row) => {
      gsap.from(row.querySelector('.area__name'), { xPercent: 6, autoAlpha: 0, duration: 1.2, ease, scrollTrigger: { trigger: row, start: 'top 92%', once: true } });
    });

    // Parallax media
    $$('[data-speed]').forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.speed) * -10, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.post-card__media img, .member__media img').forEach((img) => {
      gsap.fromTo(img, { clipPath: 'inset(12% 12% 12% 12% round 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease, scrollTrigger: { trigger: img, start: 'top 92%', once: true } });
    });

    // Data: bars grow from the baseline, figures count up
    const nf = new Intl.NumberFormat('es-CL');
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = nf.format(Math.round(o.v)); } });
    });
    $$('[data-bar]').forEach((bar, i) => {
      gsap.from(bar, { scaleX: 0, duration: 1.4, ease: 'expo.out', delay: (i % 3) * 0.08, scrollTrigger: { trigger: bar, start: 'top 92%', once: true } });
    });

    const mm = gsap.matchMedia();

    // Horizontal team gallery (desktop): vertical scroll drives the track
    mm.add('(min-width: 60em)', () => {
      $$('[data-hscroll]').forEach((sec) => {
        const track = $('.hscroll__track', sec);
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, refreshPriority: -1 },
        });
      });
    });
    mm.add('(max-width: 59.99em)', () => {
      $$('[data-hscroll]').forEach((sec) => { sec.style.overflowX = 'auto'; });
      return () => $$('[data-hscroll]').forEach((sec) => { sec.style.overflowX = ''; });
    });

    // Method: pinned stage, one step at a time (desktop); stacked list on small screens
    mm.add('(min-width: 60em)', () => {
      $$('.method').forEach((m) => {
        const steps = $$('.method__step', m);
        const plates = $$('.plate', m);
        const bar = $('.method__progress span', m);
        const platesWrap = $('.method__plates', m);
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 });
        const setActive = (i) => {
          plates.forEach((p, n) => p.classList.toggle('is-active', n === i));
          steps.forEach((s, n) => s.setAttribute('aria-hidden', String(n !== i)));
        };
        setActive(0);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: m, start: 'top top', end: `+=${steps.length * 90}%`, pin: true, scrub: 0.6,
            onUpdate: (st) => setActive(Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999))),
          },
        });
        tl.fromTo(platesWrap, { rotateZ: -38, rotateX: 58 }, { rotateZ: -18, rotateX: 52, ease: 'none', duration: steps.length }, 0);
        tl.fromTo(bar, { scaleX: 1 / steps.length }, { scaleX: 1, ease: 'none', duration: steps.length }, 0);
        steps.forEach((s, i) => {
          if (i === 0) return;
          tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, i - 0.35)
            .to(s, { autoAlpha: 1, y: 0, duration: 0.3 }, i - 0.15);
        });
        plates.forEach((p, i) => tl.fromTo(p, { z: (i - 1) * -60 }, { z: (i - 1) * -140, ease: 'none', duration: steps.length }, 0));
        return () => { gsap.set(steps, { clearProps: 'all' }); };
      });
    });
    mm.add('(max-width: 59.99em)', () => {
      $$('.method').forEach((m) => m.classList.add('no-pin'));
      return () => $$('.method').forEach((m) => m.classList.remove('no-pin'));
    });

    // Reasons: big counter rolls to the reason in view
    $$('[data-reasons]').forEach((wrap) => {
      const roll = $('.reasons__num-roll', wrap);
      $$('.reason', wrap).forEach((r, i) => {
        ScrollTrigger.create({ trigger: r, start: 'top 55%', end: 'bottom 55%', onToggle: (st) => { if (st.isActive && roll) roll.style.transform = `translateY(${-i}em)`; } });
      });
    });

    // Footer wordmark rises letter by letter as the page ends
    $$('.footer__mark').forEach((mark) => {
      gsap.from($$('span', mark), { yPercent: 100, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: true } });
    });

    // Reading progress
    const bar = $('.progress span');
    if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.article-body', start: 'top 30%', end: 'bottom bottom', scrub: true } });

    /* ── AFyV 2.0 choreography ── */
    const scramble = (el, opts = {}) => {
      const text = el.dataset.text || el.textContent;
      el.dataset.text = text;
      if (!window.ScrambleTextPlugin) return gsap.from(el, { autoAlpha: 0, duration: 0.6, ...opts });
      return gsap.fromTo(el, { scrambleText: { text: ' ' } }, { scrambleText: { text, chars: '01§·/ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: 0.6, revealDelay: 0.15 }, duration: 1.1, ease: 'none', ...opts });
    };
    const draw = (path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      return len;
    };

    // Hero: the machine types, the lawyer signs
    $$('[data-type-intro]').forEach((el) => { intro.add(scramble(el, { paused: true }).play(), 0); });
    $$('[data-sign-intro]').forEach((wrap) => {
      const path = $('.sign__path', wrap);
      const sealEl = $('.seal', wrap);
      if (path) { const len = draw(path); intro.to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 1.3); }
      intro.from($('.mono', wrap), { autoAlpha: 0, duration: 0.6 }, 1.6);
      if (sealEl) intro.from(sealEl, { scale: 1.8, rotate: -40, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.2)' }, 2.6);
    });

    // Mono labels decode when they enter
    $$('[data-scramble]').forEach((el) => {
      if (el.closest('[data-intro]')) { intro.add(scramble(el, { paused: true }).play(), 0.3); return; }
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => scramble(el) });
    });
    $$('[data-type]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => scramble(el, { duration: 1.4 }) });
    });

    // Hero: the key word gets underlined by hand
    $$('.hero__ul path').forEach((p) => { intro.to(p, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 1.15); });

    // Clauses: a margin rail follows the reader; each clause is underlined and stamped, and the counter ticks
    $$('[data-clauses]').forEach((paper) => {
      const rail = $('.clauses__rail span', paper);
      const count = $('[data-signed-count]', paper);
      let signed = 0;
      if (rail) gsap.to(rail, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: paper, start: 'top 75%', end: 'bottom 65%', scrub: 0.5 } });
      $$('.clause', paper).forEach((c) => {
        gsap.from($$('.clause__n, .clause__t, p', c), { y: 22, autoAlpha: 0, duration: 0.9, ease, stagger: 0.08, scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
        ScrollTrigger.create({ trigger: c, start: 'top 70%', once: true, onEnter: () => {
          c.classList.add('is-signed');
          setTimeout(() => {
            signed += 1;
            if (!count) return;
            count.textContent = String(signed);
            gsap.fromTo(count, { yPercent: -60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)' });
          }, 800);
        } });
      });
    });

    // IA access card: a soft light follows the pointer
    $$('.ia-cta').forEach((card) => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    // Team: the word rises letter by letter
    $$('[data-letters]').forEach((el) => {
      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.innerHTML = [...text].map((ch) => `<span class="ch" aria-hidden="true">${ch}</span>`).join('');
      gsap.from($$('.ch', el), { yPercent: 110, rotate: 6, ease: 'power3.out', stagger: 0.06, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Limits lock
    $$('.limit').forEach((l, i) => {
      ScrollTrigger.create({ trigger: l, start: 'top 85%', once: true, onEnter: () => setTimeout(() => l.classList.add('is-locked'), 200 + (i % 5) * 120) });
    });

    // Mini flow: the line draws and the stages light up in order
    $$('[data-flow-mini]').forEach((f) => {
      const path = $('.flowmini__line path', f);
      const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 80%', once: true } });
      if (path) { draw(path); tl.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0); }
      tl.from($$('.flowmini__node', f), { y: 20, autoAlpha: 0, duration: 0.7, ease, stagger: 0.12 }, 0.1)
        .from($$('.flowmini__dot', f), { scale: 0.3, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.12 }, 0.1)
        .from($$('.flowmini__notes p', f), { autoAlpha: 0, x: -12, duration: 0.6, stagger: 0.15 }, 1.2);
    });

    // Review scene: everything is a pure function of progress, so scrubbing works both ways
    $$('[data-review]').forEach((sec) => {
      const doc = $('.doc', sec);
      const lines = $$('.doc__line', sec);
      const good = lines.filter((l) => !l.classList.contains('doc__line--bad') && !l.classList.contains('doc__line--new'));
      const bad = $('.doc__line--bad', sec);
      const checks = $$('.doc__check', sec);
      const steps = $$('.review__step', sec);
      const sig = $('.doc__sign .sign__path', sec);
      const sigLen = sig ? draw(sig) : 0;
      const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
      const render = (p) => {
        lines.forEach((l, i) => { if (l.classList.contains('doc__line--new')) return; const r = seg(p, 0.02 + i * 0.05, 0.08 + i * 0.05); l.style.opacity = String(0.15 + 0.85 * r); l.style.transform = `translateY(${(1 - r) * 8}px)`; });
        const state = p < 0.24 ? 0 : p < 0.5 ? 1 : p < 0.78 ? 2 : 3;
        doc.dataset.state = String(state);
        steps.forEach((s, i) => s.classList.toggle('is-active', i === state));
        doc.classList.toggle('is-noted', p >= 0.28 && p < 0.62);
        doc.classList.toggle('is-added', p >= 0.36);
        doc.classList.toggle('is-verified', p >= 0.5);
        good.forEach((l, i) => l.classList.toggle('is-ok', p >= 0.54 + i * 0.05));
        if (bad) bad.classList.toggle('is-struck', p >= 0.58);
        checks.forEach((c, i) => c.classList.toggle('is-on', p >= 0.55 + i * 0.045));
        if (sig) sig.style.strokeDashoffset = String(sigLen * (1 - seg(p, 0.8, 0.93)));
        doc.classList.toggle('is-signed', p >= 0.95);
      };
      render(0);
      const m = gsap.matchMedia();
      m.add('(min-width: 60em)', () => {
        ScrollTrigger.create({ trigger: sec, start: 'top top', end: '+=280%', pin: true, scrub: 0.4, onUpdate: (st) => render(st.progress) });
      });
      m.add('(max-width: 59.99em)', () => {
        const o = { p: 0 };
        const t = gsap.to(o, { p: 1, duration: 6, ease: 'none', paused: true, onUpdate: () => render(o.p) });
        ScrollTrigger.create({ trigger: doc, start: 'top 75%', once: true, onEnter: () => t.play() });
      });
    });

    // IA page: the nine stages, pinned and driven by scroll on desktop
    $$('[data-flow]').forEach((sec) => {
      const cards = $$('.flow__card', sec);
      const nodes = $$('.flow__node', sec);
      const fill = $('.flow__fill', sec);
      const m = gsap.matchMedia();
      m.add('(min-width: 60em)', () => {
        gsap.set(cards.slice(1), { autoAlpha: 0, y: 30 });
        let current = 0;
        const show = (i) => {
          if (i === current) return;
          gsap.to(cards[current], { autoAlpha: 0, y: i > current ? -30 : 30, duration: 0.35, ease: 'power2.in', overwrite: true });
          gsap.fromTo(cards[i], { autoAlpha: 0, y: i > current ? 30 : -30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease, overwrite: true });
          current = i;
        };
        ScrollTrigger.create({
          trigger: sec, start: 'top top', end: `+=${cards.length * 55}%`, pin: true, scrub: true,
          onUpdate: (st) => {
            const i = Math.min(cards.length - 1, Math.floor(st.progress * cards.length));
            show(i);
            gsap.set(fill, { scaleX: st.progress });
            nodes.forEach((n, k) => { n.classList.toggle('is-active', k === i); n.classList.toggle('is-done', k < i); });
          },
        });
        return () => gsap.set(cards, { clearProps: 'all' });
      });
    });

    // Verification checklist ticks with scroll
    $$('[data-checklist]').forEach((list) => {
      const items = $$('li', list);
      ScrollTrigger.create({ trigger: list, start: 'top 70%', end: 'bottom 55%', scrub: true, onUpdate: (st) => items.forEach((it, i) => it.classList.toggle('is-on', st.progress >= (i + 0.5) / items.length)) });
    });

    // Consent: the AI box gets ticked
    $$('[data-consent-box]').forEach((b) => {
      ScrollTrigger.create({ trigger: b, start: 'top 70%', once: true, onEnter: () => setTimeout(() => b.classList.add('is-on'), 600) });
    });

    // Vault files slide apart
    $$('.vault__fig').forEach((v) => {
      gsap.from($$('.vault__file', v), { y: (i) => -(i * 60), rotateX: 50, autoAlpha: 0, duration: 1.2, ease, stagger: 0.15, scrollTrigger: { trigger: v, start: 'top 80%', once: true } });
    });

    // Lists inside the versus columns
    $$('.versus__col').forEach((col) => {
      gsap.from($$('li', col), { x: col.matches(':last-child') ? 20 : -20, autoAlpha: 0, duration: 0.8, ease, stagger: 0.08, scrollTrigger: { trigger: col, start: 'top 80%', once: true } });
    });

    // Hero frame: hairlines draw in, corners decode
    $$('.frame').forEach((f) => {
      intro.fromTo($$('.frame__l--t, .frame__l--b', f), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0)
        .fromTo($$('.frame__l--l, .frame__l--r', f), { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: 'expo.inOut' }, 0.15);
    });

    // Ribbon: constant drift that speeds up and leans with scroll velocity
    $$('[data-ribbon]').forEach((track) => {
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
      let boost = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: 'power3.out' });
      let skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
      ScrollTrigger.create({ trigger: track, start: 'top bottom', end: 'bottom top', onUpdate: (st) => {
        const v = st.getVelocity() / 600;
        boost(1 + Math.min(4, Math.abs(v)) * Math.sign(v || 1));
        skew(Math.max(-6, Math.min(6, -v * 1.2)));
        clearTimeout(track._t); track._t = setTimeout(() => { boost(1); skew(0); }, 140);
      } });
    });

    // Line art and glyphs draw themselves when their card appears
    $$('.virtue, .line-card, .secret__card, .rules').forEach((card) => {
      const paths = $$('.g, .draw', card).filter((p) => p.getTotalLength);
      if (!paths.length) return;
      paths.forEach((p) => draw(p));
      gsap.to(paths, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.06, scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
    });

    // Organic flow: the wave draws with scroll and each stage lights up as it is reached
    $$('[data-flowo]').forEach((f) => {
      const path = $('.flowo__path', f);
      const nodes = $$('.flowo__node', f);
      const steps = $$('.flowo__step', f);
      gsap.from(steps, { y: 24, autoAlpha: 0, duration: 1, ease, stagger: 0.1, scrollTrigger: { trigger: f, start: 'top 80%', once: true } });
      if (!path || !path.getTotalLength) return;
      const len = draw(path);
      gsap.set(nodes, { scale: 0.4, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: f, start: 'top 80%', end: 'bottom 55%', scrub: 0.6,
        onUpdate: (st) => {
          path.style.strokeDashoffset = String(len * (1 - st.progress));
          nodes.forEach((nd, i) => {
            const on = st.progress >= (i + 0.3) / nodes.length;
            if (nd._on !== on) { nd._on = on; gsap.to(nd, { scale: on ? 1 : 0.4, autoAlpha: on ? 1 : 0, duration: 0.5, ease: on ? 'back.out(2.2)' : 'power2.in' }); }
          });
        },
      });
    });

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    lift().then(() => intro.play());
  });

  // Safety net: never leave the curtain down
  setTimeout(() => root.classList.remove('is-loading'), 4000);
})();
