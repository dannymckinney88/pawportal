"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({
  sessionToken,
  sessionNumber,
}: {
  sessionToken: string;
  sessionNumber: number;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleCopy = async () => {
    const url = window.location.origin + "/s/" + sessionToken;
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={handleCopy}
        aria-label={
          state === "copied"
            ? `Recap link copied for Session ${sessionNumber}`
            : `Copy recap link for Session ${sessionNumber}`
        }
        className={
          state === "copied"
            ? "border-success-foreground/30 bg-success text-success-foreground hover:bg-success"
            : state === "failed"
              ? "border-danger-border text-danger hover:bg-background"
              : ""
        }
      >
        {state === "copied" ? "Copied! ✓" : state === "failed" ? "Failed" : "Copy link"}
      </Button>
      {/* Polite live region announces copy result to screen readers */}
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Link copied to clipboard"
          : state === "failed"
            ? "Copy failed. Try again."
            : ""}
      </span>
    </>
  );
}
