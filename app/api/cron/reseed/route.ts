/**
 * GET /api/cron/reseed
 *
 * Triggered daily by Vercel Cron. Clears all demo trainer data and reseeds
 * it from scratch so the HeelFlow demo environment stays fresh.
 *
 * Vercel automatically sends the secret as: Authorization: Bearer <CRON_SECRET>
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   CRON_SECRET
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  clientsSeed,
  demoTrainerId,
  homeworkItemsSeed,
  homeworkTemplatesSeed,
  sessionMessagesSeed,
  sessionsSeed,
} from "@/lib/demo/demo-seed-data";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Fetch live session IDs so child deletes reflect actual DB state,
    // not seed file constants that may have changed between deploys.
    const { data: existingSessions, error: fetchError } = await supabase
      .from("sessions")
      .select("id")
      .eq("trainer_id", demoTrainerId);

    if (fetchError) throw fetchError;

    const existingSessionIds = (existingSessions ?? []).map((s: { id: string }) => s.id);

    // Clear existing demo data — child rows first
    if (existingSessionIds.length > 0) {
      const { error: messagesError } = await supabase
        .from("session_messages")
        .delete()
        .in("session_id", existingSessionIds);
      if (messagesError) throw messagesError;

      const { error: homeworkError } = await supabase
        .from("homework_items")
        .delete()
        .in("session_id", existingSessionIds);
      if (homeworkError) throw homeworkError;
    }

    const { error: sessionsError } = await supabase
      .from("sessions")
      .delete()
      .eq("trainer_id", demoTrainerId);
    if (sessionsError) throw sessionsError;

    const { error: templatesError } = await supabase
      .from("homework_templates")
      .delete()
      .eq("trainer_id", demoTrainerId);
    if (templatesError) throw templatesError;

    const { error: clientsError } = await supabase
      .from("clients")
      .delete()
      .eq("trainer_id", demoTrainerId);
    if (clientsError) throw clientsError;

    // Insert fresh demo data — parent rows first
    const { error: insertClientsError } = await supabase.from("clients").insert(clientsSeed);
    if (insertClientsError) throw insertClientsError;

    const { error: insertTemplatesError } = await supabase
      .from("homework_templates")
      .insert(homeworkTemplatesSeed);
    if (insertTemplatesError) throw insertTemplatesError;

    const { error: insertSessionsError } = await supabase.from("sessions").insert(sessionsSeed);
    if (insertSessionsError) throw insertSessionsError;

    const { error: insertHomeworkError } = await supabase
      .from("homework_items")
      .insert(homeworkItemsSeed);
    if (insertHomeworkError) throw insertHomeworkError;

    const { error: insertMessagesError } = await supabase
      .from("session_messages")
      .insert(sessionMessagesSeed);
    if (insertMessagesError) throw insertMessagesError;

    return NextResponse.json({ ok: true, reseeded: new Date().toISOString() });
  } catch (error) {
    console.error("[cron/reseed] failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reseed failed" },
      { status: 500 }
    );
  }
}
