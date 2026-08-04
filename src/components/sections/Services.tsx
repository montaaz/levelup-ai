import type { CSSProperties } from "react";

import CinematicBackground from "@/components/media/CinematicBackground";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  {
    number: "PACK 01",
    title: "Discovery Pack",
    price: "From 890 TND",
    accent: "var(--pastel-lavender)",
    copy: "The easiest way to start. Pick the one thing your business needs most right now and get it done properly.",
    list: ["AI showcase website (5-6 pages)", "or AI product shoot (10 visuals)", "Perfect first step for a new brand"],
    cta: "Start with Discovery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 8h18M7 6h.01M10 6h.01M6 12h6M6 15h10" />
      </svg>
    ),
  },
  {
    number: "PACK 02",
    title: "Launch Pack",
    price: "1,890 TND",
    accent: "var(--pastel-sky)",
    copy: "Everything you need to go live with confidence: a website, a full set of visuals, and your first video.",
    list: ["AI showcase website", "AI product shoot (10 visuals)", "1 short video"],
    cta: "Launch my brand",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="m17 10 4-2v8l-4-2zM8 9l4 3-4 3z" />
      </svg>
    ),
  },
  {
    number: "PACK 03",
    title: "Growth Pack",
    price: "3,490 TND",
    accent: "var(--pastel-mint)",
    copy: "Built for brands already selling. More visuals, more video, and enough content to stay visible every week.",
    list: ["AI showcase website", "AI product shoot (20 visuals)", "2 short videos"],
    cta: "Grow my business",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 18V10M10 18V6M16 18v-5M22 18V4" />
        <path d="M2 21h20" />
      </svg>
    ),
  },
  {
    number: "PACK 04",
    title: "Pro Max Pack",
    price: "4,900 TND",
    accent: "var(--pastel-butter)",
    copy: "Our complete package. A full content library for brands that want to dominate their market all year.",
    list: ["AI showcase website", "AI product shoot (40 visuals)", "4 short videos"],
    cta: "Go Pro Max",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="m12 3 2.6 5.5 6 .9-4.3 4.3 1 6.1-5.3-2.9-5.3 2.9 1-6.1L3.4 9.4l6-.9z" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section className="section section-dark section-dark-bridge" id="packs">
      <CinematicBackground variant="services" src="/videos/services-bg.mp4" />
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <span className="section-kicker">What we do</span>
            <h2>Four packs to level up your business.</h2>
          </div>
          <p className="section-lead">
            You do not need a giant agency budget. Pick the pack that matches where your business is today — website, visuals, and video, bundled at one clear price.
          </p>
        </Reveal>

        <div className="services">
          {SERVICES.map((service, index) => (
            <Reveal key={service.number} delay={index * 0.1}>
              <GlassCard className="service" style={{ "--accent": service.accent } as CSSProperties}>
                <div className="service-number">{service.number}</div>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <div className="service-price">{service.price}</div>
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
