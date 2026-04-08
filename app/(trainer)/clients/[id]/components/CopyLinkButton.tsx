"use client";

import { useState, useEffect } from "react";

export function CopyLinkButton({ sessionToken }: { sessionToken: string }) {
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
    <button
      type="button"
      onClick={handleCopy}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg border min-h-[44px] transition-colors ${
        state === "copied"
          ? "border-green-200 text-green-600 bg-green-50"
          : state === "failed"
            ? "border-red-200 text-red-500"
            : "border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {state === "copied" ? "Copied! ✓" : state === "failed" ? "Failed" : "Copy link"}
    </button>
  );
}
