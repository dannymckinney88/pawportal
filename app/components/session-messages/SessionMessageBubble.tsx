import type { SessionMessage } from "@/lib/session-messages/types";

type Props = {
  message: SessionMessage;
  /** True when the current viewer is the trainer */
  isTrainer: boolean;
};

function formatShortTime(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return timePart;

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${datePart} · ${timePart}`;
}

export function SessionMessageBubble({ message, isTrainer }: Props) {
  const isOwn =
    (isTrainer && message.sender_type === "trainer") ||
    (!isTrainer && message.sender_type === "client");

  const senderLabel = message.sender_type === "trainer" ? "Trainer" : "Client";
  const displayTime = formatShortTime(message.created_at);
  const fullTimestamp = new Date(message.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isOwn
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-secondary text-secondary-foreground"
        }`}
      >
        {message.body}
      </div>
      <p
        className="px-1 text-[11px] text-hint"
        aria-label={`${senderLabel}, sent ${fullTimestamp}`}
      >
        <time dateTime={message.created_at} aria-hidden="true">
          {displayTime}
        </time>
      </p>
    </div>
  );
}
