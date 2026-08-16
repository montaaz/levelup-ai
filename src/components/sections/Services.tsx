import type { CSSProperties } from "react";

import CinematicBackground from "@/components/media/CinematicBackground";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

/** Visual-only per-pack data. All copy lives in the dictionaries and is
 *  joined to these by index — the icons are JSX and the accents are CSS
 *  vars, so neither belongs in a translation file. */
const PACK_VISUALS = [
  {
    accent: "var(--pastel-lavender)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 8h18M7 6h.01M10 6h.01M6 12h6M6 15h10" />
      </svg>
    ),
  },
  {
    accent: "var(--pastel-sky)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="m17 10 4-2v8l-4-2zM8 9l4 3-4 3z" />
      </svg>
    ),
  },
  {
    accent: "var(--pastel-mint)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 18V10M10 18V6M16 18v-5M22 18V4" />
        <path d="M2 21h20" />
      </svg>
    ),
  },
  {
    accent: "var(--pastel-butter)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="m12 3 2.6 5.5 6 .9-4.3 4.3 1 6.1-5.3-2.9-5.3 2.9 1-6.1L3.4 9.4l6-.9z" />
      </svg>
    ),
  },
];

export default async function Services({ lang }: { lang: string }) {
  const t = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE);
  const packs = t.services.packs.map((pack, i) => ({ ...pack, ...PACK_VISUALS[i] }));

  return (
    <section className="section section-dark section-dark-bridge" id="packs">
      <CinematicBackground variant="services" src="/videos/services-bg.mp4" />
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <span className="section-kicker">{t.services.kicker}</span>
            <h2>{t.services.title}</h2>
          </div>
          <p className="section-lead">{t.services.lead}</p>
        </Reveal>

        <div className="services">
          {packs.map((service, index) => (
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
