(() => {
  const root = document.documentElement;

  /* Header: hairline once the page scrolls */
  const onScroll = () => root.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Header brand appears once the hero wordmark leaves the viewport */
  const heroMark = document.querySelector('[data-hero-mark]');
  if (heroMark && 'IntersectionObserver' in window) {
    root.classList.add('has-hero-mark');
    new IntersectionObserver(([entry]) => {
      root.classList.toggle('show-brand', !entry.isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(heroMark);
  }

  /* Mobile menu */
  const menuBtn = document.querySelector('[data-menu-btn]');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    const setOpen = (open) => {
      root.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('[data-menu-label]').textContent = open ? 'Cerrar' : 'Menú';
      menu.inert = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) menu.querySelector('a')?.focus();
    };
    menu.inert = true;
    menuBtn.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) {
        setOpen(false);
        menuBtn.focus();
      }
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    window.matchMedia('(min-width: 60.0625em)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* Reveal on scroll */
  const revealables = document.querySelectorAll('[data-reveal], .cascade, .feature');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  /* Method: scrolling steps drive the layered figure */
  const method = document.querySelector('[data-method]');
  if (method && 'IntersectionObserver' in window) {
    const svg = method.querySelector('.method__svg');
    const plates = method.querySelectorAll('.plate');
    const steps = [...method.querySelectorAll('.method__step')];
    method.classList.add('method--enhanced');
    const activate = (i) => {
      svg.dataset.step = String(i);
      plates.forEach((p, n) => p.classList.toggle('is-active', n === i));
      steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
    };
    activate(0);
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) visible.set(entry.target, entry.intersectionRatio);
      let best = 0;
      let bestRatio = -1;
      steps.forEach((s, n) => {
        const r = visible.get(s) ?? 0;
        if (r > bestRatio) { bestRatio = r; best = n; }
      });
      if (bestRatio > 0) activate(best);
    }, { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    steps.forEach((s) => io.observe(s));
    steps.forEach((s, n) => s.addEventListener('focusin', () => activate(n)));
  }

  /* Contact form → opens the visitor's email client with the message prefilled */
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const showError = (field, msg) => {
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = document.getElementById(field.getAttribute('aria-describedby'));
      if (err) err.textContent = msg;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input, textarea')];
      let firstInvalid = null;
      for (const f of fields) {
        let msg = '';
        if (f.required && !f.value.trim()) msg = 'Completa este campo para continuar.';
        else if (f.type === 'email' && f.value && !f.checkValidity()) msg = 'Revisa el formato del correo, por ejemplo nombre@dominio.cl.';
        showError(f, msg);
        if (msg && !firstInvalid) firstInvalid = f;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        status.textContent = 'Revisa los campos marcados.';
        return;
      }
      const data = Object.fromEntries(new FormData(form));
      const subject = `Contacto web — ${data.nombre} ${data.apellido}`.trim();
      const body = `${data.mensaje}\n\n${data.nombre} ${data.apellido}\n${data.correo}`;
      status.textContent = 'Abriendo tu aplicación de correo…';
      window.location.href = `mailto:contacto@afyvlegal.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    form.querySelectorAll('input, textarea').forEach((f) => {
      f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') showError(f, ''); });
    });
  });

  /* Pause infinite rails when off-screen (saves work, avoids motion nobody sees) */
  if ('IntersectionObserver' in window) {
    const rails = document.querySelectorAll('.marquee__track, .team-rail__track');
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
      }
    });
    rails.forEach((r) => io.observe(r));
  }

})();
