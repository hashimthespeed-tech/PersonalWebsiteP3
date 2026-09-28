---
name: Dev preview routing
description: Distinguishing development hostname routing from healthy webview and design-sandbox services.
---

With a separate design-sandbox service running, a bare development hostname can report “Backend Not Configured” even while the main webview and canvas previews are healthy.

**Why:** Changing the main app’s external port to the default HTTP port did not restore the bare hostname and disrupted its working mapped-port route. Restoring the original mapping made the main preview reachable again; the bare hostname failure was not an application crash.

**How to apply:** Check the main workflow’s mapped webview route and the sandbox’s isolated preview route separately before changing port mappings. Do not treat a failed bare-hostname request alone as evidence that either app is down.