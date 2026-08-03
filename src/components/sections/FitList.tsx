"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const ITEMS = [
  {
    index: "01",
    title: "Start with the business goal",
    copy: "We do not add AI just because it is trendy. We begin with the customer, the bottleneck, and the result you want.",
  },
  {
    index: "02",
    title: "Design for clarity",
    copy: "Your website, video, or automation should feel simple to use and easy to understand - even when the technology behind it is advanced.",
  },
  {
    index: "03",
    title: "Build the right-sized solution",
    copy: "No bloated package. No unnecessary complexity. You get what your business needs now, with room to grow later.",
  },
  {
    index: "04",
    title: "Stay human where it matters",
    copy: "AI helps us move faster, but your voice, judgment, and customer relationships stay at the center.",
  },
];

function FitItem({ item, order }: { item: (typeof ITEMS)[number]; order: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.4"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Reveal as="div" className="fit-item" delay={order * 0.06}>
      <span className="fit-index" ref={ref}>
        <motion.span className="fit-index-fill" style={{ height: fill }} />
        <span className="fit-index-label">{item.index}</span>
      </span>
      <div>
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
      </div>
    </Reveal>
  );
}

export default function FitList() {
  return (
    <section className="section section-vivid section-vivid-fit">
      <div className="wrap fit-grid">
        <Reveal className="sticky-copy">
          <span className="section-kicker">Built for momentum</span>
          <h2>Agency-quality thinking. Small-business reality.</h2>
          <p className="section-lead" style={{ marginTop: 25 }}>
            We keep the process clear, collaborative, and focused on what will actually help your business grow.
          </p>
        </Reveal>
        <div className="fit-list">
          {ITEMS.map((item, order) => (
            <FitItem key={item.index} item={item} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
}
