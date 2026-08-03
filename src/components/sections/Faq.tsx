"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";

const FAQ_ITEMS = [
  {
    question: "Are your websites really affordable for a small business?",
    answer:
      "Yes. We shape the scope around what your business needs most, so you can launch a professional site without paying for unnecessary pages or features.",
  },
  {
    question: "Can you create an AI commercial without a traditional video shoot?",
    answer:
      "Yes. Depending on the concept, we can combine product images, AI-generated scenes, motion, voiceover, music, and editing to create a polished commercial.",
  },
  {
    question: "What kind of business tasks can you automate?",
    answer:
      "Common examples include lead capture, qualification, follow-up emails, appointment reminders, content generation, document workflows, and updates between business tools.",
  },
  {
    question: "Do I need to understand AI or technology?",
    answer:
      "No. We explain the project in business language, keep the system practical, and show you exactly how to use what we build.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section section-wash-loop section-wash-loop-end" id="faq">
      <div className="wrap faq-layout">
        <Reveal>
          <span className="section-kicker">Questions</span>
          <h2>Good to know.</h2>
          <p className="section-lead" style={{ marginTop: 25 }}>
            Every project is different, but these are the questions small businesses ask us most.
          </p>
        </Reveal>

        <Reveal className="faq-list glass" delay={0.1}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={clsx("faq-item", isOpen && "open")}>
                <button
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-plus">{isOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
