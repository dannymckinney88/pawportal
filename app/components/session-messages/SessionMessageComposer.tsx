"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
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
    <form onSubmit={handleSubmit} aria-label={`Send a message as ${senderLabel}`}>
      {error && (
        <p role="alert" className="text-danger mb-2 text-xs">
          {error}
        </p>
      )}

      {/* Visually hidden label — placeholder + section heading provide visible context */}
      <label htmlFor={composerId} className="sr-only">
        Your message
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
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
          className="border-border bg-background text-foreground placeholder:text-hint hover:border-primary/50 focus-visible:ring-primary w-full flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 disabled:opacity-50"
        />

        <Button
          type="submit"
          disabled={!body.trim() || sending}
          aria-label={sending ? "Sending message…" : "Send message"}
          className="w-full rounded-xl sm:w-auto sm:shrink-0"
        >
          {sending ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
