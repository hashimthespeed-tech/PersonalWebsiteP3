if (window.location.hash === "#intro") {
  const pageUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", pageUrl);
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  window.requestAnimationFrame(() => {
    document.documentElement.style.removeProperty("scroll-behavior");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("has-js");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", siteNav.classList.contains("open"));
    });
  }

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll("[data-text-reveal]").forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    const words = document.createDocumentFragment();
    let wordIndex = 0;

    text.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) {
        words.append(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "home-intro-word";
      word.style.transitionDelay = `${wordIndex * 45}ms`;
      word.textContent = part;
      words.append(word);
      wordIndex += 1;
    });

    paragraph.replaceChildren(words);
  });

  const orbitStage = document.querySelector("[data-orbit-gallery]");
  const orbitRing = orbitStage?.querySelector("[data-orbit-ring]");
  const orbitPositions = orbitRing ? [...orbitRing.querySelectorAll(".orbit-position")] : [];
  const orbitCards = orbitStage ? [...orbitStage.querySelectorAll(".orbit-card")] : [];
  const orbitToggle = orbitStage?.querySelector("[data-orbit-toggle]");

  orbitCards.forEach((card) => {
    const position = card.closest(".orbit-position");
    const updateActivePosition = () => {
      position?.classList.toggle("is-hovered", card.matches(":hover") || card === document.activeElement);
    };
    ["pointerenter", "pointerleave", "focus", "blur"].forEach((eventName) => {
      card.addEventListener(eventName, updateActivePosition);
    });
  });

  if (orbitStage && orbitRing && orbitPositions.length && !reducedMotion && "IntersectionObserver" in window) {
    const baseSpeed = 360 / 72000;
    let angle = -14;
    let velocity = baseSpeed;
    let lastFrameTime = null;
    let animationFrame = 0;
    let isInView = false;
    let isPaused = false;

    const paintOrbit = () => {
      orbitRing.style.transform = `rotateY(${angle}deg)`;
      orbitPositions.forEach((position) => {
        position.style.setProperty("--orbit-counter", `${-angle}deg`);
      });
    };

    const animateOrbit = (time) => {
      if (!isInView) {
        animationFrame = 0;
        return;
      }
      if (lastFrameTime === null) lastFrameTime = time;
      const elapsed = Math.min(time - lastFrameTime, 80);
      lastFrameTime = time;

      const hasPointerOrKeyboardFocus =
        orbitCards.some((card) => card.matches(":hover") || card === document.activeElement) ||
        Boolean(orbitToggle?.matches(":hover, :focus-visible"));
      const targetSpeed = isPaused ? 0 : baseSpeed * (hasPointerOrKeyboardFocus ? 0.22 : 1);
      velocity += (targetSpeed - velocity) * (1 - Math.exp(-elapsed / 520));
      angle = (angle + velocity * elapsed) % 360;
      paintOrbit();
      animationFrame = window.requestAnimationFrame(animateOrbit);
    };

    paintOrbit();
    orbitToggle?.addEventListener("click", () => {
      isPaused = !isPaused;
      orbitToggle.setAttribute("aria-pressed", String(isPaused));
      orbitToggle.querySelector("[data-orbit-toggle-label]").textContent = isPaused ? "Resume motion" : "Pause motion";
      orbitToggle.querySelector("[data-orbit-toggle-icon]").textContent = isPaused ? "▶" : "Ⅱ";
    });

    const orbitObserver = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      if (isInView && !animationFrame) {
        lastFrameTime = null;
        animationFrame = window.requestAnimationFrame(animateOrbit);
      } else if (!isInView && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        lastFrameTime = null;
      }
    }, { threshold: 0.05 });
    orbitObserver.observe(orbitStage);
  }

  const orbitLightbox = document.querySelector("[data-orbit-lightbox]");
  const orbitLightboxTitle = orbitLightbox?.querySelector("[data-orbit-lightbox-title]");
  const orbitLightboxDescription = orbitLightbox?.querySelector("[data-orbit-lightbox-description]");
  const orbitLightboxImage = orbitLightbox?.querySelector("[data-orbit-lightbox-image]");
  const revealLightboxText = (element, text, delayOffset = 0) => {
    if (reducedMotion) {
      element.textContent = text;
      return 0;
    }

    const fragment = document.createDocumentFragment();
    let wordIndex = 0;
    text.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) {
        fragment.append(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "home-intro-word";
      word.style.transitionDelay = `${delayOffset + wordIndex * 38}ms`;
      word.textContent = part;
      fragment.append(word);
      wordIndex += 1;
    });
    element.replaceChildren(fragment);
    return wordIndex;
  };
  const closeOrbitLightbox = () => {
    if (!orbitLightbox?.open) return;
    orbitLightbox.classList.remove("is-entering");
    orbitLightbox.close();
  };
  orbitCards.forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      const title = card.querySelector(".orbit-card-title");
      if (!orbitLightbox || !image || !title || !orbitLightboxTitle || !orbitLightboxDescription || !orbitLightboxImage) return;

      orbitLightbox.classList.remove("is-entering");
      const titleText = title.textContent.trim();
      if (reducedMotion) {
        orbitLightboxTitle.textContent = titleText;
        orbitLightboxDescription.textContent = card.dataset.description || "";
      } else {
        const titleWordCount = revealLightboxText(orbitLightboxTitle, titleText);
        revealLightboxText(
          orbitLightboxDescription,
          card.dataset.description || "",
          Math.min(titleWordCount * 38, 228)
        );
      }
      orbitLightboxImage.src = image.currentSrc || image.src;
      orbitLightboxImage.alt = image.alt;
      if (!orbitLightbox.open) orbitLightbox.showModal();
      window.requestAnimationFrame(() => {
        if (orbitLightbox.open) orbitLightbox.classList.add("is-entering");
      });
    });
  });
  orbitLightbox?.querySelector("[data-orbit-lightbox-close]")?.addEventListener("click", closeOrbitLightbox);
  orbitLightbox?.addEventListener("click", (event) => {
    if (event.target === orbitLightbox) closeOrbitLightbox();
  });
  orbitLightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeOrbitLightbox();
  });
  orbitLightbox?.addEventListener("close", () => {
    orbitLightbox.classList.remove("is-entering");
  });

  const revealSections = document.querySelectorAll(
    "main > section:not(.home-hero), main > .home-rest > section, .hero-portrait, .media-card, .mini-card, .feature-art, .timeline-item, .accent-card"
  );
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  } else {
    revealSections.forEach((section) => section.setAttribute("data-reveal", ""));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealSections.forEach((section) => revealObserver.observe(section));
  }

  if (!reducedMotion) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const portrait = document.querySelector(".hero-portrait");
        if (portrait && window.scrollY < window.innerHeight) {
          portrait.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.035, 18)}px`);
        }
        ticking = false;
      });
    }, { passive: true });
  }

  const openMedia = (card) => {
    const modal = document.querySelector("#mediaModal");
    const content = document.querySelector("#modalContent");
    const kind = card.dataset.kind || "image";
    const source = card.dataset.media;
    if (!modal || !content || !source) return;
    content.innerHTML = kind === "video"
      ? `<iframe title="Expanded media" src="${source}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<img src="${source}" alt="${card.dataset.alt || "Expanded portfolio media"}">`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  };
  document.querySelectorAll(".media-card[data-media]").forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", () => openMedia(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMedia(card);
      }
    });
  });

  const modal = document.querySelector("#mediaModal");
  if (modal) {
    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.querySelector("#modalContent").innerHTML = "";
    };
    document.querySelector(".modal-close")?.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  }

  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = document.querySelector("#formMessage");
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      status.className = "form-message";
      status.textContent = "Sending your note…";
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Something went wrong.");
        form.reset();
        status.className = "form-message success";
        status.textContent = "Thanks — your message is on its way.";
      } catch (error) {
        status.className = "form-message error";
        status.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  }
});