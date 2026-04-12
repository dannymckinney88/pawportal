import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { enrichSessionsWithMeta } from "./utils";

import { CopyLinkButton } from "./components/CopyLinkButton";
import { SessionActions } from "./components/SessionActions";
import { SessionProgressMeta } from "./components/SessionProgressMeta";
import { SessionStatusBadge } from "./components/SessionStatusBadge";
import { UpdateDogImage } from "./components/UpdateDogImage";
import { ArchiveClientButton } from "./components/ArchiveClientButton";
import type { ClientSessionRow } from "./types";

export default async function ClientPage({
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

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) redirect("/dashboard");

  const { data: sessions } = await supabase
    .from("sessions")
    .select(
      `
      id,
      token,
      summary,
      session_number,
      created_at,
      sent_at,
      first_viewed_at,
      last_viewed_at,
      view_count,
      homework_items (
        id,
        is_checked
      )
    `,
    )
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const sessionsWithMeta = enrichSessionsWithMeta(
    (sessions as ClientSessionRow[] | null) ?? [],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <a
          href="/dashboard"
          className="inline-block py-1 text-sm text-hint hover:text-muted-foreground"
        >
          ← Back
        </a>

        <div className="mt-4 flex items-center gap-5 rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex shrink-0 flex-col items-center gap-3">
            {client.dog_photo_url ? (
              <Image
                src={client.dog_photo_url}
                alt={client.dog_name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-3xl">
                🐾
              </div>
            )}

            <UpdateDogImage clientId={client.id} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {client.dog_name}
            </h1>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {client.owner_name}
            </p>

            {client.phone && (
              <p className="mt-1 text-sm text-hint">{client.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-semibold text-foreground">Sessions</h2>

          <a
            href={`/sessions/new?clientId=${client.id}`}
            className="flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            + New Session
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {sessionsWithMeta.length > 0 ? (
            sessionsWithMeta.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      Session {session.session_number}
                    </p>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <SessionStatusBadge status={session.status} />
                </div>

                {session.summary && (
                  <p className="mt-3 line-clamp-2 text-sm text-text">
                    {session.summary}
                  </p>
                )}

                <SessionProgressMeta
                  homeworkCompleted={session.homeworkCompleted}
                  homeworkTotal={session.homeworkTotal}
                  firstViewedAt={session.first_viewed_at}
                  lastViewedAt={session.last_viewed_at}
                />

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`/s/${session.token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View client page →
                  </a>

                  <CopyLinkButton sessionToken={session.token} />
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <SessionActions
                    sessionId={session.id}
                    sessionNumber={session.session_number}
                    clientId={id}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-card px-8 py-14 text-center shadow-sm">
              <p className="mb-4 text-sm text-muted-foreground">
                No sessions yet
              </p>

              <a
                href={`/sessions/new?clientId=${client.id}`}
                className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
              >
                Create first session
              </a>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-danger-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-foreground">Client settings</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Archive this client to remove them from your active dashboard while
            keeping session history.
          </p>

          <div className="mt-4">
            <ArchiveClientButton clientId={client.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
