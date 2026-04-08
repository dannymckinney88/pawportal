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
        className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex flex-col gap-2"
      >
        <p
          id={`delete-confirm-${sessionId}`}
          className="text-sm font-semibold text-gray-900"
        >
          Delete Session {sessionNumber}?
        </p>
        <p className="text-xs text-gray-500">
          This cannot be undone. The client&apos;s recap link will stop working.
        </p>
        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-50 min-h-11"
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="flex-1 bg-white border border-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 min-h-11"
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
        className="flex-1 text-center bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 min-h-11 flex items-center justify-center"
      >
        Edit
      </a>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex-1 text-center bg-white border border-red-200 text-red-500 rounded-lg py-2 text-sm font-medium hover:bg-red-50 min-h-11"
      >
        Delete
      </button>
    </div>
  );
}
