export type SenderType = "trainer" | "client";

export type SessionMessage = {
  id: string;
  session_id: string;
  sender_type: SenderType;
  body: string;
  created_at: string;
  read_at: string | null;
};

export type NewMessagePayload = {
  session_id: string;
  sender_type: SenderType;
  body: string;
};
