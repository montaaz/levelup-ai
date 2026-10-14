import Reveal from "@/components/ui/Reveal";

import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

export default async function Contact({ lang }: { lang: string }) {
  const t = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE);
  const points = t.contact.points.map((point, i) => ({ ...point, n: i + 1 }));
  // Numéro WhatsApp de l'agence (celui connecté à OpenWA : l'assistant y répond), sans « + » ni espaces.
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

  return (
    <section className="section contact" id="contact">
      <div className="wrap contact-grid">
        <Reveal>
          <span className="section-kicker">{t.contact.kicker}</span>
          <h2>{t.contact.title}</h2>
          <p className="contact-copy">{t.contact.copy}</p>
          <div className="contact-actions">
            <a
              className="button"
              href={`mailto:contact@levelupia.agency?subject=${encodeURIComponent(t.contact.mailSubject)}`}
            >
              {t.contact.ctaPrimary}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            {whatsapp && (
              <a
                className="button secondary"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(t.contact.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.contact.ctaWhatsapp}
              </a>
            )}
            <a className="button secondary" href="#services">{t.contact.ctaSecondary}</a>
          </div>
        </Reveal>

        <Reveal as="aside" className="contact-card glass" delay={0.15}>
          <h3>{t.contact.cardTitle}</h3>
          <div className="contact-points">
            {points.map((point) => (
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
