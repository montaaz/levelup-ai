import { getDictionary, interpolate } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

export default async function Footer({ lang }: { lang: string }) {
  const t = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE);

  return (
    <footer>
      <div className="wrap footer-inner">
        <div className="footer-brand">
          {/* Masked span, same technique as the nav (see .brand-logo). role
              + aria-label keep the accessible name the alt text carried. */}
          <span className="brand-logo" role="img" aria-label="LevelUp AI" />
        </div>
        <div className="footer-meta">
          {t.footer.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <span>{interpolate(t.footer.copyright, { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}
