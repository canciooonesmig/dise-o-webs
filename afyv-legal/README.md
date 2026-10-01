# AFyV Legal — rediseño del sitio (v2)

Rediseño de [afyvlegal.com](https://www.afyvlegal.com) con el mismo contenido sustantivo. La dirección visual toma ideas de [Crosby](https://crosby.ai), [Partech](https://partechpartners.com), [Peerscale](https://www.peerscale.com) y [AngelList](https://www.angellist.com) sin copiar ninguno: base verde casi negra con haces de luz y grano, tipografía serif editorial a gran escala, paneles claros que se deslizan sobre el fondo oscuro, y un único acento menta.

## Ver el sitio

Es un sitio estático (HTML + CSS + JS, sin dependencias). Desde la raíz del repositorio:

```sh
cd afyv-legal && python3 -m http.server 8000
# abrir http://localhost:8000
```

También funciona abriendo `afyv-legal/index.html` directamente en el navegador.

## Páginas

| Página | Archivo | Original |
|---|---|---|
| Inicio | `index.html` | `/` |
| Servicios | `servicios.html` | `/servicios` |
| Servicios para Empresas | `servicios-empresas.html` | `/sevicios-empresas` |
| ¿Por qué constituir tu Empresa? | `constituye-tu-empresa.html` | `/constituye-tu-empresa` |
| Por qué registrar tu marca | `registra-tu-marca.html` | `/registratumarca` |
| Equipo | `equipo.html` | `/equipo` |
| Blog (AFyV Informa) | `blog.html` | `/afyv` |
| 6 artículos | `blog/*.html` | `/post/*` |
| Términos y Condiciones | `terminos-y-condiciones.html` | `/copia-de-términos-y-condiciones` |
| Política de Privacidad | `politica-de-privacidad.html` | `/políticadeprivacidad` |

Si se publica en el mismo dominio, conviene crear redirecciones 301 desde las URL originales.

## Editar contenido

Las páginas se generan con un script; no edites los `.html` de la raíz a mano.

- Textos de páginas, equipo y metadatos de artículos: `_src/build.mjs`
- Cuerpo de artículos y textos legales: `_src/content/*.html`
- Estilos: `assets/styles.css` · Animaciones: `assets/main.js`

Después de editar:

```sh
node afyv-legal/_src/build.mjs
```

## Animaciones

- **Portada en WebGL** (`assets/gl.js`): curvas de nivel finas iluminadas por un haz de luz que sigue al cursor, con grano de película. Se pausa fuera de pantalla y en pestañas ocultas.
- **Cortina entre páginas** con contador la primera vez que se entra al sitio.
- **Scroll suave** (Lenis) y coreografía con GSAP ScrollTrigger:
  - titulares que suben línea a línea desde una máscara;
  - el párrafo "Sobre Nosotros" se ilumina palabra a palabra al desplazarse;
  - tarjetas de servicios que se apilan (escritorio), con ilustraciones de línea que se dibujan;
  - galería horizontal del equipo controlada por el scroll vertical (escritorio);
  - "Nuestro Método de Trabajo" fijado en pantalla con placas 3D que se activan por etapa;
  - contador de razones que rueda según la razón visible;
  - el logotipo del pie sube letra a letra al llegar al final.
- **Detalles de interacción:** cursor propio, botones magnéticos, filas de áreas que se rellenan al pasar el cursor, menú en píldora que se oculta al bajar y reaparece al subir, barra de lectura en los artículos, reloj de Santiago en el pie.

Con `prefers-reduced-motion` se desactivan el scroll suave, la cortina y las animaciones de desplazamiento; todo el contenido queda visible y la portada muestra un fotograma fijo.

## Chile en cifras

Sección de la portada con datos públicos sobre creación de empresas y solicitudes de marcas, cada cifra con su fuente (Ministerio de Economía e INAPI). Los datos están en `CIFRAS` dentro de `_src/build.mjs`; para actualizarlos, edita los números y fuentes ahí y vuelve a generar el sitio. Incluye cifras destacadas con conteo animado, barras apiladas con información al pasar el cursor o al navegar con teclado, y una tabla con todos los datos. Los colores del gráfico (verde `#1f7a4d` y azul `#3f5bd0`) se validaron para personas con daltonismo.

La portada muestra además una bandera de Chile junto a "Santiago, Chile", con proporciones oficiales.

## Notas

- **Formulario de contacto:** abre el programa de correo del visitante con el mensaje dirigido a contacto@afyvlegal.com. Para recibir los mensajes sin que el visitante use su correo, se puede conectar a un servicio de formularios (Formspree, Netlify Forms, etc.).
- **Fuentes:** Newsreader, Geist y Geist Mono (licencia SIL Open Font), alojadas localmente en `assets/fonts/`.
- **Librerías** (en `assets/vendor/`, sin CDN): GSAP 3.15 con ScrollTrigger y SplitText (licencia estándar gratuita de GSAP, apta para uso comercial) y Lenis 1.3 (MIT).
- **Imágenes:** logo, retratos y portadas de los artículos provienen del sitio actual.
- **Ajustes de texto respecto al original:** se corrigieron "Contratatación" → "Contratación" y "situaciones situaciones" → "situaciones"; se quitó del Plan Registra tu Marca un párrafo que repetía el del Plan Constituye tu Empresa; los títulos de artículos escritos en mayúsculas se muestran en tipo oración.
