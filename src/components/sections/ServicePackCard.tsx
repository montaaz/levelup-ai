"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

type Pack = {
  number: string;
  title: string;
  price: string;
  summary: string;
  copy: string;
  list: string[];
  cta: string;
};

type Props = {
  pack: Pack;
  accent: string;
  showDetails: string;
  hideDetails: string;
};

/**
 * Pack card that stays compact until asked to open. Collapsed it shows only
 * the one-line "Contenu" summary, so the four cards sit at a uniform,
 * scannable height; the full pitch, bullet list and contact link appear on
 * click.
 *
 * This also fixes a layout bug from the always-expanded version: the CTA was
 * `position: absolute; bottom: 30px`, so on the one pack whose copy runs
 * longest (Découverte) the bullet list grew straight through it and the two
 * overlapped. Everything is in normal flow here, so the button can never
 * collide with the text above it however uneven the packs are.
 */
export default function ServicePackCard({
  pack,
  accent,
  showDetails,
  hideDetails,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard className="service" style={{ "--accent": accent } as CSSProperties}>
      <div className="service-number">{pack.number}</div>
      <h3>{pack.title}</h3>
      <div className="service-price">{pack.price}</div>

      {/* Always visible: the compact contents line. */}
      <p className="service-summary">{pack.summary}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="service-details"
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="service-copy">{pack.copy}</p>
            <ul className="service-list">
              {pack.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a className="service-contact" href="#contact">
              {pack.cta}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="service-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? hideDetails : showDetails}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </GlassCard>
  );
}
