"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export const ArchiveClientButton = ({ clientId }: { clientId: string }) => {
  const supabase = createClient();
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // Move focus into the confirmation dialog when it opens.
  // Focus is restored to the trigger explicitly in the Cancel handler,
  // not in this effect, to avoid mount-time focus stealing.
  useEffect(() => {
    if (confirming) {
      const firstBtn = confirmRef.current?.querySelector<HTMLElement>("button");
      firstBtn?.focus();
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
        className="text-danger text-sm hover:underline"
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
      className="border-warning-border bg-warning-subtle mt-4 rounded-xl border p-4"
    >
      <p id="archive-confirm-title" className="text-foreground text-sm font-medium">
        Archive this client?
      </p>
      <p id="archive-confirm-desc" className="text-muted-foreground mt-1 text-xs">
        This removes them from your dashboard but keeps all session history.
      </p>

      <div className="mt-3 flex gap-3">
        <Button
          type="button"
          variant="danger"
          onClick={handleArchive}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Archiving..." : "Yes, archive"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setConfirming(false);
            triggerRef.current?.focus();
          }}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
