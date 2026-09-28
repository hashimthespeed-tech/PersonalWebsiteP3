import { useState } from "react";
import "./BusinessJourney.css";

const chapters = [
  {
    index: "01",
    period: "Seventh grade",
    title: "A channel, built one upload at a time.",
    copy: "I started a Fortnite YouTube channel and posted every day. It grew to almost 3,000 subscribers, and at one point my videos were getting 5,000–10,000 views. That was my first proof that showing up consistently could reach people.",
    note: "Fortnite · daily videos · almost 3,000 subscribers",
  },
  {
    index: "02",
    period: "Early experiments",
    title: "I learned what a sale is not.",
    copy: "I tried dropshipping on Shopify, but I didn’t know how to market it. A Printify phone-case idea sold to friends, not strangers. Neither store became a successful business. I also tried reselling counterfeit items. That was wrong. I stopped, felt bad about the people I’d sold to, and refunded them.",
    note: "A mistake I own, not a win I retell",
  },
  {
    index: "03",
    period: "Trying again",
    title: "New ideas came faster than follow-through.",
    copy: "I tried dropshipping again and started learning about AI and ChatGPT through the internet. I was curious and picked up a lot, but I kept moving to the next idea. When a project hit a real obstacle, I often stopped instead of working through it.",
    note: "Curiosity was there. Consistency wasn’t yet.",
  },
  {
    index: "04",
    period: "Sophomore year",
    title: "Guidance changed how I build.",
    copy: "A class in my sophomore year gave me guidance, strengthened my communication, and helped me go deeper with AI. I started Fragrance Mog, a fragrance channel, and began building an app last year. It’s still a work in progress—and I’m still working on it.",
    note: "Learning to make ideas tangible",
  },
];

function ArrowMark() {
  return <span aria-hidden="true" className="bj-arrow">↗</span>;
}

