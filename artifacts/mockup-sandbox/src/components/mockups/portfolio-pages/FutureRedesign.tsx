import { useEffect, useState } from "react";
import "./_group.css";
import "./FutureRedesign.css";

const navigation = [
  ["Home", "#home"],
  ["Media", "#media"],
  ["Future", "#future"],
  ["Travel", "#travel"],
  ["Business", "#business"],
  ["Admin", "#admin"],
];

type MediaSlotProps = { scene: string; index: string; label: string };

function useScrollReveal(rootSelector: string) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) return;
    root.classList.add("scroll-ready");
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return () => root.classList.remove("scroll-ready");
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      root.classList.remove("scroll-ready");
    };
  }, [rootSelector]);
}

function MediaPlaceholder({ scene, index, label }: MediaSlotProps) {
  return (
    <figure
      className="media-placeholder reveal-on-scroll"
      data-scene={scene}
      aria-label={`Photo or video placeholder for ${label}`}
    >
      <span className="media-placeholder-orbit" aria-hidden="true" />
      <span className="media-placeholder-mark" aria-hidden="true">+</span>
      <figcaption><span>{index} · photo or video</span><span>{label}</span></figcaption>
    </figure>
  );
}

function PreviewHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <span className="wordmark-mark" aria-hidden="true" />
        Hashim Al Amin
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        ☰
      </button>
      <nav className={`site-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
        {navigation.map(([label, href]) => (
          <a
            className={label === "Future" ? "active" : undefined}
            aria-current={label === "Future" ? "page" : undefined}
            href={href}
            key={label}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export function FutureRedesign() {
  useScrollReveal(".future-preview");
  const streams = [
    { number: "01", label: "Real estate", scene: "property" },
    { number: "02", label: "Stocks", scene: "stocks" },
    { number: "03", label: "Business", scene: "business" },
  ];
  return (
    <div className="future-preview" id="top">
      <PreviewHeader />
      <main>
        <section className="future-goal-section" id="future-goal" aria-labelledby="future-goal-title">
          <div className="future-goal-inner">
            <header className="future-page-heading reveal-on-scroll">
              <div>
                <span className="eyebrow">Future · long-term goal</span>
                <h1 id="future-goal-title">$20,000 <span>/ month</span></h1>
              </div>
              <div className="future-goal-meta"><span>Passive income</span><span>A goal, not current income</span></div>
            </header>
            <div className="income-streams" aria-label="Planned income streams">
              {streams.map((stream) => (
                <article className="income-stream reveal-on-scroll" key={stream.number}>
                  <MediaPlaceholder scene={stream.scene} index={stream.number} label={stream.label} />
                  <div className="stream-copy"><span className="stream-number">{stream.number}</span><h2>{stream.label}</h2></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="portfolio-container footer-inner">
          <span>Hashim Al Amin</span>
          <div className="footer-links"><a href="#business">Business</a><a href="#top">Back to top ↑</a></div>
        </div>
      </footer>
    </div>
  );
}