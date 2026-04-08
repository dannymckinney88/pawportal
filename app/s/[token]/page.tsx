import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { HomeworkCheckbox } from "./HomeworkCheckbox";
import { PastSessionsAccordion } from "./PastSessionsAccordion";

// ─── Local types ─────────────────────────────────────────────────────────────

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
  completed: boolean;
};

type PastSessionRow = {
  id: string;
  session_number: number;
  created_at: string;
  homework_items: { title: string }[];
};

type SessionRow = {
  id: string;
  summary: string | null;
  session_number: number;
  created_at: string;
  client_id: string;
  trainer_id: string;
};

// ─── Inline SVG icons ────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.29 8.29 0 004.85 1.56V6.79a4.85 4.85 0 01-1.08-.1z" />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SessionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // 1. Look up session by token
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, summary, session_number, created_at, client_id, trainer_id")
    .eq("token", token)
    .single<SessionRow>();

  if (sessionError || !session) return notFound();

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
      .select(
        "id, title, description, link_url, dog_note, steps, completed",
      )
      .eq("session_id", session.id)
      .returns<HomeworkItemRow[]>(),

    supabase
      .from("sessions")
      .select("id, session_number, created_at, homework_items(title)")
      .eq("client_id", session.client_id)
      .neq("id", session.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<PastSessionRow[]>(),
  ]);

  const dog = clientRes.data;
  const trainer = trainerRes.data;
  const homeworkItems: HomeworkItemRow[] = hwRes.data ?? [];
  const pastSessions: PastSessionRow[] = pastRes.data ?? [];

  if (!dog) return notFound();

  const sessionDate = new Date(session.created_at).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" },
  );

  const hasTrainerLinks =
    trainer &&
    (trainer.instagram_url || trainer.tiktok_url || trainer.google_review_url);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── 1. Dog photo hero ───────────────────────────────────────── */}
        {dog.dog_photo_url ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={dog.dog_photo_url}
              alt={dog.dog_name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-2xl font-bold text-white">
                Hey, {dog.dog_name}! 🐾
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-2">
            <span className="text-6xl" aria-hidden="true">
              🐾
            </span>
            <p className="text-2xl font-bold text-gray-900">
              Hey, {dog.dog_name}! 🐾
            </p>
          </div>
        )}

        {/* ── 2. Session summary card ─────────────────────────────────── */}
        <section
          aria-label="Session summary"
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2"
        >
          <p className="text-sm font-semibold text-gray-900">{sessionDate}</p>
          {session.summary && (
            <p className="text-sm text-gray-700">{session.summary}</p>
          )}
          {trainer?.name && (
            <p className="text-sm text-gray-500 mt-1">— {trainer.name}</p>
          )}
        </section>

        {/* ── 3. Homework list ────────────────────────────────────────── */}
        {homeworkItems.length > 0 && (
          <section aria-label="Homework">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Your Homework
            </h2>
            <div className="flex flex-col gap-3">
              {homeworkItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm transition-opacity ${
                    item.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <HomeworkCheckbox
                      id={item.id}
                      initialCompleted={item.completed}
                      title={item.title}
                    />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <p
                        className={`font-semibold text-gray-900 text-sm ${
                          item.completed ? "line-through" : ""
                        }`}
                      >
                        {item.title}
                      </p>

                      {/* Description mode */}
                      {(!item.steps || item.steps.length === 0) &&
                        item.description && (
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        )}

                      {/* Steps mode */}
                      {item.steps && item.steps.length > 0 && (
                        <ol className="flex flex-col gap-1">
                          {item.steps.map((step, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-700 flex gap-2"
                            >
                              <span className="font-medium text-gray-400 shrink-0">
                                {i + 1}.
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}

                      {/* Resource link */}
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Watch video →
                        </a>
                      )}

                      {/* Dog-specific note */}
                      {item.dog_note && (
                        <p className="text-sm text-blue-700 italic">
                          🐾 {item.dog_note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 4. Past sessions accordion ──────────────────────────────── */}
        {pastSessions.length > 0 && (
          <PastSessionsAccordion sessions={pastSessions} />
        )}

        {/* ── 5. Trainer social + review links ────────────────────────── */}
        {hasTrainerLinks && (
          <footer className="flex flex-col gap-3 pb-4">
            <div className="flex flex-col gap-2">
              {trainer.instagram_url && (
                <a
                  href={trainer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm min-h-11 hover:shadow-md transition-shadow"
                >
                  <InstagramIcon />
                  <span className="text-sm font-medium text-gray-700">
                    Follow on Instagram
                  </span>
                </a>
              )}
              {trainer.tiktok_url && (
                <a
                  href={trainer.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm min-h-11 hover:shadow-md transition-shadow"
                >
                  <TikTokIcon />
                  <span className="text-sm font-medium text-gray-700">
                    Follow on TikTok
                  </span>
                </a>
              )}
            </div>
            {trainer.google_review_url && (
              <a
                href={trainer.google_review_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white rounded-2xl py-3 text-center text-sm font-medium min-h-11 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                Leave us a Google Review ⭐
              </a>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
