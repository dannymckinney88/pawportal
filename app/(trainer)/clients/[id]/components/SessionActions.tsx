"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SessionActions({
  sessionId,
  sessionNumber,
  clientId,
}: {
  sessionId: string;
  sessionNumber: number;
  clientId: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // Move focus into confirm dialog when it appears; restore to Delete button on cancel
  useEffect(() => {
    if (confirming) {
      const firstBtn = confirmRef.current?.querySelector<HTMLElement>("button");
      firstBtn?.focus();
    } else {
      deleteButtonRef.current?.focus();
    }
  }, [confirming]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    const supabase = createClient();

    const { error: deleteError } = await supabase.from("sessions").delete().eq("id", sessionId);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      setConfirming(false);
      return;
    }

    router.refresh();
  };

  if (confirming) {
    return (
      <div
        ref={confirmRef}
        role="alertdialog"
        aria-labelledby={`delete-confirm-${sessionId}`}
        aria-describedby={`delete-desc-${sessionId}`}
        className="bg-danger-subtle border-danger-border mt-3 flex flex-col gap-2 rounded-xl border p-3"
      >
        <p id={`delete-confirm-${sessionId}`} className="text-foreground text-sm font-semibold">
          Delete Session {sessionNumber}?
        </p>
        <p id={`delete-desc-${sessionId}`} className="text-muted-foreground text-xs">
          This cannot be undone. The client&apos;s recap link will stop working.
        </p>
        {error && (
          <p role="alert" className="text-danger text-xs">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1"
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <Link
        href={`/sessions/${sessionId}/edit`}
        aria-label={`Edit Session ${sessionNumber}`}
        className="bg-secondary text-secondary-foreground hover:bg-secondary-hover flex min-h-11 flex-1 items-center justify-center rounded-lg py-2 text-center text-sm font-medium"
      >
        Edit
      </Link>
      <button
        ref={deleteButtonRef}
        type="button"
        aria-label={`Delete Session ${sessionNumber}`}
        onClick={() => setConfirming(true)}
        className="bg-card border-danger-border text-danger hover:bg-danger-subtle min-h-11 flex-1 rounded-lg border py-2 text-center text-sm font-medium"
      >
        Delete
      </button>
    </div>
  );
}
