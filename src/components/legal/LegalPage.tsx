import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { legalDocs, PUBLISHER, type LegalDoc } from "@/content/legal";

/**
 * Mise en page commune des pages juridiques (conditions, réclamations) : un
 * en-tête réduit — le menu principal ne pointe que vers des ancres de la page
 * d'accueil — puis le texte en sections, puis le pied de page du site.
 */
export default function LegalPage({ lang, doc }: { lang: string; doc: LegalDoc }) {
  const { labels } = legalDocs(lang);
  return (
    <>
      <header className="legal-head">
        <div className="wrap legal-head-inner">
          <Link href={`/${lang}`} className="brand legal-brand" aria-label="LevelUp AI">
            <Image className="brand-logo" src="/LEVEL_UP_AI_2026-09-29.png" alt="LevelUp AI" width={1999} height={377} />
          </Link>
          <Link href={`/${lang}`} className="legal-back">
            ← {labels.back}
          </Link>
        </div>
      </header>
      <main className="legal">
        <article className="wrap legal-article">
          <h1>{doc.title}</h1>
          <p className="legal-updated">{doc.updated}</p>
          <p className="legal-intro">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="legal-contact">
            {labels.contact} : <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>
          </p>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  );
}
