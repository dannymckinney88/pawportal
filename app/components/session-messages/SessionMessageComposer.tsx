"use client";

import { useRef, useState } from "react";

type Props = {
  onSend: (body: string) => Promise<void>;
  /** Human-readable label for the sender, used in aria context */
  senderLabel: string;
  /** Unique scope so multiple composers on one page don't share IDs */
  scopeId: string;
};

export function SessionMessageComposer({ onSend, senderLabel, scopeId }: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerId = `msg-composer-${scopeId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      await onSend(body.trim());
      setBody("");
      textareaRef.current?.focus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={`Send a message as ${senderLabel}`}
    >
      {error && (
        <p role="alert" className="mb-2 text-xs text-danger">
          {error}
        </p>
      )}

      {/* Visually hidden label — placeholder + section heading provide visible context */}
      <label htmlFor={composerId} className="sr-only">
        Your message
      </label>

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          id={composerId}
          name="message-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          placeholder="Ask a question…"
          rows={2}
          aria-required="true"
          className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-hint focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!body.trim() || sending}
          aria-label={sending ? "Sending message…" : "Send message"}
          className="shrink-0 min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        >
          {sending ? "…" : "Send"}
        </button>
      </div>
    </form>
  );
}
