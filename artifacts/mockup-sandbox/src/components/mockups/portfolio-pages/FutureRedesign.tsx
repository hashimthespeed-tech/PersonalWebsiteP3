import { useState } from "react";
import "./FutureRedesign.css";

const navigation = [
  ["Home", "index.html"],
  ["Media", "media.html"],
  ["Future", "future.html"],
  ["Travel", "travel.html"],
  ["Business", "business.html"],
  ["Admin", "admin.html"],
];

const milestones = [
  {
    year: "01 / LEARN",
    title: "Get the fundamentals right.",
    copy: "Build practical skill in AI, communication, sales, and personal finance. Keep showing up in sports, and stay curious about how useful businesses actually work.",
  },
  {
    year: "02 / CONNECT",
    title: "Learn in good company.",
    copy: "Meet people who are building, creating, and investing. Ask better questions, listen closely, and bring what I learn back to the projects in front of me.",
  },
  {
    year: "03 / BUILD",
    title: "Make useful things real.",
    copy: "Turn ideas into small products and services. Pay attention to the problems people will make time to solve, then test, improve, and share the work.",
  },
  {
    year: "04 / REFINE",
    title: "Give the best ideas room.",
    copy: "Keep improving what proves useful. Document the process, build repeatable systems, and learn how to manage time and money with care.",
  },
  {
    year: "05 / COMPOUND",
    title: "Keep choosing the long view.",
    copy: "By 2031, aim to have a stronger body of work, more options, and a thoughtful foundation for the three income streams I want to grow.",
  },
];

const streams = [
  {
    number: "01",
    name: "Real estate",
    description: "Learn the fundamentals and work toward ownership that can create durable, long-term income.",
    note: "A long-term ownership goal",
  },
  {
    number: "02",
    name: "Stocks",
    description: "Build a patient understanding of public markets and invest with a long-term perspective.",
    note: "A patient investing practice",
  },
  {
    number: "03",
    name: "Business",
    description: "Create useful businesses with systems and products that can grow beyond my own hours.",
    note: "Value built through useful work",
  },
];

