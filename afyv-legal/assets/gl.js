// Hero light field: a spotlight beam that reveals flowing contour lines, with film grain.
// Renders at reduced resolution, pauses off-screen and in background tabs,
// and draws a single still frame when the visitor prefers reduced motion.
(() => {
  const hosts = document.querySelectorAll('[data-gl]');
  if (!hosts.length) return;

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
  const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uFade;
uniform float uSeed;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Beam: a cone from above the top-right corner, its angle steered by the pointer
  vec2 origin = vec2(aspect * (0.78 + (uMouse.x - 0.5) * 0.12), 1.25);
  vec2 dir = normalize(vec2(-0.42 + (uMouse.x - 0.5) * 0.35, -1.0));
  vec2 d = p - origin;
  float along = dot(d, dir);
  float across = abs(dot(d, vec2(-dir.y, dir.x)));
  float width = 0.08 + along * 0.32;
  float beam = smoothstep(width, width * 0.15, across) * smoothstep(0.0, 0.5, along) * smoothstep(2.6, 0.6, along);

  // Soft pool of light where the pointer is
  float pool = smoothstep(0.75, 0.0, length(p - vec2(uMouse.x * aspect, uMouse.y)));

  // Flowing contour field
  float t = uTime * 0.035;
  vec2 q = p * 1.6 + vec2(uSeed, 0.0);
  float n = fbm(q + vec2(t, -t * 0.6) + 0.35 * fbm(q * 1.7 - t));
  // Thin, resolution-independent contour lines
  float v = n * 24.0;
  float dist = abs(fract(v - 0.5) - 0.5);
  float lines = 1.0 - smoothstep(0.0, fwidth(v) * 1.2, dist);
  float vm = v / 5.0;
  float distM = abs(fract(vm - 0.5) - 0.5);
  float major = 1.0 - smoothstep(0.0, fwidth(vm) * 1.6, distM);

  // Light theme: warm paper, green ink lines, a soft green halo that follows the pointer
  vec3 base = vec3(0.957, 0.949, 0.918);
  vec3 halo = vec3(0.886, 0.937, 0.890);
  vec3 ink  = vec3(0.137, 0.420, 0.290);

  float light = clamp(beam * 0.85 + pool * 0.55, 0.0, 1.0);
  vec3 col = mix(base, halo, smoothstep(0.0, 1.0, light) * 0.9);
  col = mix(col, ink, lines * (0.07 + light * 0.20));
  col = mix(col, ink, major * (0.10 + light * 0.30));

  // Soft edge fade, scroll fade and fine grain
  col = mix(col, base, 0.35 * smoothstep(0.35, 0.95, length((uv - 0.5) * vec2(1.1, 1.3))));
  col = mix(base, col, uFade);
  col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}`;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  hosts.forEach((host, index) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return; // CSS gradient background remains as the fallback
    host.appendChild(canvas);

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) {
      canvas.remove();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uFade = u('uFade'), uSeed = u('uSeed');
    gl.uniform1f(uSeed, index * 7.3 + 1.0);

    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.85;
    const resize = () => {
      const r = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    new ResizeObserver(resize).observe(host);

    const mouse = { x: 0.62, y: 0.7, tx: 0.62, ty: 0.7 };
    if (!reduce) {
      window.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        mouse.tx = (e.clientX - r.left) / r.width;
        mouse.ty = 1 - (e.clientY - r.top) / r.height;
      }, { passive: true });
    }

    let visible = true;
    let running = false;
    const start = performance.now();
    const frame = (now) => {
      if (!visible || document.hidden) { running = false; return; }
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      const r = host.getBoundingClientRect();
      const fade = Math.max(0.25, Math.min(1, 1 + r.top / Math.max(1, r.height) * 0.9));
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uFade, fade);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    };
    const run = () => { if (!running && !reduce) { running = true; requestAnimationFrame(frame); } };

    if (reduce) {
      gl.uniform1f(uTime, 12.0);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uFade, 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) run(); }).observe(host);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) run(); });
    run();
  });
})();
