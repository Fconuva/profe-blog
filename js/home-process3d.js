(function () {
  'use strict';
  // Figura de partículas para «Así trabajamos contigo»: conversación, libro, rúbrica y escalera.
  // Cambia de forma con el scroll. Si WebGL no parte, quedan las tarjetas con ilustraciones.
  var section = document.getElementById('proceso');
  var stage = section && section.querySelector('.process-stage');
  if (!stage) return;
  var canvas = document.createElement('canvas');
  var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) return;

  var small = window.matchMedia('(max-width: 899px)');
  var COUNT = small.matches ? 3500 : 6000;

  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  // Recorre una polilínea según su largo; cada punto lleva x, y, z y si es ámbar.
  function path(points, jitter, depth, amber) {
    var lengths = [], total = 0;
    for (var i = 1; i < points.length; i++) {
      var dx = points[i][0] - points[i - 1][0], dy = points[i][1] - points[i - 1][1];
      total += Math.sqrt(dx * dx + dy * dy);
      lengths.push(total);
    }
    return function () {
      var d = Math.random() * total, k = 0;
      while (lengths[k] < d) k++;
      var a = points[k], b = points[k + 1], start = k ? lengths[k - 1] : 0, t = (d - start) / ((lengths[k] - start) || 1);
      return [a[0] + (b[0] - a[0]) * t + gauss() * jitter, a[1] + (b[1] - a[1]) * t + gauss() * jitter, (a[2] || 0) + gauss() * depth, amber ? 1 : 0];
    };
  }
  function arc(cx, cy, r, from, to, out) {
    for (var i = 0; i <= 10; i++) { var a = from + (to - from) * i / 10; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  }
  function roundRect(cx, cy, w, h, r) {
    var x0 = cx - w / 2 + r, x1 = cx + w / 2 - r, y0 = cy - h / 2 + r, y1 = cy + h / 2 - r, p = [], H = Math.PI / 2;
    arc(x1, y1, r, 0, H, p); arc(x0, y1, r, H, 2 * H, p); arc(x0, y0, r, 2 * H, 3 * H, p); arc(x1, y0, r, 3 * H, 4 * H, p);
    p.push(p[0]);
    return p;
  }
  function disc(cx, cy, r, depth, amber) {
    return function () { var a = Math.random() * 6.2832, d = Math.sqrt(Math.random()) * r; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, gauss() * depth, amber ? 1 : 0]; };
  }
  function fill(x0, x1, y0, y1, depth) {
    return function () { return [rand(x0, x1), rand(y0, y1), gauss() * depth, 0]; };
  }
  function build(parts) {
    var sum = 0, out = new Float32Array(COUNT * 4), i, k;
    for (i = 0; i < parts.length; i++) sum += parts[i][0];
    for (i = 0; i < COUNT; i++) {
      var pick = Math.random() * sum;
      for (k = 0; pick > parts[k][0]; k++) pick -= parts[k][0];
      out.set(parts[k][1](), i * 4);
    }
    return out;
  }

  // 1. Conversación por WhatsApp: globo con cola y tres puntos escribiendo.
  var bubble = roundRect(0, 0.12, 1.9, 1.25, 0.42);
  var chat = build([
    [0.5, path(bubble, 0.018, 0.05)],
    [0.08, path([[-0.42, -0.5], [-0.78, -0.92], [-0.12, -0.5]], 0.016, 0.04)],
    [0.16, fill(-0.8, 0.8, -0.32, 0.56, 0.12)],
    [0.06, disc(-0.42, 0.12, 0.12, 0.04, true)],
    [0.06, disc(0, 0.12, 0.12, 0.04, true)],
    [0.06, disc(0.42, 0.12, 0.12, 0.04, true)]
  ]);

  // 2. Libro abierto, como el del inicio: páginas curvas, renglones y una cinta ámbar.
  function page(u, v, side) { return [side * (0.04 + u * 1.02), v * 1.3 - 0.62 + 0.04 * Math.sin(u * Math.PI), 0.3 * Math.sin(u * Math.PI * 0.85)]; }
  function bookPart(kind) {
    return function () {
      var side = Math.random() < 0.5 ? -1 : 1, u, v;
      if (kind === 'edge') {
        var e = Math.random();
        if (e < 0.36) { u = Math.random(); v = 1; } else if (e < 0.72) { u = Math.random(); v = 0; } else { u = 1; v = Math.random(); }
      } else if (kind === 'line') {
        u = rand(0.14, 0.88); v = 0.18 + Math.floor(Math.random() * 7) * 0.1;
      } else { u = Math.random(); v = Math.random(); }
      var p = page(u, v, side);
      return [p[0] + gauss() * 0.012, p[1] + gauss() * (kind === 'fill' ? 0 : 0.008), p[2] + gauss() * 0.02, 0];
    };
  }
  var book = build([
    [0.3, bookPart('edge')],
    [0.38, bookPart('line')],
    [0.16, bookPart('fill')],
    [0.06, path([[0, 0.7], [0, -0.62]], 0.012, 0.02)],
    [0.1, path([[0.02, 0.66, 0.04], [0.06, -0.2, 0.06], [0.1, -0.92, 0.08]], 0.014, 0.01, true)]
  ]);

  // 3. Rúbrica: hoja con filas y columna, y un visto bueno grande en ámbar.
  var sheet = roundRect(-0.15, 0, 1.35, 1.75, 0.08);
  var rubric = build([
    [0.26, path(sheet, 0.012, 0.03)],
    [0.08, path([[-0.8, 0.55], [0.5, 0.55]], 0.01, 0.03)],
    [0.06, path([[-0.8, 0.25], [0.5, 0.25]], 0.01, 0.03)],
    [0.06, path([[-0.8, -0.05], [0.5, -0.05]], 0.01, 0.03)],
    [0.06, path([[-0.8, -0.35], [0.5, -0.35]], 0.01, 0.03)],
    [0.06, path([[-0.38, 0.85], [-0.38, -0.85]], 0.01, 0.03)],
    [0.1, fill(-0.8, 0.5, -0.85, 0.85, 0.05)],
    [0.32, path([[-0.08, -0.12, 0.25], [0.28, -0.55, 0.25], [1.0, 0.48, 0.25]], 0.035, 0.03, true)]
  ]);

  // 4. Escalera que sube, con el último peldaño encendido.
  var profile = [], steps = 5, sx = 2 / steps, sy = 1.7 / steps;
  for (var s = 0; s < steps; s++) {
    var x = -1 + s * sx, y = -0.85 + s * sy;
    profile.push([x, y], [x, y + sy]);
  }
  profile.push([1, 0.85]);
  var front = path(profile, 0.008, 0);
  function extrude(depthOnly) {
    return function () { var p = front(); p[2] = depthOnly ? (Math.random() < 0.5 ? -0.4 : 0.4) + gauss() * 0.01 : rand(-0.4, 0.4); return p; };
  }
  var stairs = build([
    [0.52, extrude(false)],
    [0.24, extrude(true)],
    [0.13, function () { return [rand(1 - sx, 1), 0.85 + gauss() * 0.008, rand(-0.4, 0.4), 1]; }],
    [0.11, function () { var p = disc(0.6, 1.12, 0.16, 0.12, true)(); p[1] += Math.abs(gauss()) * 0.05; return p; }]
  ]);

  var VERT = [
    'attribute vec4 a0; attribute vec4 a1; attribute vec4 a2; attribute vec4 a3; attribute float aSeed;',
    'uniform float uProgress; uniform float uTime; uniform float uSize; uniform float uScale; uniform float uAspect;',
    'uniform float uYaw; uniform float uPitch; uniform vec2 uOffset;',
    'varying float vAmber; varying float vAlpha; varying float vTone;',
    'vec4 shape(float i) { return i < 0.5 ? a0 : i < 1.5 ? a1 : i < 2.5 ? a2 : a3; }',
    'void main() {',
    '  float p = clamp(uProgress, 0.0, 3.0); float i = min(floor(p), 2.0); float f = p - i;',
    '  float d = clamp((f - aSeed * 0.35) / 0.65, 0.0, 1.0); float e = d * d * (3.0 - 2.0 * d);',
    '  vec4 A = shape(i); vec4 B = shape(i + 1.0);',
    '  vec3 pos = mix(A.xyz, B.xyz, e);',
    '  vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 47.3), sin(aSeed * 13.1 + 1.0)) + 0.001);',
    '  pos += dir * sin(e * 3.14159) * (0.3 + 0.3 * fract(aSeed * 7.0));',
    '  pos += 0.012 * vec3(sin(uTime * 0.9 + aSeed * 40.0), cos(uTime * 0.7 + aSeed * 31.0), sin(uTime * 0.8 + aSeed * 17.0));',
    '  float cy = cos(uYaw); float sy = sin(uYaw); pos = vec3(cy * pos.x + sy * pos.z, pos.y, -sy * pos.x + cy * pos.z);',
    '  float cp = cos(uPitch); float sp = sin(uPitch); pos = vec3(pos.x, cp * pos.y - sp * pos.z, sp * pos.y + cp * pos.z);',
    '  float k = 3.0 / (3.4 - pos.z);',
    '  gl_Position = vec4(pos.x * k * uScale / uAspect + uOffset.x, pos.y * k * uScale + uOffset.y, 0.0, 1.0);',
    '  gl_PointSize = uSize * k * (0.6 + 0.8 * fract(aSeed * 13.0));',
    '  vAmber = mix(A.w, B.w, e); vTone = fract(aSeed * 3.7);',
    '  vAlpha = 0.42 + 0.18 * sin(uTime * 1.6 + aSeed * 60.0) + 0.25 * vAmber;',
    '}'
  ].join('\n');
  var FRAG = [
    'precision mediump float;',
    'varying float vAmber; varying float vAlpha; varying float vTone;',
    'void main() {',
    '  float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r); a *= a * vAlpha;',
    '  vec3 color = mix(mix(vec3(0.373, 0.878, 0.816), vec3(0.745, 0.973, 1.0), vTone), vec3(0.941, 0.706, 0.416), vAmber);',
    '  gl_FragColor = vec4(color * a, a);',
    '}'
  ].join('\n');
  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  }
  var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  var program = gl.createProgram();
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  function attribute(name, data, size) {
    var location = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }
  var seeds = new Float32Array(COUNT);
  for (var n = 0; n < COUNT; n++) seeds[n] = Math.random();
  attribute('a0', chat, 4); attribute('a1', book, 4); attribute('a2', rubric, 4); attribute('a3', stairs, 4); attribute('aSeed', seeds, 1);
  var u = {};
  ['uProgress', 'uTime', 'uSize', 'uScale', 'uAspect', 'uYaw', 'uPitch', 'uOffset'].forEach(function (name) { u[name] = gl.getUniformLocation(program, name); });
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  canvas.setAttribute('aria-hidden', 'true');
  stage.appendChild(canvas);
  section.classList.add('has-3d');
  window.dispatchEvent(new Event('process3d:ready'));

  var steps3d = section.querySelectorAll('.step');
  var dpr = 1, aspect = 1, scale = 0.78, offsetY = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, small.matches ? 1.5 : 1.75);
    var w = stage.clientWidth, h = Math.max(1, stage.clientHeight);
    canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.round(h * dpr);
    aspect = w / h;
    // En móvil la figura vive en la franja entre la barra de arriba y la tarjeta del paso.
    if (small.matches) {
      var top = 80, bottom = h * (h < 720 ? 0.45 : 0.5);
      scale = Math.min(0.78 * aspect, (bottom - top) / (1.2 * h));
      offsetY = 1 - (top + bottom) / h;
    } else {
      scale = 0.78 * Math.min(1, aspect);
      offsetY = 0;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  // El avance sale de dónde están los pasos respecto del centro de la pantalla.
  function target() {
    var middle = window.innerHeight / 2, centers = [];
    for (var i = 0; i < steps3d.length; i++) { var r = steps3d[i].getBoundingClientRect(); centers.push(r.top + r.height / 2); }
    if (middle <= centers[0]) return 0;
    for (i = 0; i < centers.length - 1; i++) {
      if (middle <= centers[i + 1]) return i + (middle - centers[i]) / (centers[i + 1] - centers[i]);
    }
    return centers.length - 1;
  }
  var YAW = [0, 0, -0.08, 0.5], PITCH = [0, -0.5, 0, -0.22];
  function blend(list, p) { var i = Math.min(Math.floor(p), 2), f = p - i; return list[i] + (list[i + 1] - list[i]) * f; }

  var progress = target(), active = -1, pointerX = 0, pointerY = 0, lookX = 0, lookY = 0;
  var visible = false, frame = 0, last = 0, start = performance.now();
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) { pointerX = e.clientX / window.innerWidth - 0.5; pointerY = e.clientY / window.innerHeight - 0.5; }, { passive: true });
  }
  function draw(now) {
    frame = 0;
    var dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
    var goal = target(), ease = 1 - Math.exp(-dt * 5);
    progress += (goal - progress) * ease;
    lookX += (pointerX - lookX) * ease; lookY += (pointerY - lookY) * ease;
    var current = Math.round(goal);
    if (current !== active) {
      for (var i = 0; i < steps3d.length; i++) steps3d[i].classList.toggle('is-active', i === current);
      active = current;
    }
    var t = (now - start) / 1000, mobile = small.matches;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.uProgress, progress);
    gl.uniform1f(u.uTime, t);
    gl.uniform1f(u.uSize, (mobile ? 2.4 : 2.7) * dpr);
    gl.uniform1f(u.uScale, scale);
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uYaw, blend(YAW, progress) + 0.22 * Math.sin(t * 0.25) + lookX * 0.5);
    gl.uniform1f(u.uPitch, blend(PITCH, progress) + lookY * 0.25);
    gl.uniform2f(u.uOffset, 0, offsetY);
    gl.drawArrays(gl.POINTS, 0, COUNT);
    if (visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function play() { if (!frame && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(draw); } }
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; play(); }).observe(section);
  document.addEventListener('visibilitychange', play);
  canvas.addEventListener('webglcontextlost', function () {
    cancelAnimationFrame(frame); visible = false;
    section.classList.remove('has-3d');
    window.dispatchEvent(new Event('process3d:ready'));
  });
})();
