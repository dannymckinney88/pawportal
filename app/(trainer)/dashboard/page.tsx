import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { ClientRow, SessionRow } from "./types";
import { buildClientsWithEngagement } from "./utils";
import { ClientSection } from "./components/ClientSection";
import { DashboardHeader } from "./components/DashboardHeader";
import { EmptyClientsState } from "./components/EmptyClientsState";

/**
 * Dashboard page
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, dog_name, owner_name, dog_photo_url, created_at")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  const clientRows = (clients as ClientRow[] | null) ?? [];

  if (clientRows.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <DashboardHeader />
          <EmptyClientsState />
        </div>
      </div>
    );
  }

  const clientIds = clientRows.map((client) => client.id);

  const { data: sessions } = await supabase
    .from("sessions")
    .select(
      `
      id,
      client_id,
      token,
      session_number,
      created_at,
      first_viewed_at,
      last_viewed_at,
      homework_items (
        id,
        is_checked
      )
    `,
    )
    .in("client_id", clientIds)
    .order("created_at", { ascending: false });

  const sessionRows = (sessions as SessionRow[] | null) ?? [];

  const clientsWithEngagement = buildClientsWithEngagement(
    clientRows,
    sessionRows,
  );

  const followUpClients = clientsWithEngagement.filter(
    (client) => client.needsFollowUp,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DashboardHeader />

        <ClientSection
          title="Needs follow-up"
          description="Clients who may need a quick check-in"
          clients={followUpClients}
        />

        <ClientSection title="All clients" clients={clientsWithEngagement} />
      </div>
    </div>
  );
}
