"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId);

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
        role="alertdialog"
        aria-labelledby={`delete-confirm-${sessionId}`}
        className="mt-3 bg-danger-subtle border border-danger-border rounded-xl p-3 flex flex-col gap-2"
      >
        <p
          id={`delete-confirm-${sessionId}`}
          className="text-sm font-semibold text-foreground"
        >
          Delete Session {sessionNumber}?
        </p>
        <p className="text-xs text-muted-foreground">
          This cannot be undone. The client&apos;s recap link will stop working.
        </p>
        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-danger text-danger-foreground rounded-lg py-2 text-sm font-medium hover:bg-danger-hover disabled:opacity-50 min-h-11"
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="flex-1 bg-card border border-border text-secondary-foreground rounded-lg py-2 text-sm font-medium hover:bg-background disabled:opacity-50 min-h-11"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <a
        href={`/sessions/${sessionId}/edit`}
        className="flex-1 text-center bg-secondary text-secondary-foreground rounded-lg py-2 text-sm font-medium hover:bg-secondary-hover min-h-11 flex items-center justify-center"
      >
        Edit
      </a>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex-1 text-center bg-card border border-danger-border text-danger rounded-lg py-2 text-sm font-medium hover:bg-danger-subtle min-h-11"
      >
        Delete
      </button>
    </div>
  );
}
