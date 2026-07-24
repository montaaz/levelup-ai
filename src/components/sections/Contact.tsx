import CinematicBackground from "@/components/media/CinematicBackground";
import Reveal from "@/components/ui/Reveal";

const POINTS = [
  { n: 1, title: "What your business does", copy: "A short description is enough." },
  { n: 2, title: "What you want to create", copy: "Website, video, automation, or a combination." },
  { n: 3, title: "Your goal and timing", copy: "What success looks like and when you need it." },
];

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <CinematicBackground variant="contact" src="/videos/contact-bg.mp4" />
      <div className="wrap contact-grid">
        <Reveal>
          <span className="section-kicker">Start a conversation</span>
          <h2>Ready to level up?</h2>
          <p className="contact-copy">
            Tell us what you are building, promoting, or trying to simplify. We will help you choose the smartest first step.
          </p>
          <div className="contact-actions">
            <a className="button" href="mailto:hello@levelupai.studio?subject=LevelUp AI Project Inquiry">
              Email the studio
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a className="button secondary" href="#services">Review services</a>
          </div>
        </Reveal>

        <Reveal as="aside" className="contact-card glass" delay={0.15}>
          <h3>A good first message includes:</h3>
          <div className="contact-points">
            {POINTS.map((point) => (
              <div className="contact-point" key={point.n}>
                <span>{point.n}</span>
                <div>
                  <strong>{point.title}</strong>
                  <small>{point.copy}</small>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
