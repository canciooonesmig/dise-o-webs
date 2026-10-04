# AFyV Legal — sitio AFyV 2.0

Rediseño de [afyvlegal.com](https://www.afyvlegal.com) con el mismo contenido sustantivo. La dirección visual toma ideas de [Crosby](https://crosby.ai), [Partech](https://partechpartners.com), [Peerscale](https://www.peerscale.com) y [AngelList](https://www.angellist.com) sin copiar ninguno: base verde casi negra con haces de luz y grano, tipografía serif editorial a gran escala, paneles claros que se deslizan sobre el fondo oscuro, y un único acento menta.

## Ver el sitio

Es un sitio estático (HTML + CSS + JS, sin dependencias). Desde la raíz del repositorio:

```sh
cd afyv-legal && python3 -m http.server 8000
# abrir http://localhost:8000
```

También funciona abriendo `afyv-legal/index.html` directamente en el navegador.

## Estructura (AFyV 2.0)

El sitio sigue el plan ejecutivo, el reglamento interno y el tarifario del 4 de octubre de 2026. El mensaje central es la regla de oro del reglamento: **la IA prepara; un abogado verifica, decide, firma y responde.**

| Página | Archivo | Contenido |
|---|---|---|
| Inicio | `index.html` | Regla de oro, aviso de IA, nuevo enfoque, cinco compromisos (art. 54), escena "del borrador a la firma", cuatro líneas con precios, flujo de nueve etapas, cinco límites absolutos, Chile en cifras, equipo y blog |
| Servicios y precios | `servicios.html` | Tarifario con filtro por línea, precios con y sin IVA, ficha de alcance por servicio, suscripción Abogado de tu Pyme con definiciones, flujo del encargo y opiniones |
| IA responsable | `ia-responsable.html` | Quién hace qué, flujo pinneado de nueve etapas, límites absolutos, protocolo de verificación, protección de datos, consentimiento y opción sin IA, errores y control, principios y marco normativo |
| Razones | `constituye-tu-empresa.html`, `registra-tu-marca.html` | Se mantienen y enlazan a los servicios correspondientes |
| Equipo, Blog, artículos, Términos, Privacidad | igual que antes | |

`servicios-empresas.html` redirige a `servicios.html#corporativo`.

**Lo que el sitio ya no dice** (art. 53): las áreas de derecho laboral, público y prescripción de deudas se retiraron de la oferta, y no se usan frases como "compra resultados", "premium", "garantizamos el registro", "100 % seguro" ni comparaciones con otros estudios. No se menciona seguro hasta tenerlo (art. 50).

## Datos pendientes antes de publicar

En `_src/data.mjs`, el objeto `PENDIENTES` reúne lo que los socios deben definir. Mientras esté vacío, el sitio muestra una marca amarilla "por confirmar":

- `proveedorIA`: proveedor y plan de IA (decisión 3; arts. 17 y 18)
- `razonSocial` y `rut`: identificación del estudio (art. 43)
- `sinIA`: precio y plazo del servicio sin IA (decisión 8; arts. 29 y 45)
- `retencionIA`: plazo de borrado de la memoria de IA (decisión 4; art. 41)

Otros puntos del plan que afectan al sitio: los plazos publicados solo deben mantenerse si se miden y cumplen (art. 54); la política de privacidad debe agregar la sección de IA antes del 1 de diciembre de 2026 (Ley 21.719); los testimonios requieren autorización escrita del cliente (art. 55).

## Editar contenido

Las páginas se generan con un script; no edites los `.html` de la raíz a mano.

- Servicios, precios, planes, flujo, límites, principios y datos pendientes: `_src/data.mjs`
- Textos de páginas, equipo y metadatos de artículos: `_src/build.mjs`
- Cuerpo de artículos y textos legales: `_src/content/*.html`
- Estilos: `assets/styles.css` · Animaciones: `assets/main.js`

Después de editar:

```sh
node afyv-legal/_src/build.mjs
```

## Animaciones

- **Portada en WebGL** (`assets/gl.js`): curvas de nivel iluminadas por un haz de luz que sigue al cursor.
- **Portada:** "La IA prepara." se escribe como texto de máquina; la frase del abogado sube línea a línea; una firma se dibuja y un sello se estampa.
- **Compromisos:** cada cláusula se "firma" con un timbre al aparecer.
- **Del borrador a la firma** (escena fija en pantalla al hacer scroll): un contrato pasa de borrador IA a verificación (se tachan citas no verificables, se marcan casillas) y a firma con sello.
- **Flujo de nueve etapas:** la línea se dibuja y las etapas se encienden en orden; en la página de IA, el flujo queda fijo y avanza etapa por etapa con el scroll.
- **Límites absolutos:** los candados se cierran al aparecer.
- **Tarifario:** filtro por línea con transición animada y conversión animada de precios con y sin IVA.
- Además: protocolo de verificación que se marca con el scroll, fichas de clientes que se separan, consentimiento que se marca, etiquetas que se "decodifican", tarjetas apiladas, galería horizontal del equipo, scroll suave y cortina entre páginas.

Con `prefers-reduced-motion` todo se muestra en su estado final, sin movimiento.

## Chile en cifras

Sección de la portada con datos públicos sobre creación de empresas y solicitudes de marcas, cada cifra con su fuente (Ministerio de Economía e INAPI). Los datos están en `CIFRAS` dentro de `_src/build.mjs`; para actualizarlos, edita los números y fuentes ahí y vuelve a generar el sitio. Incluye cifras destacadas con conteo animado, barras apiladas con información al pasar el cursor o al navegar con teclado, y una tabla con todos los datos. Los colores del gráfico (verde `#1f7a4d` y azul `#3f5bd0`) se validaron para personas con daltonismo.

La portada muestra además una bandera de Chile junto a "Santiago, Chile", con proporciones oficiales.

## Notas

- **Formulario de contacto:** abre el programa de correo del visitante con el mensaje dirigido a contacto@afyvlegal.com. Para recibir los mensajes sin que el visitante use su correo, se puede conectar a un servicio de formularios (Formspree, Netlify Forms, etc.).
- **Fuentes:** Newsreader, Geist y Geist Mono (licencia SIL Open Font), alojadas localmente en `assets/fonts/`.
- **Librerías** (en `assets/vendor/`, sin CDN): GSAP 3.15 con ScrollTrigger, SplitText, ScrambleText, DrawSVG y Flip (licencia estándar gratuita de GSAP, apta para uso comercial) y Lenis 1.3 (MIT).
- **Imágenes:** logo, retratos y portadas de los artículos provienen del sitio actual.
- **Ajustes de texto respecto al original:** se corrigieron "Contratatación" → "Contratación" y "situaciones situaciones" → "situaciones"; se quitó del Plan Registra tu Marca un párrafo que repetía el del Plan Constituye tu Empresa; los títulos de artículos escritos en mayúsculas se muestran en tipo oración.
