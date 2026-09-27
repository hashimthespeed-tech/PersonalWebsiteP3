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

  const homeGallery = document.querySelector("[data-home-gallery]");
  const homeGalleryStage = homeGallery?.querySelector("[data-home-gallery-stage]");
  const homeGallerySlides = homeGallery
    ? [...homeGallery.querySelectorAll("[data-home-gallery-slide]")]
    : [];
  const homeGalleryDots = homeGallery
    ? [...homeGallery.querySelectorAll("[data-gallery-dot]")]
    : [];
  const homeGalleryStatus = homeGallery?.querySelector("[data-gallery-status]");
  const orbitCards = homeGallery
    ? [...homeGallery.querySelectorAll("[data-orbit-photo]")]
    : [];
  let activeHomeGalleryIndex = 0;

  const paintHomeGallery = () => {
    const total = homeGallerySlides.length;
    if (!homeGalleryStage || !total) return;
    const stageWidth = homeGalleryStage.clientWidth;
    const spacing = stageWidth <= 620
      ? Math.min(stageWidth * 0.47, 180)
      : Math.min(stageWidth * 0.31, 350);

    homeGallerySlides.forEach((slide, index) => {
      let offset = index - activeHomeGalleryIndex;
      if (offset > total / 2) offset -= total;
      else if (offset < -total / 2) offset += total;
      const distance = Math.abs(offset);
      slide.style.setProperty("--gallery-x", `${offset * spacing}px`);
      slide.style.setProperty("--gallery-rotation", `${-offset * 34}deg`);
      slide.style.setProperty("--gallery-scale", String(Math.max(0.76, 1 - distance * 0.12)));
      slide.style.zIndex = String(10 - distance);
      slide.style.opacity = distance > 2 ? "0" : "1";
      slide.style.pointerEvents = distance > 2 ? "none" : "";
      slide.setAttribute("aria-current", String(index === activeHomeGalleryIndex));
    });

    homeGalleryDots.forEach((dot, index) => {
      const active = index === activeHomeGalleryIndex;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (homeGalleryStatus) {
      homeGalleryStatus.textContent = `Photo ${activeHomeGalleryIndex + 1} of ${total}`;
    }
  };

  const setHomeGallerySlide = (index) => {
    const total = homeGallerySlides.length;
    if (!total) return;
    activeHomeGalleryIndex = ((index % total) + total) % total;
    paintHomeGallery();
  };

  if (homeGallery && homeGalleryStage && homeGallerySlides.length) {
    paintHomeGallery();
    homeGalleryDots.forEach((dot, index) => {
      dot.addEventListener("click", () => setHomeGallerySlide(index));
    });
    homeGallery.querySelector("[data-gallery-previous]")?.addEventListener("click", () => {
      setHomeGallerySlide(activeHomeGalleryIndex - 1);
    });
    homeGallery.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
      setHomeGallerySlide(activeHomeGalleryIndex + 1);
    });
    homeGalleryStage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") setHomeGallerySlide(activeHomeGalleryIndex - 1);
      else if (event.key === "ArrowRight") setHomeGallerySlide(activeHomeGalleryIndex + 1);
      else return;
      event.preventDefault();
    });

    let pointerStart = null;
    homeGalleryStage.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStart = { id: event.pointerId, x: event.clientX, moved: false };
    });
    homeGalleryStage.addEventListener("pointermove", (event) => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      if (!pointerStart.moved && Math.abs(event.clientX - pointerStart.x) >= 12) {
        pointerStart.moved = true;
        homeGalleryStage.setPointerCapture(event.pointerId);
        homeGalleryStage.classList.add("is-dragging");
      }
    });
    homeGalleryStage.addEventListener("pointerup", (event) => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      const delta = event.clientX - pointerStart.x;
      const moved = pointerStart.moved;
      pointerStart = null;
      homeGalleryStage.classList.remove("is-dragging");
      if (moved && Math.abs(delta) >= 48) {
        setHomeGallerySlide(activeHomeGalleryIndex + (delta < 0 ? 1 : -1));
      }
    });
    homeGalleryStage.addEventListener("pointercancel", () => {
      pointerStart = null;
      homeGalleryStage.classList.remove("is-dragging");
    });
    window.addEventListener("resize", paintHomeGallery);
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
  orbitCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (index !== activeHomeGalleryIndex) {
        setHomeGallerySlide(index);
        return;
      }
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