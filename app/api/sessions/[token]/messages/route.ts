import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id")
    .eq("token", token)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  const senderType = body?.sender_type;
  const messageBody = body?.body;

  if (
    (senderType !== "trainer" && senderType !== "client") ||
    typeof messageBody !== "string" ||
    !messageBody.trim()
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: message, error: insertError } = await supabase
    .from("session_messages")
    .insert({
      session_id: session.id,
      sender_type: senderType,
      body: messageBody.trim(),
    })
    .select("id, session_id, sender_type, body, created_at, read_at")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await supabase
    .from("sessions")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", session.id);

  return NextResponse.json({ message }, { status: 201 });
}
