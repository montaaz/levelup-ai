/**
 * Passerelle vers la plateforme (levelupia.app).
 *
 * Le vitrine n'envoie jamais de prix : il envoie un CODE d'offre. La plateforme
 * relit le prix dans sa base, signe un jeton et renvoie l'URL d'inscription.
 * Un visiteur ne peut donc pas fabriquer une commande à un prix de son choix.
 */

/** Base de la plateforme, surchargeable par variable d'environnement. */
export const PLATFORM_URL = (
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? "https://levelupia.app"
).replace(/\/+$/, "");

/** Numéro de pack affiché → code attendu par la plateforme. */
export const PACK_CODES: Record<string, string> = {
  "PACK 01": "PACK_DECOUVERTE",
  "PACK 02": "PACK_LANCEMENT",
  "PACK 03": "PACK_CROISSANCE",
  "PACK 04": "PACK_PRO_MAX",
};

/**
 * Nom d'abonnement → code plateforme. La comparaison est faite sans accents ni
 * casse pour rester valable en français comme en anglais.
 */
const SUBSCRIPTION_CODES: Array<{ match: RegExp; code: string }> = [
  { match: /starter/i, code: "ABO_STARTER" },
  { match: /^pro$|^pro\b/i, code: "ABO_PRO" },
  { match: /r[ée]seaux|social/i, code: "ABO_SOCIAL" },
];

export function subscriptionCode(name: string): string | null {
  const plain = name.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return SUBSCRIPTION_CODES.find((s) => s.match.test(plain))?.code ?? null;
}

/**
 * Demande l'URL d'inscription pour une offre et y envoie le visiteur.
 * En cas d'échec (plateforme injoignable), on renvoie false pour que l'appelant
 * garde son comportement de repli (scroll vers le formulaire de contact).
 */
export async function startCheckout(packCode: string): Promise<boolean> {
  try {
    const res = await fetch(`${PLATFORM_URL}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packCode }),
    });
    if (!res.ok) return false;
    const data: { signupUrl?: string } = await res.json();
    if (!data.signupUrl) return false;
    window.location.href = data.signupUrl;
    return true;
  } catch {
    return false;
  }
}
