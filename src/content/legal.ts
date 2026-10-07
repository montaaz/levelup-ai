/**
 * Textes juridiques du site : conditions d'utilisation et de vente, et
 * processus de gestion des réclamations. Exigés par la banque (ClicToPay /
 * Attijari E-Payment) pour ouvrir le paiement en ligne : les conditions et le
 * circuit de réclamation doivent être publiés sur le site marchand.
 *
 * Les pages /{lang}/conditions et /{lang}/reclamations les affichent ; les
 * versions imprimables remises à la banque reprennent les mêmes textes.
 */

export type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[] };

/** Coordonnées de l'éditeur, reprises dans les deux documents et le pied de page. */
export const PUBLISHER = {
  brand: "LevelUp AI",
  site: "https://levelupia.agency",
  platform: "https://levelupia.app",
  email: "contact@levelupia.agency",
  /* À compléter avec l'extrait RNE : raison sociale, forme, capital, siège, matricule fiscal. */
  legalName: "LevelUp AI",
  address: "Tunisie",
};

const UPDATED_FR = "7 octobre 2026";
const UPDATED_EN = "7 October 2026";

export const TERMS_FR: LegalDoc = {
  title: "Conditions générales d'utilisation et de vente",
  updated: `Dernière mise à jour : ${UPDATED_FR}`,
  intro:
    "Les présentes conditions régissent l'utilisation du site levelupia.agency, de l'espace client levelupia.app et l'achat des prestations de LevelUp AI. Toute commande vaut acceptation sans réserve de ces conditions.",
  sections: [
    {
      heading: "1. Éditeur et contact",
      paragraphs: [
        `Le site levelupia.agency et la plateforme levelupia.app sont édités par ${PUBLISHER.legalName}, ${PUBLISHER.address}.`,
        `Contact : ${PUBLISHER.email}. Les demandes commerciales, techniques et les réclamations passent par cette adresse ou par la messagerie de l'espace client.`,
      ],
    },
    {
      heading: "2. Objet",
      paragraphs: [
        "LevelUp AI est une agence de marketing digital assistée par l'intelligence artificielle. Elle propose des prestations de création de sites web, de vidéos commerciales générées par IA, de création digitale (branding, contenu, SEO) et d'automatisation d'entreprise, vendues sous forme de packs à prix fixe ou d'abonnements mensuels.",
        "Le détail de chaque pack et abonnement (contenu, livrables, prix) figure sur la page Tarifs du site et dans l'espace client au moment de la commande.",
      ],
    },
    {
      heading: "3. Prix",
      paragraphs: [
        "Les prix sont exprimés en dinars tunisiens (TND), toutes taxes comprises (TVA 19 % incluse). Le site peut afficher une conversion indicative dans une autre devise ; seul le montant en dinars indiqué dans l'espace client au moment du paiement fait foi.",
        "LevelUp AI peut modifier ses prix à tout moment ; le prix applicable est celui affiché au moment de la commande. Une facture est émise pour chaque paiement et reste disponible dans l'espace client.",
      ],
    },
    {
      heading: "4. Commande",
      paragraphs: [
        "Le client choisit une offre sur le site, l'ajoute à son panier et finalise sa commande. Il est alors dirigé vers le paiement puis vers la création de son espace client (ou sa connexion s'il en possède déjà un).",
        "La commande est ferme à l'acceptation du paiement. Le client reçoit une confirmation dans son espace et par e-mail, et son projet y apparaît avec son état d'avancement.",
      ],
    },
    {
      heading: "5. Paiement",
      paragraphs: [
        "Le paiement s'effectue en ligne par carte bancaire (cartes nationales et internationales) sur la page de paiement sécurisée de la plateforme monétique ClicToPay. LevelUp AI n'a jamais accès aux numéros de carte : la saisie se fait exclusivement sur la page de la banque, protégée par chiffrement et 3-D Secure.",
        "Le paiement par virement bancaire reste possible sur demande ; la prestation démarre alors à réception des fonds.",
        "En cas de refus de paiement par la banque, aucune commande n'est enregistrée et aucun montant n'est débité. Le client peut renouveler sa tentative depuis son espace.",
      ],
    },
    {
      heading: "6. Exécution et livraison",
      paragraphs: [
        "Les prestations sont des services numériques livrés dans l'espace client sous forme de fichiers, d'accès ou de mises en ligne. Chaque projet suit cinq étapes visibles par le client : Brief reçu, Production, Première version, Votre validation, Livraison finale.",
        "Les délais indicatifs sont communiqués lors du cadrage du projet. Ils courent à compter de la réception des éléments nécessaires fournis par le client (textes, visuels, accès). Un retard du client décale d'autant la livraison.",
        "Le client dispose de la première version pour formuler ses retours ; une série d'ajustements est comprise dans chaque pack, dans le périmètre de l'offre commandée. Toute demande hors périmètre fait l'objet d'un devis.",
      ],
    },
    {
      heading: "7. Annulation et remboursement",
      paragraphs: [
        "Pack (prestation ponctuelle) : le client peut annuler sans frais tant que la production n'a pas démarré. Le montant payé est alors intégralement remboursé sous 14 jours ouvrés, par le même moyen de paiement. Une fois la production démarrée, les travaux réalisés restent dus ; le solde éventuel est remboursé au prorata.",
        "Abonnement mensuel : résiliable à tout moment depuis l'espace client ou par e-mail. La résiliation prend effet à la fin de la période déjà payée ; le mois entamé n'est pas remboursé.",
        "En cas de prestation non conforme à la commande, le client la signale selon le processus de réclamation ; LevelUp AI corrige la prestation ou rembourse la partie non conforme.",
      ],
    },
    {
      heading: "8. Obligations du client",
      paragraphs: [
        "Le client garantit disposer des droits sur tous les éléments qu'il fournit (textes, images, logos, vidéos, accès) et répond de leur contenu. Il s'engage à fournir des informations exactes lors de la création de son compte et à garder ses identifiants confidentiels.",
        "Il s'interdit toute utilisation du site ou de l'espace client contraire à la loi, à l'ordre public ou aux droits de tiers.",
      ],
    },
    {
      heading: "9. Propriété intellectuelle",
      paragraphs: [
        "Les livrables finaux sont la propriété du client à compter du paiement intégral de la prestation. LevelUp AI conserve ses méthodes, outils, modèles et savoir-faire, et peut citer le projet comme référence sauf refus écrit du client.",
        "Le site, sa charte graphique, ses textes et ses vidéos restent la propriété de LevelUp AI et ne peuvent être reproduits sans autorisation.",
      ],
    },
    {
      heading: "10. Données personnelles",
      paragraphs: [
        "Les données collectées (identité, coordonnées, informations sur l'entreprise, historique des commandes et des échanges) servent uniquement à l'exécution des prestations, à la facturation et au suivi de la relation client. Elles ne sont ni vendues ni cédées.",
        "Les données de paiement sont traitées exclusivement par la banque et la plateforme monétique ; LevelUp AI n'en conserve que la référence de transaction.",
        `Conformément à la loi organique n° 2004-63 relative à la protection des données à caractère personnel, le client peut accéder à ses données, les rectifier ou en demander la suppression en écrivant à ${PUBLISHER.email}.`,
      ],
    },
    {
      heading: "11. Responsabilité",
      paragraphs: [
        "LevelUp AI met en œuvre les moyens nécessaires à la bonne exécution des prestations. Sa responsabilité ne peut être engagée pour les contenus fournis par le client, pour l'usage que celui-ci fait des livrables, ni pour les interruptions dues à des services tiers (hébergeurs, réseaux sociaux, plateformes de paiement).",
        "En tout état de cause, la responsabilité de LevelUp AI est limitée au montant de la prestation concernée.",
      ],
    },
    {
      heading: "12. Réclamations et litiges",
      paragraphs: [
        "Toute réclamation est traitée selon le processus publié sur la page « Réclamations » du site : accusé de réception sous 2 jours ouvrés, réponse sous 7 jours ouvrés.",
        "Les présentes conditions sont soumises au droit tunisien. À défaut de solution amiable, les tribunaux tunisiens compétents sont seuls habilités à connaître du litige.",
      ],
    },
  ],
};

