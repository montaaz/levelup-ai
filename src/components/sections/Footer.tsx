import Image from "next/image";
import { getDictionary, interpolate } from "@/i18n/dictionaries";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

export default async function Footer({ lang }: { lang: string }) {
  const t = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE);

  return (
    <footer>
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Image
            className="brand-logo"
            src="/LEVEL_UP_IA_MASTER_TRANSPARENT.png"
            alt="LevelUp AI"
            width={1150}
            height={365}
          />
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
