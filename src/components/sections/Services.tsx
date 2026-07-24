import CinematicBackground from "@/components/media/CinematicBackground";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  {
    number: "SERVICE 01",
    title: "Affordable websites that mean business.",
    copy: "Professional, modern websites for small businesses and startups that need to launch quickly without paying big-agency prices.",
    list: ["Landing pages and business websites", "Mobile-ready, fast and easy to navigate", "Clear messaging and conversion-focused design"],
    cta: "Build my website",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 8h18M7 6h.01M10 6h.01M6 12h6M6 15h10" />
      </svg>
    ),
  },
  {
    number: "SERVICE 02",
    title: "AI commercial videos people remember.",
    copy: "Product commercials, social ads, and short-form creative made with AI and shaped by real marketing strategy.",
    list: ["Product and service commercials", "Instagram Reels and short social ads", "Concept, script, visuals and final edit"],
    cta: "Create my video",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="m17 10 4-2v8l-4-2zM8 9l4 3-4 3z" />
      </svg>
    ),
  },
  {
    number: "SERVICE 03",
    title: "AI automations that give time back.",
    copy: "Smart workflows and business assistants that reduce repetitive work, follow up with leads, and keep your business moving.",
    list: ["Lead capture and follow-up systems", "Content and client workflow automation", "Custom AI assistants for daily operations"],
    cta: "Automate my business",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 7h7v5H4zM13 12h7v5h-7zM7.5 12v3h5.5M11 9.5h3.5V12" />
        <circle cx="4" cy="17" r="1.5" />
        <circle cx="20" cy="7" r="1.5" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section className="section section-dark" id="services">
      <CinematicBackground variant="services" src="/videos/services-bg.mp4" />
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <span className="section-kicker">What we do</span>
            <h2>Three ways to level up your business.</h2>
          </div>
          <p className="section-lead">
            You do not need a giant agency budget. You need the right mix of design, storytelling, and automation built around your real goals.
          </p>
        </Reveal>

        <div className="services">
          {SERVICES.map((service, index) => (
            <Reveal key={service.number} delay={index * 0.1}>
              <GlassCard className="service">
                <div className="service-number">{service.number}</div>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="service-copy">{service.copy}</p>
                <ul className="service-list">
                  {service.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="service-link" href="#contact">
                  {service.cta}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
