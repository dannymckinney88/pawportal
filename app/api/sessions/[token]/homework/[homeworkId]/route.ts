import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    token: string;
    homeworkId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { token, homeworkId } = await context.params;
  const supabase = await createClient();

  const body = (await request.json()) as {
    isChecked?: boolean;
  };

  if (typeof body.isChecked !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id")
    .eq("token", token)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: homeworkItem, error: homeworkError } = await supabase
    .from("homework_items")
    .select("id, session_id")
    .eq("id", homeworkId)
    .single();

  if (homeworkError || !homeworkItem) {
    return NextResponse.json({ error: "Homework item not found" }, { status: 404 });
  }

  if (homeworkItem.session_id !== session.id) {
    return NextResponse.json(
      { error: "Homework item does not belong to session" },
      { status: 403 }
    );
  }

  const payload = {
    is_checked: body.isChecked,
    checked_at: body.isChecked ? new Date().toISOString() : null,
  };

  const { data: updatedItem, error: updateError } = await supabase
    .from("homework_items")
    .update(payload)
    .eq("id", homeworkId)
    .select("id, is_checked, checked_at")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    item: updatedItem,
  });
}
