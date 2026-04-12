"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const ArchiveClientButton = ({ clientId }: { clientId: string }) => {
  const supabase = createClient();
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // Move focus into the confirmation dialog when it appears; restore on cancel
  useEffect(() => {
    if (confirming) {
      const firstBtn = confirmRef.current?.querySelector<HTMLElement>("button");
      firstBtn?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [confirming]);

  const handleArchive = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("clients")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", clientId);

    if (!error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      console.error("[ArchiveClient] failed", error);
      setLoading(false);
    }
  };

  if (!confirming) {
    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-danger hover:underline"
      >
        Archive client
      </button>
    );
  }

  return (
    <div
      ref={confirmRef}
      role="alertdialog"
      aria-labelledby="archive-confirm-title"
      aria-describedby="archive-confirm-desc"
      className="mt-4 rounded-xl border border-warning-border bg-warning-subtle p-4"
    >
      <p id="archive-confirm-title" className="text-sm font-medium text-foreground">
        Archive this client?
      </p>
      <p id="archive-confirm-desc" className="mt-1 text-xs text-muted-foreground">
        This removes them from your dashboard but keeps all session history.
      </p>

      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={handleArchive}
          disabled={loading}
          className="flex-1 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 min-h-11"
        >
          {loading ? "Archiving..." : "Yes, archive"}
        </button>

        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-50 min-h-11"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
