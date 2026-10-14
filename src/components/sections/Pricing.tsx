import type { CSSProperties } from "react";

import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";
import AddOfferButton from "./AddOfferButton";
import { cookies } from "next/headers";
import { CURRENCY_COOKIE, DEFAULT_CURRENCY, isCurrency, localizePrice } from "@/i18n/currency";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

/* Tint cycles so no two cards sharing an edge in the 3-column grid repeat a
   color (row-to-row included). Visual only — titles/copy come from the
   dictionary and are joined to these by index. */
const SERVICE_TINTS = [
  { tint: "var(--tint-lavender)", deep: "var(--deep-lavender)" },
  { tint: "var(--tint-sky)", deep: "var(--deep-sky)" },
  { tint: "var(--tint-mint)", deep: "var(--deep-mint)" },
  { tint: "var(--tint-butter)", deep: "var(--deep-butter)" },
  { tint: "var(--tint-pink)", deep: "var(--deep-pink)" },
  { tint: "var(--tint-peach)", deep: "var(--deep-peach)" },
  { tint: "var(--tint-coral)", deep: "var(--deep-coral)" },
  { tint: "var(--tint-sand)", deep: "var(--deep-sand)" },
  { tint: "var(--tint-sky)", deep: "var(--deep-sky)" },
];

export default async function Pricing({ lang }: { lang: string }) {
  const t = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE);
  const aiServices = t.pricing.aiServices.map((s, i) => ({ ...s, ...SERVICE_TINTS[i] }));
  // Les offres à paliers (automatisation, SEO) sont bien plus hautes que les
  // autres : rendues en pleine largeur après la grille, sinon elles étirent
  // toute leur rangée et laissent les cartes voisines aux trois quarts vides.
  const simpleServices = aiServices.filter((s) => s.tiers.length === 0);
  const tieredServices = aiServices.filter((s) => s.tiers.length > 0);
  // Devise d'affichage (pays du visiteur, posée par proxy.ts) : seule l'unité change.
  const rawCurrency = (await cookies()).get(CURRENCY_COOKIE)?.value;
  const currency = rawCurrency && isCurrency(rawCurrency) ? rawCurrency : DEFAULT_CURRENCY;
  const price = (value: string) => localizePrice(value, currency);

  return (
    <section className="section section-vivid section-vivid-pricing" id="pricing">
      <div className="wrap">
        <Reveal className="section-head" id="services">
          <div>
            <span className="section-kicker">{t.pricing.kicker}</span>
          </div>
        </Reveal>

        {/* The nav's "Services" link targets the "Services" label above
            (#services), so it lands with the label in view over this full
            list of what we offer. The pack cards further up the page are
            bundles/pricing, so they own #packs instead. The headline and the
            one-line intro were removed on 2026-09-25 (texts kept in the
            dictionaries). */}
        <div className="pricing-services">
          {simpleServices.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <GlassCard
                className="pricing-service"
                style={{ "--tint": service.tint, "--deep": service.deep } as CSSProperties}
              >
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                {/* Revue des services et tarifs (13 octobre 2026) : offres tarifées avec ajout au panier. */}
                {service.price && service.code && (
                  <div className="pricing-offer">
                    <span className="service-price">{price(service.price)}</span>
                    <AddOfferButton code={service.code} name={service.title} label={t.services.addToCart} addedLabel={t.services.addedToCart} />
                  </div>
                )}
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <div className="pricing-services pricing-services-wide">
          {tieredServices.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <GlassCard
                className="pricing-service pricing-service-wide"
                style={{ "--tint": service.tint, "--deep": service.deep } as CSSProperties}
              >
                <div className="pricing-service-intro">
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </div>
                <div className="pricing-tiers">
                  {service.tiers.map((tier) => (
                    <div className="pricing-tier" key={tier.name}>
                      {(tier.level || tier.audience) && (
                        <span className="pricing-tier-kicker">{[tier.level, tier.audience].filter(Boolean).join(" · ")}</span>
                      )}
                      <strong className="pricing-tier-name">{tier.name}</strong>
                      {tier.copy && <p className="pricing-tier-copy">{tier.copy}</p>}
                      {tier.items.length > 0 && (
                        <ul className="pricing-tier-items">
                          {tier.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                      <div className="pricing-offer">
                        <span className="service-price">{price(tier.price)}</span>
                        {tier.quote ? (
                          <a className="pricing-cart" href="#contact">{t.pricing.quoteCta}</a>
                        ) : (
                          tier.code && <AddOfferButton code={tier.code} name={tier.name} label={t.services.addToCart} addedLabel={t.services.addedToCart} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="pricing-cta">
          <a className="button" href="#contact">
            {t.pricing.cta}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
