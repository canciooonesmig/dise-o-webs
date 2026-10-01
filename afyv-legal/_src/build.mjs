// Generates the static AFyV Legal site from the content in this folder.
// Usage: node afyv-legal/_src/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, '..');
const read = (p) => readFileSync(join(SRC, p), 'utf8');

const SITE = {
  name: 'AFyV Legal',
  url: 'https://www.afyvlegal.com',
  email: 'contacto@afyvlegal.com',
  phone: '+56 9 8171 4111',
  whatsapp: 'https://wa.me/56981714111',
  instagram: 'https://www.instagram.com/afyvlegal/',
  linkedin: 'https://www.linkedin.com/company/afyvlegal',
  city: 'Santiago, Chile.',
};

const NAV = [
  { href: 'index.html', label: 'Inicio', key: 'inicio' },
  { href: 'servicios.html', label: 'Servicios', key: 'servicios' },
  { href: 'blog.html', label: 'Blog', key: 'blog' },
  { href: 'equipo.html', label: 'Equipo', key: 'equipo' },
  { href: 'terminos-y-condiciones.html', label: 'Avisos Legales', key: 'legal' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const chars = (word) => [...word].map((c, i) => `<span class="wordmark__char" style="--i:${i}">${esc(c)}</span>`).join('');
const spread = (word) => [...word].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
const cascadeDown = (word) => [...word].map((_, i) => `<li style="--i:${i}">${esc(word.slice(i))}</li>`).join('');
const cascadeUp = (word) => [...word].map((_, i) => `<li style="--i:${i}">${esc(word.slice(0, i + 1))}</li>`).join('');

const ICON = {
  arrow: '<svg class="btn__arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.1 8.1c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.5.9 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .5-.2 1.1-.6 1.4-.5.4-1.2.6-2 .4a8.2 8.2 0 0 1-5.2-4.6c-.4-1-.3-1.9.2-2.5Z" fill="currentColor"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 9h3v10.5h-3zM6 4.2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM10 9h2.9v1.5c.4-.8 1.5-1.7 3.1-1.7 3.2 0 3.8 2.1 3.8 4.8v5.9h-3v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8v5.3h-3z" fill="currentColor"/></svg>',
};

/* ───────────── Content ───────────── */

const AREAS = ['Derecho Civil', 'Derecho Laboral', 'Derecho Público', 'Prescripción de Deudas'];

const TEAM = [
  {
    slug: 'matias-araos',
    name: 'Matías Araos',
    area: 'Derecho Civil y Derecho Corporativo',
    img: 'matias.webp',
    bio: ['Matías cuenta con experiencia en materias corporativas, civiles y penales, desarrollada tanto en estudios jurídicos como en organismos públicos.'],
    exp: ['AFyV Legal', 'MGA Abogados', 'Servicio Jesuita a Migrantes', 'Defensoría Penal Pública'],
  },
  {
    slug: 'rosario-soto',
    name: 'Rosario Soto',
    area: 'Derecho Público',
    img: 'rosario.webp',
    bio: ['Rosario cuenta con experiencia en derecho corporativo, inmobiliario, civil, laboral y concursal. Destaca por su enfoque innovador respaldado por sus conocimientos en Legal <em>Design Thinking</em>, lo que le permite automatizar procesos y simplificar el lenguaje jurídico para los clientes. Con experiencia previa como Subgerente Legal y líder de equipos, aporta un análisis legal estratégico, gran capacidad de gestión de crisis y un fuerte compromiso con el cumplimiento normativo.'],
    exp: ['Legal Broker', 'Lexy', 'Curaduría Ad Litem', 'G&amp;M Asesorías'],
  },
  {
    slug: 'alberto-vargas',
    name: 'Alberto Vargas',
    area: 'Derecho Corporativo',
    img: 'alberto.webp',
    bio: ['Alberto posee experiencia en materias corporativas, regulatorias y societarias, desarrollada en el sector financiero y en organizaciones jurídicas.'],
    exp: ['AFyV Legal', 'AFP Capital', 'Corporación Comunidad y Justicia'],
  },
  {
    slug: 'gabriel-freulon',
    name: 'Gabriel Freulon',
    area: 'Derecho Civil y Derecho Laboral',
    img: 'gabriel.webp',
    bio: ['Gabriel ha orientado su ejercicio hacia el Derecho Civil y Laboral. Destacando por un enfoque práctico y riguroso en la resolución de asuntos legales.'],
    exp: ['AFyV Legal'],
  },
];

const POSTS = [
  { slug: 'compraventa-de-estacionamientos-en-chile', file: 'post-estacionamientos', title: 'Compraventa de Estacionamientos en Chile', author: 'Bianca Carrasco', avatar: 'autor-bianca.webp', date: '25 jun', read: '7 min de lectura' },
  { slug: 'simulacion-de-contratos', file: 'post-simulacion', title: 'Simulación de contratos', author: 'Matías Araos', avatar: 'autor-matias.webp', date: '10 jun', read: '5 min de lectura' },
  { slug: 'sobre-la-liquidacion-simplificada', file: 'post-liquidacion', title: 'Sobre la Liquidación Simplificada', author: 'Matías Araos', avatar: 'autor-matias.webp', date: '4 jun', read: '3 min de lectura' },
  { slug: 'arriendas-tu-propiedad-tu-inquilino-no-paga', file: 'post-arriendo', title: 'Arriendas tu propiedad: ¿tu inquilino no paga?', author: 'Matías Araos', avatar: 'autor-matias.webp', date: '3 jun', read: '2 min de lectura' },
  { slug: 'interdiccion-por-demencia-y-nombramiento-de-curador', file: 'post-interdiccion', title: 'Interdicción por demencia y nombramiento de curador', author: 'Matías Araos', avatar: 'autor-matias.webp', date: '2 jun', read: '2 min de lectura' },
  { slug: 'filiacion-tu-derecho-a-la-identidad-familiar', file: 'post-filiacion', title: 'Filiación: tu derecho a la identidad familiar', author: 'Matías Araos', avatar: 'autor-matias.webp', date: '2 jun', read: '4 min de lectura' },
].map((p) => {
  const raw = read(`content/${p.file}.html`);
  const first = (raw.match(/<p>([\s\S]*?)<\/p>/) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
  return { ...p, html: raw, excerpt: first };
});

/* ───────────── Layout ───────────── */

function prose(html) {
  const isCaps = (t) => {
    const letters = [...t].filter((c) => /\p{L}/u.test(c));
    return letters.length > 3 && letters.filter((c) => c === c.toUpperCase() && c !== c.toLowerCase()).length / letters.length > 0.85;
  };
  return html
    .replace(/<h2>([\s\S]*?)<\/h2>/g, (m, inner) => {
      const text = inner.replace(/<[^>]+>/g, '');
      return isCaps(text) ? `<h2 class="caps">${inner}</h2>` : m;
    })
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<a href="(https?:)?\/\/(www\.)?afyvlegal\.com\/?">/g, '<a href="index.html">');
}

function header(active, depth, hasContact = true) {
  const p = '../'.repeat(depth);
  const contactHref = hasContact ? '#contacto' : `${p}index.html#contacto`;
  const links = NAV.map((n) => `<li><a class="nav__link" href="${p}${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  const mlinks = NAV.map((n) => `<li><a href="${p}${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="topbar" aria-hidden="true"></div>
<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="${p}index.html" aria-label="AFyV Legal, inicio">AFyV</a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav__list">${links}</ul>
      <a class="btn btn--sm" href="${contactHref}">Contáctanos</a>
    </nav>
    <button class="menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="mobile-menu">
      <span data-menu-label>Menú</span><span class="menu-btn__icon" aria-hidden="true"></span>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu">
  <nav aria-label="Principal (móvil)"><ul class="mobile-menu__list">${mlinks}</ul></nav>
  <a class="btn" href="${contactHref}">Contáctanos</a>
</div>`;
}

function contact({ title = '¡Contáctanos!', lede = '' } = {}) {
  return `<section class="contact on-ink" id="contacto" aria-labelledby="contacto-title">
  <div class="wrap contact__grid">
    <div>
      <h2 class="contact__title" id="contacto-title" data-reveal>${title}</h2>
      ${lede ? `<p class="lede" data-reveal style="--i:1">${lede}</p>` : ''}
      <ul class="contact__details" data-reveal style="--i:2">
        <li><span>Oficina</span><p>${SITE.city}</p></li>
        <li><span>Correo</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li><span>Teléfono</span><a href="${SITE.whatsapp}" rel="noopener">${SITE.phone.replace(/ /g, '&nbsp;')}</a></li>
      </ul>
      <div class="social" data-reveal style="--i:3;margin-top:2rem">
        <a href="${SITE.instagram}" rel="noopener" aria-label="Instagram de AFyV Legal">${ICON.instagram}</a>
        <a href="${SITE.whatsapp}" rel="noopener" aria-label="WhatsApp de AFyV Legal">${ICON.whatsapp}</a>
        <a href="${SITE.linkedin}" rel="noopener" aria-label="LinkedIn de AFyV Legal">${ICON.linkedin}</a>
      </div>
    </div>
    <form class="form" data-contact-form novalidate action="mailto:${SITE.email}" method="post" enctype="text/plain">
      <div class="form__row">
        <div class="field">
          <label for="f-nombre">Nombre</label>
          <input id="f-nombre" name="nombre" type="text" autocomplete="given-name" required aria-describedby="f-nombre-err" placeholder="Ej.: Camila…">
          <p class="field__error" id="f-nombre-err" aria-live="polite"></p>
        </div>
        <div class="field">
          <label for="f-apellido">Apellido</label>
          <input id="f-apellido" name="apellido" type="text" autocomplete="family-name" aria-describedby="f-apellido-err" placeholder="Ej.: Rojas…">
          <p class="field__error" id="f-apellido-err" aria-live="polite"></p>
        </div>
      </div>
      <div class="field">
        <label for="f-correo">Correo</label>
        <input id="f-correo" name="correo" type="email" inputmode="email" autocomplete="email" spellcheck="false" required aria-describedby="f-correo-err" placeholder="nombre@dominio.cl…">
        <p class="field__error" id="f-correo-err" aria-live="polite"></p>
      </div>
      <div class="field">
        <label for="f-mensaje">Mensaje</label>
        <textarea id="f-mensaje" name="mensaje" autocomplete="off" required aria-describedby="f-mensaje-err" placeholder="Cuéntanos brevemente tu caso…"></textarea>
        <p class="field__error" id="f-mensaje-err" aria-live="polite"></p>
      </div>
      <div class="form__actions">
        <button class="btn btn--light" type="submit">Enviar ${ICON.arrow}</button>
        <p class="form__status" data-form-status aria-live="polite"></p>
      </div>
    </form>
  </div>
</section>`;
}

function footer(depth) {
  const p = '../'.repeat(depth);
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__grid">
      <div class="site-footer__meta">
        <p style="margin:0">El Derecho cerca de ti.</p>
        <p style="margin:0">${SITE.city}</p>
        <a href="mailto:${SITE.email}">${SITE.email}</a>
        <a href="${SITE.whatsapp}" rel="noopener">${SITE.phone.replace(/ /g, '&nbsp;')}</a>
      </div>
      <ul class="site-footer__nav">
        ${NAV.slice(0, 4).map((n) => `<li><a href="${p}${n.href}">${n.label}</a></li>`).join('')}
      </ul>
      <ul class="site-footer__nav">
        <li><a href="${SITE.instagram}" rel="noopener">Instagram</a></li>
        <li><a href="${SITE.whatsapp}" rel="noopener">WhatsApp</a></li>
        <li><a href="${SITE.linkedin}" rel="noopener">LinkedIn</a></li>
      </ul>
    </div>
    <div class="site-footer__legal">
      <span>© ${new Date().getFullYear()} AFyV Legal</span>
      <a href="${p}terminos-y-condiciones.html">Términos y Condiciones</a>
      <a href="${p}politica-de-privacidad.html">Política de Privacidad</a>
    </div>
  </div>
  <p class="site-footer__mark wrap" aria-hidden="true">AFyV</p>
</footer>`;
}

function page({ file, title, description, active, depth = 0, body, heroMark = false, contactOpts, ogImage }) {
  const p = '../'.repeat(depth);
  const canonical = `${SITE.url}/${file.replace(/index\.html$/, '')}`;
  const html = `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#f6f2e8">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CL">
<meta property="og:site_name" content="AFyV Legal">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${ogImage ? `<meta property="og:image" content="${SITE.url}/assets/img/${ogImage}">` : ''}
<link rel="icon" href="${p}assets/img/logo.webp" type="image/webp">
<link rel="preload" href="${p}assets/fonts/newsreader-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${p}assets/fonts/geist-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${p}assets/fonts.css">
<link rel="stylesheet" href="${p}assets/styles.css">
<script>document.documentElement.classList.add('js')</script>
<script src="${p}assets/main.js" defer></script>
</head>
<body>
${header(active, depth, contactOpts !== false)}
<main id="contenido" tabindex="-1">
${body}
</main>
${contactOpts === false ? '' : contact(contactOpts)}
${footer(depth)}
</body>
</html>
`;
  mkdirSync(dirname(join(OUT, file)), { recursive: true });
  writeFileSync(join(OUT, file), html.replace(/\n\s*\n/g, '\n'));
  return file;
}

const postCard = (post, depth = 0, i = 0) => {
  const p = '../'.repeat(depth);
  return `<article class="post-card" data-reveal style="--i:${i}">
  <div class="post-card__media"><img src="${p}assets/img/${post.file}.webp" alt="" width="960" height="540" loading="lazy" decoding="async"></div>
  <div class="post-card__meta"><span>${post.author}</span><span>${post.date}</span><span>${post.read}</span></div>
  <h3 class="post-card__title"><a href="${p}blog/${post.slug}.html">${esc(post.title)}</a></h3>
  <p class="post-card__excerpt">${esc(post.excerpt)}</p>
</article>`;
};

const portrait = (m, depth = 0, hidden = false) => {
  const p = '../'.repeat(depth);
  return `<a class="portrait" href="${p}equipo.html#${m.slug}"${hidden ? ' tabindex="-1"' : ''}>
  <div class="portrait__media"><img src="${p}assets/img/${m.img}" alt="${hidden ? '' : `Retrato de ${m.name}`}" width="600" height="860" loading="lazy" decoding="async"></div>
  <p class="portrait__name">${m.name}</p>
  <p class="portrait__role">${m.area}</p>
</a>`;
};

/* ───────────── Pages ───────────── */

const built = [];

// Inicio
built.push(page({
  file: 'index.html',
  title: 'AFyV Legal — El Derecho cerca de ti',
  description: 'En AFyV acompañamos a personas y emprendedores en la resolución de asuntos jurídicos cotidianos y estratégicos. Asesoría en derecho civil, laboral, público y empresas. Santiago, Chile.',
  active: 'inicio',
  ogImage: 'logo.webp',
  body: `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap">
    <p class="wordmark" data-hero-mark aria-hidden="true">${chars('AFyV')}</p>
    <div class="hero__body">
      <span class="eyebrow" style="--i:0">Bienvenidos a AFyV</span>
      <h1 class="display hero__title" id="hero-title" style="--i:1">El Derecho cerca de ti</h1>
      <div class="hero__actions" style="--i:2">
        <a class="btn" href="servicios.html">Leer más ${ICON.arrow}</a>
        <a class="link-arrow" href="#contacto">¡Contáctanos!</a>
      </div>
    </div>
  </div>
</section>

<div class="marquee" aria-label="Áreas de práctica">
  <div class="marquee__track">
    ${[0, 1].map((k) => `<div class="marquee__group"${k ? ' aria-hidden="true"' : ''}>${[...AREAS, 'Creación de Empresas', 'Contratos', 'Empresas'].map((a) => `<span class="marquee__item">${a}</span>`).join('')}</div>`).join('')}
  </div>
</div>

<section class="statement on-dark" aria-labelledby="nosotros-title">
  <ul class="cascade cascade--tr" aria-hidden="true">${cascadeDown('DERECHO')}</ul>
  <ul class="cascade cascade--bl" aria-hidden="true">${cascadeUp('CERCA')}</ul>
  <div class="wrap statement__body">
    <h2 class="h2 statement__title" id="nosotros-title" data-reveal>Sobre Nosotros</h2>
    <p class="statement__text" data-reveal style="--i:1">En AFyV acompañamos a personas y emprendedores en la resolución de asuntos jurídicos cotidianos y estratégicos. Nuestro propósito es reducir la incertidumbre, fortalecer la toma de decisiones y ofrecer un apoyo confiable en cada etapa de tus decisiones. Prestamos asesoría jurídica en ámbitos civiles, comerciales y de derecho público, basada en un análisis detallado de cada situación y en propuestas claras que permitan avanzar con seguridad.</p>
    <a class="btn btn--light" href="equipo.html" data-reveal style="--i:2">Conoce Más ${ICON.arrow}</a>
  </div>
</section>

<section class="section" aria-labelledby="areas-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <span class="eyebrow" data-reveal>Nuestros Servicios</span>
        <h2 class="h2" id="areas-title" data-reveal style="--i:1">Áreas del Derecho</h2>
      </div>
      <p class="lede" data-reveal style="--i:2">Somos especialistas en:</p>
    </div>
    <ol class="areas">
      ${AREAS.map((a, i) => `<li class="areas__item" data-reveal style="--i:${i}"><span class="areas__num">${String(i + 1).padStart(2, '0')}</span><span class="areas__name">${a}</span></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section section--tight" aria-label="Servicios destacados" style="padding-top:0">
  <div class="wrap">
    <div class="cards-3">
      <article class="feature feature--ink">
        <p class="feature__spread" aria-hidden="true">${spread('Empresa')}</p>
        <h3 class="feature__title">Creación de Empresas</h3>
        <p class="feature__text">Trabajamos en la creación de tu empresa, en su modificación o su migración al régimen propuesto por la Ley N°&nbsp;20.659</p>
        <a class="feature__link" href="constituye-tu-empresa.html" aria-label="Creación de Empresas: por qué constituir tu empresa"></a>
        <span class="feature__cta" aria-hidden="true">Conoce Más ${ICON.arrow}</span>
      </article>
      <article class="feature feature--green">
        <p class="feature__spread" aria-hidden="true">${spread('Contratos')}</p>
        <h3 class="feature__title">Contratos</h3>
        <p class="feature__text">Te acompañamos en la negociación de tus contratos comerciales, y nos encargamos de su análisis y redacción</p>
        <a class="feature__link" href="servicios.html" aria-label="Contratos: ver servicios"></a>
        <span class="feature__cta" aria-hidden="true">Conoce Más ${ICON.arrow}</span>
      </article>
      <article class="feature feature--graphite">
        <p class="feature__spread" aria-hidden="true">${spread('Pymes')}</p>
        <h3 class="feature__title">Empresas</h3>
        <p class="feature__text">Prestamos apoyo a emprendedores y pequeños negocios mediante la constitución de sociedades, la celebración de juntas de accionistas, el registro de marcas y la revisión y redacción de contratos necesarios para su adecuada operación.</p>
        <a class="feature__link" href="servicios-empresas.html" aria-label="Empresas: conoce más"></a>
        <span class="feature__cta" aria-hidden="true">Conoce Más ${ICON.arrow}</span>
      </article>
    </div>
  </div>
</section>

<section class="section section--paper-2" aria-labelledby="equipo-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <span class="eyebrow" data-reveal>Conoce más Acerca de Nosotros</span>
        <h2 class="h2" id="equipo-title" data-reveal style="--i:1">Y nuestro compromiso por llevar el Derecho cerca de ti</h2>
      </div>
      <a class="btn" href="equipo.html" data-reveal style="--i:2">Sobre Nosotros ${ICON.arrow}</a>
    </div>
  </div>
  <div class="team-rail">
    <div class="team-rail__track">
      ${[0, 1].map((k) => `<div class="team-rail__group"${k ? ' aria-hidden="true"' : ''}>${TEAM.map((m) => portrait(m, 0, !!k)).join('')}<div style="display:contents" aria-hidden="true">${TEAM.map((m) => portrait(m, 0, true)).join('')}</div></div>`).join('')}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="informa-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <h2 class="h2" id="informa-title" data-reveal>AFyV Informa</h2>
      <a class="link-arrow" href="blog.html" data-reveal style="--i:1">Ver todas las publicaciones</a>
    </div>
    <div class="posts posts--3">
      ${POSTS.slice(0, 3).map((post, i) => postCard(post, 0, i)).join('')}
    </div>
  </div>
</section>`,
}));

// Servicios
built.push(page({
  file: 'servicios.html',
  title: 'Servicios — AFyV Legal',
  description: 'Asesoría jurídica en ámbitos civiles, comerciales y de derecho público: servicios para empresas, personas, laboral y derecho público.',
  active: 'servicios',
  contactOpts: { title: 'Contacto', lede: 'Contáctanos para saber más sobre nuestros servicios' },
  body: `
<section class="page-hero" aria-labelledby="t">
  <div class="wrap page-hero__grid">
    <h1 class="display" id="t" data-reveal>Nuestros Servicios</h1>
    <p class="lede" data-reveal style="--i:1">Prestamos asesoría jurídica en ámbitos civiles, comerciales y de derecho público, basada en un análisis detallado de cada situación y en propuestas claras que permitan avanzar con seguridad.</p>
  </div>
</section>

<section class="section" aria-label="Servicios">
  <div class="wrap service-list">
    <article class="service" data-reveal>
      <span class="service__num">01</span>
      <h2 class="service__title">Servicios para Empresas</h2>
      <div>
        <p class="service__text">Prestamos apoyo a emprendedores y pequeños negocios mediante la constitución de sociedades, la celebración de juntas de accionistas, el registro de marcas y la revisión y redacción de contratos necesarios para su adecuada operación.</p>
        <a class="link-arrow" href="servicios-empresas.html">Conoce Más</a>
      </div>
    </article>
    <article class="service" data-reveal>
      <span class="service__num">02</span>
      <h2 class="service__title">Personas</h2>
      <p class="service__text">Brindamos orientación jurídica a personas en materias de contratos, deudas, arrendamientos, responsabilidad civil, conflictos entre particulares, posesiones efectivas y planificación testamentaria, abordando cada situación con un enfoque humano.</p>
    </article>
    <article class="service" data-reveal>
      <span class="service__num">03</span>
      <h2 class="service__title">Laboral</h2>
      <p class="service__text">Guiamos a trabajadores y empleadores en la gestión de relaciones de trabajo y en la resolución de conflictos derivados del vínculo laboral. Asesoramos en la revisión de contratos de trabajo, término de la relación laboral, cumplimiento de obligaciones legales y análisis de situaciones complejas.</p>
    </article>
    <article class="service" data-reveal>
      <span class="service__num">04</span>
      <h2 class="service__title">Derecho Público</h2>
      <p class="service__text">Otorgamos apoyo técnico y gestión estratégica en materias de derecho público y penal. Asistimos a nuestros clientes mediante la tramitación ágil de procedimientos ante órganos de la Administración del Estado, el monitoreo continuo de carpetas investigativas y la redacción de solicitudes o escritos de tramitación.</p>
    </article>
  </div>
</section>

<section class="statement on-graphite" aria-labelledby="pymes-title">
  <ul class="cascade cascade--tr" aria-hidden="true">${cascadeDown('PYMES')}</ul>
  <ul class="cascade cascade--bl" aria-hidden="true">${cascadeUp('PLANES')}</ul>
  <div class="wrap statement__body">
    <h2 class="h2 statement__title" id="pymes-title" data-reveal>Descubre nuestros planes para pymes</h2>
    <p class="statement__text" data-reveal style="--i:1">En AFyV Legal ofrecemos planes que se adaptan a las necesidades y realidad de cada empresa.</p>
    <a class="btn" href="servicios-empresas.html" data-reveal style="--i:2">Haz click para conocer nuestros planes ${ICON.arrow}</a>
  </div>
</section>

<section class="section on-dark method" aria-labelledby="metodo-title" data-method>
  <div class="wrap">
    <div class="section-head">
      <h2 class="h2" id="metodo-title" data-reveal style="--i:1">Nuestro Método de Trabajo</h2>
    </div>
    <div class="method__grid">
      <div class="method__figure" aria-hidden="true">
        <svg class="method__svg" viewBox="0 0 480 380" data-step="0" role="presentation">
          <g class="plate plate--3" style="transform-origin:240px 260px">
            <path class="plate__face" d="M240 190 L440 290 L240 390 L40 290 Z" transform="translate(0,-40)"/>
            <text class="plate__label" x="452" y="254">03 ENTREGA</text>
          </g>
          <g class="plate plate--2" style="transform-origin:240px 190px">
            <path class="plate__face" d="M240 120 L440 220 L240 320 L40 220 Z" transform="translate(0,-40)"/>
            <text class="plate__label" x="452" y="184">02 TRABAJO</text>
          </g>
          <g class="plate plate--1" style="transform-origin:240px 120px">
            <path class="plate__face" d="M240 50 L440 150 L240 250 L40 150 Z" transform="translate(0,-40)"/>
            <text class="plate__label" x="452" y="114">01 CONTRATACIÓN</text>
          </g>
        </svg>
      </div>
      <ol class="method__steps">
        <li class="method__step" tabindex="0">
          <span class="method__step-kicker">Etapa 01</span>
          <h3 class="method__step-title">Etapa Inicial: Contratación</h3>
          <p>Podemos agendar una reunión para explicarte los pasos y la estrategia a seguir según tus necesidades</p>
        </li>
        <li class="method__step" tabindex="0">
          <span class="method__step-kicker">Etapa 02</span>
          <h3 class="method__step-title">Etapa Intermedia: Trabajo</h3>
          <p>Trabajamos minuciosamente en tu requerimiento y te informamos cada día acerca de su avance</p>
        </li>
        <li class="method__step" tabindex="0">
          <span class="method__step-kicker">Etapa 03</span>
          <h3 class="method__step-title">Entrega</h3>
          <p>Podemos agendar una reunión para presentarte nuestro trabajo. En esta etapa, resolvemos tus dudas y te orientamos acerca de los pasos a seguir</p>
        </li>
      </ol>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="opiniones-title">
  <div class="wrap">
    <div class="section-head">
      <h2 class="h2" id="opiniones-title" data-reveal>Opiniones</h2>
    </div>
    <div class="quotes">
      <figure class="quote" data-reveal>
        <blockquote><p style="margin:0">“AFyV me ayudó a resolver con éxito una notificación errónea de embargo por parte de la Tesorería General de la República. Totalmente recomendados.”</p></blockquote>
        <figcaption><strong>Iván</strong>Santiago</figcaption>
      </figure>
      <figure class="quote" data-reveal style="--i:1">
        <blockquote><p style="margin:0">“AFyV constituyó nuestra sociedad y nos han apoyado en nuestras juntas de accionistas, colaborando desde una perspectiva estratégica. Los recomiendo mucho.”</p></blockquote>
        <figcaption><strong>Luis Peralta</strong>Fundador de Jolu SpA</figcaption>
      </figure>
    </div>
  </div>
</section>`,
}));

// Servicios para empresas
built.push(page({
  file: 'servicios-empresas.html',
  title: 'Servicios para Empresas — AFyV Legal',
  description: 'Plan Constituye tu Empresa, Plan Registra tu Marca y Plan Inicio Seguro: constituye tu empresa y solicita el registro de tu marca por una tarifa única.',
  active: 'servicios',
  body: `
<section class="page-hero" aria-labelledby="t">
  <div class="wrap page-hero__grid">
    <h1 class="display" id="t" data-reveal>Servicios para Empresas</h1>
    <p class="lede" data-reveal style="--i:2">En AFyV Legal ofrecemos planes que se adaptan a las necesidades y realidad de cada empresa.</p>
  </div>
</section>

<section class="section" style="padding-top:0" aria-label="Planes">
  <div class="wrap">
    <article class="plan" data-reveal>
      <div>
        <span class="plan__kicker">Plan 01</span>
        <h2 class="plan__title">Plan Constituye tu Empresa</h2>
      </div>
      <div class="plan__body">
        <p>Al constituir una empresa, se crea una persona jurídica distinta de sus socios. Esto permite separar el patrimonio personal del empresarial, limitando la responsabilidad a los aportes realizados a la sociedad. De esta forma, podrás desarrollar tu actividad con mayor seguridad y reducir riesgos innecesarios para tu patrimonio personal.</p>
        <p>Muchos emprendimientos comienzan como una simple idea, pero solo aquellos que se formalizan están verdaderamente preparados para crecer, atraer oportunidades y proyectarse a largo plazo.</p>
        <p class="plan__pull">Constituir una empresa es una decisión estratégica que puede marcar el futuro de tu negocio.</p>
        <div class="plan__links"><a class="link-arrow" href="constituye-tu-empresa.html">Click para conocer las razones por las cuales debes constituir formalmente tu empresa</a></div>
      </div>
    </article>

    <article class="plan" data-reveal>
      <div>
        <span class="plan__kicker">Plan 02</span>
        <h2 class="plan__title">Plan Registra tu Marca</h2>
      </div>
      <div class="plan__body">
        <p>Muchos emprendedores invierten tiempo, recursos y esfuerzo en posicionar un nombre en el mercado, sin considerar que, si no se encuentra registrado, cualquier tercero podría utilizarlo o incluso obtener derechos exclusivos sobre él.</p>
        <p class="plan__pull">Registrar una marca es una decisión estratégica para proteger y fortalecer tu negocio.</p>
        <div class="plan__links"><a class="link-arrow" href="registra-tu-marca.html">Click para conocer las razones por las cuales debes registrar tu marca</a></div>
      </div>
    </article>

    <article class="plan" data-reveal>
      <div>
        <span class="plan__kicker">Plan 03</span>
        <h2 class="plan__title">Plan Inicio Seguro</h2>
      </div>
      <div class="plan__body">
        <p>Este plan incluye nuestro servicio de constitución formal de tu empresa, entre otras, junto con la presentación de la solicitud de registro de tu marca ante INAPI. De esta manera, no solo comienzas tu negocio cumpliendo con todas las formalidades legales, sino que también proteges desde el primer momento el activo más importante de tu empresa: su identidad.</p>
        <p>Emprender sin una estructura jurídica adecuada o sin proteger tu marca puede significar riesgos innecesarios, conflictos futuros e incluso la pérdida del nombre que tanto esfuerzo te costó construir. Con este plan, te acompañamos en cada etapa para que puedas enfocarte en hacer crecer tu negocio con la tranquilidad de contar con un respaldo legal sólido, proyectando tu empresa de forma segura, profesional y preparada para el futuro.</p>
        <div class="plan__links">
          <a class="link-arrow" href="constituye-tu-empresa.html">Sobre los tipos de sociedades</a>
          <a class="link-arrow" href="registra-tu-marca.html">Sobre los registros de marca</a>
        </div>
      </div>
    </article>
  </div>
</section>

<section class="statement on-dark" aria-labelledby="inicio-seguro-title">
  <ul class="cascade cascade--tr" aria-hidden="true">${cascadeDown('SEGURO')}</ul>
  <ul class="cascade cascade--bl" aria-hidden="true">${cascadeUp('INICIO')}</ul>
  <div class="wrap statement__body">
    <span class="eyebrow" data-reveal>Plan Inicio Seguro</span>
    <h2 class="h2 statement__title" id="inicio-seguro-title" data-reveal style="--i:1">Constituye tu empresa y solicita el registro de tu marca por una tarifa única</h2>
    <p class="statement__text" data-reveal style="--i:2">Asesoría Integral a un valor conveniente con el Plan Inicio Seguro</p>
    <a class="btn btn--light" href="#contacto" data-reveal style="--i:3">¡Contáctanos! ${ICON.arrow}</a>
  </div>
</section>

<section class="section" aria-label="Qué incluye el Plan Inicio Seguro">
  <div class="wrap cards-3">
    <article class="feature feature--ink">
      <p class="feature__spread" aria-hidden="true">${spread('Empresa')}</p>
      <h3 class="feature__title">Constituye tu empresa</h3>
      <p class="feature__text">Constituir formalmente una empresa te permite desarrollar tu actividad de manera segura y profesional, separar tu patrimonio personal del empresarial, acceder a nuevas oportunidades comerciales y generar mayor confianza frente a clientes, proveedores e inversionistas.</p>
    </article>
    <article class="feature feature--green">
      <p class="feature__spread" aria-hidden="true">${spread('Marca')}</p>
      <h3 class="feature__title">Registra tu marca</h3>
      <p class="feature__text">Tu marca es uno de los activos más valiosos de tu negocio. Registrarla te otorga el derecho exclusivo a utilizarla, evita que terceros la copien o registren antes que tú y fortalece la identidad y reputación de tu empresa en el mercado.</p>
    </article>
    <article class="feature feature--graphite">
      <p class="feature__spread" aria-hidden="true">${spread('Plan')}</p>
      <h3 class="feature__title">Beneficios de nuestro plan</h3>
      <p class="feature__text">Nuestro plan te permite iniciar tu negocio con una estructura jurídica adecuada y con tu marca protegida desde el primer día. Ahorras tiempo, evitas errores y cuentas con asesoría legal integral para emprender con seguridad, tranquilidad y visión de crecimiento.</p>
    </article>
  </div>
</section>`,
}));

// Reasons pages
function reasonsPage({ file, title, description, h1, intro, reasons, closing }) {
  return page({
    file, title, description, active: 'servicios',
    body: `
<section class="page-hero" aria-labelledby="t">
  <div class="wrap page-hero__grid">
    <div>
      <span class="eyebrow" data-reveal><a href="servicios-empresas.html" style="text-decoration:none">Servicios para Empresas</a></span>
      <h1 class="display" id="t" data-reveal style="--i:1">${h1}</h1>
    </div>
    <p class="lede" data-reveal style="--i:2">${intro}</p>
  </div>
</section>
<section class="section" style="padding-top:0" aria-label="Razones">
  <div class="wrap">
    <ol class="reasons">
      ${reasons.map(([t, txt], i) => `<li class="reason" data-reveal>
        <span class="reason__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h2 class="reason__title">${t}</h2>
        <p class="reason__text">${txt}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>
<section class="closing on-dark" aria-label="Conclusión">
  <div class="wrap">
    <p class="closing__text" data-reveal>${closing}</p>
    <a class="btn btn--light" href="#contacto" data-reveal style="--i:1">¡Contáctanos! ${ICON.arrow}</a>
  </div>
</section>`,
  });
}

built.push(reasonsPage({
  file: 'constituye-tu-empresa.html',
  title: '¿Por qué constituir tu Empresa? — AFyV Legal',
  description: 'Constituir una empresa es una decisión estratégica que puede marcar el futuro de tu negocio. Cinco razones para formalizar tu emprendimiento.',
  h1: '¿Por qué constituir tu Empresa?',
  intro: 'Muchos emprendimientos comienzan como una simple idea, pero solo aquellos que se formalizan están verdaderamente preparados para crecer, atraer oportunidades y proyectarse a largo plazo. Constituir una empresa es una decisión estratégica que puede marcar el futuro de tu negocio.',
  reasons: [
    ['Separación de Patrimonios', 'Al constituir una empresa, se crea una persona jurídica distinta de sus socios. Esto permite separar el patrimonio personal del empresarial, limitando la responsabilidad a los aportes realizados a la sociedad. De esta forma, podrás desarrollar tu actividad con mayor seguridad y reducir riesgos innecesarios para tu patrimonio personal.'],
    ['Accede a oportunidades de Financiamiento', 'Una empresa formal abre la puerta a créditos bancarios, fondos concursables, subsidios estatales y programas de apoyo al emprendimiento. Además, una estructura empresarial sólida genera confianza y puede facilitar la incorporación de socios estratégicos o inversionistas interesados en impulsar el crecimiento de tu proyecto.'],
    ['Construye una empresa a tu medida', 'Cada negocio tiene necesidades distintas. La elección correcta del tipo societario permite definir cómo se administrará la empresa, cómo se distribuirán las utilidades y cuáles serán las reglas que regirán la relación entre los socios, entregando flexibilidad y seguridad para el desarrollo del negocio.'],
    ['Genera confianza', 'Clientes, proveedores y empresas prefieren relacionarse con negocios formales. Operar a través de una sociedad transmite seriedad, estabilidad y profesionalismo, fortaleciendo tu imagen comercial y aumentando tus posibilidades de generar nuevas oportunidades de negocio.'],
    ['Profesionaliza la operación de tu empresa', 'La formalización permite emitir documentos tributarios, contratar trabajadores, acceder a servicios bancarios empresariales y separar adecuadamente las finanzas personales de las de la empresa. Todo ello contribuye a una gestión más eficiente y ordenada.'],
  ],
  closing: 'Formalizar tu negocio es invertir en su futuro. Porque las grandes empresas no solo nacen de buenas ideas: se construyen sobre bases legales sólidas.',
}));

built.push(reasonsPage({
  file: 'registra-tu-marca.html',
  title: 'Por qué registrar tu marca — AFyV Legal',
  description: 'Tu marca es uno de los activos más valiosos de tu negocio. Cinco razones para registrarla y protegerla desde el inicio.',
  h1: 'Por qué registrar tu marca',
  intro: 'Tu marca es uno de los activos más valiosos de tu negocio. Registrarla te permite proteger su identidad, diferenciarte de la competencia y construir una base sólida para crecer con seguridad.',
  reasons: [
    ['Tu marca es uno de los activos más valiosos de tu negocio', 'Muchos emprendedores invierten tiempo, recursos y esfuerzo en posicionar un nombre en el mercado, sin considerar que, si no se encuentra registrado, cualquier tercero podría utilizarlo o incluso obtener derechos exclusivos sobre él. Registrar una marca es una decisión estratégica para proteger y fortalecer tu negocio.'],
    ['Asegura la exclusividad sobre tu marca', 'El registro de marca otorga el derecho exclusivo de utilizar un nombre, logo o signo distintivo respecto de determinados productos o servicios. Esto te permite diferenciarte de la competencia y evitar que terceros utilicen una identidad similar que pueda generar confusión en el mercado.'],
    ['Protege la inversión realizada en posicionar tu marca', 'Posicionar una marca requiere tiempo, dedicación y recursos. Registrar tu marca significa proteger todo ese esfuerzo y reducir el riesgo de tener que cambiar de nombre, imagen corporativa o estrategia comercial debido a conflictos con terceros.'],
    ['Protege el valor de tu marca', 'Una marca registrada constituye un activo intangible que forma parte del patrimonio de la empresa. A medida que tu negocio crece, la marca adquiere valor comercial, pudiendo incluso ser licenciada, cedida o incorporada como un activo relevante para atraer inversionistas o concretar alianzas estratégicas.'],
    ['Competitividad', 'Las empresas más exitosas del mundo tienen algo en común: protegen sus marcas desde el inicio. Registrar tu marca hoy significa asegurar la identidad de tu negocio para el futuro y construir una ventaja competitiva que perdure en el tiempo.'],
  ],
  closing: 'Porque una gran marca no solo se crea: también se protege.',
}));

// Equipo
built.push(page({
  file: 'equipo.html',
  title: 'Nuestro Equipo — AFyV Legal',
  description: 'Un equipo altamente capacitado, dedicado a ofrecer respuestas ágiles y efectivas, con una visión práctica y contingente del derecho.',
  active: 'equipo',
  ogImage: 'logo.webp',
  body: `
<section class="page-hero" aria-labelledby="t">
  <div class="wrap page-hero__grid">
    <h1 class="display" id="t" data-reveal>Nuestro Equipo</h1>
    <p class="lede" data-reveal style="--i:1">Somos un equipo altamente capacitado, dedicados a ofrecer respuestas ágiles y efectivas. Nos destacamos por nuestra visión práctica y contingente del derecho, abordando cada desafío legal con el compromiso de entregar soluciones reales y a la medida. Entendemos que cada cliente es único, por lo que trabajamos de manera colaborativa, combinando cercanía y rigor técnico para brindar tranquilidad y seguridad jurídica frente a un entorno en permanente cambio.</p>
  </div>
</section>
<section class="section" style="padding-top:0" aria-label="Integrantes">
  <div class="wrap">
    ${TEAM.map((m) => `<article class="profile" id="${m.slug}" aria-labelledby="${m.slug}-name">
      <div class="profile__media" data-reveal><div class="portrait"><div class="portrait__media"><img src="assets/img/${m.img}" alt="Retrato de ${m.name}" width="600" height="860" loading="lazy" decoding="async"></div></div></div>
      <div data-reveal style="--i:1">
        <h2 class="profile__name" id="${m.slug}-name">${m.name}</h2>
        <p class="profile__area">${m.area}</p>
        <div class="profile__bio">${m.bio.map((b) => `<p>${b}</p>`).join('')}</div>
        <p class="profile__exp-title">Experiencia</p>
        <ul class="profile__exp">${m.exp.map((e) => `<li>${e}</li>`).join('')}</ul>
      </div>
    </article>`).join('')}
  </div>
</section>`,
}));

// Blog
built.push(page({
  file: 'blog.html',
  title: 'AFyV Informa — Blog de AFyV Legal',
  description: 'Artículos de AFyV Legal sobre derecho civil, arrendamientos, contratos, filiación, liquidación simplificada y más.',
  active: 'blog',
  body: `
<section class="page-hero" aria-labelledby="t">
  <div class="wrap page-hero__grid">
    <div>
      <span class="eyebrow" data-reveal>Blog</span>
      <h1 class="display" id="t" data-reveal style="--i:1">AFyV Informa</h1>
    </div>
  </div>
</section>
<section class="section" aria-label="Publicaciones">
  <div class="wrap posts posts--3">
    ${POSTS.map((post, i) => postCard(post, 0, i % 3)).join('')}
  </div>
</section>`,
}));

// Posts
POSTS.forEach((post, idx) => {
  const more = POSTS.filter((_, i) => i !== idx).slice(0, 3);
  built.push(page({
    file: `blog/${post.slug}.html`,
    depth: 1,
    title: `${post.title} — AFyV Informa`,
    description: post.excerpt.slice(0, 155),
    active: 'blog',
    ogImage: `${post.file}.webp`,
    body: `
<article aria-labelledby="t">
  <header class="article-head">
    <div class="wrap--narrow">
      <a class="link-arrow" href="../blog.html" data-reveal>AFyV Informa</a>
      <h1 class="article-head__title" id="t" data-reveal style="--i:1;margin-top:2rem">${esc(post.title)}</h1>
      <div class="byline" data-reveal style="--i:2">
        <img src="../assets/img/${post.avatar}" alt="" width="80" height="80">
        <span><strong>${post.author}</strong> · ${post.date} · ${post.read}</span>
      </div>
    </div>
  </header>
  <figure class="article-cover wrap--narrow" data-reveal>
    <img src="../assets/img/${post.file}.webp" alt="Portada del artículo ${esc(post.title)}" width="960" height="540" fetchpriority="high">
  </figure>
  <div class="wrap--narrow prose">
    ${prose(post.html)}
  </div>
  <div class="wrap--narrow article-foot">
    <a class="link-arrow" href="../blog.html">Volver a AFyV Informa</a>
    <a class="btn" href="#contacto">¡Contáctanos! ${ICON.arrow}</a>
  </div>
</article>
<section class="section" aria-labelledby="mas-title">
  <div class="wrap">
    <div class="section-head"><h2 class="h2" id="mas-title">Más publicaciones</h2></div>
    <div class="posts posts--3">${more.map((p, i) => postCard(p, 1, i)).join('')}</div>
  </div>
</section>`,
  }));
});

// Legal
for (const [file, title, src, desc] of [
  ['terminos-y-condiciones.html', 'Términos y Condiciones', 'terminos', 'Términos y Condiciones de acceso, uso y consulta del sitio web de AFyV Legal.'],
  ['politica-de-privacidad.html', 'Política de Privacidad', 'privacidad', 'Política de tratamiento de datos personales de AFyV Legal.'],
]) {
  built.push(page({
    file,
    title: `${title} — AFyV Legal`,
    description: desc,
    active: 'legal',
    contactOpts: false,
    body: `
<section class="page-hero" aria-labelledby="t">
  <div class="wrap page-hero__grid">
    <div>
      <span class="eyebrow">Avisos Legales</span>
      <h1 class="display" id="t">${title}</h1>
    </div>
    <p class="lede"><a class="link-arrow" href="${file.startsWith('terminos') ? 'politica-de-privacidad.html">Ver Política de Privacidad' : 'terminos-y-condiciones.html">Ver Términos y Condiciones'}</a></p>
  </div>
</section>
<section class="section">
  <div class="wrap--narrow prose prose--legal">
    ${prose(read(`content/${src}.html`))}
  </div>
</section>`,
  }));
}

console.log(`Built ${built.length} pages:\n  ${built.join('\n  ')}`);
