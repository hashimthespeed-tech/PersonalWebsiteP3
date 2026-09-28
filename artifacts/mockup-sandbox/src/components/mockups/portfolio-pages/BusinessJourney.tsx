import { useEffect, useState } from "react";
import "./_group.css";
import "./BusinessJourney.css";

const navigation = [
  ["Home", "#home"],
  ["Media", "#media"],
  ["Future", "#future"],
  ["Travel", "#travel"],
  ["Business", "#business"],
  ["Admin", "#admin"],
];

const milestones = [
  {
    number: "01",
    label: "Grade 7",
    title: "Fortnite YouTube channel",
    facts: ["Daily videos", "Nearly 3,000 subscribers at its peak"],
    scene: "gaming",
  },
  {
    number: "02",
    label: "Early experiments",
    title: "Shopify · Printify · reselling",
    facts: ["Phone cases for friends", "Stopped counterfeit reselling; refunded buyers"],
    scene: "experiments",
  },
  {
    number: "03",
    label: "Sophomore year",
    title: "Fragrance Mog · AI class",
    facts: ["Learning to build with AI", "Stronger communication"],
    scene: "learning",
  },
  {
    number: "04",
    label: "First local work",
    title: "Bin cleaning · car detailing",
    facts: ["First bin-cleaning customer on day one", "Helping with my cousin’s detailing business"],
    scene: "local-work",
  },
  {
    number: "05",
    label: "Now",
    title: "Building what comes next",
    facts: ["App still in progress", "San Diego detailing branch is a plan"],
    scene: "next",
  },
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
            className={label === "Business" ? "active" : undefined}
            aria-current={label === "Business" ? "page" : undefined}
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

export function BusinessJourney() {
  useScrollReveal(".business-preview");
  return (
    <div className="business-preview" id="top">
      <PreviewHeader />
      <main>
        <section className="business-story" id="business-story" aria-labelledby="business-story-title">
          <div className="business-story-inner">
            <div className="business-story-heading reveal-on-scroll">
              <div>
                <span className="eyebrow">Business journey · five moments</span>
                <h1 id="business-story-title">Started young. Still learning.</h1>
              </div>
            </div>
            <ol className="business-timeline">
              {milestones.map((milestone) => (
                <li className="business-milestone reveal-on-scroll" key={milestone.number}>
                  <span className="milestone-number">{milestone.number}</span>
                  <div className="milestone-content">
                    <span className="milestone-label">{milestone.label}</span>
                    <h3>{milestone.title}</h3>
                    <div className="milestone-facts">
                      {milestone.facts.map((fact) => <span key={fact}>{fact}</span>)}
                    </div>
                  </div>
                  <MediaPlaceholder scene={milestone.scene} index={milestone.number} label={milestone.title} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="portfolio-container footer-inner">
          <span>Hashim Al Amin</span>
          <div className="footer-links"><a href="#future">Future</a><a href="#top">Back to top ↑</a></div>
        </div>
      </footer>
    </div>
  );
}