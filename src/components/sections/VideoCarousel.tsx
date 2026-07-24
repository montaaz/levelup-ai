"use client";

import { useEffect, useRef } from "react";
import VideoSlot from "@/components/media/VideoSlot";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

const CARDS = [
  { id: "gold-macro", label: "Texture study", src: "/videos/carousel-gold-macro.mp4", rotate: -3 },
  { id: "architectural", label: "Interior light", src: "/videos/carousel-architectural.mp4", rotate: 2 },
  { id: "circuit", label: "Tech detail", src: "/videos/carousel-circuit.mp4", rotate: -1.5 },
  { id: "skyline", label: "Atmosphere", src: "/videos/carousel-skyline.mp4", rotate: 3 },
];

/**
 * Horizontal scroll-snap track of mood/style reference clips — native touch
 * scroll on mobile, an optional pointer-drag-to-scroll enhancement on
 * desktop (gated inside an effect, pointer:fine only, so it never fights
 * native scrollLeft as the single source of truth).
 */
export default function VideoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    function onPointerDown(event: PointerEvent) {
      isDown = true;
      startX = event.clientX;
      startScrollLeft = track!.scrollLeft;
      track!.setPointerCapture(event.pointerId);
    }
    function onPointerMove(event: PointerEvent) {
      if (!isDown) return;
      track!.scrollLeft = startScrollLeft - (event.clientX - startX);
    }
    function onPointerUp(event: PointerEvent) {
      isDown = false;
      track!.releasePointerCapture(event.pointerId);
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <section className="section video-carousel-section">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <span className="section-kicker">More from the studio</span>
            <h2>Moods we can build for you.</h2>
          </div>
          <p className="section-lead">
            A look at the kind of cinematic style we produce — not client work, just the range.
          </p>
        </Reveal>
      </div>

      <div className="video-carousel-track" ref={trackRef}>
        {CARDS.map((card) => (
          <div key={card.id} className="video-carousel-card" style={{ "--card-rotate": `${card.rotate}deg` } as React.CSSProperties}>
            <GlassCard className="video-carousel-glass">
              <span className="video-carousel-label">{card.label}</span>
              <VideoSlot
                className="video-carousel-video-slot"
                src={card.src}
                fallback={<div className="video-carousel-fallback" />}
              />
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
}
