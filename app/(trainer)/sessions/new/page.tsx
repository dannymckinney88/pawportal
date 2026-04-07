"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type HomeworkItem = {
  title: string;
  description: string;
  link_url: string;
  dog_note: string;
  mode: "description" | "steps";
  steps: string[];
};

type Client = {
  id: string;
  dog_name: string;
  owner_name: string;
};

const emptyItem = (): HomeworkItem => ({
  title: "",
  description: "",
  link_url: "",
  dog_note: "",
  mode: "description",
  steps: [""],
});

export default function NewSessionPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const router = useRouter();
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [summary, setSummary] = useState("");
  const [items, setItems] = useState<HomeworkItem[]>([emptyItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSave =
    summary.trim().length > 0 &&
    items.every((item) => item.title.trim().length > 0);

  useEffect(() => {
    if (!clientId) return;
    const client = createClient();
    client
      .from("clients")
      .select("id, dog_name, owner_name")
      .eq("id", clientId)
      .single()
      .then(({ data }) => {
        if (data) setClient(data);
      });
  }, [clientId]);

  const updateItem = (
    index: number,
    field: keyof Pick<HomeworkItem, "title" | "description" | "link_url" | "dog_note">,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const setItemMode = (index: number, mode: HomeworkItem["mode"]) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, mode } : item)),
    );
  };

  const updateStep = (itemIndex: number, stepIndex: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const steps = item.steps.map((s, si) => (si === stepIndex ? value : s));
        return { ...item, steps };
      }),
    );
  };

  const addStep = (itemIndex: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex ? { ...item, steps: [...item.steps, ""] } : item,
      ),
    );
  };

  const removeStep = (itemIndex: number, stepIndex: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const steps = item.steps.filter((_, si) => si !== stepIndex);
        return { ...item, steps: steps.length > 0 ? steps : [""] };
      }),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientId || !client) return;
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Count existing sessions to determine session_number
    const { count } = await supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("client_id", clientId);

    const session_number = (count ?? 0) + 1;
    const token = crypto.randomUUID();

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        client_id: clientId,
        trainer_id: user.id,
        summary,
        session_number,
        token,
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      setError(sessionError?.message ?? "Failed to create session");
      setLoading(false);
      return;
    }

    const filledItems = items.filter((item) => item.title.trim());
    if (filledItems.length > 0) {
      const { error: hwError } = await supabase.from("homework_items").insert(
        filledItems.map((item) => ({
          session_id: session.id,
          title: item.title.trim(),
          description:
            item.mode === "description"
              ? item.description?.trim() || null
              : null,
          link_url: item.link_url?.trim() || null,
          dog_note: item.dog_note?.trim() || null,
          steps:
            item.mode === "steps"
              ? item.steps.filter((s) => s.trim().length > 0)
              : null,
        })),
      );

      if (hwError) {
        setError(hwError.message);
        setLoading(false);
        return;
      }
    }

    router.push(`/clients/${clientId}`);
  };

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No client selected.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <a
            href={`/clients/${clientId}`}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back
          </a>
          <h1 className="text-xl font-bold text-gray-900">New Session</h1>
        </div>

        {/* Client Info */}
        {client && (
          <div className="bg-blue-50 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <div>
              <p className="font-semibold text-gray-900">{client.dog_name}</p>
              <p className="text-sm text-gray-500">{client.owner_name}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mb-2">
          Fields marked{" "}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Session Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h2 className="text-base font-semibold text-gray-900">
              Session Summary
            </h2>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="summary"
                className="text-sm font-medium text-gray-700"
              >
                What did you cover today?{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                aria-required="true"
                aria-describedby="summary-hint"
                placeholder="We worked on loose-leash walking and sit-stay. Buddy did great with focus exercises..."
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
              <p id="summary-hint" className="text-xs text-gray-400">
                Briefly describe what you worked on. This appears on the
                client&apos;s recap page.
              </p>
            </div>
          </div>

          {/* Homework Items */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-900">Homework</h2>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 border border-gray-100 rounded-xl p-4"
              >
                {/* Item header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    Item {index + 1}
                  </p>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove homework item ${index + 1}`}
                      className="text-red-500 text-sm hover:text-red-700 min-h-11 min-w-11 flex items-center justify-center"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`title-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Title{" "}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id={`title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    aria-required="true"
                    aria-describedby={`title-hint-${index}`}
                    placeholder="Loose-leash walking"
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                  <p id={`title-hint-${index}`} className="text-xs text-gray-400">
                    A short name for this exercise or skill.
                  </p>
                </div>

                {/* Description / Steps toggle */}
                <div
                  role="group"
                  aria-label={`Content type for item ${index + 1}`}
                >
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                    <button
                      type="button"
                      onClick={() => setItemMode(index, "description")}
                      aria-pressed={item.mode === "description"}
                      className={`px-4 py-2 rounded-md text-sm font-medium min-h-11 transition-colors ${
                        item.mode === "description"
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemMode(index, "steps")}
                      aria-pressed={item.mode === "steps"}
                      className={`px-4 py-2 rounded-md text-sm font-medium min-h-11 transition-colors ${
                        item.mode === "steps"
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Steps
                    </button>
                  </div>
                </div>

                {/* Description mode */}
                {item.mode === "description" && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`description-${index}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      rows={3}
                      placeholder="Practice 5 minutes per day in the backyard before meals..."
                      className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                )}

                {/* Steps mode */}
                {item.mode === "steps" && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700">Steps</p>
                    {item.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold text-gray-400 w-6 shrink-0 text-center"
                          aria-hidden="true"
                        >
                          {stepIndex + 1}.
                        </span>
                        <input
                          id={`step-${index}-${stepIndex}`}
                          type="text"
                          value={step}
                          onChange={(e) =>
                            updateStep(index, stepIndex, e.target.value)
                          }
                          aria-label={`Item ${index + 1}, step ${stepIndex + 1}`}
                          placeholder={`Step ${stepIndex + 1}`}
                          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                        />
                        {item.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(index, stepIndex)}
                            aria-label={`Remove step ${stepIndex + 1} from item ${index + 1}`}
                            className="text-red-400 hover:text-red-600 min-h-11 min-w-11 flex items-center justify-center shrink-0"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addStep(index)}
                      className="w-full border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 text-sm hover:bg-gray-50 min-h-11"
                    >
                      + Add step
                    </button>
                  </div>
                )}

                {/* Link */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`link-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Resource link{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id={`link-${index}`}
                    type="text"
                    value={item.link_url}
                    onChange={(e) =>
                      updateItem(index, "link_url", e.target.value)
                    }
                    aria-describedby={`link-hint-${index}`}
                    placeholder="https://..."
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                  <p id={`link-hint-${index}`} className="text-xs text-gray-400">
                    A YouTube video, article, or any helpful URL for this
                    exercise.
                  </p>
                </div>

                {/* Dog-specific note */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`dog_note-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Note for {client?.dog_name ?? "this dog"}{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id={`dog_note-${index}`}
                    type="text"
                    value={item.dog_note}
                    onChange={(e) =>
                      updateItem(index, "dog_note", e.target.value)
                    }
                    aria-describedby={`dog-note-hint-${index}`}
                    placeholder="Buddy tends to pull when he sees other dogs — use high-value treats"
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                  <p
                    id={`dog-note-hint-${index}`}
                    className="text-xs text-gray-400"
                  >
                    Personalized tip shown to the owner about their specific dog.
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="w-full border border-dashed border-blue-300 text-blue-600 rounded-xl py-3 text-sm font-medium hover:bg-blue-50 min-h-11"
            >
              + Add homework item
            </button>
          </div>

          {error && (
            <p role="alert" className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {!canSave && !loading && (
            <p role="status" className="text-xs text-gray-400 text-center -mb-2">
              Add a session summary and a title for each homework item to
              continue.
            </p>
          )}
          <button
            type="submit"
            disabled={!canSave || loading}
            aria-disabled={!canSave || loading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-11"
          >
            {loading ? "Saving session..." : "Save Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
