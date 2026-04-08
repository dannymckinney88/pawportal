import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SessionActions } from "./components/SessionActions";
import { CopyLinkButton } from "./components/CopyLinkButton";
import { UpdateDogImage } from "./components/UpdateDogImage";
import Image from "next/image";

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
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <a
          href="/dashboard"
          className="text-hint hover:text-muted-foreground text-sm"
        >
          ← Back
        </a>

        {/* Client Header */}
        {/* Client Header */}
        <div className="bg-card rounded-2xl p-6 shadow-sm mt-4 flex items-center gap-5">
          <div className="flex flex-col items-center gap-3 shrink-0">
            {client.dog_photo_url ? (
              <Image
                src={client.dog_photo_url}
                alt={client.dog_name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-3xl">
                🐾
              </div>
            )}

            <UpdateDogImage clientId={client.id} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {client.dog_name}
            </h1>
            <p className="text-muted-foreground">{client.owner_name}</p>

            {client.phone && (
              <p className="text-hint text-sm mt-1">{client.phone}</p>
            )}
          </div>
        </div>

        {/* New Session Button */}
        <div className="mt-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Sessions</h2>

          <a
            href={`/sessions/new?clientId=${client.id}`}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover"
          >
            + New Session
          </a>
        </div>

        {/* Session List */}
        <div className="mt-4 flex flex-col gap-3">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-card rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">
                      Session {session.session_number}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
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
                  {session.sent_at && (
                    <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                      Sent
                    </span>
                  )}
                </div>
                {session.summary && (
                  <p className="text-text text-sm mt-3 line-clamp-2">
                    {session.summary}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={`/s/${session.token}`}
                    target="_blank"
                    className="text-primary text-sm hover:underline"
                  >
                    View client page →
                  </a>
                  <CopyLinkButton sessionToken={session.token} />
                </div>
                <SessionActions
                  sessionId={session.id}
                  sessionNumber={session.session_number}
                  clientId={id}
                />
              </div>
            ))
          ) : (
            <div className="bg-card rounded-2xl p-10 text-center shadow-sm">
              <p className="text-hint text-sm">No sessions yet</p>

              <a
                href={`/sessions/new?clientId=${client.id}`}
                className="mt-3 inline-block text-primary text-sm hover:underline"
              >
                Create first session
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
