"use client";

import { useEffect } from "react";

/**
 * Restores focus to the client card that was last navigated from.
 *
 * When a user opens a client detail page and then returns to the dashboard,
 * this component reads the stored client ID from sessionStorage, focuses the
 * matching card element, and then clears the stored value so subsequent visits
 * do not restore focus unexpectedly.
 *
 * Rendered as a null node — no visible output.
 */
export const DashboardFocusRestorer = () => {
  useEffect(() => {
    try {
      const clientId = sessionStorage.getItem("lastOpenedClientId");
      if (!clientId) return;
      sessionStorage.removeItem("lastOpenedClientId");
      const el = document.getElementById(`client-card-${clientId}`);
      el?.focus();
    } catch {
      // sessionStorage unavailable — skip silently
    }
  }, []);

  return null;
};
