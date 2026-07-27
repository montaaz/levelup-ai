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

// A swipe needs to travel this many px (vertically, upward) on the phone
// screen before it counts as "unlock" rather than an accidental tap/drag.
const SWIPE_UNLOCK_THRESHOLD = 40;

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * Pinned phone showcase: once the sticky stage is fully in view, page
 * scroll freezes and the phone screen shows an iPhone-style lock screen.
 * Swiping up (or clicking, for mouse users) unlocks it and starts the
 * video — that swipe/click is a real trusted gesture, so the browser
 * allows the video to play with sound immediately, no separate mute
 * button needed. Scroll stays frozen until the phone is unlocked and the
 * video finishes — the lock screen is a deliberate gate, not something
 * scrolling past skips.
 */
export default function PhoneVideoLock() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPinnedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [screenRect, setScreenRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const now = useClock();

  // Recompute the video overlay's pixel position whenever the stage
  // resizes — object-fit:cover scales+crops the full-bleed background to
  // fill it, so the screen's on-screen position shifts with the
  // container's aspect ratio. object-position also switches at the same
  // 740px breakpoint .phone-lock-bg uses (see device-mockup.css): desktop
  // centers the crop, mobile biases it toward ~78% width — the phone
  // itself sits right-of-center in the source photo, so a plain center
  // crop on a narrow/tall viewport pushes the phone half off-screen,
  // while this keeps it framed regardless of viewport shape.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const mobileQuery = window.matchMedia("(max-width: 740px)");

    function measure() {
      const { width: cw, height: ch } = stage!.getBoundingClientRect();
      const imageAspect = IMAGE_SIZE.width / IMAGE_SIZE.height;
      const containerAspect = cw / ch;
      // 0.71 centers the phone itself (not the image) in the viewport —
      // derived from the phone's horizontal midpoint in the source photo
      // (~66% of its width) adjusted for how far cover has to scale up a
      // 1.92:1 landscape image to fill a much taller mobile viewport.
      const objectPositionX = mobileQuery.matches ? 0.71 : 0.5;

      let renderedW: number;
      let renderedH: number;
      if (containerAspect > imageAspect) {
        renderedW = cw;
        renderedH = cw / imageAspect;
      } else {
        renderedH = ch;
        renderedW = ch * imageAspect;
      }
      const offsetX = (cw - renderedW) * objectPositionX;
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
    mobileQuery.addEventListener("change", measure);
    return () => {
      resizeObserver.disconnect();
      mobileQuery.removeEventListener("change", measure);
    };
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

    // Pin the stage and reveal the lock screen the moment the section's
    // top reaches (or passes) the viewport top — checked across several
    // input event types, not just "scroll", and with a window the size of
    // one viewport height rather than a single pixel, so a fast fling or
    // large wheel delta can't skip past the trigger between two events.
    function pinIfNeeded() {
      if (hasPinnedRef.current) return;
      const rect = stage!.getBoundingClientRect();
      if (rect.top <= 0 && rect.top > -window.innerHeight) {
        hasPinnedRef.current = true;
        lockScroll();
        setShowLockScreen(true);
      }
    }
    window.addEventListener("wheel", pinIfNeeded, { passive: true });
    window.addEventListener("touchmove", pinIfNeeded, { passive: true });
    window.addEventListener("scroll", pinIfNeeded, { passive: true });
    window.addEventListener("keydown", pinIfNeeded, { passive: true });
    pinIfNeeded();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      window.removeEventListener("wheel", blockIfLocked);
      window.removeEventListener("touchmove", blockIfLocked);
      window.removeEventListener("keydown", blockKeyIfLocked);
      window.removeEventListener("wheel", pinIfNeeded);
      window.removeEventListener("touchmove", pinIfNeeded);
      window.removeEventListener("scroll", pinIfNeeded);
      window.removeEventListener("keydown", pinIfNeeded);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Swiping up (or a plain click, for mouse users) on the lock screen is a
  // real trusted gesture — calling video.play() synchronously inside this
  // handler is what lets the browser grant unmuted autoplay, unlike a
  // scroll-triggered call, which every major browser refuses.
  function unlockAndPlay() {
    setShowLockScreen(false);
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    video.currentTime = 0;
    video.play().catch(() => {
      // Extremely defensive fallback — should never actually be hit since
      // this only runs inside a real click/pointerup handler.
      video.muted = true;
      video.play();
    });
  }

  const swipeStartY = useRef<number | null>(null);
  function onSwipeStart(event: React.PointerEvent) {
    swipeStartY.current = event.clientY;
  }
  function onSwipeEnd(event: React.PointerEvent) {
    const startY = swipeStartY.current;
    swipeStartY.current = null;
    // A short drag still counts as "unlock" (so a plain tap/click works
    // too, matching real iOS's tap-to-unlock alongside swipe-to-unlock) —
    // only a genuine downward drag is treated as "not an unlock attempt".
    const deltaY = startY === null ? 0 : startY - event.clientY;
    if (deltaY >= -SWIPE_UNLOCK_THRESHOLD) {
      unlockAndPlay();
    }
  }

  const timeLabel = now
    ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })
    : "";
  // Abbreviated "Sun, Jul 26" style — matches the compact weekday+month
  // format iOS itself uses on the lock screen, rather than a spelled-out
  // "Sunday, July 26" that doesn't fit the same visual rhythm.
  const dateLabel = now
    ? now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    : "";

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
          <video ref={videoRef} className="phone-lock-video" src="/phone-preview-v2.mp4" playsInline preload="auto" />

            {showLockScreen && (
            <div
              className="phone-lockscreen"
              onPointerDown={onSwipeStart}
              onPointerUp={onSwipeEnd}
              role="button"
              tabIndex={0}
              aria-label="Swipe up to play preview"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") unlockAndPlay();
              }}
            >
              <svg
                className="phone-lockscreen-wallpaper"
                viewBox="0 0 300 650"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="lockBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8fd0f5" />
                    <stop offset="45%" stopColor="#6fb4ec" />
                    <stop offset="100%" stopColor="#3f7fd6" />
                  </linearGradient>
                  <linearGradient id="lockMid" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4f8fe0" />
                    <stop offset="100%" stopColor="#1f4fae" />
                  </linearGradient>
                  <linearGradient id="lockDeep" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#153a8a" />
                    <stop offset="100%" stopColor="#05102f" />
                  </linearGradient>
                  <radialGradient id="lockGlow" cx="10%" cy="95%" r="70%">
                    <stop offset="0%" stopColor="#ffd9c4" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ffd9c4" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="300" height="650" fill="url(#lockBase)" />
                <path
                  d="M300,60 C220,140 260,260 190,340 C130,410 220,470 300,430 Z"
                  fill="url(#lockMid)"
                />
                <path
                  d="M300,300 C210,340 250,480 150,560 C80,620 40,650 0,650 L300,650 Z"
                  fill="url(#lockDeep)"
                />
                <rect width="300" height="650" fill="url(#lockGlow)" />
              </svg>

              <div className="phone-lockscreen-statusbar">
                <span>LevelUp</span>
                <div className="phone-lockscreen-statusbar-icons">
                  <svg viewBox="0 0 16 12" width="14" height="10" aria-hidden="true">
                    <rect x="0" y="7" width="2.5" height="5" rx="0.5" fill="currentColor" />
                    <rect x="4.5" y="5" width="2.5" height="7" rx="0.5" fill="currentColor" />
                    <rect x="9" y="3" width="2.5" height="9" rx="0.5" fill="currentColor" />
                    <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="currentColor" />
                  </svg>
                  <svg viewBox="0 0 16 12" width="14" height="10" aria-hidden="true">
                    <path
                      d="M8 10.5 5.5 8a3.6 3.6 0 0 1 5 0L8 10.5Z M2.5 4.8A9 9 0 0 1 8 3a9 9 0 0 1 5.5 1.8 M0.5 2A12 12 0 0 1 8 0a12 12 0 0 1 7.5 2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <svg viewBox="0 0 25 12" width="22" height="10" aria-hidden="true">
                    <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor" fill="none" />
                    <rect x="2" y="2" width="15" height="8" rx="1" fill="currentColor" />
                    <rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <div className="phone-lockscreen-clock">
                <div className="phone-lockscreen-date">{dateLabel}</div>
                <div className="phone-lockscreen-time">{timeLabel}</div>
              </div>

              <div className="phone-lockscreen-swipe">
                <span className="phone-lockscreen-swipe-chevron" aria-hidden="true" />
                <span>Swipe up to play</span>
              </div>

              <div className="phone-lockscreen-controls">
                <span className="phone-lockscreen-control">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M13 2 5 13h5l-1 9 8-13h-5l1-7Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="phone-lockscreen-control">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <rect x="3" y="7" width="18" height="13" rx="2.5" fill="currentColor" />
                    <rect x="9" y="4" width="6" height="3" rx="1" fill="currentColor" />
                    <circle cx="12" cy="13.5" r="3.4" fill="#0a1a4a" />
                  </svg>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="phone-lock-content wrap">
          <Reveal className="phone-lock-copy">
            <span className="section-kicker">See it in action</span>
            <h2>Watch it come to life.</h2>
            <p className="section-lead">
              {showLockScreen
                ? "Swipe up on the phone to play the preview with sound."
                : "Sit tight while the preview plays — we'll hand control back to the page once it's done."}
            </p>

            <div className="phone-lock-progress" aria-hidden="true">
              <div className="phone-lock-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="phone-lock-hint" data-visible={isReady && !showLockScreen && progressPct < 100}>
              Playing preview…
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
