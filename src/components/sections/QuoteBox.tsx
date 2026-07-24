"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function QuoteBox() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.4"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <section className="quote-section">
      <div className="wrap" ref={ref}>
        <div className="quote-box glass glass-gold-border">
          <motion.blockquote style={{ opacity, filter }}>
            AI should make your business feel more capable - not more complicated.
          </motion.blockquote>
          <p>That is the LevelUp AI standard.</p>
        </div>
      </div>
    </section>
  );
}
