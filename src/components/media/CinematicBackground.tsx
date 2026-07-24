"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import VideoSlot from "./VideoSlot";
import VideoRipple from "./VideoRipple";
import { useParallaxY } from "@/hooks/useParallaxY";

type Variant = "hero" | "services" | "process" | "contact";

type CinematicBackgroundProps = {
  variant: Variant;
  src?: string;
  poster?: string;
  className?: string;
  parallax?: boolean;
  priority?: boolean;
  /** Applies the cursor-driven WebGL ripple + chromatic-aberration shader
   * on top of the video. Desktop-only, gated inside VideoRipple itself. */
  ripple?: boolean;
};

const VARIANT_FALLBACK: Record<Variant, React.ReactNode> = {
  hero: (
    <>
      <div className="cine-glow cine-glow-gold" />
      <div className="cine-glow cine-glow-bronze" />
      <div className="cine-grain" />
    </>
  ),
  services: (
    <>
      <div className="cine-glow cine-glow-champagne" />
      <div className="cine-grain" />
    </>
  ),
  process: (
    <>
      <div className="cine-glow cine-glow-gold cine-glow-soft" />
      <div className="cine-grain" />
    </>
  ),
  contact: (
    <>
      <div className="cine-glow cine-glow-bronze" />
      <div className="cine-glow cine-glow-gold cine-glow-soft" />
      <div className="cine-grain" />
    </>
  ),
};

function ParallaxLayer({
  variant,
  src,
  poster,
  className,
  priority,
  ripple,
}: Omit<CinematicBackgroundProps, "parallax">) {
  const { ref, y } = useParallaxY(60);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  return (
    <motion.div ref={ref} className={clsx("cine-bg", `cine-bg-${variant}`, className)} style={{ y }}>
      <VideoSlot
        src={src}
        poster={poster}
        fallback={VARIANT_FALLBACK[variant]}
        className="cine-bg-video-slot"
        priority={priority}
        onVideoElement={ripple ? setVideoEl : undefined}
      />
      {ripple && <VideoRipple video={videoEl} />}
    </motion.div>
  );
}

function StaticLayer({
  variant,
  src,
  poster,
  className,
  priority,
  ripple,
}: Omit<CinematicBackgroundProps, "parallax">) {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  return (
    <div className={clsx("cine-bg", `cine-bg-${variant}`, className)}>
      <VideoSlot
        src={src}
        poster={poster}
        fallback={VARIANT_FALLBACK[variant]}
        className="cine-bg-video-slot"
        priority={priority}
        onVideoElement={ripple ? setVideoEl : undefined}
      />
      {ripple && <VideoRipple video={videoEl} />}
    </div>
  );
}

/**
 * When `parallax` is false (e.g. the hero background, which now lives
 * inside a GSAP-pinned section — a scroll-linked `y` drift on the whole
 * layer fights the pin, since the pin holds the layer's viewport position
 * fixed while useParallaxY's independent useScroll tracking keeps
 * computing as if it were moving), this renders a completely separate,
 * non-parallax component rather than conditionally skipping the ref on a
 * shared one. useParallaxY's useScroll({ target: ref }) call is not
 * conditional internally — attaching that hook but never attaching its
 * ref to a DOM node (which the old `ref={parallax ? ref : undefined}`
 * pattern did) left Framer Motion watching a ref that's never hydrated,
 * producing a console warning on every render.
 */
export default function CinematicBackground({ parallax = true, ...props }: CinematicBackgroundProps) {
  return parallax ? <ParallaxLayer {...props} /> : <StaticLayer {...props} />;
}
