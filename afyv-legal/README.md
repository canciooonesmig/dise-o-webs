# AFyV Legal — rediseño del sitio

Rediseño de [afyvlegal.com](https://www.afyvlegal.com) con el mismo contenido sustantivo, con una dirección visual y de animación inspirada en [crosby.ai](https://crosby.ai): fondo papel, tipografía editorial serif a gran escala, bandas de color sólido y movimiento sobrio. El rojo de Crosby se reemplazó por el verde de la marca AFyV.

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

- Logotipo "AFyV" gigante que se revela letra por letra al cargar; el logotipo pequeño del encabezado aparece al pasar la portada.
- Revelado suave de secciones al hacer scroll.
- Cascadas tipográficas (DERECHO / CERCA…) en las bandas de color.
- Carrusel continuo de áreas de práctica y del equipo (se pausa al pasar el cursor).
- "Nuestro Método de Trabajo": placas isométricas que se activan según la etapa visible.
- Retratos en blanco y negro que pasan a color al pasar el cursor.

Todo respeta `prefers-reduced-motion`: con movimiento reducido, solo quedan los fundidos.

## Notas

- **Formulario de contacto:** abre el programa de correo del visitante con el mensaje dirigido a contacto@afyvlegal.com. Para recibir los mensajes sin que el visitante use su correo, se puede conectar a un servicio de formularios (Formspree, Netlify Forms, etc.).
- **Fuentes:** Newsreader y Geist (licencia SIL Open Font), alojadas localmente en `assets/fonts/`.
- **Imágenes:** logo, retratos y portadas de los artículos provienen del sitio actual.
- **Ajustes de texto respecto al original:** se corrigieron "Contratatación" → "Contratación" y "situaciones situaciones" → "situaciones"; se quitó del Plan Registra tu Marca un párrafo que repetía el del Plan Constituye tu Empresa; los títulos de artículos escritos en mayúsculas se muestran en tipo oración.
