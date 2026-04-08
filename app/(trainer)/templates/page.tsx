import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplatesClient } from "@/components/trainer/TemplatesClient";

export default async function TemplatesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: templates } = await supabase
    .from("homework_templates")
    .select("id, title, description, steps, link_url, dog_note")
    .eq("trainer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TemplatesClient
          initialTemplates={templates ?? []}
          trainerId={user.id}
        />
      </div>
    </div>
  );
}
