(() => {
  const canvas = document.querySelector("#homeRestShader");
  if (!canvas) return;

  const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform float u_time;

    float grainHash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution)
        / min(u_resolution.x, u_resolution.y);
      p *= 1.16;

      vec3 acc = vec3(0.03) * 0.22;
      float total = 0.22;
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 center = vec2(
          sin(u_time * (0.31 + fi * 0.095) + fi * 2.4 + 1453.0),
          cos(u_time * (0.25 + fi * 0.11) + fi * 1.7)
        ) * 0.62;
        float weight = exp(-dot(p - center, p - center) * 3.6);
        vec3 color;
        if (i == 0) color = vec3(0.72);
        else if (i == 1) color = vec3(0.98);
        else if (i == 2) color = vec3(0.46);
        else color = vec3(0.18);
        acc += color * weight;
        total += weight;
      }

      vec3 color = (acc / total - 0.5) * 1.32 + 0.5;
      float grainSeed = mod(1453.0, 31.0);
      color += (grainHash(
        gl_FragCoord.xy + vec2(grainSeed * 17.0, grainSeed * 31.0)
      ) - 0.5) * 0.045;
      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    console.warn("Home background shader unavailable; using the static CSS texture.");
    return;
  }

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("Home background shader failed to compile:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return;
  }

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Home background shader failed to link:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let startTime = performance.now();
  let visible = document.visibilityState === "visible";
  let backgroundInView = false;
  let disposed = false;

  function requestRender() {
    if (
      !disposed &&
      visible &&
      backgroundInView &&
      !reducedMotion.matches &&
      frame === 0
    ) {
      frame = requestAnimationFrame(render);
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const deviceScale = Math.min(window.devicePixelRatio || 1, 1.5);
    const pixelScale = Math.min(
      deviceScale,
      Math.sqrt(1_350_000 / Math.max(1, bounds.width * bounds.height)),
    );
    const width = Math.max(1, Math.round(bounds.width * pixelScale));
    const height = Math.max(1, Math.round(bounds.height * pixelScale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    if (reducedMotion.matches) {
      render(performance.now());
    } else {
      requestRender();
    }
  }

  function render(now) {
    frame = 0;
    if (disposed || !visible || !backgroundInView) return;
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, reducedMotion.matches ? 0 : ((now - startTime) / 1000) * 1.35);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestRender();
  }

  const motionChange = () => {
    if (reducedMotion.matches) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      render(performance.now());
    } else {
      requestRender();
    }
  };
  const visibilityChange = () => {
    visible = document.visibilityState === "visible";
    if (visible) {
      startTime = performance.now();
      if (reducedMotion.matches) render(startTime);
      else requestRender();
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const backgroundObserver = new IntersectionObserver(([entry]) => {
    backgroundInView = entry?.isIntersecting ?? false;
    if (backgroundInView) {
      if (reducedMotion.matches) render(performance.now());
      else requestRender();
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }, { threshold: 0.01 });
  const resizeObserver = new ResizeObserver(resize);
  backgroundObserver.observe(canvas);
  resizeObserver.observe(canvas);
  document.addEventListener("visibilitychange", visibilityChange);
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", motionChange);
  } else {
    reducedMotion.addListener(motionChange);
  }
  window.addEventListener("resize", resize);

  function cleanup() {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    backgroundObserver.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", visibilityChange);
    window.removeEventListener("resize", resize);
    if (reducedMotion.removeEventListener) {
      reducedMotion.removeEventListener("change", motionChange);
    } else {
      reducedMotion.removeListener(motionChange);
    }
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  }

  window.addEventListener("pagehide", cleanup, { once: true });
  resize();
})();