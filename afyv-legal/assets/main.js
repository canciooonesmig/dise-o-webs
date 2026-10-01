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

  /* ───── Scroll choreography ───── */
  if (!hasGsap || reduce) {
    $$('.method').forEach((m) => m.classList.add('no-pin'));
    lift();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
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
          if (inHero) intro.add(tween.play(), 0.1);
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
    $$('[data-words]').forEach((el) => {
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
          gsap.to(card, { scale: 0.92, filter: 'brightness(0.55)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true } });
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
          scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
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

    ScrollTrigger.refresh();
    lift().then(() => intro.play());
  });

  // Safety net: never leave the curtain down
  setTimeout(() => root.classList.remove('is-loading'), 4000);
})();
