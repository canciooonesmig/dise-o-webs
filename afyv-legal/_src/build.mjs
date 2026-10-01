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

const ICON = {
  arrow: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  diag: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
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

/* ───────────── Partials ───────────── */

const btn = (href, label, cls = '', attrs = '') => `<a class="btn ${cls}" href="${href}" data-magnetic ${attrs}>${label}<span class="btn__icon">${ICON.arrow}</span></a>`;
const num = (i) => String(i + 1).padStart(2, '0');

function nav(active, depth, hasContact) {
  const p = '../'.repeat(depth);
  const contactHref = hasContact ? '#contacto' : `${p}index.html#contacto`;
  const links = NAV.map((n) => `<li><a class="nav__link" href="${p}${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  const sheetLinks = NAV.map((n, i) => `<li><a href="${p}${n.href}"${n.key === active ? ' aria-current="page"' : ''}><span>${num(i)}</span>${n.label}</a></li>`).join('');
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="curtain" aria-hidden="true"><span class="curtain__mark">AFyV</span><span class="curtain__count mono" data-count></span><span class="curtain__tag mono">El Derecho cerca de ti</span></div>
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="${p}index.html" aria-label="AFyV Legal, inicio">AFyV</a>
    <nav aria-label="Principal"><ul class="nav__pill">${links}</ul></nav>
    <div class="nav__cta">${btn(contactHref, 'Contáctanos', 'btn--mint')}</div>
    <button class="menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="sheet"><span data-menu-label>Menú</span><span class="menu-btn__icon" aria-hidden="true"></span></button>
  </div>
</header>
<div class="sheet" id="sheet">
  <nav aria-label="Principal (móvil)"><ul class="sheet__list">${sheetLinks}</ul></nav>
  <div class="sheet__foot">${btn(contactHref, 'Contáctanos', 'btn--mint')}<span class="mono">${SITE.city}</span></div>
</div>`;
}

function contact({ title = '¡Contáctanos!', lede = '' } = {}) {
  return `<section class="contact" id="contacto" aria-labelledby="contacto-title">
  <div class="wrap">
    <span class="label" data-reveal>Contacto</span>
    <h2 class="contact__title" id="contacto-title" data-split style="margin-top:1.5rem">${title}</h2>
    <div class="contact__grid">
      <div>
        ${lede ? `<p class="lede" data-reveal style="margin-bottom:2.5rem">${lede}</p>` : ''}
        <ul class="contact__details" data-reveal="1">
          <li><span class="mono">Oficina</span><p>${SITE.city}</p></li>
          <li><span class="mono">Correo</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><span class="mono">Teléfono</span><a href="${SITE.whatsapp}" rel="noopener">${SITE.phone.replace(/ /g, '&nbsp;')}</a></li>
        </ul>
        <div class="social" data-reveal="2">
          <a href="${SITE.instagram}" rel="noopener" aria-label="Instagram de AFyV Legal">${ICON.instagram}</a>
          <a href="${SITE.whatsapp}" rel="noopener" aria-label="WhatsApp de AFyV Legal">${ICON.whatsapp}</a>
          <a href="${SITE.linkedin}" rel="noopener" aria-label="LinkedIn de AFyV Legal">${ICON.linkedin}</a>
        </div>
      </div>
      <form class="form" data-contact-form novalidate action="mailto:${SITE.email}" method="post" enctype="text/plain" data-reveal="1">
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
          <button class="btn btn--mint" type="submit" data-magnetic>Enviar<span class="btn__icon">${ICON.arrow}</span></button>
          <p class="form__status" data-form-status aria-live="polite"></p>
        </div>
      </form>
    </div>
  </div>
</section>`;
}

function footer(depth) {
  const p = '../'.repeat(depth);
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__col">
        <p class="title-sm" style="margin:0 0 1rem">El Derecho <span class="hl">cerca</span> de ti.</p>
        <span class="footer__clock" data-clock>Santiago, Chile</span>
      </div>
      <div class="footer__col"><span class="mono">Navegación</span>${NAV.slice(0, 4).map((n) => `<a href="${p}${n.href}">${n.label}</a>`).join('')}</div>
      <div class="footer__col"><span class="mono">Redes</span><a href="${SITE.instagram}" rel="noopener">Instagram</a><a href="${SITE.whatsapp}" rel="noopener">WhatsApp</a><a href="${SITE.linkedin}" rel="noopener">LinkedIn</a></div>
      <div class="footer__col"><span class="mono">Contacto</span><a href="mailto:${SITE.email}">${SITE.email}</a><a href="${SITE.whatsapp}" rel="noopener">${SITE.phone.replace(/ /g, '&nbsp;')}</a><span style="color:var(--text-soft)">${SITE.city}</span></div>
    </div>
  </div>
  <p class="footer__mark" aria-hidden="true"><span>A</span><span>F</span><span>y</span><span>V</span></p>
  <div class="wrap footer__legal mono">
    <span>© ${new Date().getFullYear()} AFyV Legal</span>
    <nav aria-label="Avisos legales"><a href="${p}terminos-y-condiciones.html">Términos y Condiciones</a><a href="${p}politica-de-privacidad.html">Política de Privacidad</a></nav>
  </div>
</footer>`;
}

function page({ file, title, description, active, depth = 0, body, contactOpts, ogImage, progress = false }) {
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
<meta name="theme-color" content="#04110b">
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
<script>(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('is-loading');setTimeout(function(){d.classList.remove('is-loading')},4000)}})(document.documentElement)</script>
<script src="${p}assets/vendor/gsap.min.js" defer></script>
<script src="${p}assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="${p}assets/vendor/SplitText.min.js" defer></script>
<script src="${p}assets/vendor/lenis.min.js" defer></script>
<script src="${p}assets/gl.js" defer></script>
<script src="${p}assets/main.js" defer></script>
</head>
<body>
${progress ? '<div class="progress" aria-hidden="true"><span></span></div>' : ''}
${nav(active, depth, contactOpts !== false)}
<main id="contenido" tabindex="-1">
${body}
${contactOpts === false ? '' : contact(contactOpts)}
</main>
${footer(depth)}
</body>
</html>
`;
  mkdirSync(dirname(join(OUT, file)), { recursive: true });
  writeFileSync(join(OUT, file), html.replace(/\n\s*\n/g, '\n'));
  return file;
}

const pageHero = ({ label, h1, lede = '', labelHref }) => `<section class="page-hero" data-intro aria-labelledby="t">
  <div class="hero__gl" data-gl></div>
  <div class="wrap page-hero__grid hero__inner" style="padding:0">
    <div>
      <span class="label" data-reveal>${labelHref ? `<a href="${labelHref}" style="text-decoration:none">${label}</a>` : label}</span>
      <h1 class="display" id="t" data-split>${h1}</h1>
    </div>
    ${lede ? `<p class="lede" data-reveal="2">${lede}</p>` : ''}
  </div>
</section>`;

const postCard = (post, depth = 0) => {
  const p = '../'.repeat(depth);
  return `<article class="post-card" data-reveal>
  <div class="post-card__media"><img src="${p}assets/img/${post.file}.webp" alt="" width="960" height="540" loading="lazy" decoding="async"></div>
  <div class="post-card__meta"><span>${post.author}</span><span>${post.date}</span><span>${post.read}</span></div>
  <h3 class="post-card__title"><a href="${p}blog/${post.slug}.html">${esc(post.title)}</a></h3>
  <p class="post-card__excerpt">${esc(post.excerpt)}</p>
</article>`;
};

const member = (m, i) => `<a class="member" href="equipo.html#${m.slug}">
  <div class="member__media"><span class="member__tag mono">( ${num(i)} )</span><img src="assets/img/${m.img}" alt="Retrato de ${m.name}" width="600" height="860" loading="lazy" decoding="async"></div>
  <p class="member__name">${m.name}</p>
  <p class="member__role">${m.area}</p>
</a>`;

/* Generative line art for the service cards (600×600 viewBox) */
const iso = (cx, cy, w, h, d) => [
  `M${cx} ${cy - h} L${cx + w} ${cy} L${cx} ${cy + h} L${cx - w} ${cy} Z`,
  `M${cx - w} ${cy} L${cx - w} ${cy + d} L${cx} ${cy + h + d} L${cx + w} ${cy + d} L${cx + w} ${cy}`,
  `M${cx} ${cy + h} L${cx} ${cy + h + d}`,
];
const ART = {
  empresa: (() => {
    const boxes = [[300, 380, 200, 100, 70], [300, 290, 150, 75, 60], [300, 215, 100, 50, 50]];
    const paths = boxes.flatMap((b) => iso(...b)).map((d) => `<path class="art-line draw" d="${d}"/>`).join('');
    const dots = boxes.map(([cx, cy, , h]) => `<circle class="art-glow" cx="${cx}" cy="${cy - h}" r="4"/>`).join('');
    const grid = Array.from({ length: 9 }, (_, i) => `<path class="art-line" style="opacity:.14" d="M${60 + i * 60} 80 V520"/>`).join('');
    return `<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" style="color:rgba(158,240,192,.75)" aria-hidden="true">${grid}${paths}${dots}</svg>`;
  })(),
  contrato: (() => {
    const lines = [0, 1, 2, 3, 4, 5, 6].map((i) => `<path class="art-line draw" d="M215 ${190 + i * 30} H${[370, 390, 340, 385, 360, 300, 380][i]}"/>`).join('');
    return `<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" style="color:#0a1a12" aria-hidden="true">
      <path class="art-line draw" d="M190 110 H372 L410 148 V490 H190 Z"/><path class="art-line draw" d="M372 110 V148 H410"/>
      ${lines}
      <path class="art-line draw" style="stroke-width:1.6" d="M215 440 C240 395 255 470 285 425 S330 400 350 432 S392 452 410 410 S440 400 452 412"/>
      <circle class="art-line draw" cx="365" cy="190" r="26"/><circle class="art-line draw" cx="365" cy="190" r="18"/>
      <circle class="art-glow" cx="452" cy="412" r="5"/></svg>`;
  })(),
  red: (() => {
    const rings = [90, 160, 230].map((r) => `<circle class="art-line draw" style="opacity:.6" cx="300" cy="300" r="${r}"/>`).join('');
    const nodes = (r, n, off) => Array.from({ length: n }, (_, i) => { const a = off + (i / n) * Math.PI * 2; return `<circle class="art-glow" cx="${(300 + r * Math.cos(a)).toFixed(1)}" cy="${(300 + r * Math.sin(a)).toFixed(1)}" r="${r > 200 ? 3.5 : 5}"/>`; }).join('');
    return `<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" style="color:rgba(158,240,192,.7)" aria-hidden="true">${rings}
      <g class="orbit">${nodes(160, 3, 0.4)}</g><g class="orbit orbit--rev">${nodes(230, 5, 1.1)}</g><g class="orbit">${nodes(90, 2, 2)}</g>
      <circle class="art-glow" cx="300" cy="300" r="9"/></svg>`;
  })(),
};


/* ───────────── Chile en cifras (datos públicos, con fuente) ───────────── */

const fmt = (n) => n.toLocaleString('es-CL');
const MINECON = 'Ministerio de Economía';
const CIFRAS = {
  empresas: [
    { period: '2023', total: 167769, a: 147784, b: 19985, source: `${MINECON}, Informe RES diciembre 2023` },
    { period: '2025', total: 221262, a: 202406, b: 18856, source: `${MINECON}, Informe RES diciembre 2025` },
    { period: 'Ene–ago 2026', note: '8 meses', total: 161318, a: 148405, b: 12913, source: `${MINECON}, Informe RES agosto 2026` },
  ],
  rm: { total: 89715, pct: 44.3, source: `${MINECON}, 6 feb 2026` },
  marcas: [
    { period: '2024', total: 62391, a: 43689, b: 18702, source: 'INAPI, Reporte Cuenta Pública 2025' },
    { period: '1 ene–1 dic 2025', total: 64508, a: 48590, b: 15918, source: `${MINECON}, 18 feb 2026` },
  ],
};

const FLAG_CL = (() => {
  // Official proportions 3:2; canton = half the height; star diameter = half the canton
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 1.0 : 2.5;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(5 + r * Math.cos(a)).toFixed(3)},${(5 + r * Math.sin(a)).toFixed(3)}`;
  }).join(' ');
  return `<span class="flag-cl" role="img" aria-label="Bandera de Chile">
  <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id="flag-clip"><rect width="30" height="20" rx="2.2"/></clipPath>
      <linearGradient id="flag-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/>
      </linearGradient>
    </defs>
    <g clip-path="url(#flag-clip)">
      <rect width="30" height="10" fill="#ffffff"/>
      <rect y="10" width="30" height="10" fill="#d52b1e"/>
      <rect width="10" height="10" fill="#0039a6"/>
      <polygon points="${pts}" fill="#ffffff"/>
      <rect width="30" height="20" fill="url(#flag-shade)"/>
      <rect class="flag-cl__sheen" x="-14" y="-4" width="8" height="28" fill="#fff" opacity=".35" transform="rotate(20 0 0)"/>
    </g>
    <rect x=".25" y=".25" width="29.5" height="19.5" rx="2" fill="none" stroke="rgba(255,255,255,.35)" stroke-width=".5"/>
  </svg>
</span>`;
})();

function barChart({ id, title, rows, keys, max, note }) {
  const scale = (v) => ((v / max) * 100).toFixed(3);
  return `<figure class="chart" data-chart aria-labelledby="${id}-t">
  <div class="chart__head">
    <h3 class="chart__title" id="${id}-t">${title}</h3>
    <ul class="legend" aria-label="Leyenda">
      <li><span class="legend__key legend__key--a" aria-hidden="true"></span>${keys[0]}</li>
      <li><span class="legend__key legend__key--b" aria-hidden="true"></span>${keys[1]}</li>
    </ul>
  </div>
  <div class="chart__rows">
    ${rows.map((r) => `<div class="chart__row">
      <div class="chart__label"><span>${r.period}</span>${r.note ? `<em>${r.note}</em>` : ''}</div>
      <div class="chart__track">
        <div class="chart__bar" style="width:${scale(r.total)}%" data-bar>
          <span class="seg seg--a" style="flex-grow:${r.a}" tabindex="0" data-tip="${r.period} · ${keys[0]}|${fmt(r.a)}" aria-label="${r.period}, ${keys[0]}: ${fmt(r.a)}">${r.a / r.total > 0.3 ? `<span class="seg__label">${fmt(r.a)}</span>` : ''}</span>
          <span class="seg seg--b" style="flex-grow:${r.b}" tabindex="0" data-tip="${r.period} · ${keys[1]}|${fmt(r.b)}" aria-label="${r.period}, ${keys[1]}: ${fmt(r.b)}"></span>
        </div>
        <span class="chart__total"><span data-count="${r.total}">${fmt(r.total)}</span></span>
      </div>
    </div>`).join('')}
  </div>
  <figcaption class="chart__src">
    ${note ? `<p>${note}</p>` : ''}
    <ul>${rows.map((r) => `<li><span>${r.period}</span> Fuente: ${r.source}</li>`).join('')}</ul>
  </figcaption>
  <div class="chart__tip" role="presentation" hidden><strong></strong><span></span></div>
</figure>`;
}

function cifras() {
  const e25 = CIFRAS.empresas[1];
  const m25 = CIFRAS.marcas[1];
  const table = (caption, rows, keys) => `<table>
    <caption>${caption}</caption>
    <thead><tr><th scope="col">Período</th><th scope="col">Total</th><th scope="col">${keys[0]}</th><th scope="col">${keys[1]}</th><th scope="col">Fuente</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><th scope="row">${r.period}</th><td>${fmt(r.total)}</td><td>${fmt(r.a)}</td><td>${fmt(r.b)}</td><td>${r.source}</td></tr>`).join('')}</tbody>
  </table>`;
  return `<section class="section cifras" id="cifras" aria-labelledby="cifras-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          <span class="label" data-reveal>( 03 ) Chile en cifras ${FLAG_CL.replace('class="flag-cl"', 'class="flag-cl flag-cl--sm"').replace(/flag-clip|flag-shade/g, (m) => `${m}-2`)}</span>
          <h2 class="title" id="cifras-title" data-split style="margin-top:1.5rem">Emprender en Chile, <span class="hl">en cifras</span></h2>
        </div>
        <p class="lede" data-reveal="1">Cifras oficiales sobre la creación de empresas y las solicitudes de marcas en Chile.</p>
      </div>

      <div class="kpis">
        <article class="kpi" data-reveal>
          <p class="kpi__label">Empresas creadas en Chile en 2025</p>
          <p class="kpi__value"><span data-count="${e25.total}">${fmt(e25.total)}</span></p>
          <p class="kpi__meta">${fmt(e25.a)} por Registro de Empresas y Sociedades (RES, en línea) · ${fmt(e25.b)} por Diario Oficial</p>
          <p class="kpi__src">Fuente: ${e25.source}</p>
        </article>
        <article class="kpi" data-reveal="1">
          <p class="kpi__label">Empresas creadas en la Región Metropolitana en 2025</p>
          <p class="kpi__value"><span data-count="${CIFRAS.rm.total}">${fmt(CIFRAS.rm.total)}</span></p>
          <div class="meter" role="img" aria-label="${String(CIFRAS.rm.pct).replace('.', ',')}% de las empresas creadas por RES en 2025">
            <span class="meter__fill" style="width:${CIFRAS.rm.pct}%" data-bar></span>
          </div>
          <p class="kpi__meta"><strong>${String(CIFRAS.rm.pct).replace('.', ',')}%</strong> de las empresas creadas por RES</p>
          <p class="kpi__src">Fuente: ${CIFRAS.rm.source}</p>
        </article>
        <article class="kpi" data-reveal="2">
          <p class="kpi__label">Marcas solicitadas en INAPI, 1 de enero al 1 de diciembre de 2025</p>
          <p class="kpi__value"><span data-count="${m25.total}">${fmt(m25.total)}</span></p>
          <p class="kpi__meta">${fmt(m25.a)} de residentes · ${fmt(m25.b)} de no residentes</p>
          <p class="kpi__src">Fuente: ${m25.source}</p>
        </article>
      </div>

      <div class="charts">
        ${barChart({ id: 'ch-empresas', title: 'Empresas creadas en Chile', rows: CIFRAS.empresas, keys: ['RES (en línea)', 'Diario Oficial'], max: 230000, note: 'El período 2026 abarca enero a agosto.' })}
        ${barChart({ id: 'ch-marcas', title: 'Marcas solicitadas en INAPI', rows: CIFRAS.marcas, keys: ['Residentes', 'No residentes'], max: 70000, note: 'La cifra de 2025 cubre del 1 de enero al 1 de diciembre; el total del año completo no está publicado en un informe (está en el conjunto de datos «Solicitudes de Marcas» de INAPI, datos.gob.cl).' })}
      </div>

      <details class="datatable">
        <summary class="paren">Ver datos en tabla</summary>
        ${table('Empresas creadas en Chile', CIFRAS.empresas, ['RES (en línea)', 'Diario Oficial'])}
        ${table('Marcas solicitadas en INAPI', CIFRAS.marcas, ['Residentes', 'No residentes'])}
        <p class="kpi__src">Región Metropolitana 2025: ${fmt(CIFRAS.rm.total)} empresas, ${String(CIFRAS.rm.pct).replace('.', ',')}% de las creadas por RES (${CIFRAS.rm.source}).</p>
      </details>
    </div>
  </section>`;
}

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
<section class="hero" data-intro aria-labelledby="hero-title">
  <div class="hero__gl" data-gl></div>
  <div class="wrap hero__inner">
    <div class="hero__top">
      <span class="label" data-reveal>Bienvenidos a AFyV</span>
      <span class="hero__place" data-reveal="1">${FLAG_CL}<span class="mono">Santiago, Chile — 33°27′S 70°40′O</span></span>
    </div>
    <h1 class="display hero__title" id="hero-title" data-split>El Derecho <span class="hl">cerca</span> de&nbsp;ti</h1>
    <div class="hero__row">
      <p class="lede" data-reveal="2" style="margin:0">En AFyV acompañamos a personas y emprendedores en la resolución de asuntos jurídicos cotidianos y estratégicos.</p>
      <div class="hero__actions" data-reveal="3">
        ${btn('servicios.html', 'Leer más')}
        <a class="paren" href="#contacto">¡Contáctanos!</a>
      </div>
    </div>
  </div>
  <div class="hero__foot" data-reveal="4">
    <div class="wrap">
      <p class="ticker" style="margin:0">${[...AREAS, 'Creación de Empresas', 'Contratos'].map((a) => `<span>${a}</span>`).join('')}</p>
      <span class="scroll-cue mono" aria-hidden="true"><span class="scroll-cue__bar"></span>Desliza</span>
    </div>
  </div>
</section>

<section class="manifesto" aria-labelledby="nosotros-title">
  <div class="wrap manifesto__grid">
    <div><span class="label" data-reveal>( 01 ) <span id="nosotros-title">Sobre Nosotros</span></span></div>
    <div>
      <p class="manifesto__text" data-words>En AFyV acompañamos a personas y emprendedores en la resolución de asuntos jurídicos cotidianos y estratégicos. Nuestro propósito es reducir la incertidumbre, fortalecer la toma de decisiones y ofrecer un apoyo confiable en cada etapa de tus decisiones. Prestamos asesoría jurídica en ámbitos civiles, comerciales y de derecho público, basada en un análisis detallado de cada situación y en propuestas claras que permitan avanzar con seguridad.</p>
      <div data-reveal>${btn('equipo.html', 'Conoce Más', 'btn--ghost')}</div>
    </div>
  </div>
</section>

<div class="light">
  <section class="section" aria-labelledby="areas-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          <span class="label" data-reveal>( 02 ) Nuestros Servicios</span>
          <h2 class="title" id="areas-title" data-split style="margin-top:1.5rem">Áreas del Derecho</h2>
        </div>
        <p class="lede" data-reveal="1">Somos especialistas en:</p>
      </div>
      <ol class="areas">
        ${AREAS.map((a, i) => `<li><a class="area" href="servicios.html"><span class="area__num">( ${num(i)} )</span><span class="area__name">${a}</span><span class="area__arrow" aria-hidden="true">${ICON.diag}</span></a></li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-label="Servicios destacados">
    <div class="wrap stack">
      <article class="stack-card stack-card--green" style="--n:0">
        <div class="stack-card__body">
          <span class="label">( 01 ) Servicio</span>
          <div>
            <h3 class="stack-card__title">Creación de Empresas</h3>
            <p class="stack-card__text">Trabajamos en la creación de tu empresa, en su modificación o su migración al régimen propuesto por la Ley N°&nbsp;20.659</p>
          </div>
          <a class="paren" href="constituye-tu-empresa.html">Conoce Más</a>
        </div>
        <div class="stack-card__art">${ART.empresa}</div>
      </article>
      <article class="stack-card stack-card--paper" style="--n:1">
        <div class="stack-card__body">
          <span class="label">( 02 ) Servicio</span>
          <div>
            <h3 class="stack-card__title">Contratos</h3>
            <p class="stack-card__text">Te acompañamos en la negociación de tus contratos comerciales, y nos encargamos de su análisis y redacción</p>
          </div>
          <a class="paren" href="servicios.html">Conoce Más</a>
        </div>
        <div class="stack-card__art">${ART.contrato}</div>
      </article>
      <article class="stack-card stack-card--ink" style="--n:2">
        <div class="stack-card__body">
          <span class="label">( 03 ) Servicio</span>
          <div>
            <h3 class="stack-card__title">Empresas</h3>
            <p class="stack-card__text">Prestamos apoyo a emprendedores y pequeños negocios mediante la constitución de sociedades, la celebración de juntas de accionistas, el registro de marcas y la revisión y redacción de contratos necesarios para su adecuada operación.</p>
          </div>
          <a class="paren" href="servicios-empresas.html">Conoce Más</a>
        </div>
        <div class="stack-card__art">${ART.red}</div>
      </article>
    </div>
  </section>
  ${cifras()}
</div>

<section class="hscroll section" data-hscroll aria-labelledby="equipo-title" style="padding-block:clamp(5rem,10vw,8rem)">
  <div class="hscroll__track">
    <div class="hscroll__intro">
      <div>
        <span class="label" data-reveal>( 04 ) Conoce más Acerca de Nosotros</span>
        <h2 class="title-sm" id="equipo-title" data-split style="margin-top:1.5rem">Y nuestro compromiso por llevar el Derecho <span class="hl">cerca</span> de ti</h2>
      </div>
      <div data-reveal>${btn('equipo.html', 'Sobre Nosotros', 'btn--ghost')}</div>
    </div>
    ${TEAM.map(member).join('')}
  </div>
</section>

<div class="light">
  <section class="section" aria-labelledby="informa-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          <span class="label" data-reveal>( 05 ) Blog</span>
          <h2 class="title" id="informa-title" data-split style="margin-top:1.5rem">AFyV Informa</h2>
        </div>
        <a class="paren" href="blog.html" data-reveal="1">Ver todas las publicaciones</a>
      </div>
      <div class="posts posts--3">${POSTS.slice(0, 3).map((p) => postCard(p)).join('')}</div>
    </div>
  </section>
</div>`,
}));

// Servicios
built.push(page({
  file: 'servicios.html',
  title: 'Servicios — AFyV Legal',
  description: 'Asesoría jurídica en ámbitos civiles, comerciales y de derecho público: servicios para empresas, personas, laboral y derecho público.',
  active: 'servicios',
  contactOpts: { title: 'Contacto', lede: 'Contáctanos para saber más sobre nuestros servicios' },
  body: `
${pageHero({ label: 'Servicios', h1: 'Nuestros <span class="hl">Servicios</span>', lede: 'Prestamos asesoría jurídica en ámbitos civiles, comerciales y de derecho público, basada en un análisis detallado de cada situación y en propuestas claras que permitan avanzar con seguridad.' })}
<div class="light">
  <section class="section" aria-label="Servicios">
    <div class="wrap svc">
      <article class="svc__item" data-reveal>
        <span class="svc__num">( 01 )</span>
        <h2 class="svc__title">Servicios para Empresas</h2>
        <div><p class="svc__text">Prestamos apoyo a emprendedores y pequeños negocios mediante la constitución de sociedades, la celebración de juntas de accionistas, el registro de marcas y la revisión y redacción de contratos necesarios para su adecuada operación.</p><a class="paren" href="servicios-empresas.html">Conoce Más</a></div>
      </article>
      <article class="svc__item" data-reveal>
        <span class="svc__num">( 02 )</span>
        <h2 class="svc__title">Personas</h2>
        <p class="svc__text">Brindamos orientación jurídica a personas en materias de contratos, deudas, arrendamientos, responsabilidad civil, conflictos entre particulares, posesiones efectivas y planificación testamentaria, abordando cada situación con un enfoque humano.</p>
      </article>
      <article class="svc__item" data-reveal>
        <span class="svc__num">( 03 )</span>
        <h2 class="svc__title">Laboral</h2>
        <p class="svc__text">Guiamos a trabajadores y empleadores en la gestión de relaciones de trabajo y en la resolución de conflictos derivados del vínculo laboral. Asesoramos en la revisión de contratos de trabajo, término de la relación laboral, cumplimiento de obligaciones legales y análisis de situaciones complejas.</p>
      </article>
      <article class="svc__item" data-reveal>
        <span class="svc__num">( 04 )</span>
        <h2 class="svc__title">Derecho Público</h2>
        <p class="svc__text">Otorgamos apoyo técnico y gestión estratégica en materias de derecho público y penal. Asistimos a nuestros clientes mediante la tramitación ágil de procedimientos ante órganos de la Administración del Estado, el monitoreo continuo de carpetas investigativas y la redacción de solicitudes o escritos de tramitación.</p>
      </article>
    </div>
  </section>
</div>

<section class="band" aria-labelledby="pymes-title">
  <div class="wrap band__body">
    <span class="label" data-reveal>Planes</span>
    <h2 class="title band__title" id="pymes-title" data-split>Descubre nuestros planes para <span class="hl">pymes</span></h2>
    <p class="lede" data-reveal="1">En AFyV Legal ofrecemos planes que se adaptan a las necesidades y realidad de cada empresa.</p>
    <div data-reveal="2">${btn('servicios-empresas.html', 'Haz click para conocer nuestros planes', 'btn--mint')}</div>
  </div>
</section>

<section class="method" aria-labelledby="metodo-title">
  <div class="wrap method__stage">
    <div class="method__fig" aria-hidden="true">
      <div class="method__plates">
        ${['01 Contratación', '02 Trabajo', '03 Entrega'].map((l, i) => `<div class="plate${i === 0 ? ' is-active' : ''}" style="transform:translateZ(${(1 - i) * 60}px)"><div class="plate__grid"></div><span class="plate__label mono">${l}</span></div>`).join('')}
      </div>
    </div>
    <div>
      <span class="label">Cómo avanzamos</span>
      <h2 class="title-sm" id="metodo-title" style="margin:1.5rem 0 2.5rem">Nuestro Método de Trabajo</h2>
      <div class="method__progress" aria-hidden="true"><span></span></div>
      <div class="method__steps">
        <div class="method__step"><div class="method__step-num">01</div><h3 class="method__step-title">Etapa Inicial: Contratación</h3><p>Podemos agendar una reunión para explicarte los pasos y la estrategia a seguir según tus necesidades</p></div>
        <div class="method__step"><div class="method__step-num">02</div><h3 class="method__step-title">Etapa Intermedia: Trabajo</h3><p>Trabajamos minuciosamente en tu requerimiento y te informamos cada día acerca de su avance</p></div>
        <div class="method__step"><div class="method__step-num">03</div><h3 class="method__step-title">Entrega</h3><p>Podemos agendar una reunión para presentarte nuestro trabajo. En esta etapa, resolvemos tus dudas y te orientamos acerca de los pasos a seguir</p></div>
      </div>
    </div>
  </div>
</section>

<div class="light">
  <section class="section" aria-labelledby="opiniones-title">
    <div class="wrap">
      <div class="section-head"><span class="label" data-reveal>Clientes</span><h2 class="title" id="opiniones-title" data-split style="margin-top:1.5rem">Opiniones</h2></div>
      <div class="quotes">
        <figure class="quote" data-reveal><span class="quote__mark" aria-hidden="true">“</span><blockquote><p style="margin:0">AFyV me ayudó a resolver con éxito una notificación errónea de embargo por parte de la Tesorería General de la República. Totalmente recomendados.</p></blockquote><figcaption><div><strong>Iván</strong><span>Santiago</span></div></figcaption></figure>
        <figure class="quote" data-reveal="1"><span class="quote__mark" aria-hidden="true">“</span><blockquote><p style="margin:0">AFyV constituyó nuestra sociedad y nos han apoyado en nuestras juntas de accionistas, colaborando desde una perspectiva estratégica. Los recomiendo mucho.</p></blockquote><figcaption><div><strong>Luis Peralta</strong><span>Fundador de Jolu SpA</span></div></figcaption></figure>
      </div>
    </div>
  </section>
</div>`,
}));

// Servicios para empresas
const plans = [
  { title: 'Plan Constituye tu Empresa', body: ['Al constituir una empresa, se crea una persona jurídica distinta de sus socios. Esto permite separar el patrimonio personal del empresarial, limitando la responsabilidad a los aportes realizados a la sociedad. De esta forma, podrás desarrollar tu actividad con mayor seguridad y reducir riesgos innecesarios para tu patrimonio personal.', 'Muchos emprendimientos comienzan como una simple idea, pero solo aquellos que se formalizan están verdaderamente preparados para crecer, atraer oportunidades y proyectarse a largo plazo.'], pull: 'Constituir una empresa es una decisión estratégica que puede marcar el futuro de tu negocio.', links: [['constituye-tu-empresa.html', 'Click para conocer las razones por las cuales debes constituir formalmente tu empresa']] },
  { title: 'Plan Registra tu Marca', body: ['Muchos emprendedores invierten tiempo, recursos y esfuerzo en posicionar un nombre en el mercado, sin considerar que, si no se encuentra registrado, cualquier tercero podría utilizarlo o incluso obtener derechos exclusivos sobre él.'], pull: 'Registrar una marca es una decisión estratégica para proteger y fortalecer tu negocio.', links: [['registra-tu-marca.html', 'Click para conocer las razones por las cuales debes registrar tu marca']] },
  { title: 'Plan Inicio Seguro', body: ['Este plan incluye nuestro servicio de constitución formal de tu empresa, entre otras, junto con la presentación de la solicitud de registro de tu marca ante INAPI. De esta manera, no solo comienzas tu negocio cumpliendo con todas las formalidades legales, sino que también proteges desde el primer momento el activo más importante de tu empresa: su identidad.', 'Emprender sin una estructura jurídica adecuada o sin proteger tu marca puede significar riesgos innecesarios, conflictos futuros e incluso la pérdida del nombre que tanto esfuerzo te costó construir. Con este plan, te acompañamos en cada etapa para que puedas enfocarte en hacer crecer tu negocio con la tranquilidad de contar con un respaldo legal sólido, proyectando tu empresa de forma segura, profesional y preparada para el futuro.'], links: [['constituye-tu-empresa.html', 'Sobre los tipos de sociedades'], ['registra-tu-marca.html', 'Sobre los registros de marca']] },
];
built.push(page({
  file: 'servicios-empresas.html',
  title: 'Servicios para Empresas — AFyV Legal',
  description: 'Plan Constituye tu Empresa, Plan Registra tu Marca y Plan Inicio Seguro: constituye tu empresa y solicita el registro de tu marca por una tarifa única.',
  active: 'servicios',
  body: `
${pageHero({ label: 'Servicios', labelHref: 'servicios.html', h1: 'Servicios para <span class="hl">Empresas</span>', lede: 'En AFyV Legal ofrecemos planes que se adaptan a las necesidades y realidad de cada empresa.' })}
<div class="light">
  <section class="section" aria-label="Planes">
    <div class="wrap">
      ${plans.map((pl, i) => `<article class="plan">
        <div class="plan__head"><span class="label" data-reveal>( ${num(i)} ) Plan</span><h2 class="plan__title" data-split>${pl.title}</h2></div>
        <div class="plan__body" data-reveal="1">
          ${pl.body.map((b) => `<p>${b}</p>`).join('')}
          ${pl.pull ? `<p class="plan__pull">${pl.pull}</p>` : ''}
          <div class="plan__links">${pl.links.map(([h, l]) => `<a class="paren" href="${h}">${l}</a>`).join('')}</div>
        </div>
      </article>`).join('')}
    </div>
  </section>
</div>
<section class="band" aria-labelledby="inicio-seguro-title">
  <div class="wrap band__body">
    <span class="label" data-reveal>Plan Inicio Seguro</span>
    <h2 class="title band__title" id="inicio-seguro-title" data-split>Constituye tu empresa y solicita el registro de tu marca por una <span class="hl">tarifa única</span></h2>
    <p class="lede" data-reveal="1">Asesoría Integral a un valor conveniente con el Plan Inicio Seguro</p>
    <div data-reveal="2">${btn('#contacto', '¡Contáctanos!', 'btn--mint')}</div>
  </div>
</section>
<section class="section" style="padding-top:0;background:var(--deep)" aria-label="Qué incluye el Plan Inicio Seguro">
  <div class="wrap cards-3">
    <article class="tile" data-reveal><span class="label">( 01 )</span><div><h3 class="tile__title">Constituye tu empresa</h3><p>Constituir formalmente una empresa te permite desarrollar tu actividad de manera segura y profesional, separar tu patrimonio personal del empresarial, acceder a nuevas oportunidades comerciales y generar mayor confianza frente a clientes, proveedores e inversionistas.</p></div></article>
    <article class="tile" data-reveal="1"><span class="label">( 02 )</span><div><h3 class="tile__title">Registra tu marca</h3><p>Tu marca es uno de los activos más valiosos de tu negocio. Registrarla te otorga el derecho exclusivo a utilizarla, evita que terceros la copien o registren antes que tú y fortalece la identidad y reputación de tu empresa en el mercado.</p></div></article>
    <article class="tile" data-reveal="2"><span class="label">( 03 )</span><div><h3 class="tile__title">Beneficios de nuestro plan</h3><p>Nuestro plan te permite iniciar tu negocio con una estructura jurídica adecuada y con tu marca protegida desde el primer día. Ahorras tiempo, evitas errores y cuentas con asesoría legal integral para emprender con seguridad, tranquilidad y visión de crecimiento.</p></div></article>
  </div>
</section>`,
}));

// Reasons pages
function reasonsPage({ file, title, description, h1, intro, reasons, closing }) {
  return page({
    file, title, description, active: 'servicios',
    body: `
${pageHero({ label: 'Servicios para Empresas', labelHref: 'servicios-empresas.html', h1, lede: intro })}
<div class="light">
  <section class="section" aria-label="Razones">
    <div class="wrap reasons" data-reasons>
      <div class="reasons__counter" aria-hidden="true">
        <div class="reasons__num"><div class="reasons__num-roll">${reasons.map((_, i) => `<span>${num(i)}</span>`).join('')}</div></div>
        <p class="mono" style="margin-top:1.5rem;color:var(--ink-dim)">de ${num(reasons.length - 1)} razones</p>
      </div>
      <ol class="reasons__list">
        ${reasons.map(([t, txt], i) => `<li class="reason" data-reveal><span class="reason__idx mono">( ${num(i)} )</span><h2 class="reason__title">${t}</h2><p class="reason__text">${txt}</p></li>`).join('')}
      </ol>
    </div>
  </section>
</div>
<section class="band" aria-label="Conclusión">
  <div class="wrap band__body">
    <p class="title band__title" data-split style="margin:0">${closing}</p>
    <div data-reveal="1">${btn('#contacto', '¡Contáctanos!', 'btn--mint')}</div>
  </div>
</section>`,
  });
}

built.push(reasonsPage({
  file: 'constituye-tu-empresa.html',
  title: '¿Por qué constituir tu Empresa? — AFyV Legal',
  description: 'Constituir una empresa es una decisión estratégica que puede marcar el futuro de tu negocio. Cinco razones para formalizar tu emprendimiento.',
  h1: '¿Por qué constituir tu <span class="hl">Empresa</span>?',
  intro: 'Muchos emprendimientos comienzan como una simple idea, pero solo aquellos que se formalizan están verdaderamente preparados para crecer, atraer oportunidades y proyectarse a largo plazo. Constituir una empresa es una decisión estratégica que puede marcar el futuro de tu negocio.',
  reasons: [
    ['Separación de Patrimonios', 'Al constituir una empresa, se crea una persona jurídica distinta de sus socios. Esto permite separar el patrimonio personal del empresarial, limitando la responsabilidad a los aportes realizados a la sociedad. De esta forma, podrás desarrollar tu actividad con mayor seguridad y reducir riesgos innecesarios para tu patrimonio personal.'],
    ['Accede a oportunidades de Financiamiento', 'Una empresa formal abre la puerta a créditos bancarios, fondos concursables, subsidios estatales y programas de apoyo al emprendimiento. Además, una estructura empresarial sólida genera confianza y puede facilitar la incorporación de socios estratégicos o inversionistas interesados en impulsar el crecimiento de tu proyecto.'],
    ['Construye una empresa a tu medida', 'Cada negocio tiene necesidades distintas. La elección correcta del tipo societario permite definir cómo se administrará la empresa, cómo se distribuirán las utilidades y cuáles serán las reglas que regirán la relación entre los socios, entregando flexibilidad y seguridad para el desarrollo del negocio.'],
    ['Genera confianza', 'Clientes, proveedores y empresas prefieren relacionarse con negocios formales. Operar a través de una sociedad transmite seriedad, estabilidad y profesionalismo, fortaleciendo tu imagen comercial y aumentando tus posibilidades de generar nuevas oportunidades de negocio.'],
    ['Profesionaliza la operación de tu empresa', 'La formalización permite emitir documentos tributarios, contratar trabajadores, acceder a servicios bancarios empresariales y separar adecuadamente las finanzas personales de las de la empresa. Todo ello contribuye a una gestión más eficiente y ordenada.'],
  ],
  closing: 'Formalizar tu negocio es invertir en su futuro. Porque las grandes empresas no solo nacen de buenas ideas: se construyen sobre <span class="hl">bases legales sólidas</span>.',
}));

built.push(reasonsPage({
  file: 'registra-tu-marca.html',
  title: 'Por qué registrar tu marca — AFyV Legal',
  description: 'Tu marca es uno de los activos más valiosos de tu negocio. Cinco razones para registrarla y protegerla desde el inicio.',
  h1: 'Por qué registrar tu <span class="hl">marca</span>',
  intro: 'Tu marca es uno de los activos más valiosos de tu negocio. Registrarla te permite proteger su identidad, diferenciarte de la competencia y construir una base sólida para crecer con seguridad.',
  reasons: [
    ['Tu marca es uno de los activos más valiosos de tu negocio', 'Muchos emprendedores invierten tiempo, recursos y esfuerzo en posicionar un nombre en el mercado, sin considerar que, si no se encuentra registrado, cualquier tercero podría utilizarlo o incluso obtener derechos exclusivos sobre él. Registrar una marca es una decisión estratégica para proteger y fortalecer tu negocio.'],
    ['Asegura la exclusividad sobre tu marca', 'El registro de marca otorga el derecho exclusivo de utilizar un nombre, logo o signo distintivo respecto de determinados productos o servicios. Esto te permite diferenciarte de la competencia y evitar que terceros utilicen una identidad similar que pueda generar confusión en el mercado.'],
    ['Protege la inversión realizada en posicionar tu marca', 'Posicionar una marca requiere tiempo, dedicación y recursos. Registrar tu marca significa proteger todo ese esfuerzo y reducir el riesgo de tener que cambiar de nombre, imagen corporativa o estrategia comercial debido a conflictos con terceros.'],
    ['Protege el valor de tu marca', 'Una marca registrada constituye un activo intangible que forma parte del patrimonio de la empresa. A medida que tu negocio crece, la marca adquiere valor comercial, pudiendo incluso ser licenciada, cedida o incorporada como un activo relevante para atraer inversionistas o concretar alianzas estratégicas.'],
    ['Competitividad', 'Las empresas más exitosas del mundo tienen algo en común: protegen sus marcas desde el inicio. Registrar tu marca hoy significa asegurar la identidad de tu negocio para el futuro y construir una ventaja competitiva que perdure en el tiempo.'],
  ],
  closing: 'Porque una gran marca no solo se crea: también se <span class="hl">protege</span>.',
}));

// Equipo
built.push(page({
  file: 'equipo.html',
  title: 'Nuestro Equipo — AFyV Legal',
  description: 'Un equipo altamente capacitado, dedicado a ofrecer respuestas ágiles y efectivas, con una visión práctica y contingente del derecho.',
  active: 'equipo',
  ogImage: 'logo.webp',
  body: `
${pageHero({ label: 'Equipo', h1: 'Nuestro <span class="hl">Equipo</span>', lede: 'Somos un equipo altamente capacitado, dedicados a ofrecer respuestas ágiles y efectivas. Nos destacamos por nuestra visión práctica y contingente del derecho, abordando cada desafío legal con el compromiso de entregar soluciones reales y a la medida. Entendemos que cada cliente es único, por lo que trabajamos de manera colaborativa, combinando cercanía y rigor técnico para brindar tranquilidad y seguridad jurídica frente a un entorno en permanente cambio.' })}
<div class="light">
  <section class="section" aria-label="Integrantes">
    <div class="wrap">
      ${TEAM.map((m, i) => `<article class="profile" id="${m.slug}" aria-labelledby="${m.slug}-name">
        <div class="profile__media" data-reveal><div class="member__media"><span class="member__tag mono">( ${num(i)} )</span><img src="assets/img/${m.img}" alt="Retrato de ${m.name}" width="600" height="860" loading="lazy" decoding="async"></div></div>
        <div>
          <h2 class="profile__name" id="${m.slug}-name" data-split>${m.name}</h2>
          <p class="profile__area" data-reveal>${m.area}</p>
          <div class="profile__bio" data-reveal="1">${m.bio.map((b) => `<p>${b}</p>`).join('')}</div>
          <p class="label" data-reveal="2" style="margin-top:2.5rem">Experiencia</p>
          <ul class="profile__exp" data-reveal="2" style="margin-top:1rem">${m.exp.map((e) => `<li>${e}</li>`).join('')}</ul>
        </div>
      </article>`).join('')}
    </div>
  </section>
</div>`,
}));

// Blog
built.push(page({
  file: 'blog.html',
  title: 'AFyV Informa — Blog de AFyV Legal',
  description: 'Artículos de AFyV Legal sobre derecho civil, arrendamientos, contratos, filiación, liquidación simplificada y más.',
  active: 'blog',
  body: `
${pageHero({ label: 'Blog', h1: 'AFyV <span class="hl">Informa</span>' })}
<div class="light">
  <section class="section" aria-label="Publicaciones">
    <div class="wrap posts posts--3">${POSTS.map((p) => postCard(p)).join('')}</div>
  </section>
</div>`,
}));

// Posts
POSTS.forEach((post, idx) => {
  const more = POSTS.filter((_, i) => i !== idx).slice(0, 3);
  built.push(page({
    file: `blog/${post.slug}.html`,
    depth: 1,
    progress: true,
    title: `${post.title} — AFyV Informa`,
    description: post.excerpt.slice(0, 155),
    active: 'blog',
    ogImage: `${post.file}.webp`,
    body: `
<article aria-labelledby="t">
  <header class="article-head page-hero" data-intro style="padding-bottom:clamp(6rem,12vw,10rem)">
    <div class="hero__gl" data-gl></div>
    <div class="wrap--narrow hero__inner" style="padding:0">
      <a class="paren" href="../blog.html" data-reveal>AFyV Informa</a>
      <h1 class="article-head__title" id="t" data-split>${esc(post.title)}</h1>
      <div class="byline" data-reveal="2">
        <img src="../assets/img/${post.avatar}" alt="" width="80" height="80">
        <span><strong>${post.author}</strong> · ${post.date} · ${post.read}</span>
      </div>
    </div>
  </header>
  <div class="light">
    <figure class="article-cover wrap--narrow" style="transform:translateY(calc(-1 * clamp(4rem,10vw,8rem)));margin-bottom:calc(-1 * clamp(4rem,10vw,8rem))">
      <img src="../assets/img/${post.file}.webp" alt="Portada del artículo ${esc(post.title)}" width="960" height="540" fetchpriority="high">
    </figure>
    <div class="article-body section" style="padding-top:clamp(3rem,6vw,5rem)">
      <div class="wrap--narrow prose">${prose(post.html)}</div>
      <div class="wrap--narrow article-foot">
        <a class="paren" href="../blog.html">Volver a AFyV Informa</a>
        ${btn('#contacto', '¡Contáctanos!', 'btn--dark')}
      </div>
    </div>
    <section class="section" style="padding-top:0" aria-labelledby="mas-title">
      <div class="wrap">
        <div class="section-head"><span class="label">Sigue leyendo</span><h2 class="title-sm" id="mas-title">Más publicaciones</h2></div>
        <div class="posts posts--3">${more.map((p) => postCard(p, 1)).join('')}</div>
      </div>
    </section>
  </div>
</article>`,
  }));
});

// Legal
for (const [file, title, src, desc] of [
  ['terminos-y-condiciones.html', 'Términos y Condiciones', 'terminos', 'Términos y Condiciones de acceso, uso y consulta del sitio web de AFyV Legal.'],
  ['politica-de-privacidad.html', 'Política de Privacidad', 'privacidad', 'Política de tratamiento de datos personales de AFyV Legal.'],
]) {
  const other = file.startsWith('terminos') ? ['politica-de-privacidad.html', 'Ver Política de Privacidad'] : ['terminos-y-condiciones.html', 'Ver Términos y Condiciones'];
  built.push(page({
    file,
    title: `${title} — AFyV Legal`,
    description: desc,
    active: 'legal',
    contactOpts: false,
    body: `
${pageHero({ label: 'Avisos Legales', h1: title, lede: `<a class="paren" href="${other[0]}">${other[1]}</a>` })}
<div class="light">
  <section class="section">
    <div class="wrap--narrow prose prose--legal">${prose(read(`content/${src}.html`))}</div>
  </section>
</div>`,
  }));
}

console.log(`Built ${built.length} pages:\n  ${built.join('\n  ')}`);
