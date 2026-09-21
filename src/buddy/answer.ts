import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { route } from "./core/router";
import { bullets, numbered, paragraphs, truncate } from "./core/templates";
import { buildKnowledge, type Knowledge } from "./knowledge";
import { buildIntents, type VitrineIntentId } from "./intents";

/**
 * Répond à un visiteur du site, sans modèle.
 *
 * Le message est routé vers une intention approuvée, et la réponse est un
 * gabarit rempli avec la base de connaissances. Trois refus possibles —
 * question hors sujet, question ambiguë, détail absent — chacun avec des
 * suggestions cliquables pour que le visiteur ne reste pas bloqué.
 */

export type BuddyReply = {
  reply: string;
  /** Questions proposées en puces sous la réponse. */
  suggestions?: string[];
};

const MAX_CHARS = 1500;

export function answer(rawMessage: string, locale: Locale): BuddyReply {
  const t = getDictionary(locale).chat.buddy;
  const k = buildKnowledge(locale);
  const suggestions = t.suggestions.map((s) => s.question);
  const message = (rawMessage ?? "").slice(0, MAX_CHARS);

  const result = route(message, buildIntents(locale));

  if (result.kind === "none") {
    return { reply: t.unsupported, suggestions };
  }
  if (result.kind === "ambiguous") {
    const options = result.ids.map((id) => labelFor(id, k, t.labels)).join(` ${t.or} `);
    return {
      reply: t.ambiguous.replace("{options}", options),
      suggestions: result.ids.map((id) => questionFor(id, k, t.labels)),
    };
  }
  return render(result.id, k, t, suggestions);
}

type BuddyDict = ReturnType<typeof getDictionary>["chat"]["buddy"];

function render(id: VitrineIntentId, k: Knowledge, t: BuddyDict, suggestions: string[]): BuddyReply {
  if (id.startsWith("pack:")) {
    const pack = k.packs[Number(id.slice(5))];
    if (!pack) return { reply: t.noEvidence, suggestions };
    return {
      reply: paragraphs(
        `${pack.number} — ${pack.title} · ${pack.price}`,
        pack.copy,
        `${t.packIncludes}\n${bullets(pack.includes)}`,
        t.orderHelp,
      ),
    };
  }

  if (id.startsWith("faq:")) {
    const item = k.faq[Number(id.slice(4))];
    if (!item) return { reply: t.noEvidence, suggestions };
    return { reply: paragraphs(item.question, item.answer) };
  }

  switch (id) {
    case "help":
      return { reply: t.help, suggestions };

    case "packs":
      return {
        reply: paragraphs(
          t.packsIntro,
          bullets(k.packs.map((p) => `${p.number} — ${p.title} · ${p.price}\n  ${p.summary}`)),
          t.packsOutro,
        ),
        suggestions: k.packs.map((p) => p.title),
      };

    case "subscriptions":
      return {
        reply: paragraphs(
          t.subscriptionsIntro,
          bullets(k.subscriptions.map((s) => `${s.name} · ${s.price}\n  ${s.content}`)),
          t.orderHelp,
        ),
      };

    case "services":
      return {
        reply: paragraphs(
          t.servicesIntro,
          bullets(k.services.map((s) => `${s.title} — ${truncate(s.copy, 110)}`)),
        ),
        suggestions: [t.suggestions[0]?.question, t.suggestions[1]?.question].filter((s): s is string => !!s),
      };

    case "process":
      return {
        reply: paragraphs(t.processIntro, numbered(k.process.map((s) => `${s.title} — ${s.copy}`))),
      };

    case "contact":
      return { reply: paragraphs(t.contactIntro, k.contact.copy) };

    case "order":
      return { reply: t.orderHelp };
  }
  // Inatteignable : toute intention est traitée ci-dessus. On refuse plutôt qu'inventer.
  return { reply: t.noEvidence, suggestions };
}

/** Libellé court d'une intention, pour la question de désambiguïsation. */
function labelFor(id: VitrineIntentId, k: Knowledge, labels: BuddyDict["labels"]): string {
  if (id.startsWith("pack:")) return k.packs[Number(id.slice(5))]?.title ?? id;
  if (id.startsWith("faq:")) return `« ${truncate(k.faq[Number(id.slice(4))]?.question ?? id, 60)} »`;
  return labels[id as keyof typeof labels] ?? id;
}

/** Question à envoyer quand le visiteur clique sur une option proposée. */
function questionFor(id: VitrineIntentId, k: Knowledge, labels: BuddyDict["labels"]): string {
  if (id.startsWith("pack:")) return k.packs[Number(id.slice(5))]?.title ?? id;
  if (id.startsWith("faq:")) return k.faq[Number(id.slice(4))]?.question ?? id;
  return labels[id as keyof typeof labels] ?? id;
}
