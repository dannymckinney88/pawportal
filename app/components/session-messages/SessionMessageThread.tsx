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

export function SessionMessageThread({ sessionId, sessionToken, senderType }: Props) {
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
  }, [sessionId]);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("session_messages")
        .select("id, session_id, sender_type, body, created_at, read_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      setMessages((data as SessionMessage[] | null) ?? []);
      setLoading(false);
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

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
      throw new Error(data?.error ?? "Failed to send message. Please try again.");
    }

    const { message } = await res.json();
    setMessages((prev) => [...prev, message as SessionMessage]);
    await fetchMessages();
  };

  const headingId = `thread-heading-${sessionId}`;
  const listId = `thread-list-${sessionId}`;
  const senderLabel = isTrainer ? "trainer" : "client";

  const hasOverflow = isTrainer && messages.length > PREVIEW_COUNT;
  const visibleMessages = isTrainer && !expanded ? messages.slice(-PREVIEW_COUNT) : messages;
  const hiddenCount = messages.length - PREVIEW_COUNT;

  return (
    <section aria-labelledby={headingId}>
      {isTrainer ? (
        <p
          id={headingId}
          className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase"
        >
          Questions &amp; follow-up
        </p>
      ) : (
        <div className="mb-3">
          <h2 id={headingId} className="text-foreground text-xl font-bold">
            Questions &amp; follow-up
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Have a question about today&apos;s lesson or homework? Ask your trainer here.
          </p>
        </div>
      )}

      <div
        className={`border-border overflow-hidden rounded-2xl border ${
          isTrainer ? "bg-card" : "bg-card shadow-sm"
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
          tabIndex={0}
          className={`focus-visible:ring-primary/20 overflow-y-auto px-4 pt-3 pb-2 focus-visible:ring-2 focus-visible:outline-none ${isTrainer ? "max-h-72" : "min-h-36 max-h-80 sm:max-h-96"}`}
        >
          {loading ? (
            <p className="text-muted-foreground py-4 text-center text-sm">Loading…</p>
          ) : messages.length === 0 ? (
            <p
              className={`text-muted-foreground text-center text-sm ${isTrainer ? "py-4" : "py-6"}`}
            >
              {isTrainer
                ? "No messages from this client yet."
                : "No messages yet — ask a question below."}
            </p>
          ) : (
            <div className="flex flex-col pb-1">
              {isTrainer && hasOverflow && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-controls={listId}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-primary/20 mb-1 w-full rounded py-1 text-xs font-medium transition hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {expanded
                    ? "Show fewer messages"
                    : `↑ ${hiddenCount} earlier message${hiddenCount !== 1 ? "s" : ""}`}
                </button>
              )}

              {visibleMessages.map((msg, i) => (
                <SessionMessageBubble
                  key={msg.id}
                  message={msg}
                  isTrainer={isTrainer}
                  prevSenderType={i > 0 ? visibleMessages[i - 1].sender_type : undefined}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-border border-t" aria-hidden="true" />

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
