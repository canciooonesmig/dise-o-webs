// Generates the static AFyV Legal site from the content in this folder.
// Usage: node afyv-legal/_src/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as D from './data.mjs';

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
  { href: 'servicios.html', label: 'Servicios y precios', key: 'servicios' },
  { href: 'ia-responsable.html', label: 'IA responsable', key: 'ia' },
  { href: 'equipo.html', label: 'Equipo', key: 'equipo' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICON = {
  check: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="lock__shackle" d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/></svg>',
  clock: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 4.6V8l2.4 1.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  arrow: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  diag: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.1 8.1c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.5.9 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .5-.2 1.1-.6 1.4-.5.4-1.2.6-2 .4a8.2 8.2 0 0 1-5.2-4.6c-.4-1-.3-1.9.2-2.5Z" fill="currentColor"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 9h3v10.5h-3zM6 4.2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM10 9h2.9v1.5c.4-.8 1.5-1.7 3.1-1.7 3.2 0 3.8 2.1 3.8 4.8v5.9h-3v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8v5.3h-3z" fill="currentColor"/></svg>',
};

/* ───────────── Content ───────────── */


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
    titulo: 'Abogada',
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
    bio: ['Gabriel se ha especializado en Derecho Civil y Laboral, con un enfoque práctico y riguroso en la resolución de asuntos jurídicos.'],
    exp: ['AFyV Legal'],
  },
];

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
<div class="curtain" aria-hidden="true"><span class="curtain__mark">AFyV</span><span class="curtain__count mono" data-count></span><span class="curtain__tag mono">La IA prepara · el equipo decide</span></div>
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
  return `<section class="contact ink" id="contacto" aria-labelledby="contacto-title">
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
        <p class="title-sm" style="margin:0 0 1rem">${D.REGLA.ia}<br>${D.REGLA.equipo}</p>
        <span class="footer__clock" data-clock>Santiago, Chile</span>
      </div>
      <div class="footer__col"><span class="mono">Navegación</span>${NAV.map((n) => `<a href="${p}${n.href}">${n.label}</a>`).join('')}</div>
      <div class="footer__col"><span class="mono">Redes</span><a href="${SITE.instagram}" rel="noopener">Instagram</a><a href="${SITE.whatsapp}" rel="noopener">WhatsApp</a><a href="${SITE.linkedin}" rel="noopener">LinkedIn</a></div>
      <div class="footer__col"><span class="mono">Contacto</span><a href="mailto:${SITE.email}">${SITE.email}</a><a href="${SITE.whatsapp}" rel="noopener">${SITE.phone.replace(/ /g, '&nbsp;')}</a><span style="color:var(--text-soft)">${SITE.city}</span></div>
    </div>
    <div class="footer__notes">
      ${seal('footer')}
      <div>
        <p><strong>Aviso legal.</strong> La información de este sitio no es asesoría legal. La relación con el estudio se rige por la carta de encargo.</p>
        <p><strong>Privacidad.</strong> Este sitio no usa cookies ni herramientas que identifiquen a sus visitantes.</p>
      </div>
    </div>
  </div>
  <p class="footer__mark" aria-hidden="true"><span>A</span><span>F</span><span>y</span><span>V</span></p>
  <div class="wrap footer__legal mono">
    <span>© ${new Date().getFullYear()} AFyV Legal</span>
    <nav aria-label="Avisos legales"><a href="${p}ia-responsable.html">Uso de IA</a><a href="${p}terminos-y-condiciones.html">Términos y Condiciones</a><a href="${p}politica-de-privacidad.html">Política de Privacidad</a></nav>
  </div>
</footer>`;
}

/* Marked placeholder for data the partners still have to define */
const pend = (label) => `<span class="pending" title="Dato pendiente: debe definirse antes de publicar">${label}<em>por confirmar</em></span>`;

/* Rotating notarial seal */
function seal(id, text = 'AFyV LEGAL · SANTIAGO DE CHILE · ') {
  return `<span class="seal" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="seal-${id}" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs>
    <circle cx="60" cy="60" r="57" class="seal__ring"/><circle cx="60" cy="60" r="35" class="seal__ring"/>
    <g class="seal__text"><text><textPath href="#seal-${id}" textLength="286">${text}</textPath></text></g>
    <text x="60" y="66" text-anchor="middle" class="seal__mark">AFyV</text></svg></span>`;
}

/* AI notice (texto 5.2 de la due diligence) */
const avisoIA = (p = '', ctx = '') => `<aside class="aviso-ia" aria-label="Cómo usamos la IA">
  <span class="aviso-ia__tag mono">Cómo usamos la IA</span>
  <p>${ctx || D.AVISO_IA}</p>
  <a class="paren" href="${p}ia-responsable.html">Ver detalle</a>
</aside>`;

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
<script src="${p}assets/vendor/ScrambleTextPlugin.min.js" defer></script>
<script src="${p}assets/vendor/DrawSVGPlugin.min.js" defer></script>
<script src="${p}assets/vendor/Flip.min.js" defer></script>
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

const pageHero = ({ label, h1, lede = '', labelHref }) => `<section class="page-hero ink" data-intro aria-labelledby="t">
  <div class="hero__gl" data-gl></div>
  <div class="wrap page-hero__grid hero__inner" style="padding:0">
    <div>
      <span class="label" data-reveal>${labelHref ? `<a href="${labelHref}" style="text-decoration:none">${label}</a>` : label}</span>
      <h1 class="display" id="t" data-split>${h1}</h1>
    </div>
    ${lede ? `<p class="lede" data-reveal="2">${lede}</p>` : ''}
  </div>
</section>`;

