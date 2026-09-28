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
  let homeGalleryPointerActive = false;
  let homeGalleryIsVisible = !("IntersectionObserver" in window);
  let homeGalleryAutoplayTimer = null;
  let homeGalleryLightboxOpen = false;

  const syncHomeGalleryAutoplay = () => {
    const shouldRun = Boolean(
      homeGallery &&
      !homeGalleryPointerActive &&
      homeGalleryIsVisible &&
      !homeGalleryLightboxOpen &&
      !document.hidden
    );
    if (shouldRun && homeGalleryAutoplayTimer === null) {
      homeGalleryStatus?.setAttribute("aria-live", "off");
      homeGalleryAutoplayTimer = window.setInterval(() => {
        setHomeGallerySlide(activeHomeGalleryIndex + 1);
      }, 2000);
    } else if (!shouldRun && homeGalleryAutoplayTimer !== null) {
      window.clearInterval(homeGalleryAutoplayTimer);
      homeGalleryAutoplayTimer = null;
      homeGalleryStatus?.setAttribute("aria-live", "polite");
    }
  };

  const shuffleHomeGallery = () => {
    for (let index = homeGallerySlides.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [homeGallerySlides[index], homeGallerySlides[randomIndex]] = [
        homeGallerySlides[randomIndex],
        homeGallerySlides[index],
      ];
    }

    const track = homeGallery?.querySelector(".home-coverflow-track");
    homeGallerySlides.forEach((slide, index) => {
      track?.append(slide);
      const title = slide.querySelector(".orbit-card-title")?.textContent?.trim() || `Photo ${index + 1}`;
      const count = slide.querySelector(".home-gallery-count");
      const category = count?.textContent?.split("·").slice(1).join("·").trim();
      slide.setAttribute("aria-label", `${index + 1} of ${homeGallerySlides.length}: ${title}`);
      if (count) {
        count.textContent = `${String(index + 1).padStart(2, "0")} / ${homeGallerySlides.length}${category ? ` · ${category}` : ""}`;
      }
      homeGalleryDots[index]?.setAttribute("aria-label", `Show ${title} photo`);
    });
  };

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
    shuffleHomeGallery();
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
    document.addEventListener("visibilitychange", syncHomeGalleryAutoplay);
    if ("IntersectionObserver" in window) {
      const homeGalleryVisibilityObserver = new IntersectionObserver(([entry]) => {
        homeGalleryIsVisible = entry.isIntersecting;
        syncHomeGalleryAutoplay();
      }, { threshold: 0.08 });
      homeGalleryVisibilityObserver.observe(homeGallery);
    }
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
      homeGalleryPointerActive = true;
      syncHomeGalleryAutoplay();
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
      homeGalleryPointerActive = false;
      syncHomeGalleryAutoplay();
      if (moved && Math.abs(delta) >= 48) {
        setHomeGallerySlide(activeHomeGalleryIndex + (delta < 0 ? 1 : -1));
      }
    });
    homeGalleryStage.addEventListener("pointercancel", () => {
      pointerStart = null;
      homeGalleryStage.classList.remove("is-dragging");
      homeGalleryPointerActive = false;
      syncHomeGalleryAutoplay();
    });
    window.addEventListener("resize", paintHomeGallery);
    syncHomeGalleryAutoplay();
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
    homeGalleryLightboxOpen = false;
    syncHomeGalleryAutoplay();
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
      homeGalleryLightboxOpen = true;
      syncHomeGalleryAutoplay();
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
    homeGalleryLightboxOpen = false;
    syncHomeGalleryAutoplay();
  });

  const businessLightbox = document.querySelector("[data-business-lightbox]");
  const businessLightboxImage = businessLightbox?.querySelector("[data-business-lightbox-image]");
  const businessLightboxTitle = businessLightbox?.querySelector("[data-business-lightbox-title]");
  document.querySelectorAll("[data-business-lightbox-open]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!businessLightbox || !businessLightboxImage || !businessLightboxTitle) return;
      event.preventDefault();
      const thumbnail = link.querySelector("img");
      businessLightboxImage.src = link.href;
      businessLightboxImage.alt = thumbnail?.alt || "";
      businessLightboxTitle.textContent =
        link.dataset.businessLightboxTitle || thumbnail?.alt || "Business photo";
      if (!businessLightbox.open) businessLightbox.showModal();
    });
  });
  businessLightbox?.querySelector("[data-business-lightbox-close]")?.addEventListener("click", () => {
    businessLightbox.close();
  });
  businessLightbox?.addEventListener("click", (event) => {
    if (event.target === businessLightbox) businessLightbox.close();
  });

  const revealSelector =
    "main > section:not(.home-hero), main > .home-rest > section, .hero-portrait, .media-card, .mini-card, .feature-art, .timeline-item, .accent-card, .income-stream, .business-milestone, .media-placeholder"
  const revealObserver =
    !reducedMotion && "IntersectionObserver" in window
      ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
      : null;
  const observedRevealTargets = new WeakSet();
  const prepareRevealTargets = (root) => {
    const targets = [];
    if (root.nodeType === 1 && root.matches(revealSelector)) targets.push(root);
    if (typeof root.querySelectorAll === "function") {
      targets.push(...root.querySelectorAll(revealSelector));
    }
    targets.forEach((section) => {
      if (observedRevealTargets.has(section)) return;
      observedRevealTargets.add(section);
      if (revealObserver) {
        section.setAttribute("data-reveal", "");
        revealObserver.observe(section);
      } else {
        section.classList.add("is-visible");
      }
    });
  };
  prepareRevealTargets(document);
  const revealMutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(prepareRevealTargets);
    });
  });
  revealMutationObserver.observe(document.querySelector("main") || document.body, {
    childList: true,
    subtree: true
  });

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