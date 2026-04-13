"use client";

import { useEffect } from "react";
import { peekFocusIntent, clearFocusIntent } from "@/lib/focus-intent";

type Props = {
  /**
   * Fallback target id to focus silently when no sessionStorage intent exists.
   * Use this on pages that are typically entered without an in-app keyboard
   * navigation (e.g. direct URL access) to anchor focus to the page heading.
   */
  defaultTargetId?: string;
};

export function LandingFocus({ defaultTargetId }: Props = {}) {
  useEffect(() => {
    const intent = peekFocusIntent();

    const targetId = intent?.targetId ?? defaultTargetId;
    if (!targetId) return;

    const fallbackId = intent?.fallbackId;
    const visible = intent?.visible ?? false;

    let attempt = 0;
    let cancelled = false;
    let rafId: number;

    const tryFocus = () => {
      if (cancelled) return;

      const targetEl = document.getElementById(targetId);
      const fallbackEl = fallbackId ? document.getElementById(fallbackId) : null;
      const el = targetEl ?? fallbackEl;

      if (el instanceof HTMLElement) {
        if (visible) {
          el.dataset.landingFocus = "";
          el.addEventListener("blur", () => delete el.dataset.landingFocus, { once: true });
        }

        el.focus();

        if (document.activeElement === el) {
          clearFocusIntent();
          return;
        }
      }

      attempt++;
      if (attempt < 5) {
        rafId = requestAnimationFrame(tryFocus);
      } else {
        clearFocusIntent();
      }
    };

    rafId = requestAnimationFrame(tryFocus);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [defaultTargetId]);

  return null;
}