const member = (m, i) => `<a class="member" href="equipo.html#${m.slug}">
  <div class="member__media"><span class="member__tag mono">( ${num(i)} )</span><img src="assets/img/${m.img}" alt="Retrato de ${m.name}" width="600" height="860" loading="lazy" decoding="async"></div>
  <p class="member__name">${m.name}</p>
  <p class="member__role">${m.titulo ? `${m.titulo} · ` : ''}${m.area}</p>
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

function cifras(label = '( 03 ) Chile en cifras') {
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
          <span class="label${label.startsWith('Título') ? ' label--titulo' : ''}" data-reveal>${label.startsWith('Título') ? label.replace(/^(Título \S+) · (.*)$/, '<span class="label__t">$1</span><span aria-hidden="true">·</span> $2') : label} ${FLAG_CL.replace('class="flag-cl"', 'class="flag-cl flag-cl--sm"').replace(/flag-clip|flag-shade/g, (m) => `${m}-2`)}</span>
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



/* ───────────── AFyV partials ───────────── */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const titulo = (n, text) => `<span class="label label--titulo" data-reveal><span class="label__t">Título ${ROMAN[n - 1]}</span><span aria-hidden="true">·</span> ${text}</span>`;
const clp = (n) => `$${fmt(n)}`;
const conIVA = (n) => Math.round(n * 1.19);
const priceNum = (n) => `<span class="price__num" data-net="${n}" data-gross="${conIVA(n)}">${clp(n)}</span>`;
const iaNote = (text) => `<p class="ia-note" data-reveal><span class="ia-note__dot" aria-hidden="true"></span><span class="ia-note__k mono">Con IA</span><span>${text}</span></p>`;

function priceOf(sv, small = false) {
  if (sv.cotizacion) return `<span class="price${small ? ' price--sm' : ''}"><span class="price__quote">Cotización por etapa</span></span>`;
  return `<span class="price${small ? ' price--sm' : ''}">${sv.desde ? '<span class="price__pre">desde</span>' : ''}${priceNum(sv.precio)}${sv.mensual ? '<span class="price__post">al mes</span>' : ''}</span>`;
}
const badges = (sv) => [sv.tasas ? '<span class="tag">+ tasas oficiales</span>' : '', sv.exito ? '<span class="tag">+ 10% de lo recuperado</span>' : ''].join('');

const SIGNATURE = '<svg class="sign" viewBox="0 0 320 110" aria-hidden="true"><path class="sign__path" d="M10 78c18-30 34-58 46-58 10 0-6 52-2 60 6 10 24-44 34-44 8 0 2 34 10 34 10 0 18-30 28-30 8 0 0 26 8 26 14 0 22-40 36-40 10 0-4 30 6 30 12 0 20-22 34-22 12 0 6 18 16 18 18 0 36-16 60-18M40 96c60-6 140-10 250-8"/></svg>';

const GLYPH = {
  Rapidez: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="g" cx="24" cy="26" r="16"/><path class="g" d="M24 26l7-9M20 6h8M24 6v4"/></svg>',
  Precio: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="g" d="M8 24 24 8h16v16L24 40z"/><circle class="g" cx="32" cy="16" r="3"/></svg>',
  Rigor: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="g" cx="21" cy="21" r="12"/><path class="g" d="M30 30l10 10M15 21h12M21 15v12"/></svg>',
  Criterio: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="g" d="M24 8v32M14 40h20M24 10l-14 4M24 10l14 4M10 14 5 26h10zM38 14l-5 12h10z"/></svg>',
  shield: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="g" d="M24 5 9 11v12c0 10 6.5 17 15 20 8.5-3 15-10 15-20V11z"/><path class="g" d="M17 24l5 5 9-10"/></svg>',
  folder: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="g" d="M6 14h13l4 4h19v20H6z"/><rect class="g" x="19" y="24" width="10" height="9" rx="1.5"/><path class="g" d="M21 24v-3a3 3 0 0 1 6 0v3"/></svg>',
  nodata: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse class="g" cx="24" cy="12" rx="13" ry="5"/><path class="g" d="M11 12v22c0 3 6 5 13 5s13-2 13-5V12M11 23c0 3 6 5 13 5s13-2 13-5"/><path class="g" d="M6 42 42 6"/></svg>',
  filter: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="g" d="M7 9h34L28 25v12l-8 4V25z"/></svg>',
  erase: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="g" d="M10 14h28M19 14V9h10v5M14 14l2 26h16l2-26M21 21v12M27 21v12"/></svg>',
};

const ART2 = {
  marca: `<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <circle class="art-line draw" cx="270" cy="270" r="150"/><circle class="art-line draw" cx="270" cy="270" r="118" style="opacity:.5"/>
    <path class="art-line draw" style="stroke-width:2" d="M226 340V200h52c30 0 48 16 48 40s-18 40-48 40h-52M286 280l44 60"/>
    <path class="art-line draw" style="stroke-width:2" d="M376 376l120 120"/><circle class="art-glow" cx="496" cy="496" r="6"/>
  </svg>`,
  balanza: `<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path class="art-line draw" d="M300 120V470M220 470H380M300 120l-150 40M300 120l150 40"/>
    <path class="art-line draw" d="M150 160l-60 140h120zM450 160l-60 140h120z"/>
    <path class="art-line draw" d="M90 300c0 30 120 30 120 0M390 300c0 30 120 30 120 0"/>
    <circle class="art-line draw" cx="300" cy="110" r="14"/><circle class="art-glow" cx="300" cy="110" r="5"/>
  </svg>`,
};
const lineArt = { marcas: ART2.marca, corporativo: ART.empresa.replace(/style="color:[^"]*"/, ''), litigios: ART2.balanza, suscripcion: ART.red.replace(/style="color:[^"]*"/, '') };

/* Organic flow: a wave connects the stages; the team conducts, the AI assists */
function flowOrganic() {
  const n = D.FLUJO.length;
  const pts = D.FLUJO.map((_, i) => [((i + 0.5) / n) * 1000, i % 2 ? 118 : 42]);
  let d = `M0 80 C ${pts[0][0] * 0.5} 80, ${pts[0][0] * 0.5} ${pts[0][1]}, ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < n; i++) { const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i]; const mx = (x0 + x1) / 2; d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`; }
  d += ` C ${pts[n - 1][0] + 40} ${pts[n - 1][1]}, ${960} 80, 1000 80`;
  return `<div class="flowo" data-flowo>
    <div class="flowo__wave" aria-hidden="true">
      <svg viewBox="0 0 1000 160" preserveAspectRatio="none"><path class="flowo__ghost" d="${d}"/><path class="flowo__path" d="${d}"/></svg>
      ${pts.map(([x, y], i) => `<span class="flowo__node${D.FLUJO[i].ai ? ' is-ai' : ''}${D.FLUJO[i].key ? ' is-key' : ''}" style="left:${x / 10}%;top:${(y / 160) * 100}%"><span>${i + 1}</span></span>`).join('')}
    </div>
    <ol class="flowo__steps">
      ${D.FLUJO.map((f) => `<li class="flowo__step">
        <span class="flowo__num mono" aria-hidden="true">${String(f.n).padStart(2, '0')}</span>
        <h3 class="flowo__t">${f.t}</h3>
        <span class="flowo__who${f.ai ? ' is-ai' : ''}">${f.who}</span>
        <p>${f.d}</p>
      </li>`).join('')}
    </ol>
  </div>`;
}

const limitCard = (l, i) => `<article class="limit" data-reveal="${i % 3}">
  <div class="limit__head"><span class="limit__lock">${ICON.lock}</span><span class="mono">${String(i + 1).padStart(2, '0')}</span></div>
  <h3 class="limit__t">${l.t}</h3>
  <p>${l.d}</p>
