import type { CSSProperties } from "react";

import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

/* tint cycles so no two cards sharing an edge in the 3-column grid repeat a
   color (row-to-row included). */
const AI_SERVICES = [
  {
    title: "AI websites",
    copy: "Professional, fast, optimized showcase sites. Delivered in days instead of weeks.",
    tint: "var(--tint-lavender)",
    deep: "var(--deep-lavender)",
  },
  {
    title: "AI product shoots",
    copy: "Product visuals generated in a virtual studio or lifestyle setting, no travel or photo gear, high-quality output.",
    tint: "var(--tint-sky)",
    deep: "var(--deep-sky)",
  },
  {
    title: "AI videos",
    copy: "Short videos for social media, ads, or product presentations, made to the same visual standard as a classic production.",
    tint: "var(--tint-mint)",
    deep: "var(--deep-mint)",
  },
  {
    title: "AI copywriting",
    copy: "Product sheets, e-commerce descriptions, and ad copy written and tailored to the client's brand voice.",
    tint: "var(--tint-butter)",
    deep: "var(--deep-butter)",
  },
  {
    title: "Voiceover & multilingual dubbing",
    copy: "Videos available in multiple languages with no new shoot, so you can reach international markets.",
    tint: "var(--tint-pink)",
    deep: "var(--deep-pink)",
  },
  {
    title: "Avatars & virtual spokespeople",
    copy: "Regular on-camera presence for the brand without needing a real person for every shoot.",
    tint: "var(--tint-peach)",
    deep: "var(--deep-peach)",
  },
  {
    title: "Chatbots & automation",
    copy: "Conversational agents for customer support or booking, on WhatsApp, your website, or Messenger.",
    tint: "var(--tint-coral)",
    deep: "var(--deep-coral)",
  },
  {
    title: "Automated email marketing",
    copy: "Segmentation, message personalization, and automated follow-ups driven by AI.",
    tint: "var(--tint-sand)",
    deep: "var(--deep-sand)",
  },
  {
    title: "Express visual identity",
    copy: "Logo and brand guidelines generated quickly for businesses just getting started.",
    tint: "var(--tint-sky)",
    deep: "var(--deep-sky)",
  },
];

const SUBSCRIPTIONS = [
  {
    name: "Starter",
    content: "8 visuals + 2 short videos per month",
    price: "1,190 TND/mo",
  },
  {
    name: "Pro",
    content: "12 visuals + 4 videos + monthly website updates",
    price: "1,490 TND/mo",
  },
];

export default function Pricing() {
  return (
    <section className="section section-vivid section-vivid-pricing" id="pricing">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <span className="section-kicker">Services</span>
            <h2>AI-powered marketing, at a fraction of the cost.</h2>
          </div>
          <p className="section-lead">
            Level Up is expanding into one of the first players on the market offering fully AI-powered digital
            marketing services. Websites, product shoots, and videos, produced faster, at the same quality bar, for
            noticeably more competitive rates. Built for businesses that want a professional digital presence
            without the delays and costs of classic production, and for existing clients ready to go further in
            their digital transformation.
          </p>
        </Reveal>

        {/* The nav's "Services" link targets this block: it's the full list of
            what we actually offer. The pack cards further up the page are
            bundles/pricing, so they own #packs instead. */}
        <Reveal className="pricing-block-head" id="services">
          <p>Everything we can build for you, powered end to end by AI.</p>
        </Reveal>
        <div className="pricing-services">
          {AI_SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <GlassCard
                className="pricing-service"
                style={{ "--tint": service.tint, "--deep": service.deep } as CSSProperties}
              >
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="pricing-block-head">
          <h3>Monthly subscriptions</h3>
          <p>For an ongoing digital presence, maintained continuously.</p>
        </Reveal>
        <Reveal>
          <GlassCard className="pricing-table-card">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Content</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {SUBSCRIPTIONS.map((sub) => (
                  <tr key={sub.name}>
                    <td data-label="Plan">{sub.name}</td>
                    <td data-label="Content">{sub.content}</td>
                    <td data-label="Price" className="pricing-price">{sub.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </Reveal>

        <Reveal className="pricing-cta">
          <a className="button" href="#contact">
            Talk to us about a pack
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
