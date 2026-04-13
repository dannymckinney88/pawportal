"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SessionMessage, SenderType } from "@/lib/session-messages/types";
import { SessionMessageBubble } from "./SessionMessageBubble";
import { SessionMessageComposer } from "./SessionMessageComposer";

const PREVIEW_COUNT = 2;

type Props = {
  sessionId: string;
  sessionToken: string;
  senderType: SenderType;
};

export function SessionMessageThread({
  sessionId,
  sessionToken,
  senderType,
}: Props) {
  const isTrainer = senderType === "trainer";

  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  // Trainer starts collapsed; client always shows full thread
  const [expanded, setExpanded] = useState(!isTrainer);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("session_messages")
      .select("id, session_id, sender_type, body, created_at, read_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    setMessages((data as SessionMessage[] | null) ?? []);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Scroll the container to the bottom on load, after send, and when expanding
  useEffect(() => {
    if (loading) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [loading, messages.length, expanded]);

  const handleSend = async (body: string) => {
    const res = await fetch(`/api/sessions/${sessionToken}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_type: senderType, body }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(
        data?.error ?? "Failed to send message. Please try again.",
      );
    }

    const { message } = await res.json();
    setMessages((prev) => [...prev, message as SessionMessage]);
  };

  const headingId = `thread-heading-${sessionId}`;
  const listId = `thread-list-${sessionId}`;
  const senderLabel = isTrainer ? "trainer" : "client";

  const hasOverflow = isTrainer && messages.length > PREVIEW_COUNT;
  const visibleMessages =
    isTrainer && !expanded ? messages.slice(-PREVIEW_COUNT) : messages;
  const hiddenCount = messages.length - PREVIEW_COUNT;

  return (
    <section aria-labelledby={headingId}>
      {isTrainer ? (
        <p
          id={headingId}
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-hint"
        >
          Questions &amp; follow-up
        </p>
      ) : (
        <div className="mb-3">
          <h2 id={headingId} className="text-xl font-bold text-foreground">
            Questions &amp; follow-up
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Have a question about today&apos;s lesson or homework? Ask your
            trainer here.
          </p>
        </div>
      )}

      <div
        className={`overflow-hidden rounded-2xl border border-border ${
          isTrainer ? "bg-background" : "bg-card shadow-sm"
        }`}
      >
        {/* Message list */}
        <div
          ref={listRef}
          id={listId}
          role="log"
          aria-label="Message thread"
          aria-live="polite"
          aria-relevant="additions"
          className={`overflow-y-auto px-4 pt-3 pb-2 ${
            isTrainer ? "max-h-44" : "max-h-64"
          }`}
        >
          {loading ? (
            <p className="py-3 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : messages.length === 0 ? (
            <p
              className={`text-center text-sm text-muted-foreground ${
                isTrainer ? "py-3" : "py-5"
              }`}
            >
              {isTrainer
                ? "No messages yet."
                : "No messages yet \u2014 ask a question below."}
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Expand / collapse toggle for trainer */}
              {isTrainer && hasOverflow && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-controls={listId}
                  className="w-full py-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {expanded
                    ? "Show fewer messages"
                    : `↑ ${hiddenCount} earlier message${hiddenCount !== 1 ? "s" : ""}`}
                </button>
              )}

              {visibleMessages.map((msg) => (
                <SessionMessageBubble
                  key={msg.id}
                  message={msg}
                  isTrainer={isTrainer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" aria-hidden="true" />

        {/* Composer — always visible so trainer can reply without expanding */}
        <div className="p-3">
          <SessionMessageComposer
            onSend={handleSend}
            senderLabel={senderLabel}
            scopeId={sessionId}
          />
        </div>
      </div>
    </section>
  );
}
