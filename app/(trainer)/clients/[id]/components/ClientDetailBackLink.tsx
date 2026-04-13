"use client";

import { setFocusIntent } from "@/lib/focus-intent";

type Props = { clientId: string };

/**
 * Back link from client detail → dashboard.
 * Sets an explicit focus intent so LandingFocus on the dashboard can restore
 * focus to the exact client card the user came from.
 */
export function ClientDetailBackLink({ clientId }: Props) {
  return (
    <a
      href="/dashboard"
      onClick={(e) => {
        setFocusIntent(
          e.currentTarget.matches(":focus-visible")
            ? { targetId: `client-card-${clientId}`, fallbackId: "dashboard-heading", visible: true }
            : { targetId: "main-content", visible: false }
        );
      }}
      className="text-hint hover:text-muted-foreground focus-visible:ring-primary/50 inline-block rounded py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span aria-hidden="true">← </span>
      Back
    </a>
  );
}
