import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { HomeworkCard } from "./HomeworkCheckbox";
import { PastSessionsAccordion } from "./PastSessionsAccordion";

// ─── Local types ──────────────────────────────────────────────────────────────

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
  homework_items: { title: string }[];
};

type SessionRow = {
  id: string;
  summary: string | null;
  created_at: string;
  client_id: string;
  trainer_id: string;
};

// ─── SVG icons ────────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.29 8.29 0 004.85 1.56V6.79a4.85 4.85 0 01-1.08-.1z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // 1. Session by token
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, summary, created_at, client_id, trainer_id")
    .eq("token", token)
    .single<SessionRow>();

  if (sessionError || !session) {
    console.error("[SessionPage] session fetch failed:", sessionError?.message, "token:", token);
    return notFound();
  }

  // 2. Fetch related data in parallel
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

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        {dog.dog_photo_url ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={dog.dog_photo_url}
              alt={dog.dog_name}
              fill
              unoptimized
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-2xl font-bold text-white">
                Hey, {dog.dog_name}! 🐾
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-3">
            <span className="text-5xl" aria-hidden="true">🐾</span>
            <p className="text-2xl font-bold text-gray-900">
              Hey, {dog.dog_name}!
            </p>
          </div>
        )}

        {/* ── Session summary ───────────────────────────────────────────── */}
        <section
          aria-label="Session summary"
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <p className="font-semibold text-gray-900">{sessionDate}</p>
          {session.summary && (
            <p className="text-sm text-gray-600 mt-1">{session.summary}</p>
          )}
          {trainer?.name && (
            <p className="text-xs text-gray-400 mt-3">— {trainer.name}</p>
          )}
        </section>

        {/* ── Homework ─────────────────────────────────────────────────── */}
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

        {/* ── Past sessions ─────────────────────────────────────────────── */}
        {pastSessions.length > 0 && (
          <PastSessionsAccordion sessions={pastSessions} />
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="mt-3 pb-8 flex flex-col gap-4">
          {trainer?.google_review_url ? (
            <a
              href={trainer.google_review_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl py-4 text-center text-base min-h-[44px] flex items-center justify-center transition-colors"
            >
              ⭐ Leave Us a Google Review
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full bg-blue-600 text-white font-semibold rounded-2xl py-4 text-center text-base min-h-[44px] opacity-50 cursor-not-allowed"
            >
              ⭐ Leave Us a Google Review
            </button>
          )}

          {(trainer?.instagram_url || trainer?.tiktok_url) && (
            <div className="flex justify-center gap-6">
              {trainer.instagram_url && (
                <a
                  href={trainer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              )}
              {trainer.tiktok_url && (
                <a
                  href={trainer.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
                >
                  <TikTokIcon />
                  TikTok
                </a>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
