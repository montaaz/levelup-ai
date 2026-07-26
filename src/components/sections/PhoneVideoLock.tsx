"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

// phone.png's native size and the screen cutout's bounding box within it
// (measured directly from the source pixels — the phone sits right-of-
// center against an orange backdrop, screen roughly 58-75% width / 16-83%
// height). Used to convert the "background-size:cover" rendered rect for
// the image into a pixel-accurate position for the video overlay. Inset
// ~2% in from the raw dark-pixel bounding box on every edge — a hair
// smaller than the true screen so the video always lands just inside the
// phone's bezel rather than flush against it, absorbing any sub-pixel
// rounding differences across browsers/zoom levels instead of ever
// spilling past the frame.
const IMAGE_SIZE = { width: 1736, height: 906 };
const SCREEN_BOX = { left: 0.58, top: 0.178, right: 0.743, bottom: 0.822 };

/**
 * Pinned phone showcase: once the sticky stage is fully in view, the video
 * autoplays and page scroll is frozen (body overflow:hidden) until it
 * finishes, then scroll is released and the page continues normally.
 * Scrolling back up before it finishes releases the lock immediately
 * rather than trapping the user.
 */
export default function PhoneVideoLock() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [screenRect, setScreenRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Recompute the video overlay's pixel position whenever the stage
  // resizes — object-fit:cover scales+crops the background image, so the
  // screen's on-screen position shifts with the container's aspect ratio.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function measure() {
      const { width: cw, height: ch } = stage!.getBoundingClientRect();
      const imageAspect = IMAGE_SIZE.width / IMAGE_SIZE.height;
      const containerAspect = cw / ch;

      let renderedW: number;
      let renderedH: number;
      if (containerAspect > imageAspect) {
        renderedW = cw;
        renderedH = cw / imageAspect;
      } else {
        renderedH = ch;
        renderedW = ch * imageAspect;
      }
      const offsetX = (cw - renderedW) / 2;
      const offsetY = (ch - renderedH) / 2;

      setScreenRect({
        left: offsetX + renderedW * SCREEN_BOX.left,
        top: offsetY + renderedH * SCREEN_BOX.top,
        width: renderedW * (SCREEN_BOX.right - SCREEN_BOX.left),
        height: renderedH * (SCREEN_BOX.bottom - SCREEN_BOX.top),
      });
    }

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;

    function onLoadedMetadata() {
      setIsReady(true);
    }
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    if (video.readyState >= 1) onLoadedMetadata();

    let isLocked = false;

    function lockScroll() {
      isLocked = true;
      setLocked(true);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    function unlockScroll() {
      isLocked = false;
      setLocked(false);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    // Belt-and-braces on top of overflow:hidden — some inputs (a mouse
    // wheel dispatched while the target is inside a still-scrollable
    // nested element, etc.) can slip past a plain overflow toggle, so
    // scroll-producing input is also cancelled directly while locked.
    const SCROLL_KEYS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"];
    function blockIfLocked(event: Event) {
      if (isLocked) event.preventDefault();
    }
    function blockKeyIfLocked(event: KeyboardEvent) {
      if (isLocked && SCROLL_KEYS.includes(event.key)) event.preventDefault();
    }
    window.addEventListener("wheel", blockIfLocked, { passive: false });
    window.addEventListener("touchmove", blockIfLocked, { passive: false });
    window.addEventListener("keydown", blockKeyIfLocked, { passive: false });

    function onTimeUpdate() {
      if (video!.duration) {
        setProgressPct((video!.currentTime / video!.duration) * 100);
      }
    }
    function onEnded() {
      setProgressPct(100);
      unlockScroll();
    }
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    function tryTrigger() {
      if (hasPlayedRef.current) return;
      const rect = stage!.getBoundingClientRect();
      // Trigger as soon as the section's top has reached (or passed) the
      // viewport top, rather than waiting for one exact instant — a fast
      // scroll (fling, trackpad momentum, a big wheel delta) can jump
      // straight past a single-pixel check between browser scroll-event
      // ticks. The lower bound guards against firing on a section that's
      // scrolled fully past and out of view (e.g. on initial page load
      // with a restored scroll position deep in the page).
      if (rect.top <= 0 && rect.top > -window.innerHeight) {
        hasPlayedRef.current = true;
        lockScroll();
        video!.currentTime = 0;
        video!.muted = false;
        video!.play().catch(() => {
          // Browsers block unmuted autoplay before any user gesture on the
          // page (a scroll counts as one in most browsers, but not all —
          // e.g. Safari can still refuse). Retry muted so the section
          // isn't stuck showing a frozen first frame; better silent
          // playback than no playback.
          video!.muted = true;
          video!.play().catch(() => unlockScroll());
        });
      }
    }

    // Only ever called synchronously from real input-event handlers
    // (wheel/touchmove/scroll/keydown) — never from a bare rAF loop.
    // Chrome's autoplay-with-sound policy credits a call to video.play()
    // as user-activated only when it happens inside the call stack of an
    // actual input event; a requestAnimationFrame callback has no such
    // provenance, so play() still resolves but Chrome silently drops the
    // audio. That was the bug: an unconditional rAF poll was racing (and
    // usually beating) the real event handlers, so playback nearly always
    // started from the ungested path and lost sound.
    window.addEventListener("wheel", tryTrigger, { passive: true });
    window.addEventListener("touchmove", tryTrigger, { passive: true });
    window.addEventListener("scroll", tryTrigger, { passive: true });
    window.addEventListener("keydown", tryTrigger, { passive: true });
    tryTrigger();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      window.removeEventListener("wheel", blockIfLocked);
      window.removeEventListener("touchmove", blockIfLocked);
      window.removeEventListener("keydown", blockKeyIfLocked);
      window.removeEventListener("wheel", tryTrigger);
      window.removeEventListener("touchmove", tryTrigger);
      window.removeEventListener("scroll", tryTrigger);
      window.removeEventListener("keydown", tryTrigger);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <section className="section section-dark phone-lock-section" aria-label="Product preview">
      <div className={`phone-lock-stage${locked ? " is-locked" : ""}`} ref={stageRef}>
        <div className="phone-lock-bg-wrap">
          <Image
            src="/phone.png"
            alt="Hand holding a phone"
            fill
            sizes="100vw"
            className="phone-lock-bg"
            priority
          />
        </div>
        <div className="phone-lock-scrim" aria-hidden="true" />

        <div
          className="phone-lock-screen"
          style={
            screenRect
              ? { left: screenRect.left, top: screenRect.top, width: screenRect.width, height: screenRect.height }
              : { left: 0, top: 0, width: 0, height: 0 }
          }
        >
          <video
            ref={videoRef}
            className="phone-lock-video"
            src="/level_up.mp4"
            playsInline
            preload="auto"
          />
        </div>

        <div className="phone-lock-content wrap">
          <Reveal className="phone-lock-copy">
            <span className="section-kicker">See it in action</span>
            <h2>Watch it come to life.</h2>
            <p className="section-lead">
              Sit tight while the preview plays — we&apos;ll hand control back to the page once it&apos;s done.
            </p>

            <div className="phone-lock-progress" aria-hidden="true">
              <div className="phone-lock-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="phone-lock-hint" data-visible={isReady && progressPct < 100}>
              Playing preview…
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
