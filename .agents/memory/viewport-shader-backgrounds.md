---
name: Viewport-sized shader backgrounds
description: Keep procedural backgrounds composed consistently across long scrolling pages.
---

A procedural shader that normalizes fragment coordinates to canvas dimensions should not be stretched across an entire long page. The page height changes the shader's aspect and can push its color fields away from the first section. A viewport-height sticky canvas contained by the intended content region keeps the composition stable while scrolling and prevents it from drawing over unrelated sections.

**Why:** A full-document canvas made the grayscale shader look nearly black at the top because its brighter regions were mapped elsewhere on the tall canvas.

**How to apply:** Scope the canvas to the relevant content, keep its active drawing area viewport-sized, stack content above it, pause frames while it is offscreen, and retain reduced-motion and CSS fallback behavior.