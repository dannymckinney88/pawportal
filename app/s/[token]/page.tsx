import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PastSessionsAccordion } from "./components/PastSessionsAccordion";
import { ClientHero } from "./components/ClientHero";
import { SessionSummaryCard } from "./components/SessionSummaryCard";
import { ReviewCard } from "./components/ReviewCard";
import { TrainerSocialLinks } from "./components/TrainerSocialLinks";
import { SessionViewTracker } from "./components/SessionViewTracker";
import { HomeworkSection } from "./components/HomeworkSection";
import { SessionMessageThread } from "@/app/components/session-messages/SessionMessageThread";
import type {
  Dog,
  Trainer,
  HomeworkItemRow,
  PastSessionRow,
  SessionRow,
} from "./types";

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

  if (!dog) return notFound();

  const sessionDate = new Date(session.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
        <SessionViewTracker token={token} />

        <ClientHero dogName={dog.dog_name} dogPhotoUrl={dog.dog_photo_url} />

        <SessionSummaryCard
          sessionDate={sessionDate}
          summary={session.summary}
          trainerName={trainer?.name}
        />

        {homeworkItems.length > 0 && (
          <HomeworkSection sessionToken={token} items={homeworkItems} />
        )}

        <SessionMessageThread
          sessionId={session.id}
          sessionToken={token}
          senderType="client"
        />

        {pastSessions.length > 0 && (
          <PastSessionsAccordion sessions={pastSessions} />
        )}

        <footer className="mt-10 flex flex-col gap-4 border-t border-border pt-6 pb-8">
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
