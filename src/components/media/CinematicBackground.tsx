"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import VideoSlot from "./VideoSlot";
import VideoRipple from "./VideoRipple";
import { useParallaxY } from "@/hooks/useParallaxY";
import { useUnmutableVideo } from "@/hooks/useUnmutableVideo";
import { useTranslations } from "@/i18n/LocaleProvider";

type Variant = "hero" | "services" | "process" | "contact";

type CinematicBackgroundProps = {
  variant: Variant;
  src?: string;
  /** Alternate clip for narrow/mobile viewports — see VideoSlot. */
  mobileSrc?: string;
  poster?: string;
  className?: string;
  parallax?: boolean;
  priority?: boolean;
  /** Applies the cursor-driven WebGL ripple + chromatic-aberration shader
   * on top of the video. Desktop-only, gated inside VideoRipple itself. */
  ripple?: boolean;
  /** Starts muted with a tap-to-unmute control instead of playing silently
   * forever — see useUnmutableVideo. */
  sound?: boolean;
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

/** Tap-to-unmute control for a CinematicBackground with `sound` enabled.
 * Rendered as a sibling of .cine-bg (not a descendant) — .cine-bg sits at
 * z-index:-1 inside its section's own isolated stacking context (see
 * `.hero { isolation: isolate }`), so nothing nested inside it can ever
 * paint — or receive clicks — above the section's normal-flow content,
 * regardless of its own z-index. The button has to live outside that
 * subtree entirely to be clickable over the hero copy/laptop. */
function SoundButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations();
  return (
    <button type="button" className="video-slot-sound" onClick={onClick} aria-label={t.media.playWithSound}>
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path
          d="M4 9v6h4l5 4V5L8 9H4Z M16 8.5a4.5 4.5 0 0 1 0 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span>{t.media.soundOn}</span>
    </button>
  );
}

function ParallaxLayer({
  variant,
  src,
  mobileSrc,
  poster,
  className,
  priority,
  ripple,
  sound,
}: Omit<CinematicBackgroundProps, "parallax">) {
  const { ref, y } = useParallaxY(60);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const { videoRef, unmuted, playWithSound } = useUnmutableVideo();

  return (
    <>
      <motion.div ref={ref} className={clsx("cine-bg", `cine-bg-${variant}`, className)} style={{ y }}>
        <VideoSlot
          src={src}
          mobileSrc={mobileSrc}
          poster={poster}
          fallback={VARIANT_FALLBACK[variant]}
          className="cine-bg-video-slot"
          priority={priority}
          unmuted={unmuted}
          videoRef={(el) => {
            videoRef.current = el;
            if (ripple) setVideoEl(el);
          }}
        />
        {ripple && <VideoRipple video={videoEl} />}
      </motion.div>
      {sound && !unmuted && <SoundButton onClick={playWithSound} />}
    </>
  );
}

function StaticLayer({
  variant,
  src,
  mobileSrc,
  poster,
  className,
  priority,
  ripple,
  sound,
}: Omit<CinematicBackgroundProps, "parallax">) {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const { videoRef, unmuted, playWithSound } = useUnmutableVideo();

  return (
    <>
      <div className={clsx("cine-bg", `cine-bg-${variant}`, className)}>
        <VideoSlot
          src={src}
          mobileSrc={mobileSrc}
          poster={poster}
          fallback={VARIANT_FALLBACK[variant]}
          className="cine-bg-video-slot"
          priority={priority}
          unmuted={unmuted}
          videoRef={(el) => {
            videoRef.current = el;
            if (ripple) setVideoEl(el);
          }}
        />
        {ripple && <VideoRipple video={videoEl} />}
      </div>
      {sound && !unmuted && <SoundButton onClick={playWithSound} />}
    </>
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