export function FutureRedesign() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="future-page">
      <header className="future-header">
        <a className="future-brand" href="index.html" aria-label="Hashim Al Amin home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>Hashim Al Amin</span>
        </a>
        <button
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="future-navigation"
          className="future-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
        </button>
        <nav id="future-navigation" className={`future-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a
              aria-current={label === "Future" ? "page" : undefined}
              href={href}
              key={label}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="future-hero" aria-labelledby="future-title">
        <div className="hero-grain" aria-hidden="true" />
        <div className="future-hero-copy">
          <p className="future-kicker"><span className="kicker-rule" /> A direction, not a prediction</p>
          <h1 id="future-title">The next five<br />years are <em>wide open.</em></h1>
          <p className="future-lead">
            I’m building toward a life with more useful work, more room to explore, and the freedom to choose what comes next.
          </p>
          <a className="future-text-link" href="#the-plan">
            Follow the direction <span aria-hidden="true">↘</span>
          </a>
          <div className="hero-location">
            <span className="location-dot" />
            <span>San Diego, California</span>
            <span className="location-divider" />
            <span>Looking toward 2031</span>
          </div>
        </div>
        <figure className="future-hero-art">
          <img src="/__mockup/images/san-francisco-buildings.webp" alt="San Francisco buildings rising into a bright coastal sky" />
          <figcaption><span>Keep looking up.</span><span>37°46′ N / 122°25′ W</span></figcaption>
          <span className="image-index" aria-hidden="true">01 — 05</span>
        </figure>
        <a className="hero-scroll" href="#the-plan" aria-label="Scroll to the five-year direction">
          <span>Scroll to explore</span><span className="scroll-line" />
        </a>
      </section>

      <section className="direction-section" id="the-plan">
        <div className="section-inner direction-layout">
          <div className="direction-heading">
            <p className="future-kicker">2026 <span className="kicker-arrow">→</span> 2031</p>
            <h2>Build smart.<br /><em>Go far.</em></h2>
            <p className="direction-caption">Five years of learning, making, and getting a little more capable every day.</p>
          </div>
          <div className="direction-copy">
            <p className="copy-large">I want to become an AI-fluent entrepreneur with strong communication skills, a meaningful network, and the discipline to turn good ideas into real income.</p>
            <p>That doesn’t mean having every step figured out. It means staying open, learning from people further along, and putting what I learn to work in real projects.</p>
            <p>Sports, travel, and hands-on work are part of that education. They keep me grounded in the people and places that make a bigger life worth building.</p>
          </div>
        </div>
      </section>

      <section className="target-section" aria-labelledby="target-heading">
        <div className="target-topline">
          <span className="target-label">The ambition</span>
          <span className="target-date">BY 2031 <i /></span>
        </div>
        <div className="target-main">
          <div className="target-amount" aria-label="Twenty thousand dollars per month">
            <span className="currency">$</span>20,000<span className="per-month">/ month</span>
          </div>
          <div className="target-copy">
            <h2 id="target-heading">A goal to work toward.<br /><em>Not a result I’ve reached.</em></h2>
            <p>My long-term aim is to build toward $20,000 per month in passive income by 2031, across three possible streams. Each would take time, learning, and responsible decisions to develop.</p>
          </div>
        </div>
        <div className="stream-list" aria-label="Three intended income streams">
          {streams.map((stream) => (
            <article className="stream-item" key={stream.number}>
              <span className="stream-number">{stream.number}</span>
              <div className="stream-detail">
                <h3>{stream.name}</h3>
                <p>{stream.description}</p>
              </div>
              <span className="stream-note">{stream.note}</span>
            </article>
          ))}
        </div>
        <p className="target-disclaimer">These are future ambitions—not current properties, investment returns, or income.</p>
      </section>

      <section className="roadmap-section" aria-labelledby="roadmap-title">
        <div className="section-inner">
          <div className="roadmap-intro">
            <div>
              <p className="future-kicker">The path I’m imagining</p>
              <h2 id="roadmap-title">A little further<br /><em>each year.</em></h2>
            </div>
            <p>Not a rigid forecast. A set of useful directions I can revisit as I learn more.</p>
          </div>
          <div className="roadmap">
            {milestones.map((milestone, index) => (
              <article className="milestone" key={milestone.year}>
                <div className="milestone-marker"><span>0{index + 1}</span></div>
                <div className="milestone-copy">
                  <span className="milestone-year">{milestone.year}</span>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.copy}</p>
                </div>
                <span className="milestone-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fieldwork-section">
        <div className="section-inner fieldwork-layout">
          <figure className="fieldwork-photo">
            <img src="/__mockup/images/hashim-portrait.png" alt="Hashim Al Amin in a dark suit and tie" />
            <figcaption><span>Still learning. Still moving.</span><span>Hashim / San Diego</span></figcaption>
          </figure>
          <div className="fieldwork-copy">
            <p className="future-kicker">The work between the lines</p>
            <h2>Learn by<br /><em>doing.</em></h2>
            <p>Plans matter most when they meet real life. I want to keep taking on projects that teach me how to solve a problem, communicate clearly, and follow through.</p>
            <p>Every small attempt is practice: noticing what people need, figuring out what I can offer, and getting better at the work itself.</p>
            <a className="future-text-link" href="business.html">See what I’m building <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="horizon-section" aria-label="A reminder to keep perspective">
        <img src="/__mockup/images/san-francisco-park.webp" alt="A sunlit path through a San Francisco park, opening toward the horizon" />
        <div className="horizon-overlay" />
        <div className="horizon-copy">
          <p className="future-kicker">Stay curious. Stay in motion.</p>
          <blockquote>“I don’t need a perfectly straight line. I want a body of work that gets more useful, more generous, and more mine.”</blockquote>
          <span>— A note to my future self</span>
        </div>
      </section>

      <footer className="future-footer">
        <a className="footer-signoff" href="index.html">Hashim Al Amin <span>San Diego, CA</span></a>
        <p>Ambition is a direction. The work is the point.</p>
        <nav aria-label="Footer navigation">
          <a href="travel.html">Travel</a>
          <a href="business.html">Business</a>
          <a href="index.html">Home</a>
        </nav>
      </footer>
    </main>
  );
}