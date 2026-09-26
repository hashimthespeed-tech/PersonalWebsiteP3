---
name: WebGL preview verification
description: How to interpret static app-preview captures of procedural WebGL backgrounds.
---

The workspace app-preview screenshot can show only a CSS fallback even when a procedural WebGL background is working. Headless Chromium may render the shader, report WebGL unavailable, or capture a uniformly black frame depending on its graphics context.

**Why:** A static gradient or black capture can look like a shader regression even when the limitation is the screenshot browser's graphics context.

**How to apply:** Prefer a WebGL-capable browser for visual verification. Treat a fallback or black headless capture as inconclusive; retain the CSS fallback for clients without WebGL and for reduced-motion settings.