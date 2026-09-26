---
name: Vite IIFE browser builds
description: A browser-only Vite library bundle can retain process.env references from its dependencies.
---

When Vite emits a browser library in IIFE format, verify the generated bundle does not retain Node-only `process.env.NODE_ENV` references. In the observed setup, the page failed before React mounted until that expression was explicitly defined as `"production"` in the Vite config.

**Why:** A successful TypeScript/Vite build does not prove that a library bundle is free of Node globals; the error only appeared when the bundle executed in a browser.

**How to apply:** For browser-only IIFE builds that bundle React, inspect or grep the generated JS for `process.env.NODE_ENV` and verify the page mounts in a browser.