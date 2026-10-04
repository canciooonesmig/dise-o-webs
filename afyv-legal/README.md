# AFyV Legal — sitio AFyV 2.0

Rediseño de [afyvlegal.com](https://www.afyvlegal.com) con el mismo contenido sustantivo. La versión 5 usa una paleta clara: papel cálido con tinta verde, curvas de nivel en WebGL y bloques en verde bosque para las escenas destacadas. La dirección visual toma ideas de Crosby, Milledollars, Cominvi y Jesper Landberg sin copiar ninguno.

## Ver el sitio

Es un sitio estático (HTML + CSS + JS, sin dependencias). Desde la raíz del repositorio:

```sh
cd afyv-legal && python3 -m http.server 8000
# abrir http://localhost:8000
```

También funciona abriendo `afyv-legal/index.html` directamente en el navegador.

## Estructura

El sitio sigue el plan ejecutivo, el reglamento y el tarifario del 4 de octubre de 2026. El mensaje central es: **la IA prepara; nuestro equipo analiza, decide, firma y responde.** Cada sección explica cómo la IA aporta valor (rapidez, precio fijo, rigor) sin reemplazar el criterio del equipo.

| Página | Archivo | Contenido |
|---|---|---|
| Inicio | `index.html` | Portada, cómo usamos la IA y sus virtudes, cinco compromisos, escena "del borrador a la firma" (la IA prepara, el equipo analiza y decide, verificamos, firmamos), cuatro líneas con precios, flujo de seis etapas, Chile en cifras, equipo y contacto |
| Servicios y precios | `servicios.html` | Tarifario con filtro por línea, precios con y sin IVA, ficha de alcance, suscripción Abogado de tu Pyme, flujo del encargo y opiniones |
| IA responsable | `ia-responsable.html` | Quién hace qué, flujo de seis etapas, cinco reglas, lo que revisamos antes de firmar, secreto profesional y requisitos de seguridad para el uso de IA, consentimiento y opción sin IA, compromiso de calidad, principios y marco normativo (incluido el art. 2129 del Código Civil) |
| Razones | `constituye-tu-empresa.html`, `registra-tu-marca.html` | Enlazan a los servicios correspondientes |
| Equipo, Términos, Privacidad | `equipo.html`, etc. | |

`servicios-empresas.html` redirige a `servicios.html#corporativo`. El blog se retiró en la versión 5.

**Criterios de redacción:** AFyV Legal se presenta como "el estudio" o "AFyV Legal". El sitio no nombra al proveedor de IA (se informa en la cláusula de uso de IA de la carta de encargo), no expone el protocolo interno ni deja textos pendientes por completar.

## Editar contenido

Las páginas se generan con un script; no edites los `.html` de la raíz a mano.

- Servicios, precios, planes, flujo, límites, principios y requisitos de seguridad: `_src/data.mjs`
- Textos de páginas y equipo: `_src/build.mjs`
- Textos legales: `_src/content/*.html`
- Estilos: `assets/styles.css` · Animaciones: `assets/main.js`

Después de editar:

```sh
node afyv-legal/_src/build.mjs
```

## Animaciones

- **Portada en WebGL** (`assets/gl.js`): curvas de nivel claras iluminadas por un haz que sigue al cursor; el marco de la portada se dibuja al cargar.
- **Portada:** "La IA prepara." se escribe como texto de máquina; la frase del equipo sube línea a línea; una firma se dibuja y un sello se estampa.
- **Cinta de valores** que se desplaza y se inclina según la velocidad del scroll.
- **Virtudes y líneas de servicio:** íconos que se dibujan e inclinación 3D al pasar el cursor.
- **Del borrador a la firma** (escena fija al hacer scroll): el borrador de la IA pasa a análisis (nota del equipo y cláusula nueva), a verificación (se retira una cita no verificable, se marcan casillas) y a entrega firmada con sello.
- **Flujo de seis etapas:** una onda se dibuja con el scroll y los nodos aparecen en orden; en la página de IA, el flujo queda fijo y avanza etapa por etapa.
- **Tarifario:** filtro por línea con transición animada y conversión animada de precios con y sin IVA.
- Además: lista de revisión que se marca con el scroll, consentimiento que se marca, galería horizontal del equipo, scroll suave y cortina entre páginas.

Con `prefers-reduced-motion` todo se muestra en su estado final, sin movimiento.

## Chile en cifras

Sección de la portada con datos públicos sobre creación de empresas y solicitudes de marcas, cada cifra con su fuente (Ministerio de Economía e INAPI). Los datos están en `CIFRAS` dentro de `_src/build.mjs`; para actualizarlos, edita los números y fuentes ahí y vuelve a generar el sitio. Incluye cifras destacadas con conteo animado, barras apiladas con información al pasar el cursor o al navegar con teclado, y una tabla con todos los datos. Los colores del gráfico (verde `#1f7a4d` y azul `#3f5bd0`) se validaron para personas con daltonismo.

La portada muestra además una bandera de Chile junto a "Santiago, Chile", con proporciones oficiales.

## Notas

- **Formulario de contacto:** abre el programa de correo del visitante con el mensaje dirigido a contacto@afyvlegal.com. Para recibir los mensajes sin que el visitante use su correo, se puede conectar a un servicio de formularios (Formspree, Netlify Forms, etc.).
- **Fuentes:** Newsreader, Geist y Geist Mono (licencia SIL Open Font), alojadas localmente en `assets/fonts/`.
- **Librerías** (en `assets/vendor/`, sin CDN): GSAP 3.15 con ScrollTrigger, SplitText, ScrambleText, DrawSVG y Flip (licencia estándar gratuita de GSAP, apta para uso comercial) y Lenis 1.3 (MIT).
- **Imágenes:** logo y retratos provienen del sitio actual.
- **Ajustes de texto respecto al original:** se corrigieron "Contratatación" → "Contratación" y "situaciones situaciones" → "situaciones"; se quitó del Plan Registra tu Marca un párrafo que repetía el del Plan Constituye tu Empresa.