</article>`;

const DOC_LINES = [
  ['Primero. Objeto.', 'El prestador realizará los servicios descritos en el Anexo 1, con la calidad y diligencia propias de su oficio.'],
  ['Segundo. Precio.', 'El precio total es de $1.200.000, pagadero en dos cuotas contra la emisión de la boleta respectiva.'],
  ['Tercero. Plazo.', 'El contrato rige desde su firma y dura doce meses, renovable por acuerdo escrito de las partes.'],
];

const REVIEW_STEPS = [
  ['La IA prepara el borrador', 'Ordena los antecedentes y propone una primera versión.', 'IA'],
  ['El equipo analiza y decide', 'Valora los argumentos, ajusta la estrategia y agrega lo que falta.', 'Equipo'],
  ['Verificamos cada fuente', 'Lo que no se puede comprobar en su origen oficial, no se usa.', 'Equipo'],
  ['Firmamos y entregamos', 'Con lectura completa y una explicación clara para ti.', 'Equipo'],
];

function reviewScene(n) {
  return `<section class="review dark" data-review aria-labelledby="review-title">
  <div class="wrap review__stage">
    <div class="review__copy">
      ${titulo(n, 'Del borrador a la firma')}
      <h2 class="title-sm" id="review-title" style="margin:1.5rem 0 2rem">Así participa la IA en un encargo, y así lo conduce AFyV&nbsp;Legal.</h2>
      <ol class="review__steps">
        ${REVIEW_STEPS.map(([t, d, who], i) => `<li class="review__step${i === 0 ? ' is-active' : ''}"><span class="mono">${String(i + 1).padStart(2, '0')} · ${who}</span><strong>${t}</strong><span>${d}</span></li>`).join('')}
      </ol>
    </div>
    <div class="review__doc" aria-hidden="true">
      <div class="doc" data-state="0">
        <div class="doc__bar">
          <span class="doc__state"><span class="doc__state-i" data-state="0">Borrador IA</span><span class="doc__state-i" data-state="1">En análisis</span><span class="doc__state-i" data-state="2">En verificación</span><span class="doc__state-i" data-state="3">Entregable firmado</span></span>
          <span class="mono doc__meta">Expediente reservado</span>
        </div>
        <div class="doc__body">
          <p class="doc__h">Contrato de prestación de servicios</p>
          ${DOC_LINES.map(([h, t]) => `<p class="doc__line"><strong>${h}</strong> <span class="doc__type">${t}</span><span class="doc__ok">${ICON.check}</span></p>`).join('')}
          <p class="doc__line doc__line--bad"><strong>Cuarto.</strong> <span class="doc__type">Según el fallo Rol 0000-2025, esta cláusula se entiende siempre válida.</span><span class="doc__flag">Fuente no verificable: se retira</span></p>
          <div class="doc__added"><div><p class="doc__line doc__line--new"><strong>Cuarto. Término anticipado.</strong> <span>Cualquiera de las partes podrá poner término al contrato con aviso escrito de treinta días.</span></p></div></div>
          <span class="doc__note"><span class="mono">Nota del equipo</span>Agregar término anticipado: protege al cliente si el servicio no cumple.</span>
          <div class="doc__checks">
            ${['Hechos y antecedentes', 'Normativa vigente', 'Fuentes verificadas', 'Estrategia y riesgos', 'Confidencialidad'].map((c) => `<span class="doc__check"><span class="doc__box">${ICON.check}</span>${c}</span>`).join('')}
          </div>
          <div class="doc__sign">
            <div><span class="mono">Responsable del encargo</span>${SIGNATURE}</div>
            ${seal('doc', 'REVISADO Y FIRMADO · AFyV LEGAL · ')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

const svcRow = (sv) => `<li><span>${sv.nombre}</span><span class="dots" aria-hidden="true"></span>${priceOf(sv, true)}</li>`;

/* ───────────── Pages ───────────── */

const built = [];

// Inicio
built.push(page({
  file: 'index.html',
  title: 'AFyV Legal — Estudio para pymes, con IA responsable',
  description: 'Marcas, corporativo pyme, litigios y asesoría mensual para pymes en Chile, con precio fijo conocido antes de empezar. La IA prepara; nuestro equipo analiza, decide, firma y responde.',
  active: 'inicio',
  ogImage: 'logo.webp',
  contactOpts: { lede: 'Cuéntanos qué necesitas. Te respondemos con una propuesta de precio fijo y alcance claro.' },
  body: `
<section class="hero hero--v3 ink" data-intro aria-labelledby="hero-title">
  <div class="hero__gl" data-gl></div>
  <div class="frame" aria-hidden="true"><span class="frame__l frame__l--t"></span><span class="frame__l frame__l--b"></span><span class="frame__l frame__l--l"></span><span class="frame__l frame__l--r"></span>
    <span class="frame__c frame__c--tl mono" data-scramble>AFyV Legal</span><span class="frame__c frame__c--tr mono" data-scramble>IA responsable</span>
    <span class="frame__c frame__c--bl mono" data-scramble>Marcas · Corporativo · Litigios · Suscripción</span><span class="frame__c frame__c--br mono" data-scramble>Precio fijo · Horas hábiles</span>
  </div>
  <div class="wrap hero__inner">
    <div class="hero__top">
      <span class="label" data-reveal>Estudio para pymes y emprendedores</span>
      <span class="hero__place" data-reveal="1">${FLAG_CL}<span class="mono">Santiago, Chile</span></span>
    </div>
    <h1 class="hero__title" id="hero-title">
      <span class="hero__machine mono" data-type-intro>${D.REGLA.ia}</span>
      <span class="hero__human" data-split>Nuestro equipo analiza, decide, <span class="hl">firma</span> y&nbsp;responde.</span>
    </h1>
    <div class="hero__row">
      <div class="hero__sign" data-sign-intro aria-hidden="true">${SIGNATURE}<span class="mono">Firma del responsable del encargo</span>${seal('hero', 'REVISADO Y FIRMADO · AFyV LEGAL · ')}</div>
      <div class="hero__actions" data-reveal="3">
        ${btn('servicios.html', 'Servicios y precios')}
        <a class="paren" href="#ia">Cómo usamos la IA</a>
      </div>
    </div>
  </div>
</section>

<div class="ribbon" aria-hidden="true">
  <div class="ribbon__track" data-ribbon>
    ${[0, 1].map(() => `<div class="ribbon__group">${['Rapidez', 'Precio fijo', 'Rigor', 'Criterio humano', 'Reserva', 'Transparencia'].map((w) => `<span>${w}</span>`).join('')}</div>`).join('')}
  </div>
</div>

<div class="light">
  <section class="section" id="ia" aria-labelledby="ia-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          ${titulo(1, 'Cómo usamos la IA')}
          <h2 class="title" id="ia-title" data-split style="margin-top:1.5rem">La IA nos da velocidad. <span class="hl">El criterio es nuestro.</span></h2>
        </div>
        <p class="lede" data-reveal="1">Usamos inteligencia artificial para preparar y ordenar. Nuestro equipo analiza, decide y responde por cada entrega.</p>
      </div>
      <div class="virtues">
        ${D.VIRTUDES.map((v, i) => `<article class="virtue" data-tilt data-reveal="${i}">
          <div class="virtue__top"><span class="virtue__glyph">${GLYPH[v.k]}</span><span class="mono">${String(i + 1).padStart(2, '0')} · ${v.k}</span></div>
          <h3 class="virtue__t">${v.t}</h3>
          <p>${v.d}</p>
        </article>`).join('')}
      </div>
      <div style="margin-top:clamp(1.5rem,3vw,2.5rem)" data-reveal>${avisoIA()}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="promesas-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          ${titulo(2, 'Lo que puedes esperar')}
          <h2 class="title" id="promesas-title" data-split style="margin-top:1.5rem">Cinco compromisos <span class="hl">por escrito</span></h2>
        </div>
        ${iaNote('La IA acorta los tiempos; estos compromisos no cambian.')}
      </div>
      <ol class="clauses doc-paper">
        ${D.PROMESAS.map((pr, i) => `<li class="clause" data-reveal>
          <span class="clause__n">§ ${i + 1}</span>
          <div><h3 class="clause__t">${pr.t}</h3><p>${pr.d}</p></div>
          <span class="clause__stamp" aria-hidden="true">${ICON.check}</span>
        </li>`).join('')}
      </ol>
    </div>
  </section>
</div>

${reviewScene(3)}

<div class="light">
  <section class="section" aria-labelledby="lineas-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          ${titulo(4, 'Servicios y precios')}
          <h2 class="title" id="lineas-title" data-split style="margin-top:1.5rem">Cuatro líneas, <span class="hl">precio fijo</span></h2>
        </div>
        <p class="lede" data-reveal="1">Precios sin IVA, conocidos antes de empezar. Las tasas oficiales se cobran aparte cuando corresponde.</p>
      </div>
      <div class="lines">
        ${D.LINEAS.map((ln, i) => {
          const items = ln.id === 'suscripcion' ? D.PLANES.map((pl) => ({ nombre: `Plan ${pl.nombre}`, precio: pl.precio, mensual: true })) : D.SERVICIOS.filter((s) => s.linea === ln.id);
          return `<article class="line-card" data-tilt data-reveal="${i % 2}">
            <a class="line-card__link" href="servicios.html#${ln.id}" aria-label="${ln.nombre}: ver alcance y plazos"></a>
            <div class="line-card__art">${lineArt[ln.id]}</div>
            <div class="line-card__head"><span class="mono">${String(i + 1).padStart(2, '0')}</span><span class="line-card__arrow" aria-hidden="true">${ICON.diag}</span></div>
            <h3 class="line-card__t">${ln.nombre}</h3>
            <p class="line-card__d">${ln.bajada}</p>
            <ul class="svc-mini">${items.slice(0, 4).map(svcRow).join('')}</ul>
            <p class="line-card__ia"><span class="ia-note__dot" aria-hidden="true"></span>${ln.ia}</p>
          </article>`;
        }).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="flujo-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          ${titulo(5, 'Cómo trabajamos')}
          <h2 class="title" id="flujo-title" data-split style="margin-top:1.5rem">El equipo conduce. <span class="hl">La IA acompaña.</span></h2>
        </div>
        <p class="lede" data-reveal="1">Seis pasos, de tu primera consulta a la entrega firmada.</p>
      </div>
      ${flowOrganic()}
    </div>
  </section>

  ${cifras('Título VI · Chile en cifras')}
  <div class="wrap" style="margin-top:calc(-1 * clamp(3rem,7vw,6rem));padding-bottom:clamp(4rem,8vw,7rem)">${iaNote('Más empresas y marcas cada año: la IA nos permite atender más encargos sin bajar el estándar.')}</div>
</div>

<section class="hscroll section dark" data-hscroll aria-labelledby="equipo-title" style="padding-block:clamp(5rem,10vw,8rem)">
  <div class="hscroll__track">
    <div class="hscroll__intro">
      <div>
        ${titulo(7, 'Equipo')}
        <h2 class="title-sm" id="equipo-title" data-split style="margin-top:1.5rem">Un equipo que <span class="hl">firma</span> lo que entrega</h2>
        ${iaNote('Trabajamos con IA todos los días, y respondemos por cada resultado.')}
      </div>
      <div data-reveal>${btn('equipo.html', 'Conoce al equipo', 'btn--ghost')}</div>
    </div>
    ${TEAM.map(member).join('')}
  </div>
</section>`,
}));

// Servicios y precios
const svcCard = (sv) => `<article class="svc-card${sv.destacado ? ' is-featured' : ''}" data-line="${sv.linea}">
  <div class="svc-card__top">
    <span class="mono svc-card__line">${D.LINEAS.find((l) => l.id === sv.linea).nombre}</span>
    <span class="mono svc-card__modo">${sv.modo}</span>
  </div>
  <h3 class="svc-card__t">${sv.nombre}</h3>
  ${priceOf(sv)}
  <div class="svc-card__tags">${badges(sv)}</div>
  <p class="svc-card__d">${sv.desc}</p>
  <p class="svc-card__plazo">${ICON.clock}<span>${sv.plazo}</span></p>
  <details class="ficha">
    <summary><span>Ficha de alcance</span><span class="ficha__plus" aria-hidden="true"></span></summary>
    <div class="ficha__body">
      <p class="mono">Incluye</p>
      <ul>${sv.incluye.map((x) => `<li>${ICON.check}<span>${x}</span></li>`).join('')}</ul>
      ${sv.nota ? `<p class="ficha__nota">${sv.nota}</p>` : ''}
      <p class="ficha__nota">Si aparece trabajo fuera de este alcance, te lo cotizamos antes y solo se hace con tu aceptación.</p>
      <p class="ficha__sinia">${D.SIN_IA}</p>
    </div>
  </details>
</article>`;

built.push(page({
  file: 'servicios.html',
  title: 'Servicios y precios — AFyV Legal',
  description: 'Marcas, corporativo pyme, litigios y suscripción Abogado de tu Pyme. Precio fijo conocido antes de empezar y plazos en horas hábiles.',
  active: 'servicios',
  contactOpts: { title: 'Cotiza tu encargo', lede: 'Cuéntanos qué necesitas y te enviamos un precio fijo con alcance claro.' },
  body: `
${pageHero({ label: 'Servicios y precios', h1: 'Precio fijo, <span class="hl">conocido antes</span> de empezar', lede: 'Cuatro líneas para pymes y emprendedores. Cada servicio tiene un alcance definido, y nuestro equipo revisa y firma cada entrega.' })}
<div class="light">
  <section class="section" aria-label="Tarifario">
    <div class="wrap">
      <div style="margin-bottom:clamp(1.5rem,3vw,2.5rem)" data-reveal>${avisoIA('', 'La IA prepara los borradores y agiliza las búsquedas; por eso podemos publicar precios fijos y plazos en horas hábiles. Nuestro equipo revisa, corrige y firma cada entrega. ' + D.SIN_IA)}</div>
      <div class="tarifa-bar" data-reveal>
        <div class="filters" role="group" aria-label="Filtrar por línea">
          <button type="button" class="filter is-on" data-filter="all" aria-pressed="true">Todos</button>
          ${D.LINEAS.filter((l) => l.id !== 'suscripcion').map((l) => `<button type="button" class="filter" data-filter="${l.id}" aria-pressed="false">${l.nombre}</button>`).join('')}
        </div>
        <div class="iva" role="group" aria-label="Mostrar precios">
          <button type="button" class="iva__opt is-on" data-iva="net" aria-pressed="true">Sin IVA</button>
          <button type="button" class="iva__opt" data-iva="gross" aria-pressed="false">Con IVA</button>
          <span class="iva__knob" aria-hidden="true"></span>
        </div>
      </div>
      <p class="visually-hidden" aria-live="polite" data-tarifa-status></p>
      ${D.LINEAS.filter((l) => l.id !== 'suscripcion').map((l) => `<span id="${l.id}" class="anchor"></span>`).join('')}
      <div class="svc-grid" data-svc-grid>${D.SERVICIOS.map(svcCard).join('')}</div>
      <p class="figref mono" style="margin-top:2rem">Precios en pesos chilenos. IVA 19%. Las tasas oficiales (INAPI, notaría, Diario Oficial) se cobran aparte cuando se indica.</p>
    </div>
  </section>

  <section class="section" id="suscripcion" aria-labelledby="sus-title" style="padding-top:0">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          <span class="label" data-reveal>Suscripción</span>
          <h2 class="title" id="sus-title" data-split style="margin-top:1.5rem">Abogado de tu <span class="hl">Pyme</span></h2>
        </div>
        <p class="lede" data-reveal="1">${D.PLANES_REGLAS.respuesta}. Cada plan define por escrito qué incluye.</p>
      </div>
      <div class="plans">
        ${D.PLANES.map((pl, i) => `<article class="plan-card${pl.destacado ? ' is-featured' : ''}" data-tilt data-reveal="${i}">
          <p class="mono">Plan</p>
          <h3 class="plan-card__t">${pl.nombre}</h3>
          <span class="price">${priceNum(pl.precio)}<span class="price__post">al mes</span></span>
          <ul>${pl.items.map((x) => `<li>${ICON.check}<span>${x}</span></li>`).join('')}</ul>
          <p class="svc-card__plazo">${ICON.clock}<span>${D.PLANES_REGLAS.respuesta}</span></p>
        </article>`).join('')}
      </div>
      <div class="plans-rules doc-paper" data-reveal>
        <dl>${D.PLANES_REGLAS.definiciones.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
          <div><dt>No incluido en los planes</dt><dd>${D.PLANES_REGLAS.excluido}</dd></div>
          <div><dt>Baja</dt><dd>${D.PLANES_REGLAS.baja}</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="como-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          <span class="label" data-reveal>Cómo trabajamos</span>
          <h2 class="title-sm" id="como-title" data-split style="margin-top:1.5rem">De tu consulta a la entrega firmada</h2>
        </div>
        <a class="paren" href="ia-responsable.html" data-reveal="1">IA responsable</a>
      </div>
      ${flowOrganic()}
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="opiniones-title">
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

// IA responsable
built.push(page({
  file: 'ia-responsable.html',
  title: 'IA responsable — AFyV Legal',
  description: 'Cómo usa AFyV Legal la inteligencia artificial: la IA prepara; nuestro equipo analiza, decide, firma y responde. Seguridad de la información, consentimiento y opción sin IA.',
  active: 'ia',
  body: `
${pageHero({ label: 'Transparencia', h1: 'IA <span class="hl">responsable</span>', lede: 'La IA nos permite trabajar más rápido y con precio fijo. El criterio, las decisiones y la responsabilidad son siempre de nuestro equipo.' })}

<section class="golden" aria-label="Regla de oro">
  <div class="wrap">
    <span class="label" data-reveal>Nuestra regla</span>
    <p class="golden__text"><span class="golden__ai mono" data-type>${D.REGLA.ia}</span> <span data-words-light>${D.REGLA.equipo}</span></p>
  </div>
</section>

<div class="light">
  <section class="section" aria-labelledby="roles-title">
    <div class="wrap">
      <div class="section-head">
        ${titulo(1, 'Quién hace qué')}
        <h2 class="title" id="roles-title" data-split style="margin-top:1.5rem">La IA asiste. <span class="hl">El equipo decide.</span></h2>
      </div>
      <div class="versus">
        <div class="versus__col" data-reveal>
          <p class="versus__k mono"><span class="versus__dot versus__dot--ai"></span>Lo que hace la IA</p>
          <ul>${D.USOS_IA.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div>
        <div class="versus__divider" aria-hidden="true"><span></span></div>
        <div class="versus__col" data-reveal="1">
          <p class="versus__k mono"><span class="versus__dot"></span>Lo que hace nuestro equipo</p>
          <ul>${D.USOS_EQUIPO.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </section>
</div>

<section class="flow dark" data-flow aria-labelledby="flow-title">
  <div class="wrap flow__stage">
    <div class="flow__head">
      ${titulo(2, 'Cómo trabajamos')}
      <h2 class="title-sm" id="flow-title" style="margin-top:1.5rem">Seis pasos. El equipo conduce cada uno.</h2>
    </div>
    <div class="flow__track" aria-hidden="true">
      <div class="flow__rail"><span class="flow__fill"></span></div>
      ${D.FLUJO.map((f, i) => `<span class="flow__node${f.key ? ' is-key' : ''}${f.ai ? ' is-ai' : ''}" style="--x:${(i / (D.FLUJO.length - 1)) * 100}%"><span>${f.n}</span></span>`).join('')}
    </div>
    <ol class="flow__cards">
      ${D.FLUJO.map((f) => `<li class="flow__card${f.key ? ' is-key' : ''}">
        <span class="flow__num">${String(f.n).padStart(2, '0')}</span>
        <div>
          <p class="mono flow__who">${f.who}</p>
          <h3 class="flow__t">${f.t}</h3>
          <p>${f.d}</p>
        </div>
      </li>`).join('')}
    </ol>
  </div>
</section>

<div class="light">
  <section class="section" aria-labelledby="limites-title">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div>
          ${titulo(3, 'Sin excepciones')}
          <h2 class="title" id="limites-title" data-split style="margin-top:1.5rem">Cinco reglas <span class="hl">que no cambian</span></h2>
        </div>
        <p class="lede" data-reveal="1">Valen para cada encargo, con o sin IA.</p>
      </div>
      <div class="limits limits--light">${D.LIMITES.map(limitCard).join('')}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="check-title" style="padding-top:0">
    <div class="wrap check-grid">
      <div>
        ${titulo(4, 'Antes de cada entrega')}
        <h2 class="title-sm" id="check-title" data-split style="margin:1.5rem 0 1.5rem">Lo que revisamos antes de firmar</h2>
        <p class="lede" data-reveal>Cada entrega se lee completa en su versión final. Los escritos judiciales, las oposiciones y los pactos de socios pasan además por una segunda revisión.</p>
      </div>
      <ol class="checklist checklist--rich doc-paper" data-checklist>
        ${D.CHECKLIST.map(([t, d], i) => `<li><span class="checklist__box">${ICON.check}</span><span class="mono checklist__n">${num(i)}</span><span><strong>${t}</strong><em>${d}</em></span></li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="section" aria-labelledby="datos-title" style="padding-top:0">
    <div class="wrap">
      <div class="secret">
        <div class="secret__head">
          ${titulo(5, 'Tu información')}
          <h2 class="title" id="datos-title" data-split style="margin-top:1.5rem">Secreto profesional <span class="hl">primero</span></h2>
          <p class="lede" data-reveal="1">Tu información es reservada. Así la protegemos cuando trabajamos con IA.</p>
        </div>
        <div class="secret__grid">
          ${D.RESGUARDOS.map((r, i) => `<article class="secret__card" data-reveal="${i}"><span class="secret__icon">${GLYPH[['folder', 'nodata', 'filter', 'erase'][i]]}</span><h3>${r.t}</h3><p>${r.d}</p></article>`).join('')}
        </div>
      </div>
      <div class="rules doc-paper" data-reveal>
        <div class="rules__head"><span class="secret__icon">${GLYPH.shield}</span><h3 class="title-sm">Requisitos de seguridad para el uso de IA</h3></div>
        <ol class="rules__list">${D.SEGURIDAD_IA.map((x, i) => `<li><span class="rules__n">${i + 1}</span><p>${x}</p></li>`).join('')}</ol>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="decides-title" style="padding-top:0">
    <div class="wrap">
      <div class="section-head">
        ${titulo(6, 'Tú decides')}
        <h2 class="title" id="decides-title" data-split style="margin-top:1.5rem">Consentimiento expreso, <span class="hl">y siempre una alternativa</span></h2>
      </div>
      <div class="consent">
        <div class="consent__mock doc-paper" data-reveal aria-hidden="true">
          <p class="mono">Carta de encargo</p>
          <label class="consent__row"><span class="consent__box"></span>Acepto la carta de encargo</label>
          <label class="consent__row consent__row--ia"><span class="consent__box" data-consent-box>${ICON.check}</span>Leí y acepto la cláusula de uso de IA</label>
          <p class="consent__alt">o <u>prefiero que mi encargo se trabaje sin IA</u></p>
        </div>
        <div class="consent__facts">
          <p data-reveal><strong>Antes de contratar</strong> sabes cómo usamos la IA y qué herramienta empleamos: lo detalla la cláusula de uso de IA.</p>
          <p data-reveal="1"><strong>Aceptación separada</strong> de la carta de encargo, con una casilla propia que no viene marcada.</p>
          <p data-reveal="2"><strong>Puedes cambiar de opinión</strong> para trabajos futuros en cualquier momento; te informamos el nuevo precio y plazo antes de seguir.</p>
          <p data-reveal="3"><strong>Servicio sin IA:</strong> tu encargo se trabaja sin herramientas de IA generativa, con precio y plazo informados antes de contratar.</p>
        </div>
      </div>
    </div>
  </section>
</div>

<section class="section dark" aria-labelledby="calidad-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        ${titulo(7, 'Compromiso de calidad')}
        <h2 class="title" id="calidad-title" data-split style="margin-top:1.5rem">Respondemos por <span class="hl">cada entrega</span></h2>
      </div>
      <p class="lede" data-reveal="1">Revisamos nuestro trabajo de forma periódica. Si una entrega requiere un ajuste, lo hacemos sin costo y te lo informamos por escrito. Cualquier inquietud la atiende un socio del estudio.</p>
    </div>
    <div class="quality">
      ${[['Revisión completa', 'Cada entrega se lee entera antes de firmarse.'], ['Segunda revisión', 'Escritos judiciales, oposiciones y pactos pasan por dos personas.'], ['Controles periódicos', 'Revisamos muestras de nuestro trabajo y actualizamos nuestras prácticas.'], ['Ajustes sin costo', 'Si algo debe corregirse, lo corregimos sin cargo.']].map(([t, d], i) => `<article class="quality__item" data-reveal="${i}"><span class="mono">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}
    </div>
  </div>
</section>

<div class="light">
  <section class="section" aria-labelledby="principios-title">
    <div class="wrap">
      <div class="section-head">
        ${titulo(8, 'Principios')}
        <h2 class="title" id="principios-title" data-split style="margin-top:1.5rem">Cinco principios</h2>
      </div>
      <ol class="principles">
        ${D.PRINCIPIOS.map(([t, d], i) => `<li class="principle" data-reveal="${i % 3}"><span class="principle__n">${ROMAN[i]}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}
      </ol>
      <div class="marco">
        <h3 class="title-sm" data-reveal>Marco que respeta nuestro método</h3>
        <dl>${D.MARCO.map(([t, d]) => `<div data-reveal><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
        <p class="figref mono" data-reveal>La información de este sitio no es asesoría legal. La relación con el estudio se rige por la carta de encargo.</p>
      </div>
    </div>
  </section>
</div>`,
}));

// Redirección de la antigua página de planes
writeFileSync(join(OUT, 'servicios-empresas.html'), `<!doctype html>
<html lang="es-CL"><head><meta charset="utf-8"><title>Servicios y precios — AFyV Legal</title>
<meta http-equiv="refresh" content="0; url=servicios.html#corporativo"><link rel="canonical" href="${SITE.url}/servicios.html">
<meta name="robots" content="noindex"></head>
<body><p><a href="servicios.html#corporativo">Ver servicios y precios</a></p></body></html>
`);
built.push('servicios-empresas.html (redirección)');

// Reasons pages
function reasonsPage({ file, title, description, h1, intro, reasons, closing, cta }) {
  return page({
    file, title, description, active: 'servicios',
    body: `
${pageHero({ label: 'Servicios y precios', labelHref: 'servicios.html', h1, lede: intro })}
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
    <div data-reveal="1">${btn(cta[0], cta[1], 'btn--mint')}</div>
  </div>
</section>`,
  });
}

built.push(reasonsPage({
  file: 'constituye-tu-empresa.html',
  title: '¿Por qué constituir tu empresa? — AFyV Legal',
  description: 'Constituir una empresa es una decisión estratégica para el futuro de tu negocio. Cinco razones para formalizar tu emprendimiento.',
  h1: '¿Por qué constituir tu <span class="hl">empresa</span>?',
  intro: 'Muchos emprendimientos nacen como una idea, pero solo los que se formalizan están preparados para crecer, atraer oportunidades y proyectarse en el tiempo.',
  reasons: [
    ['Separación de patrimonios', 'La empresa es una persona jurídica distinta de sus socios. Tu patrimonio personal queda separado del empresarial y la responsabilidad se limita a los aportes, con menos riesgos para ti.'],
    ['Acceso a financiamiento', 'Una empresa formal abre la puerta a créditos, fondos concursables, subsidios y programas de apoyo, y facilita sumar socios o inversionistas.'],
    ['Una empresa a tu medida', 'Elegir bien el tipo societario define cómo se administra la empresa, cómo se reparten las utilidades y qué reglas rigen entre los socios.'],
    ['Confianza', 'Clientes y proveedores prefieren trabajar con negocios formales. Una sociedad transmite seriedad y estabilidad, y abre nuevas oportunidades.'],
    ['Una operación profesional', 'Podrás emitir documentos tributarios, contratar trabajadores, acceder a servicios bancarios para empresas y ordenar tus finanzas.'],
  ],
  closing: 'Formalizar tu negocio es invertir en su futuro: las grandes empresas se construyen sobre <span class="hl">bases legales sólidas</span>.',
  cta: ['servicios.html#corporativo', 'Ver Empresa lista y Pack Empresa + Marca'],
}));

built.push(reasonsPage({
  file: 'registra-tu-marca.html',
  title: 'Por qué registrar tu marca — AFyV Legal',
  description: 'Tu marca es uno de los activos más valiosos de tu negocio. Cinco razones para registrarla y protegerla desde el inicio.',
  h1: 'Por qué registrar tu <span class="hl">marca</span>',
  intro: 'Tu marca es uno de los activos más valiosos de tu negocio. Registrarla protege su identidad, te diferencia de la competencia y te da una base sólida para crecer.',
  reasons: [
    ['Un activo valioso', 'Si tu marca no está registrada, un tercero podría usarla o incluso obtener derechos exclusivos sobre ella. Registrarla protege y fortalece tu negocio.'],
    ['Exclusividad', 'El registro te da el derecho exclusivo de usar un nombre, logo o signo para tus productos o servicios, y evita confusiones en el mercado.'],
    ['Tu inversión protegida', 'Posicionar una marca exige tiempo y recursos. Registrarla evita tener que cambiar de nombre o de imagen por conflictos con terceros.'],
    ['Valor que crece', 'Una marca registrada es un activo de la empresa: puede licenciarse, cederse o aportarse para atraer inversionistas y alianzas.'],
    ['Competitividad', 'Las empresas más exitosas protegen sus marcas desde el inicio. Registrar la tuya hoy es una ventaja que perdura.'],
  ],
  closing: 'Una gran marca no solo se crea: también se <span class="hl">protege</span>.',
  cta: ['servicios.html#marcas', 'Ver Diagnóstico de marca y Marca protegida'],
}));

// Equipo
built.push(page({
  file: 'equipo.html',
  title: 'Equipo — AFyV Legal',
  description: 'El equipo de AFyV Legal: visión práctica del derecho, cercanía y rigor técnico. Revisamos y firmamos cada entrega.',
  active: 'equipo',
  ogImage: 'logo.webp',
  body: `
${pageHero({ label: 'Equipo', h1: 'Nuestro <span class="hl">equipo</span>', lede: 'Un equipo con visión práctica del derecho, que combina cercanía y rigor técnico para entregar soluciones a la medida. Trabajamos con IA y respondemos por cada resultado.' })}
<div class="light">
  <section class="section" aria-label="Integrantes">
    <div class="wrap">
      ${TEAM.map((m, i) => `<article class="profile" id="${m.slug}" aria-labelledby="${m.slug}-name">
        <div class="profile__media" data-reveal><div class="member__media"><span class="member__tag mono">( ${num(i)} )</span><img src="assets/img/${m.img}" alt="Retrato de ${m.name}" width="600" height="860" loading="lazy" decoding="async"></div></div>
        <div>
          <h2 class="profile__name" id="${m.slug}-name" data-split>${m.name}</h2>
          <p class="profile__area" data-reveal>${m.titulo ? `${m.titulo} · ` : ''}${m.area}</p>
          <div class="profile__bio" data-reveal="1">${m.bio.map((b) => `<p>${b}</p>`).join('')}</div>
          <p class="label" data-reveal="2" style="margin-top:2.5rem">Experiencia</p>
          <ul class="profile__exp" data-reveal="2" style="margin-top:1rem">${m.exp.map((e) => `<li>${e}</li>`).join('')}</ul>
        </div>
      </article>`).join('')}
    </div>
  </section>
</div>`,
}));

// Legal
for (const [file, title, src, desc] of [
  ['terminos-y-condiciones.html', 'Términos y Condiciones', 'terminos', 'Términos y Condiciones de acceso, uso y consulta del sitio web de AFyV Legal.'],
  ['politica-de-privacidad.html', 'Política de Privacidad', 'privacidad', 'Política de tratamiento de datos personales de AFyV Legal.'],
]) {
  const other = file.startsWith('terminos') ? ['politica-de-privacidad.html', 'Política de Privacidad'] : ['terminos-y-condiciones.html', 'Términos y Condiciones'];
  built.push(page({
    file,
    title: `${title} — AFyV Legal`,
    description: desc,
    active: 'legal',
    contactOpts: false,
    body: `
${pageHero({ label: 'Avisos legales', h1: title, lede: `<a class="paren" href="${other[0]}">${other[1]}</a> <a class="paren" href="ia-responsable.html">IA responsable</a>` })}
<div class="light">
  <section class="section">
    <div class="wrap--narrow prose prose--legal">${prose(read(`content/${src}.html`))}</div>
  </section>
</div>`,
  }));
}

console.log(`Built ${built.length} pages:\n  ${built.join('\n  ')}`);
