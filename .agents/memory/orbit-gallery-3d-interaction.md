---
name: Orbit gallery 3D interaction
description: Interaction and image-loading constraints for the rotating perspective gallery.
---

The gallery uses a small set of cards positioned in a 3D ring. Rear cards are naturally occluded until they rotate into the front; do not raise a hovered `.orbit-position` with `z-index`, because changing the 3D stacking order made pointer hit-testing unstable. Keep the small gallery image set eagerly loaded so every card is ready when it rotates into view. For stages containing linked cards, do not capture the pointer on pointer-down: capture retargets the click to the stage and breaks link navigation. Track movement first and capture only after the pointer crosses a drag threshold.

**Why:** CSS 3D paint order and pointer hit-testing are coupled, lazy-loading heuristics are unreliable for absolute transformed cards, and pointer capture can prevent native anchor clicks.

**How to apply:** Use per-card hover and keyboard-focus states, slow the ring while a card is active, capture only after a drag threshold, and test every card's click target as it reaches the front of the ring in a browser that supports CSS 3D transforms.