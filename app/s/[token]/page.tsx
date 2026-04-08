import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HomeworkCard } from "./components/HomeworkCheckbox";
import { PastSessionsAccordion } from "./components/PastSessionsAccordion";
import { ClientHero } from "./components/ClientHero";
import { SessionSummaryCard } from "./components/SessionSummaryCard";
import { ReviewCard } from "./components/ReviewCard";
import { TrainerSocialLinks } from "./components/TrainerSocialLinks";

type Dog = {
  dog_name: string;
  dog_photo_url: string | null;
  owner_name: string;
};

type Trainer = {
  name: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  google_review_url: string | null;
};

type HomeworkItemRow = {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
  is_checked: boolean;
};

type PastSessionRow = {
  id: string;
  session_date: string;
  created_at: string;
  notes: string | null;
  homework_items: { title: string }[];
};

type SessionRow = {
  id: string;
  summary: string | null;
  created_at: string;
  client_id: string;
  trainer_id: string;
};

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, summary, created_at, client_id, trainer_id")
    .eq("token", token)
    .single<SessionRow>();

  if (sessionError || !session) {
    console.error(
      "[SessionPage] session fetch failed:",
      sessionError?.message,
      "token:",
      token,
    );
    return notFound();
  }

  const [clientRes, trainerRes, hwRes, pastRes] = await Promise.all([
    supabase
      .from("clients")
      .select("dog_name, dog_photo_url, owner_name")
      .eq("id", session.client_id)
      .single<Dog>(),

    supabase
      .from("trainers")
      .select("name, instagram_url, tiktok_url, google_review_url")
      .eq("id", session.trainer_id)
      .single<Trainer>(),

    supabase
      .from("homework_items")
      .select("id, title, description, link_url, dog_note, steps, is_checked")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true }),

    supabase
      .from("sessions")
      .select("id, created_at, homework_items(title)")
      .eq("client_id", session.client_id)
      .neq("id", session.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const dog = clientRes.data;
  const trainer = trainerRes.data;

  const homeworkItems = ((hwRes.data as HomeworkItemRow[] | null) ?? []).map(
    (item) => ({ ...item, is_checked: item.is_checked ?? false }),
  );

  const pastSessions = (pastRes.data as PastSessionRow[] | null) ?? [];

  console.log("[SessionPage] homework_items fetch:", {
    error: hwRes.error?.message ?? null,
    count: homeworkItems.length,
    items: homeworkItems,
  });

  if (!dog) return notFound();

  const sessionDate = new Date(session.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-5">
        <ClientHero dogName={dog.dog_name} dogPhotoUrl={dog.dog_photo_url} />

        <SessionSummaryCard
          sessionDate={sessionDate}
          summary={session.summary}
          trainerName={trainer?.name}
        />

        {homeworkItems.length > 0 && (
          <section aria-label="Homework">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Your Homework 📋
            </h2>

            {homeworkItems.map((item) => (
              <HomeworkCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                link_url={item.link_url}
                dog_note={item.dog_note}
                steps={item.steps}
                initialChecked={item.is_checked}
              />
            ))}
          </section>
        )}

        {pastSessions.length > 0 && (
          <PastSessionsAccordion sessions={pastSessions} />
        )}

        <footer className="mt-3 pb-8 flex flex-col gap-4">
          <ReviewCard googleReviewUrl={trainer?.google_review_url} />

          <TrainerSocialLinks
            instagramUrl={trainer?.instagram_url}
            tiktokUrl={trainer?.tiktok_url}
          />
        </footer>
      </div>
    </div>
  );
}
