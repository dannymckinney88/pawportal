import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const supabase = await createClient();

  const now = new Date().toISOString();

  const { data: session, error: fetchError } = await supabase
    .from("sessions")
    .select("id, first_viewed_at, view_count")
    .eq("token", token)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const nextViewCount = (session.view_count ?? 0) + 1;

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      first_viewed_at: session.first_viewed_at ?? now,
      last_viewed_at: now,
      view_count: nextViewCount,
    })
    .eq("id", session.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
