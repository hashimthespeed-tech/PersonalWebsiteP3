import { useState } from "react";
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
  },
  {
    number: "02",
    label: "Early experiments",
    title: "Shopify · Printify · reselling",
    facts: ["Phone cases for friends", "Stopped counterfeit reselling; refunded buyers"],
  },
  {
    number: "03",
    label: "Sophomore year",
    title: "Fragrance Mog · AI class",
    facts: ["Learning to build with AI", "Stronger communication"],
  },
  {
    number: "04",
    label: "First local work",
    title: "Bin cleaning · car detailing",
    facts: ["First bin-cleaning customer on day one", "Helping with my cousin’s detailing business"],
  },
  {
    number: "05",
    label: "Now",
    title: "Building what comes next",
    facts: ["App still in progress", "San Diego detailing branch is a plan"],
  },
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
  return (
    <div className="business-preview" id="top">
      <PreviewHeader />
      <main>
        <section className="home-hero business-hero" aria-labelledby="business-preview-title">
          <div className="hero-grid business-hero-grid">
            <div className="hero-copy business-hero-copy">
              <p className="eyebrow">Learning by doing</p>
              <h1 className="hero-title business-title" id="business-preview-title">
                <span className="title-line">Business</span>
                <span className="title-line title-accent">Journey</span>
              </h1>
            </div>
          </div>
          <figure className="hero-portrait business-portrait">
            <img src="/__mockup/images/hashim-portrait.png" alt="Hashim Al Amin in a dark suit and tie" />
          </figure>
          <a className="scroll-cue" href="#business-story">Scroll to explore ↓</a>
        </section>

        <section className="business-story" id="business-story" aria-labelledby="business-story-title">
          <div className="business-story-inner">
            <div className="business-story-heading">
              <span className="eyebrow">A few key moments</span>
              <h2 id="business-story-title">Started young.<br />Still learning.</h2>
            </div>
            <ol className="business-timeline">
              {milestones.map((milestone) => (
                <li className="business-milestone" key={milestone.number}>
                  <span className="milestone-number">{milestone.number}</span>
                  <div className="milestone-content">
                    <span className="milestone-label">{milestone.label}</span>
                    <h3>{milestone.title}</h3>
                    <div className="milestone-facts">
                      {milestone.facts.map((fact) => <span key={fact}>{fact}</span>)}
                    </div>
                  </div>
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