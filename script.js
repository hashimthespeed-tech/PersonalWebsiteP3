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

  const revealSections = document.querySelectorAll(
    "main > section:not(.home-hero), main > .home-rest > section, .hero-portrait, .media-card, .mini-card, .feature-art, .timeline-item, .accent-card"
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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