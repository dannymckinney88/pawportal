import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PawPortal</h1>
            <p className="text-gray-500 text-sm">Your clients</p>
          </div>

          <a
            href="/clients/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
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
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {client.dog_photo_url ? (
                  <img
                    src={client.dog_photo_url}
                    alt={client.dog_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                    🐾
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {client.dog_name}
                  </p>
                  <p className="text-sm text-gray-500">{client.owner_name}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">🐾</p>
            <p className="text-gray-500 text-sm">No clients yet</p>

            <a
              href="/clients/new"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Add your first client
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
