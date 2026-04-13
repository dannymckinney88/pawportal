"use client";

import { useEffect } from "react";

/**
 * Diagnostic focus helper.
 * Focuses the page h1 on mount so that screen readers begin reading
 * from the top of the content rather than wherever the browser lands.
 * The h1 must have tabIndex={-1} to accept programmatic focus.
 */
export function FocusPageHeading() {
  useEffect(() => {
    const heading = document.getElementById("page-heading");
    heading?.focus({ preventScroll: true });
  }, []);

  return null;
}
