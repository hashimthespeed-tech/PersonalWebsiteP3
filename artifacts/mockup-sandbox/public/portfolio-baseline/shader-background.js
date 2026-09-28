(() => {
  const vertexSource = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float value = 0.0, amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p = p * 2.03 + vec2(17.0, 9.2);
        amplitude *= 0.5;
      }
      return value;
    }
    vec3 palette(float value) {
      vec3 paper = vec3(0.9451, 0.9333, 0.8980);
      vec3 light = vec3(0.98, 0.973, 0.953);
      return mix(paper, light, smoothstep(0.32, 0.82, value) * 0.08);
    }
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
      float t = time * -0.38;
      p *= 2.0;
      float warpX = fbm(p * 1.5 + vec2(t, 2.4));
      float warpY = fbm(p * 1.5 + vec2(5.2, -t));
      p += (vec2(warpX, warpY) - 0.5) * 0.42;
      float wave = uv.y
        + sin(uv.x * 5.7 + t * 1.25 + fbm(p * 1.2) * 2.2) * 0.1
        + (fbm(p * 2.1 + t * 0.34) - 0.5) * 0.48;
      vec3 color = palette(wave);
      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `;

  function initShader() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const useFallback = (reason) => {
      document.documentElement.classList.add("shader-fallback");
      if (reason) console.warn(reason);
    };
    const canvas = document.createElement("canvas");
    canvas.className = "world-shader";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.remove();
      useFallback("Shared WebGL background unavailable; using the animated CSS fallback.");
      return;
    }

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      canvas.remove();
      useFallback("Shared WebGL background failed to compile; using the animated CSS fallback.");
      return;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      canvas.remove();
      useFallback("Shared WebGL background failed to link; using the animated CSS fallback.");
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let started = performance.now();
    let visible = document.visibilityState === "visible";
    let inView = true;
    let disposed = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelLimit = 1_350_000;
      const scale = Math.min(dpr, Math.sqrt(pixelLimit / Math.max(bounds.width * bounds.height, 1)));
      const width = Math.max(1, Math.round(bounds.width * scale));
      const height = Math.max(1, Math.round(bounds.height * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      if (visible && inView && !frame) frame = requestAnimationFrame(draw);
    };
    const draw = (now) => {
      frame = 0;
      if (disposed || !visible || !inView) return;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, ((now - started) / 1000) * 0.2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };
    const visibilityChange = () => {
      visible = document.visibilityState === "visible";
      if (visible) {
        started = performance.now();
        if (!frame) frame = requestAnimationFrame(draw);
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && visible && !frame) frame = requestAnimationFrame(draw);
      if (!inView && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", visibilityChange);
    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("pagehide", () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShader, { once: true });
  } else {
    initShader();
  }
})();