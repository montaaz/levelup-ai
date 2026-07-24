"use client";

import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CinematicBackground from "@/components/media/CinematicBackground";
import RevealText from "@/components/ui/RevealText";
import DeviceMockup from "@/components/hero/DeviceMockup";
import AutomationPhone from "@/components/hero/AutomationPhone";
import { useCursorTilt } from "@/hooks/useCursorTilt";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  }),
};

export default function Hero() {
  const { containerRef: tiltRef, tiltX, tiltY } = useCursorTilt();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  // Desktop-pin-driven phone phase. undefined until the pin actually
  // engages (mobile / reduced-motion never set this), so AutomationPhone
  // falls back to its own timer in those cases.
  const [phonePhase, setPhonePhase] = useState<number | undefined>(undefined);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 980px)", () => {
        if (!pinRef.current || !trackRef.current) return;

        // Pixel-based, not yPercent: yPercent is relative to the TRACK's
        // own height (3x the screen window, since it holds 3 stacked
        // panels), not the screen window's height — using yPercent: -100
        // to mean "advance one panel" is wrong by a factor of 3. Measure
        // the real screen window height and tween `y` in pixels instead.
        const screenWindow = trackRef.current.parentElement;
        const panelHeight = screenWindow ? screenWindow.getBoundingClientRect().height : 0;
        if (!panelHeight) return;

        // Timeline shape: [dwell panel1] [pan 1→2] [dwell panel2] [pan 2→3] [dwell panel3]
        // Each dwell holds the current panel still (readable); each pan
        // scrolls to the next. Label positions are explicit timeline
        // seconds, mapped onto the pin's real scroll budget below — same
        // technique as ProcessTimeline's `steps.length * 360`, just with
        // dwell+pan sub-segments instead of one tween per step.
        const DWELL = 1;
        const PAN = 0.6;
        const pan1Start = DWELL;
        const pan2Start = DWELL + PAN + DWELL;
        // Trailing dwell after the last pan — GSAP timelines auto-size to
        // the furthest tween, so this must be an explicit tween/marker, not
        // just implied by totalUnits math, or the timeline's real duration
        // falls short of the intended budget and the scrub finishes early,
        // leaving dead (empty-screen) scroll before the pin releases.
        const trailingDwellStart = pan2Start + PAN;
        const totalUnits = trailingDwellStart + DWELL;
        const pxPerUnit = 340;
        const totalPx = Math.round(totalUnits * pxPerUnit);

        // Phase boundaries at the midpoint of each pan (halfway through the
        // transition reads better than switching exactly at pan-start).
        const phase1Boundary = pan1Start + PAN / 2;
        const phase2Boundary = pan2Start + PAN / 2;

        // Set synchronously now, not just from the scrub — without this,
        // phonePhase stays undefined for a real gap after mount and
        // AutomationPhone starts its own uncontrolled timer in that
        // window, racing the pin.
        setPhonePhase(0);

        // React to phase crossings via a lightweight, throttled ticker
        // driven by ScrollTrigger's own progress, not a setState call
        // inside onUpdate — onUpdate fires on every scroll recalculation
        // during the scrub (many times per scroll gesture), and forcing a
        // React render pass that often, on top of GSAP's own tween work
        // and the video shader, was the real source of the scroll jank
        // reported against this section. requestAnimationFrame throttles
        // this to at most once per rendered frame.
        let lastPhase = 0;
        let phaseRaf = 0;
        const syncPhase = () => {
          phaseRaf = 0;
          const t = tl.time();
          const phase = t < phase1Boundary ? 0 : t < phase2Boundary ? 1 : 2;
          if (phase !== lastPhase) {
            lastPhase = phase;
            setPhonePhase(phase);
          }
        };

        // Pin flush against the sticky nav's own height, not the raw
        // viewport top — without this offset the pinned laptop content
        // sits directly under the 82px nav bar with zero clearance, so
        // panel text/buttons near the top visually collide with it.
        const navHeight = document.querySelector(".nav")?.getBoundingClientRect().height ?? 82;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: `top top+=${navHeight}`,
            end: `+=${totalPx}`,
            scrub: 0.6,
            pin: true,
            pinType: "transform",
            anticipatePin: 1,
            onUpdate: () => {
              if (!phaseRaf) phaseRaf = requestAnimationFrame(syncPhase);
            },
          },
        });

        tl.to(trackRef.current, { y: -panelHeight, ease: "none", duration: PAN }, pan1Start);
        tl.to(trackRef.current, { y: -panelHeight * 2, ease: "none", duration: PAN }, pan2Start);
        tl.to({}, { duration: DWELL }, trailingDwellStart);

        return () => {
          if (phaseRaf) cancelAnimationFrame(phaseRaf);
          tl.scrollTrigger?.kill();
          tl.kill();
          setPhonePhase(undefined);
        };
      });
    },
    // revertOnUpdate: true — by default @gsap/react's useGSAP only reverts
    // its GSAP context on unmount, not when `dependencies` change; without
    // this, flipping reducedMotion from false→true (which the app's own
    // usePrefersReducedMotion hook always does once, shortly after mount,
    // by design) re-runs the callback and hits the early return, but never
    // cleans up the pin/timeline the first (false) run already created —
    // the pin silently stays active under reduced motion.
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <section className="hero hero-device" ref={sectionRef}>
      <CinematicBackground
        variant="hero"
        className="hero-cine-bg"
        src="/videos/hero-bg.mp4"
        poster="/videos/hero-bg-poster.jpg"
        priority
        ripple
        parallax={false}
      />
      <div className="wrap hero-grid hero-grid-device">
        <div className="hero-content">
          <motion.span
            className="eyebrow"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
          >
            <span className="eyebrow-dot"></span> AI-powered creative studio
          </motion.span>

          <RevealText
            as="h1"
            className="hero-h1"
            delay={0.15}
            lines={["Big ideas.", <span className="underline" key="u">Smart build.</span>, "Real growth."]}
          />

          <motion.div
            className="hero-copy-panel glass"
            initial="hidden"
            animate="visible"
            custom={0.55}
            variants={fadeUp}
          >
            <p className="hero-copy">
              LevelUp AI helps small businesses and startups look bigger, move faster, and grow smarter
              with affordable websites, AI commercial videos, and practical automations.
            </p>

            <div className="hero-proof">
              <span className="proof-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m5 12 4 4L19 6" /></svg>
                Small-business friendly
              </span>
              <span className="proof-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m5 12 4 4L19 6" /></svg>
                Fast, focused delivery
              </span>
              <span className="proof-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m5 12 4 4L19 6" /></svg>
                Human-guided AI
              </span>
            </div>
          </motion.div>

          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            custom={0.7}
            variants={fadeUp}
          >
            <a className="button glass-gold-border" href="#contact">
              Let&apos;s build your project
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="button secondary" href="#services">
              Explore services
            </a>
          </motion.div>
        </div>
      </div>

      <div className="wrap hero-device-wrap" ref={pinRef}>
        <div ref={tiltRef}>
          <DeviceMockup tiltX={tiltX} tiltY={tiltY} trackRef={trackRef} />
          <div className="hero-device-phone">
            <AutomationPhone tiltX={tiltX} tiltY={tiltY} activeIndex={phonePhase} />
          </div>
        </div>
      </div>
    </section>
  );
}
