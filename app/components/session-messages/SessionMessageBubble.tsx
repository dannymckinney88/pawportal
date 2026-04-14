import type { SessionMessage } from "@/lib/session-messages/types";

type Props = {
  message: SessionMessage;
  /** True when the current viewer is the trainer */
  isTrainer: boolean;
  /** sender_type of the previous message — used to group consecutive messages */
  prevSenderType?: string;
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

export function SessionMessageBubble({ message, isTrainer, prevSenderType }: Props) {
  // Alignment: the current viewer's messages sit on the right
  const isOwn =
    (isTrainer && message.sender_type === "trainer") ||
    (!isTrainer && message.sender_type === "client");

  // Label is always based on who actually sent the message, not the viewer
  const senderLabel =
    message.sender_type === "trainer" ? "Trainer" : isTrainer ? "Client" : "You";

  // Color is based on sender identity: trainer = green, client = muted
  const isTrainerMessage = message.sender_type === "trainer";

  // Group consecutive messages from the same sender — hide label and reduce spacing
  const isGrouped = prevSenderType === message.sender_type;

  const displayTime = formatShortTime(message.created_at);

  return (
    <div
      className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"} ${isGrouped ? "mt-1" : "mt-2.5"}`}
    >
      {!isGrouped && (
        <span aria-hidden="true" className="text-muted-foreground px-1 text-[11px] font-medium">
          {senderLabel}
        </span>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-snug ${
          isOwn ? "rounded-br-sm" : "rounded-bl-sm"
        } ${isTrainerMessage ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
      >
        {message.body}
      </div>

      <p className="text-muted-foreground px-1 text-[11px]">
        <span className="sr-only">{senderLabel}, sent </span>
        <time dateTime={message.created_at}>{displayTime}</time>
      </p>
    </div>
  );
}
