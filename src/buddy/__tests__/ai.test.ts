import { describe, expect, it } from "vitest";
import { answer, answerWithAI } from "../answer";
import { siteChunks } from "../ai/knowledge";
import type { ChatMessage, ChatOptions, LocalModel } from "../ai/model";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Le modèle local est remplacé par un faux : on vérifie quand il est
 * consulté, ce qu'il reçoit (les textes du site, rien d'autre) et ce que
 * l'assistant fait de ses réponses — sans Ollama.
 */
const fr = getDictionary("fr").chat.buddy;

function fakeModel(reply: string | Error, delayMs = 0): LocalModel & { calls: { messages: ChatMessage[]; opts: ChatOptions }[] } {
  const calls: { messages: ChatMessage[]; opts: ChatOptions }[] = [];
  return {
    calls,
    async chat(messages, opts) {
      calls.push({ messages, opts });
      if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
      if (reply instanceof Error) throw reply;
      return reply;
    },
    async embed() {
      return null;
    },
  };
}

const UNKNOWN_TO_RULES = "Est-ce que vous travaillez avec les hôtels ?";

describe("site — modèle local en renfort", () => {
  it("les règles qui répondent déjà ne consultent pas le modèle", async () => {
    const model = fakeModel("ne doit pas servir");
    const r = await answerWithAI("Quels sont vos packs ?", "fr", model);
    expect(model.calls).toHaveLength(0);
    expect(r.ai).toBeUndefined();
    expect(r).not.toHaveProperty("open");
  });

  it("question non reconnue : réponse rédigée, validée, marquée IA", async () => {
    expect(answer(UNKNOWN_TO_RULES, "fr").open).toBe(true);
    const model = fakeModel("Oui, nous travaillons avec l'hôtellerie et les maisons d'hôtes.");
    const r = await answerWithAI(UNKNOWN_TO_RULES, "fr", model);
    expect(r.ai).toBe(true);
    expect(r.reply).toContain("hôtellerie");
    expect(r).not.toHaveProperty("open");
  });

  it("le modèle ne reçoit que des textes du site", async () => {
    const model = fakeModel("INCONNU");
    await answerWithAI(UNKNOWN_TO_RULES, "fr", model);
    const system = model.calls[0]!.messages[0]!.content;
    expect(system).toContain("CONNAISSANCES");
    for (const line of system.split("\n").filter((l) => l.startsWith("["))) {
      expect(siteChunks("fr").some((c) => line === `[${c.title}] ${c.text}`)).toBe(true);
    }
  });

  it("délai inventé → écarté, réponse à règles", async () => {
    const model = fakeModel("Oui, un site pour hôtel est livré en 3 jours.");
    const r = await answerWithAI(UNKNOWN_TO_RULES, "fr", model);
    expect(r.ai).toBeUndefined();
    expect(r.reply).toBe(fr.unsupported);
  });

  it("INCONNU, panne ou délai dépassé → réponse à règles", async () => {
    for (const model of [fakeModel("INCONNU"), fakeModel(new Error("down"))]) {
      const r = await answerWithAI(UNKNOWN_TO_RULES, "fr", model);
      expect(r.reply).toBe(fr.unsupported);
    }
  });

  it("un seul calcul à la fois : le second visiteur reçoit la réponse à règles", async () => {
    const model = fakeModel("Oui, nous travaillons avec l'hôtellerie.", 50);
    const [a, b] = await Promise.all([answerWithAI(UNKNOWN_TO_RULES, "fr", model), answerWithAI(UNKNOWN_TO_RULES, "fr", model)]);
    expect([a.ai, b.ai].filter(Boolean)).toHaveLength(1);
    expect(model.calls).toHaveLength(1);
  });

  it("sans modèle, rien ne change", async () => {
    const r = await answerWithAI(UNKNOWN_TO_RULES, "fr", null);
    expect(r).toEqual({ reply: fr.unsupported, suggestions: fr.suggestions.map((s) => s.question) });
  });

  it("les connaissances couvrent l'équipe, les secteurs et le contact, en deux langues", () => {
    for (const locale of ["fr", "en"] as const) {
      const ids = siteChunks(locale).map((c) => c.id);
      expect(ids).toEqual(expect.arrayContaining([`${locale}:about`, `${locale}:team`, `${locale}:sectors`, `${locale}:contact`, `${locale}:pack-0`]));
    }
  });
});