export const COMPLAINTS_FR: LegalDoc = {
  title: "Gestion des réclamations clients",
  updated: `Dernière mise à jour : ${UPDATED_FR}`,
  intro:
    "Une réclamation est toute insatisfaction exprimée par un client sur une commande, un paiement, une prestation ou l'usage de son espace client. Chaque réclamation est enregistrée, suivie et close par une réponse écrite.",
  sections: [
    {
      heading: "1. Comment déposer une réclamation",
      paragraphs: ["Le client choisit le canal qui lui convient :"],
      bullets: [
        `Par e-mail à ${PUBLISHER.email}, en indiquant son nom, son entreprise et la commande concernée.`,
        "Depuis son espace client (levelupia.app), via la messagerie du projet concerné : l'échange est horodaté et rattaché au projet.",
        "Pour un problème de paiement par carte : en précisant la date, le montant et, si possible, la référence de transaction figurant sur l'e-mail de confirmation ou le relevé bancaire.",
      ],
    },
    {
      heading: "2. Délais d'engagement",
      paragraphs: [],
      bullets: [
        "Accusé de réception sous 2 jours ouvrés, avec le nom de la personne en charge.",
        "Réponse motivée et proposition de solution sous 7 jours ouvrés.",
        "Si l'analyse demande plus de temps (vérification auprès de la banque, par exemple), le client en est informé avant l'échéance, avec une nouvelle date.",
        "Clôture sous 15 jours ouvrés au plus tard, par écrit.",
      ],
    },
    {
      heading: "3. Traitement",
      paragraphs: [
        "La réclamation est prise en charge par la personne responsable du projet. Elle vérifie les faits dans l'espace client (commande, paiement, échanges, livrables), consulte l'équipe concernée et propose une solution : correction de la prestation, nouvelle version, geste commercial ou remboursement selon les conditions générales.",
        "Si le client n'est pas satisfait de la réponse, la réclamation est transmise à une co-fondatrice de LevelUp AI, qui rend une décision finale sous 5 jours ouvrés.",
      ],
    },
    {
      heading: "4. Réclamations liées au paiement",
      paragraphs: [
        "Pour un débit sans commande visible, un double débit ou un montant inexact, LevelUp AI vérifie la transaction auprès de la plateforme monétique ClicToPay et de sa banque. Un montant indûment perçu est remboursé par le même moyen de paiement dès confirmation, sous 14 jours ouvrés.",
        "Le client conserve la possibilité de s'adresser à sa propre banque pour contester une opération par carte.",
      ],
    },
    {
      heading: "5. Traçabilité et amélioration",
      paragraphs: [
        "Chaque réclamation est conservée avec sa date, son objet, les échanges et la solution apportée. Les réclamations sont revues chaque mois pour corriger ce qui en est à l'origine : informations du site, déroulement des commandes, qualité des livrables.",
      ],
    },
  ],
};

