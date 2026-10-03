import { answerWithAI } from "@/buddy/answer";
import { configuredModel } from "@/buddy/ai/model";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

/**
 * Chatbot du site, sans service extérieur. Les règles répondent d'abord ;
 * quand BUDDY_AI=on, le modèle local (Ollama, sur ce serveur) prend le relais
 * de ce qu'elles ne comprennent pas — à partir des seuls textes du site.
 *
 * Le navigateur envoie le fil de conversation ; seul le dernier message du
 * visiteur compte, car chaque question est traitée seule par le routeur
 * d'intentions. Rien ne sort du serveur : ni clé, ni appel extérieur.
 *
 * Le contrat de la réponse (`{ reply }`) est celui que le widget attendait
 * déjà ; il gagne seulement des `suggestions` cliquables.
 */

const MAX_CHARS = 1500;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Le modèle local est partagé avec l'espace client : un visiteur anonyme a
 * droit à 10 réponses rédigées par 10 minutes, ensuite les règles seules.
 */
const AI_WINDOW_MS = 10 * 60_000;
const AI_PER_WINDOW = 10;
const aiHits = new Map<string, number[]>();
function aiAllowed(ip: string): boolean {
  const now = Date.now();
  const recent = (aiHits.get(ip) ?? []).filter((t) => now - t < AI_WINDOW_MS);
  if (recent.length >= AI_PER_WINDOW) {
    aiHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  aiHits.set(ip, recent);
  if (aiHits.size > 5000) aiHits.clear();
  return true;
}

/** Anti-abus : au plus 30 messages par minute et par adresse (mémoire du process). */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // garde-fou mémoire
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many messages. Please wait a minute." }, { status: 429 });
  }

  let body: { messages?: ChatMessage[]; locale?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawLocale = body.locale ?? "";
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // Le dernier message du visiteur, et lui seul : le routeur n'a pas de mémoire.
  const last = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => !!m && m.role === "user" && typeof m.content === "string")
    .at(-1);
  const question = last?.content.trim().slice(0, MAX_CHARS) ?? "";

  if (!question) {
    return Response.json({ error: "No message provided." }, { status: 400 });
  }

  try {
    const ai = configuredModel();
    return Response.json(await answerWithAI(question, locale, ai && aiAllowed(ip) ? ai : null));
  } catch (e) {
    console.error("[chat]", e);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}
