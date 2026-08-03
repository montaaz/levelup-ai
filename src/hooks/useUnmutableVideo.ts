"use client";

import { useRef, useState } from "react";

/**
 * Shared mute-toggle state for a background <video> plus the trusted-click
 * handler that unmutes it. Browsers only grant unmuted playback from a real
 * click/pointerup handler, never from an effect or timer, so the "play with
 * sound" control has to live wherever it can actually receive that click —
 * which for a full-bleed cinematic background is NOT inside the video's own
 * z-index:-1 layer (see the stacking-context note where this is consumed).
 * Splitting the state out like this lets the <video> and its button render
 * in different parts of the tree while staying in sync.
 */
export function useUnmutableVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [unmuted, setUnmuted] = useState(false);

  function playWithSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    setUnmuted(true);
    video.play().catch(() => {
      video.muted = true;
      setUnmuted(false);
      video.play();
    });
  }

  return { videoRef, unmuted, playWithSound };
}
