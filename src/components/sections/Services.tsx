import CinematicBackground from "@/components/media/CinematicBackground";
import Reveal from "@/components/ui/Reveal";
import ServicePackCard from "./ServicePackCard";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

/** Visual-only per-pack data. All copy lives in the dictionaries and is
 *  joined to these by index — the icons are JSX and the accents are CSS
 *  vars, so neither belongs in a translation file.
 *
 *  The icons are built to read as 3D objects rather than flat line art:
 *  each is a solid body filled with a top-lit gradient, a lighter top
 *  face/bevel for volume, a white gloss pass, and a soft contact shadow.
 *  Gradient ids are namespaced per pack (p1..p4) because all four SVGs are
 *  inlined into the same document and would otherwise collide. */
const PACK_VISUALS = [
  {
    accent: "var(--pastel-lavender)",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="p1a" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#6d43e8" />
          </linearGradient>
          <linearGradient id="p1b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9b6ff" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="p1g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="p1s" x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="2.4" stdDeviation="2" floodColor="#0a0420" floodOpacity="0.55" />
          </filter>
        </defs>
        <g filter="url(#p1s)">
          <rect x="7" y="11" width="34" height="26" rx="4.5" fill="url(#p1a)" />
          <rect x="7" y="11" width="34" height="7.5" rx="4.5" fill="url(#p1b)" />
          <circle cx="12" cy="14.8" r="1.35" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="16.4" cy="14.8" r="1.35" fill="#ffffff" fillOpacity="0.65" />
          <circle cx="20.8" cy="14.8" r="1.35" fill="#ffffff" fillOpacity="0.45" />
          <rect x="12" y="23" width="14" height="2.6" rx="1.3" fill="#ffffff" fillOpacity="0.92" />
          <rect x="12" y="28.4" width="21" height="2.6" rx="1.3" fill="#ffffff" fillOpacity="0.6" />
          <path d="M7 15.5h34v3.2a4.5 4.5 0 0 1-4.5 4.5h-25A4.5 4.5 0 0 1 7 18.7z" fill="url(#p1g)" opacity="0.5" />
        </g>
      </svg>
    ),
  },
  {
    accent: "var(--pastel-sky)",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="p2a" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1567c9" />
          </linearGradient>
          <linearGradient id="p2b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fe0ff" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="p2g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="p2s" x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="2.4" stdDeviation="2" floodColor="#0a0420" floodOpacity="0.55" />
          </filter>
        </defs>
        <g filter="url(#p2s)">
          <rect x="6" y="13" width="25" height="22" rx="5" fill="url(#p2a)" />
          <rect x="6" y="13" width="25" height="6" rx="5" fill="url(#p2b)" opacity="0.85" />
          <path d="M33 22.4l7.2-4.3a1.4 1.4 0 0 1 2.1 1.2v9.4a1.4 1.4 0 0 1-2.1 1.2L33 25.6z" fill="url(#p2a)" />
          <path d="M19.8 21.2l5.1 2.9-5.1 2.9z" fill="#ffffff" fillOpacity="0.95" />
          <path d="M6 17.5h25v2.2a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#p2g)" opacity="0.45" />
        </g>
      </svg>
    ),
  },
  {
    accent: "var(--pastel-mint)",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="p3a" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#34e6c8" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="p3b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8ffbe6" />
            <stop offset="1" stopColor="#34e6c8" />
          </linearGradient>
          <linearGradient id="p3g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="p3s" x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="2.4" stdDeviation="2" floodColor="#0a0420" floodOpacity="0.55" />
          </filter>
        </defs>
        <g filter="url(#p3s)">
          <rect x="8" y="26" width="7.5" height="13" rx="2.4" fill="url(#p3a)" />
          <rect x="8" y="26" width="7.5" height="3" rx="1.5" fill="url(#p3b)" />
          <rect x="18.5" y="19" width="7.5" height="20" rx="2.4" fill="url(#p3a)" />
          <rect x="18.5" y="19" width="7.5" height="3" rx="1.5" fill="url(#p3b)" />
          <rect x="29" y="10" width="7.5" height="29" rx="2.4" fill="url(#p3a)" />
          <rect x="29" y="10" width="7.5" height="3" rx="1.5" fill="url(#p3b)" />
          <path d="M11 22l8-6 8-5.5" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    ),
  },
  {
    accent: "#ffd500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="p4a" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#ffd500" />
            <stop offset="1" stopColor="#e08a00" />
          </linearGradient>
          <linearGradient id="p4b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0a3" />
            <stop offset="1" stopColor="#ffd500" />
          </linearGradient>
          <linearGradient id="p4g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="p4s" x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="2.4" stdDeviation="2" floodColor="#0a0420" floodOpacity="0.55" />
          </filter>
        </defs>
        <g filter="url(#p4s)">
          <path d="M24 7.5l5.1 10.8 11.6 1.7-8.4 8.5 2 12-10.3-5.8-10.3 5.8 2-12-8.4-8.5 11.6-1.7z" fill="url(#p4a)" />
          <path d="M24 7.5l5.1 10.8 11.6 1.7-8.4 8.5-8.3-4.7z" fill="url(#p4b)" opacity="0.75" />
          <path d="M24 12.5l3.4 7.2 7.7 1.1-5.6 5.7-3.9-2.2z" fill="#ffffff" fillOpacity="0.35" />
        </g>
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
              <ServicePackCard
                pack={service}
                accent={service.accent}
                icon={service.icon}
                showDetails={t.services.showDetails}
                hideDetails={t.services.hideDetails}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
