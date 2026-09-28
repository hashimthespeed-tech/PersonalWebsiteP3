import { useState } from "react";
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
  return (
    <div className="future-preview" id="top">
      <PreviewHeader />
      <main>
        <section className="home-hero future-hero" aria-labelledby="future-preview-title">
          <div className="hero-grid future-hero-grid">
            <div className="hero-copy future-hero-copy">
              <p className="eyebrow">Looking ahead</p>
              <h1 className="hero-title" id="future-preview-title">
                <span className="title-line">My</span>
                <span className="title-line title-accent">Future</span>
              </h1>
              <p className="hero-statement">Learning, building, and making room to grow.</p>
            </div>
            <figure className="hero-portrait future-portrait">
              <img src="/__mockup/images/san-francisco-buildings.webp" alt="San Francisco buildings under a bright coastal sky" />
              <figcaption>San Francisco · on the horizon</figcaption>
            </figure>
          </div>
          <a className="scroll-cue" href="#future-goal">Scroll to explore ↓</a>
        </section>

        <section className="future-goal-section" id="future-goal" aria-labelledby="future-goal-title">
          <div className="future-goal-inner">
            <div className="future-goal-heading">
              <div>
                <span className="eyebrow">Long-term goal</span>
                <h2 id="future-goal-title">$20,000 <span>/ month</span></h2>
              </div>
              <span className="future-goal-note">Passive income · a goal, not current income</span>
            </div>
            <div className="income-streams" aria-label="Planned income streams">
              <article className="income-stream"><span className="stream-number">01</span><h3>Real estate</h3></article>
              <article className="income-stream"><span className="stream-number">02</span><h3>Stocks</h3></article>
              <article className="income-stream"><span className="stream-number">03</span><h3>Business</h3></article>
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