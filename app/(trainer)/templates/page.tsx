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
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <TemplatesClient initialTemplates={templates ?? []} trainerId={user.id} />
      </div>
    </div>
  );
}