export const TERMS_EN: LegalDoc = {
  title: "Terms of use and sale",
  updated: `Last updated: ${UPDATED_EN}`,
  intro:
    "These terms govern the use of levelupia.agency, the client area at levelupia.app, and the purchase of LevelUp AI services. Placing an order means accepting these terms in full.",
  sections: [
    {
      heading: "1. Publisher and contact",
      paragraphs: [
        `levelupia.agency and levelupia.app are published by ${PUBLISHER.legalName}, ${PUBLISHER.address}.`,
        `Contact: ${PUBLISHER.email}. Sales and technical requests and complaints go through this address or the client-area messaging.`,
      ],
    },
    {
      heading: "2. Scope",
      paragraphs: [
        "LevelUp AI is an AI-assisted digital marketing agency offering websites, AI-generated commercial videos, digital creation (branding, content, SEO) and business automation, sold as fixed-price packs or monthly subscriptions.",
        "What each pack and subscription includes, and its price, is shown on the Pricing page and in the client area when ordering.",
      ],
    },
    {
      heading: "3. Prices",
      paragraphs: [
        "Prices are in Tunisian dinars (TND), all taxes included (19% VAT). The site may show an indicative conversion in another currency; only the TND amount shown in the client area at payment time is binding.",
        "Prices may change at any time; the applicable price is the one shown when ordering. An invoice is issued for every payment and stays available in the client area.",
      ],
    },
    {
      heading: "4. Ordering",
      paragraphs: [
        "The client picks an offer, adds it to the cart and completes the order. They are taken to payment, then to the creation of their client area (or to login if they already have one).",
        "The order is final once payment is accepted. The client receives a confirmation in their area and by e-mail, and the project appears there with its progress.",
      ],
    },
    {
      heading: "5. Payment",
      paragraphs: [
        "Payment is made online by bank card (domestic and international cards) on the secure payment page of the ClicToPay payment platform. LevelUp AI never sees card numbers: they are entered only on the bank's page, protected by encryption and 3-D Secure.",
        "Bank transfer remains possible on request; work starts when funds are received.",
        "If the bank declines the payment, no order is recorded and nothing is charged. The client can try again from their area.",
      ],
    },
    {
      heading: "6. Delivery",
      paragraphs: [
        "Services are digital and delivered in the client area as files, access or publications. Each project goes through five visible steps: Brief received, Production, First version, Your approval, Final delivery.",
        "Indicative lead times are given when the project is scoped and run from the moment the client has supplied the needed material (texts, visuals, access). Client delays shift delivery accordingly.",
        "The client reviews the first version and sends feedback; one round of adjustments is included in every pack, within the scope ordered. Requests outside that scope are quoted separately.",
      ],
    },
    {
      heading: "7. Cancellation and refunds",
      paragraphs: [
        "Packs: the client may cancel free of charge until production starts, and is refunded in full within 14 working days by the original payment method. Once production has started, completed work is due; any balance is refunded pro rata.",
        "Monthly subscriptions: cancellable at any time from the client area or by e-mail, effective at the end of the paid period; the current month is not refunded.",
        "If a deliverable does not match the order, the client reports it through the complaints process; LevelUp AI corrects it or refunds the non-compliant part.",
      ],
    },
    {
      heading: "8. Client obligations",
      paragraphs: [
        "The client warrants holding the rights to everything they supply (texts, images, logos, videos, access) and is responsible for that content. They provide accurate account details and keep their credentials confidential.",
        "Any use of the site or client area that is unlawful or infringes third-party rights is prohibited.",
      ],
    },
    {
      heading: "9. Intellectual property",
      paragraphs: [
        "Final deliverables belong to the client once the service is paid in full. LevelUp AI keeps its methods, tools, templates and know-how, and may cite the project as a reference unless the client objects in writing.",
        "The site, its design, texts and videos remain LevelUp AI's property and may not be reproduced without permission.",
      ],
    },
    {
      heading: "10. Personal data",
      paragraphs: [
        "Data collected (identity, contact details, company information, order and message history) is used only to deliver services, invoice and follow the client relationship. It is never sold or passed on.",
        "Payment data is handled exclusively by the bank and the payment platform; LevelUp AI keeps only the transaction reference.",
        `Under Tunisian Organic Law 2004-63 on personal data protection, clients may access, correct or request deletion of their data by writing to ${PUBLISHER.email}.`,
      ],
    },
    {
      heading: "11. Liability",
      paragraphs: [
        "LevelUp AI uses all reasonable means to deliver its services. It is not liable for content supplied by the client, for the use the client makes of deliverables, or for outages of third-party services (hosting, social networks, payment platforms).",
        "In all cases LevelUp AI's liability is limited to the price of the service concerned.",
      ],
    },
    {
      heading: "12. Complaints and disputes",
      paragraphs: [
        "Complaints follow the process published on the site's Complaints page: acknowledgement within 2 working days, answer within 7 working days.",
        "These terms are governed by Tunisian law. Failing an amicable solution, the competent Tunisian courts have sole jurisdiction.",
      ],
    },
  ],
};

