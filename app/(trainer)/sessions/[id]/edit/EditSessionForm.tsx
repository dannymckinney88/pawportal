"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ClientInfoBanner } from "../../components/ClientInfoBanner";
import {
  HomeworkItemEditor,
  emptyItem,
  type ItemEditorItem,
} from "../../components/HomeworkItemEditor";
import type { DBHomeworkItem, EditSession, EditSessionDog } from "./types";

function dbRowToItem(row: DBHomeworkItem): ItemEditorItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    link_url: row.link_url ?? "",
    dog_note: row.dog_note ?? "",

    steps: row.steps && row.steps.length > 0 ? row.steps : [""],
  };
}

export function EditSessionForm({
  session,
  dog,
  initialItems,
}: {
  session: EditSession;
  dog: EditSessionDog;
  initialItems: DBHomeworkItem[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const [summary, setSummary] = useState(session.summary);
  const [items, setItems] = useState<ItemEditorItem[]>(
    initialItems.length > 0 ? initialItems.map(dbRowToItem) : [emptyItem()],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const canSave =
    summary.trim().length > 0 &&
    items.every((item) => item.title.trim().length > 0);

  const updateItem = (
    index: number,
    field: "title" | "description" | "link_url" | "dog_note",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
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

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setConfirming(false);

    const { error: sessionError } = await supabase
      .from("sessions")
      .update({ summary: summary.trim() })
      .eq("id", session.id);

    if (sessionError) {
      setError(sessionError.message);
      setLoading(false);
      return;
    }

    const filledItems = items.filter((item) => item.title.trim().length > 0);

    const existingIds = filledItems
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    const initialIds = initialItems.map((item) => item.id);
    const idsToDelete = initialIds.filter((id) => !existingIds.includes(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("homework_items")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }
    }

    const itemsToUpdate = filledItems.filter(
      (item): item is ItemEditorItem & { id: string } => Boolean(item.id),
    );

    for (const item of itemsToUpdate) {
      const cleanedSteps = item.steps.filter((step) => step.trim().length > 0);

      const { error: updateError } = await supabase
        .from("homework_items")
        .update({
          title: item.title.trim(),
          description: item.description?.trim() || null,
          link_url: item.link_url?.trim() || null,
          dog_note: item.dog_note?.trim() || null,
          steps: cleanedSteps.length > 0 ? cleanedSteps : null,
        })
        .eq("id", item.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    }

    const itemsToInsert = filledItems.filter((item) => !item.id);

    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("homework_items")
        .insert(
          itemsToInsert.map((item) => {
            const cleanedSteps = item.steps.filter(
              (step) => step.trim().length > 0,
            );

            return {
              session_id: session.id,
              title: item.title.trim(),
              description: item.description?.trim() || null,
              link_url: item.link_url?.trim() || null,
              dog_note: item.dog_note?.trim() || null,
              steps: cleanedSteps.length > 0 ? cleanedSteps : null,
            };
          }),
        );

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push(`/clients/${session.client_id}`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <a
            href={`/clients/${session.client_id}`}
            className="text-hint hover:text-muted-foreground text-sm"
          >
            ← Back
          </a>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-foreground"
          >
            Edit Session {session.session_number}
          </h1>
        </div>

        <ClientInfoBanner dogName={dog.dog_name} ownerName={dog.owner_name} />

        <p className="text-xs text-hint mb-4">
          Fields marked{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <div className="flex flex-col gap-6">
          {/* Session Summary */}
          <div className="bg-card rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Session Summary
            </h2>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="summary"
                className="text-sm font-medium text-label"
              >
                What did you cover?{" "}
                <span className="text-danger" aria-hidden="true">
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
                className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none"
              />
              <p id="summary-hint" className="text-xs text-hint">
                This appears on the client&apos;s recap page.
              </p>
            </div>
          </div>

          {/* Homework Items */}
          <div className="bg-card rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">Homework</h2>

            {items.map((item, index) => (
              <HomeworkItemEditor
                key={item.id ?? `new-${index}`}
                item={item}
                index={index}
                itemsCount={items.length}
                dogName={dog.dog_name}
                onUpdate={(field, value) => updateItem(index, field, value)}
                onRemove={() => removeItem(index)}
                onUpdateStep={(si, value) => updateStep(index, si, value)}
                onAddStep={() => addStep(index)}
                onRemoveStep={(si) => removeStep(index, si)}
              />
            ))}

            <button
              type="button"
              onClick={addItem}
              className="w-full border border-dashed border-primary/50 text-primary rounded-xl py-3 text-sm font-medium hover:bg-primary-subtle min-h-11"
            >
              + Add homework item
            </button>
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}

          {/* Save confirmation */}
          {confirming ? (
            <div
              role="alertdialog"
              aria-labelledby="confirm-save-heading"
              aria-describedby="confirm-save-desc"
              className="bg-warning-subtle border border-warning-border rounded-2xl p-4 flex flex-col gap-3"
            >
              <div>
                <p
                  id="confirm-save-heading"
                  className="text-sm font-semibold text-foreground"
                >
                  Save changes to Session {session.session_number}?
                </p>
                <p id="confirm-save-desc" className="text-xs text-muted-foreground mt-1">
                  This will update the client&apos;s recap page immediately.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium hover:bg-primary-hover disabled:opacity-50 min-h-11"
                >
                  {loading ? "Saving..." : "Yes, save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                  className="flex-1 bg-card border border-border text-secondary-foreground rounded-lg py-3 text-sm font-medium hover:bg-background disabled:opacity-50 min-h-11"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {!canSave && (
                <p role="status" className="text-xs text-hint text-center">
                  Add a session summary and a title for each homework item to
                  continue.
                </p>
              )}
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={!canSave}
                aria-disabled={!canSave}
                className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 text-sm font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed min-h-11"
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
