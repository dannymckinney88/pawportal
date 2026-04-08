import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">PawPortal</h1>
            <p className="text-muted-foreground text-sm">Your clients</p>
          </div>

          <a
            href="/clients/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover"
          >
            + Add Client
          </a>
        </div>

        {/* Client List */}
        {clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clients.map((client) => (
              <a
                key={client.id}
                href={`/clients/${client.id}`}
                className="bg-card rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {client.dog_photo_url ? (
                  <Image
                    src={client.dog_photo_url}
                    alt={client.dog_name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-2xl">
                    🐾
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {client.dog_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {client.owner_name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">🐾</p>
            <p className="text-muted-foreground text-sm">No clients yet</p>

            <a
              href="/clients/new"
              className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover"
            >
              Add your first client
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
