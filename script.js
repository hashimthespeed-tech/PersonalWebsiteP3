document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", siteNav.classList.contains("open"));
    });
  }

  const hero = document.querySelector(".video-hero");
  const heroVideo = document.querySelector(".hero-video");
  const heroContent = document.querySelector(".video-hero-content");
  if (hero && heroVideo && heroContent) {
    const revealHeroText = () => {
      hero.classList.add("revealed");
      heroContent.setAttribute("aria-hidden", "false");
    };
    heroVideo.addEventListener("ended", revealHeroText, { once: true });
    if (heroVideo.ended) revealHeroText();
  }

  document.querySelectorAll(".media-card[data-media]").forEach((card) => {
    card.addEventListener("click", () => {
      const modal = document.querySelector("#mediaModal");
      const content = document.querySelector("#modalContent");
      const kind = card.dataset.kind || "image";
      const source = card.dataset.media;
      content.innerHTML = kind === "video"
        ? `<iframe title="Expanded media" src="${source}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
        : `<img src="${source}" alt="${card.dataset.alt || "Expanded portfolio media"}">`;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
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