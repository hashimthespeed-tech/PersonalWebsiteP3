---
name: WebGL preview verification
description: How to interpret static app-preview captures of the procedural cloud hero.
---

The workspace app-preview screenshot can show only the CSS sky fallback even when the WebGL cloud shader is working. Chromium headless with WebGL and SwiftShader can confirm shader initialization, but its CLI screenshot may still be uniformly black in this workspace.

**Why:** A static preview without clouds can look like a shader regression even when the limitation is the screenshot browser's graphics context.

**How to apply:** Prefer a WebGL-capable browser for visual verification. If headless Chromium reports the canvas ready but captures a black image, treat that capture as inconclusive rather than as app output. Retain the CSS fallback for clients without WebGL.