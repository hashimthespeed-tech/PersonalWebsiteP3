---
name: WebGL preview verification
description: How to interpret static app-preview captures of the procedural cloud hero.
---

The workspace app-preview screenshot can show only the CSS sky fallback even when the WebGL cloud shader is working. A Chromium headless run with WebGL enabled and SwiftShader confirmed that the shader renders.

**Why:** A static preview without clouds can look like a shader regression even when the limitation is the screenshot browser's graphics context.

**How to apply:** When verifying this hero, check it in a WebGL-capable browser or headless Chromium with software WebGL enabled, and retain the CSS sky fallback for clients without WebGL.