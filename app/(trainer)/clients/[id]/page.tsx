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
import { ClientPageHeading } from "./components/ClientPageHeading";
import { ClientDetailBackLink } from "./components/ClientDetailBackLink";
import { NewSessionLink } from "./components/NewSessionLink";
import { LandingFocus } from "@/app/components/LandingFocus";
import { SessionMessageThread } from "@/app/components/session-messages/SessionMessageThread";
import type { ClientSessionRow } from "./types";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();

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
    `
    )
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const sessionsWithMeta = enrichSessionsWithMeta((sessions as ClientSessionRow[] | null) ?? []);

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    return phone;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <LandingFocus />
        <ClientDetailBackLink clientId={id} />

        <div className="bg-card mt-4 flex items-center gap-5 rounded-2xl p-6 shadow-sm">
          <div className="flex shrink-0 flex-col items-center gap-3">
            {client.dog_photo_url ? (
              <Image
                src={client.dog_photo_url}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
                priority
              />
            ) : (
              <div
                aria-hidden="true"
                className="bg-accent flex h-20 w-20 items-center justify-center rounded-full text-3xl"
              >
                🐾
              </div>
            )}

            <UpdateDogImage clientId={client.id} dogName={client.dog_name} />
          </div>

          <div>
            <ClientPageHeading
              id="client-heading"
              tabIndex={-1}
              className="text-foreground text-2xl font-bold focus:outline-none"
            >
              {client.dog_name}
            </ClientPageHeading>

            <p className="text-muted-foreground mt-0.5 text-sm">{client.owner_name}</p>

            {client.phone && (
              <p className="text-hint mt-1 text-sm">{formatPhoneNumber(client.phone)}</p>
            )}
          </div>
        </div>

        <div className="border-border mt-8 flex items-center justify-between border-b pb-3">
          <h2 className="text-foreground text-lg font-semibold">Sessions</h2>

          <NewSessionLink
            clientId={client.id}
            aria-label={`New session for ${client.dog_name}`}
            className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary/20 flex min-h-11 items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            <span aria-hidden="true">+</span>
            <span aria-hidden="true">New Session</span>
          </NewSessionLink>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {sessionsWithMeta.length > 0 ? (
            sessionsWithMeta.map((session) => (
              <div key={session.id} className="bg-card rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-foreground text-base font-semibold">
                      Session {session.session_number}
                    </p>

                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {new Date(session.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <SessionStatusBadge status={session.status} />
                </div>

                {session.summary && (
                  <p className="text-text mt-3 line-clamp-2 text-sm">{session.summary}</p>
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
                    aria-label={`View client recap page for Session ${session.session_number} (opens in a new tab)`}
                    className="text-primary/80 hover:text-primary text-sm hover:underline"
                  >
                    View client page <span aria-hidden="true"> →</span>
                  </a>

                  <CopyLinkButton
                    sessionToken={session.token}
                    sessionNumber={session.session_number}
                  />
                </div>

                <div className="border-border mt-4 border-t pt-4">
                  <SessionActions
                    sessionId={session.id}
                    sessionNumber={session.session_number}
                    clientId={id}
                  />
                </div>

                <div className="border-border pt-4">
                  <SessionMessageThread
                    sessionId={session.id}
                    sessionToken={session.token}
                    senderType="trainer"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-2xl px-8 py-14 text-center shadow-sm">
              <p className="text-muted-foreground mb-4 text-sm">No sessions yet</p>

              <NewSessionLink
                clientId={client.id}
                aria-label={`Create first session for ${client.dog_name}`}
                className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary/20 inline-flex min-h-11 items-center rounded-lg px-6 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
              >
                <span aria-hidden="true">Create first session</span>
              </NewSessionLink>
            </div>
          )}
        </div>

        <div className="border-danger-border bg-card mt-8 rounded-2xl border p-5 shadow-sm">
          <p className="text-foreground text-sm font-medium">Client settings</p>
          <p id="archive-client-desc" className="text-muted-foreground mt-1 text-sm">
            Archive this client to remove them from your active dashboard while keeping session
            history.
          </p>

          <div className="mt-4">
            <ArchiveClientButton clientId={client.id} describedBy="archive-client-desc" />
          </div>
        </div>
      </div>
    </div>
  );
}
