import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditSessionForm } from "./EditSessionForm";

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("sessions")
    .select("id, summary, session_number, client_id")
    .eq("id", id)
    .eq("trainer_id", user.id)
    .single();

  if (!session) notFound();

  const [clientRes, hwRes] = await Promise.all([
    supabase
      .from("clients")
      .select("dog_name, owner_name")
      .eq("id", session.client_id)
      .single(),

    supabase
      .from("homework_items")
      .select("id, title, description, link_url, dog_note, steps")
      .eq("session_id", id),
  ]);

  if (!clientRes.data) notFound();

  return (
    <EditSessionForm
      session={{
        id: session.id,
        summary: session.summary ?? "",
        session_number: session.session_number,
        client_id: session.client_id,
      }}
      dog={{
        dog_name: clientRes.data.dog_name,
        owner_name: clientRes.data.owner_name,
      }}
      initialItems={hwRes.data ?? []}
    />
  );
}
