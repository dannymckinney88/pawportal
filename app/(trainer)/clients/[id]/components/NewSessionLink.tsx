"use client";

import { setFocusIntent } from "@/lib/focus-intent";
import type { ReactNode } from "react";

type Props = {
  clientId: string;
  className?: string;
  children: ReactNode;
};

/** Navigates to the new session form and sets a focus intent for the heading. */
export function NewSessionLink({ clientId, className, children }: Props) {
  return (
    <a
      href={`/sessions/new?clientId=${clientId}`}
      className={className}
      onClick={(e) => {
        setFocusIntent(
          e.currentTarget.matches(":focus-visible")
            ? { targetId: "new-session-heading", visible: true }
            : { targetId: "main-content", visible: false }
        );
      }}
    >
      {children}
    </a>
  );
}
