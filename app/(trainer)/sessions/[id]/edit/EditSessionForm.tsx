"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type HomeworkItem = {
  title: string;
  description: string;
  link_url: string;
  dog_note: string;
  mode: "description" | "steps";
  steps: string[];
};

type DBHomeworkItem = {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
};

type Session = {
  id: string;
  summary: string;
  session_number: number;
  client_id: string;
};

type Dog = {
  dog_name: string;
  owner_name: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyItem = (): HomeworkItem => ({
  title: "",
  description: "",
  link_url: "",
  dog_note: "",
  mode: "description",
  steps: [""],
});

function dbRowToItem(row: DBHomeworkItem): HomeworkItem {
  const hasSteps = row.steps !== null && row.steps.length > 0;
  return {
    title: row.title,
    description: row.description ?? "",
    link_url: row.link_url ?? "",
    dog_note: row.dog_note ?? "",
    mode: hasSteps ? "steps" : "description",
    steps: hasSteps ? row.steps! : [""],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditSessionForm({
  session,
  dog,
  initialItems,
}: {
  session: Session;
  dog: Dog;
  initialItems: DBHomeworkItem[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [summary, setSummary] = useState(session.summary);
  const [items, setItems] = useState<HomeworkItem[]>(
    initialItems.length > 0 ? initialItems.map(dbRowToItem) : [emptyItem()],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const canSave =
    summary.trim().length > 0 &&
    items.every((item) => item.title.trim().length > 0);

  // ── Item handlers ──────────────────────────────────────────────────────────

  const updateItem = (
    index: number,
    field: keyof Pick<
      HomeworkItem,
      "title" | "description" | "link_url" | "dog_note"
    >,
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

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setConfirming(false);

    // Update session summary
    const { error: sessionError } = await supabase
      .from("sessions")
      .update({ summary })
      .eq("id", session.id);

    if (sessionError) {
      setError(sessionError.message);
      setLoading(false);
      return;
    }

    // Replace homework items: delete existing, insert new
    const { error: deleteError } = await supabase
      .from("homework_items")
      .delete()
      .eq("session_id", session.id);

    if (deleteError) {
      setError(deleteError.message);
      setLoading(false);
      return;
    }

    const filledItems = items.filter((item) => item.title.trim());
    if (filledItems.length > 0) {
      const { error: insertError } = await supabase
        .from("homework_items")
        .insert(
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

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push(`/clients/${session.client_id}`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <a
            href={`/clients/${session.client_id}`}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back
          </a>
          <h1 className="text-xl font-bold text-gray-900">
            Edit Session {session.session_number}
          </h1>
        </div>

        {/* Client Info */}
        <div className="bg-blue-50 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            🐾
          </span>
          <div>
            <p className="font-semibold text-gray-900">{dog.dog_name}</p>
            <p className="text-sm text-gray-500">{dog.owner_name}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-2">
          Fields marked{" "}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <div className="flex flex-col gap-6">
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
                What did you cover?{" "}
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
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
              <p id="summary-hint" className="text-xs text-gray-400">
                This appears on the client&apos;s recap page.
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
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Mode toggle */}
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
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id={`link-${index}`}
                    type="text"
                    value={item.link_url}
                    onChange={(e) =>
                      updateItem(index, "link_url", e.target.value)
                    }
                    placeholder="https://..."
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Dog-specific note */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`dog_note-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Note for {dog.dog_name}{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id={`dog_note-${index}`}
                    type="text"
                    value={item.dog_note}
                    onChange={(e) =>
                      updateItem(index, "dog_note", e.target.value)
                    }
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
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

          {/* Error */}
          {error && (
            <p role="alert" className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Save confirmation */}
          {confirming ? (
            <div
              role="alertdialog"
              aria-labelledby="confirm-save-heading"
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex flex-col gap-3"
            >
              <div>
                <p
                  id="confirm-save-heading"
                  className="text-sm font-semibold text-gray-900"
                >
                  Save changes to Session {session.session_number}?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This will update the client&apos;s recap page immediately.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 min-h-11"
                >
                  {loading ? "Saving..." : "Yes, save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 min-h-11"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {!canSave && (
                <p
                  role="status"
                  className="text-xs text-gray-400 text-center -mb-2"
                >
                  Add a session summary and a title for each homework item to
                  continue.
                </p>
              )}
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={!canSave}
                aria-disabled={!canSave}
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-11"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
