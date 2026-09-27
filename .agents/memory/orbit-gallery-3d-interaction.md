---
name: Image carousel interaction
description: Image loading, 3D stacking, and pointer gesture constraints for interactive galleries.
---

For small sets of transformed gallery photos, eagerly load every image and mark photos `draggable="false"` so native image dragging cannot take over a horizontal gesture. Track pointer movement and capture only after the drag threshold; early capture retargets ordinary clicks. In a true 3D ring, do not raise a hovered card's container with `z-index`, because changing 3D stacking can destabilize hit-testing.

**Why:** Lazy-loading absolute cards can leave photos blank when they become visible; native image dragging can dispatch `pointercancel`; early pointer capture can swallow clicks; and CSS 3D stacking affects hit-testing.

**How to apply:** Eager-load small transformed galleries, disable native image dragging, and capture only after an intentional swipe threshold. Test both photo clicks and pointer gestures in a browser; for 3D rings, verify stacking and hit-testing as cards move.