export const COMPLAINTS_EN: LegalDoc = {
  title: "Customer complaints handling",
  updated: `Last updated: ${UPDATED_EN}`,
  intro:
    "A complaint is any dissatisfaction a client expresses about an order, a payment, a service or their client area. Every complaint is recorded, followed and closed with a written answer.",
  sections: [
    {
      heading: "1. How to file a complaint",
      paragraphs: ["Clients choose the channel that suits them:"],
      bullets: [
        `By e-mail to ${PUBLISHER.email}, stating their name, company and the order concerned.`,
        "From the client area (levelupia.app), through the messaging of the project concerned: the exchange is time-stamped and attached to the project.",
        "For a card payment issue: with the date, amount and, if possible, the transaction reference shown on the confirmation e-mail or bank statement.",
      ],
    },
    {
      heading: "2. Commitments",
      paragraphs: [],
      bullets: [
        "Acknowledgement within 2 working days, naming the person in charge.",
        "Reasoned answer and proposed solution within 7 working days.",
        "If more time is needed (for example a check with the bank), the client is told before the deadline, with a new date.",
        "Closure within 15 working days at most, in writing.",
      ],
    },
    {
      heading: "3. Handling",
      paragraphs: [
        "The person responsible for the project takes the complaint, checks the facts in the client area (order, payment, messages, deliverables), consults the team and proposes a solution: correction, new version, commercial gesture or refund under the terms of sale.",
        "If the client is not satisfied with the answer, the complaint is escalated to a LevelUp AI co-founder, who gives a final decision within 5 working days.",
      ],
    },
    {
      heading: "4. Payment complaints",
      paragraphs: [
        "For a charge without a visible order, a double charge or a wrong amount, LevelUp AI checks the transaction with the ClicToPay platform and its bank. Any amount wrongly collected is refunded by the original payment method once confirmed, within 14 working days.",
        "The client may also contest a card transaction with their own bank.",
      ],
    },
    {
      heading: "5. Records and improvement",
      paragraphs: [
        "Each complaint is kept with its date, subject, exchanges and outcome. Complaints are reviewed monthly to fix their causes: site information, ordering flow, deliverable quality.",
      ],
    },
  ],
};

export function legalDocs(lang: string) {
  const fr = lang === "fr";
  return {
    terms: fr ? TERMS_FR : TERMS_EN,
    complaints: fr ? COMPLAINTS_FR : COMPLAINTS_EN,
    labels: fr
      ? { back: "Retour au site", terms: "Conditions d'utilisation et de vente", complaints: "Réclamations", contact: "Contact" }
      : { back: "Back to the site", terms: "Terms of use and sale", complaints: "Complaints", contact: "Contact" },
  };
}
