"use client";

import { useState } from "react";
import { addToCart, openCart } from "@/lib/cart";
import { useCart } from "@/hooks/useCart";
import CartButtonIcon from "./CartButtonIcon";

/**
 * Bouton « Ajouter au panier » d'une offre de la liste des services
 * (revue des services et tarifs du 13 octobre 2026). Même comportement que
 * pour les packs et les abonnements : l'offre va dans le panier du site, et
 * une fois dedans le bouton ouvre le panneau au lieu de la rajouter.
 */
export default function AddOfferButton({
  code,
  name,
  label,
  addedLabel,
}: {
  code: string;
  name: string;
  label: string;
  addedLabel: string;
}) {
  const inCart = useCart().some((item) => item.code === code);
  const [announce, setAnnounce] = useState("");

  function onClick() {
    if (inCart) {
      openCart();
      return;
    }
    addToCart(code);
    setAnnounce(`${name}: ${addedLabel}`);
  }

  return (
    <>
      <button type="button" className="pricing-cart" data-in-cart={inCart || undefined} onClick={onClick}>
        <CartButtonIcon added={inCart} size={16} />
        {inCart ? addedLabel : label}
      </button>
      <span className="sr-only" role="status">
        {announce}
      </span>
    </>
  );
}