export function BusinessJourney() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="bj-page">
      <header className="bj-header">
        <a className="bj-wordmark" href="#top" aria-label="Hashim Al Amin — back to top">
          <span className="bj-mark" aria-hidden="true" />
          <span>Hashim Al Amin</span>
        </a>
        <button
          className="bj-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="business-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
        <nav id="business-nav" className={`bj-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          <a href="index.html">Home</a>
          <a href="media.html">Media</a>
          <a href="future.html">Future</a>
          <a href="travel.html">Travel</a>
          <a className="is-active" href="business.html" aria-current="page">Business</a>
          <a href="admin.html">Admin</a>
        </nav>
      </header>

      <section className="bj-hero" id="top" aria-labelledby="bj-title">
        <div className="bj-hero-copy">
          <p className="bj-kicker"><span className="bj-kicker-line" /> Notes from the work in progress</p>
          <h1 id="bj-title">Business<br /><em>Journey</em></h1>
          <p className="bj-intro">I’ve tried a lot of things. Some didn’t work. A few taught me how to keep going. This is the honest version of how I got here.</p>
          <a className="bj-text-link" href="#chapters">Follow the story <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="bj-hero-photo">
          <img src="/__mockup/images/hashim-portrait.png" alt="Hashim Al Amin in a dark suit and tie" />
          <figcaption><span>San Diego, California</span><span>Learning by doing</span></figcaption>
          <span className="bj-photo-index" aria-hidden="true">FIELD NOTES / 01</span>
        </figure>
        <div className="bj-hero-side" aria-hidden="true">STUDENT · BUILDER · STILL LEARNING</div>
        <a className="bj-scroll-cue" href="#chapters"><span /> Keep scrolling</a>
      </section>

      <section className="bj-ledger" aria-label="A few real milestones">
        <div><span className="bj-ledger-number">~3,000</span><span className="bj-ledger-label">channel subscribers</span></div>
        <div><span className="bj-ledger-number">1</span><span className="bj-ledger-label">first bin-cleaning customer, day one</span></div>
        <div><span className="bj-ledger-number">$1,000</span><span className="bj-ledger-label">weekly profit goal reached with my cousin</span></div>
        <p>Not a highlight reel.<br />Just the parts that changed me.</p>
      </section>

      <section className="bj-chapters" id="chapters" aria-labelledby="bj-chapters-title">
        <div className="bj-section-heading">
          <div>
            <p className="bj-eyebrow">The long way around</p>
            <h2 id="bj-chapters-title">Try. Learn.<br /><span>Try better.</span></h2>
          </div>
          <p className="bj-section-deck">No neat overnight-success story here. The useful part has been learning to stay with an idea after the exciting beginning.</p>
        </div>
        <div className="bj-timeline">
          {chapters.map((chapter) => (
            <article className="bj-chapter" key={chapter.index}>
              <div className="bj-chapter-marker">
                <span>{chapter.index}</span>
                <span className="bj-marker-line" />
              </div>
              <div className="bj-chapter-body">
                <p className="bj-eyebrow">{chapter.period}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
                <span className="bj-chapter-note">{chapter.note}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bj-bin-section" aria-labelledby="bj-bin-title">
        <div className="bj-bin-copy">
          <p className="bj-eyebrow">A summer side project</p>
          <h2 id="bj-bin-title">Door to door.<br /><em>Day one.</em></h2>
          <p>I started a bin-cleaning business to help pay for things like AI subscriptions. I didn’t wait until I had a perfect plan: I went door knocking, and found my first customer on the first day.</p>
          <p>That small beginning gave me a practical lesson: ask, listen, and do the work in front of you.</p>
          <span className="bj-photo-caption">The before-and-after work, not a stock photo.</span>
        </div>
        <div className="bj-bin-gallery">
          <figure className="bj-bin-image bj-bin-before">
            <img src="/__mockup/images/bin-cleaning-before.webp" alt="A residential trash bin before the cleaning service" loading="lazy" />
            <figcaption><span>01</span> Before</figcaption>
          </figure>
          <figure className="bj-bin-image bj-bin-after">
            <img src="/__mockup/images/bin-cleaning-after.webp" alt="The same trash bin after a thorough cleaning" loading="lazy" />
            <figcaption><span>02</span> After</figcaption>
          </figure>
          <span className="bj-gallery-stamp" aria-hidden="true">A real<br />first step</span>
        </div>
      </section>

      <section className="bj-detailing" aria-labelledby="bj-detailing-title">
        <div className="bj-detailing-top">
          <div>
            <p className="bj-eyebrow">Late summer · Bay Area</p>
            <h2 id="bj-detailing-title">One week.<br /><span>One shared goal.</span></h2>
          </div>
          <div className="bj-detailing-copy">
            <p>Near the end of summer, I joined my cousin to help with his car-detailing business in the Bay Area. We set a goal of $1,000 in profit for the week—and reached it.</p>
            <p>We detailed cars and knocked on doors, including in neighborhoods I’d never have approached on my own. The week made me a better communicator. It also showed me what focused effort can do when there’s a real person counting on you.</p>
          </div>
        </div>
        <figure className="bj-detailing-photo">
          <img src="/__mockup/images/porsche-exterior.webp" alt="A Porsche photographed during the car-detailing work in the Bay Area" loading="lazy" />
          <figcaption><span>Work alongside my cousin’s detailing business</span><span>Bay Area · Summer</span></figcaption>
          <div className="bj-goal-stamp"><span>Goal reached</span><strong>$1,000</strong><span>profit · one week</span></div>
        </figure>
        <div className="bj-poster-row">
          <span className="bj-poster-rule" />
          <p>The goal was ours for that week. The business is my cousin’s.</p>
          <img src="/__mockup/images/car-detailing-poster.jpg" alt="A promotional poster for the car-detailing service" loading="lazy" />
        </div>
      </section>

      <section className="bj-next" aria-labelledby="bj-next-title">
        <div className="bj-next-label">
          <p className="bj-eyebrow">What I’m doing now</p>
          <span className="bj-next-index">NEXT / 01</span>
        </div>
        <div className="bj-next-main">
          <h2 id="bj-next-title">Finish the app.<br /><em>Keep showing up.</em></h2>
          <p>The app I started last year is still in progress. I want to finish it and see where it can go. I also hope to help my cousin scale his detailing business—or possibly open a San Diego branch together. Those are plans, not things that have happened yet.</p>
          <a className="bj-back-top" href="#top">Back to the beginning <ArrowMark /></a>
        </div>
        <span className="bj-next-watermark" aria-hidden="true">NEXT</span>
      </section>

      <footer className="bj-footer">
        <a className="bj-wordmark" href="#top"><span className="bj-mark" aria-hidden="true" /><span>Hashim Al Amin</span></a>
        <p>San Diego, California <span aria-hidden="true">·</span> Building in public</p>
        <nav aria-label="Footer navigation"><a href="travel.html">Travel</a><a href="#top" aria-label="Back to top">Business ↑</a></nav>
      </footer>
    </main>
  );
}