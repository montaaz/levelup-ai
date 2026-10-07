import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { legalDocs } from "@/content/legal";
import LegalPage from "@/components/legal/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: `${lang === "fr" ? "Conditions d'utilisation et de vente" : "Terms of use and sale"} — LevelUp AI` };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage lang={lang} doc={legalDocs(lang).terms} />;
}
