"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import clsx from "clsx";

type VideoSlotProps = {
  src?: string;
  poster?: string;
  fallback: ReactNode;
  overlay?: ReactNode;
  loop?: boolean;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
  /** Called with the mounted <video> element (or null on unmount) — lets a
   * consumer attach a WebGL effect (e.g. VideoRipple) to the real element. */
  onVideoElement?: (video: HTMLVideoElement | null) => void;
};

/**
 * Video-ready background primitive. With no `src`, renders only the styled
 * fallback. Once a Flora-generated clip exists, pass `src` and it layers in
 * with zero layout changes — the fallback stays mounted underneath.
 *
 * The video only mounts after a client-side effect confirms it should (in
 * view / reduced-motion), so SSR and the first client paint always agree
 * (neither ever renders a <video>) — avoiding a hydration mismatch that a
 * client-only prefers-reduced-motion check would otherwise cause.
 */
export default function VideoSlot({
  src,
  poster,
  fallback,
  overlay,
  loop = true,
  priority = false,
  objectPosition = "center",
  className,
  onVideoElement,
}: VideoSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (!(priority || isInView)) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const frame = requestAnimationFrame(() => setShouldMount(true));
    return () => cancelAnimationFrame(frame);
  }, [src, priority, isInView]);

  return (
    <div ref={containerRef} className={clsx("video-slot", className)}>
      <div className="video-slot-fallback" aria-hidden="true">
        {fallback}
      </div>
      {shouldMount && (
        <video
          ref={onVideoElement}
          className="video-slot-video"
          src={src}
          poster={poster}
          autoPlay
          muted
          playsInline
          loop={loop}
          preload={priority ? "auto" : "metadata"}
          style={{ objectPosition }}
        />
      )}
      {overlay && (
        <div className="video-slot-overlay" aria-hidden="true">
          {overlay}
        </div>
      )}
    </div>
  );
}
