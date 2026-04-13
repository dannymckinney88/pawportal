"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ClientInfoBanner } from "../../components/ClientInfoBanner";
import {
  HomeworkItemEditor,
  emptyItem,
  type ItemEditorItem,
} from "../../components/HomeworkItemEditor";
import { LandingFocus } from "@/app/components/LandingFocus";
import { setFocusIntent } from "@/lib/focus-intent";
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

  const [summary, setSummary] = useState(session.summary);
  const [items, setItems] = useState<ItemEditorItem[]>(
    initialItems.length > 0 ? initialItems.map(dbRowToItem) : [emptyItem()]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const canSave = summary.trim().length > 0 && items.every((item) => item.title.trim().length > 0);

  const updateItem = (
    index: number,
    field: "title" | "description" | "link_url" | "dog_note",
    value: string
  ) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const updateStep = (itemIndex: number, stepIndex: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const steps = item.steps.map((s, si) => (si === stepIndex ? value : s));
        return { ...item, steps };
      })
    );
  };

  const addStep = (itemIndex: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === itemIndex ? { ...item, steps: [...item.steps, ""] } : item))
    );
  };

  const removeStep = (itemIndex: number, stepIndex: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const steps = item.steps.filter((_, si) => si !== stepIndex);
        return { ...item, steps: steps.length > 0 ? steps : [""] };
      })
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

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

    const itemsToUpdate = filledItems.filter((item): item is ItemEditorItem & { id: string } =>
      Boolean(item.id)
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
      const { error: insertError } = await supabase.from("homework_items").insert(
        itemsToInsert.map((item) => {
          const cleanedSteps = item.steps.filter((step) => step.trim().length > 0);

          return {
            session_id: session.id,
            title: item.title.trim(),
            description: item.description?.trim() || null,
            link_url: item.link_url?.trim() || null,
            dog_note: item.dog_note?.trim() || null,
            steps: cleanedSteps.length > 0 ? cleanedSteps : null,
          };
        })
      );

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setFocusIntent({ targetId: "client-heading", visible: true });
    router.push(`/clients/${session.client_id}`);
    router.refresh();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`/clients/${session.client_id}`}
            className="text-hint hover:text-muted-foreground text-sm"
            onClick={(e) => {
              setFocusIntent(
                e.currentTarget.matches(":focus-visible")
                  ? { targetId: "client-heading", visible: true }
                  : { targetId: "main-content", visible: false }
              );
            }}
          >
            <span aria-hidden="true">← </span>
            Back
          </Link>
          <LandingFocus />
          <h1 id="edit-session-heading" tabIndex={-1} className="text-foreground text-xl font-bold focus:outline-none">
            Edit Session {session.session_number}
          </h1>
        </div>

        <ClientInfoBanner dogName={dog.dog_name} ownerName={dog.owner_name} />

        <p className="text-hint mb-4 text-xs">
          Fields marked
          <span className="text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <div className="flex flex-col gap-6">
          {/* Session Summary */}
          <div className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">Session Summary</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="summary" className="text-label text-sm font-medium">
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
                className="border-border bg-muted text-foreground placeholder:text-hint hover:border-primary/50 focus:border-primary focus:ring-primary/20 focus:bg-background w-full resize-none rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2"
              />
              <p id="summary-hint" className="text-hint text-xs">
                This appears on the client&apos;s recap page.
              </p>
            </div>
          </div>

          {/* Homework Items */}
          <div className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">Homework</h2>

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

            <Button
              type="button"
              variant="secondary"
              onClick={addItem}
              className="w-full rounded-xl border-dashed"
            >
              <span aria-hidden="true">+ </span>
              Add homework item
            </Button>
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
              className="bg-warning-subtle border-warning-border flex flex-col gap-3 rounded-2xl border p-4"
            >
              <div>
                <p id="confirm-save-heading" className="text-foreground text-sm font-semibold">
                  Save changes to Session {session.session_number}?
                </p>
                <p id="confirm-save-desc" className="text-muted-foreground mt-1 text-xs">
                  This will update the client&apos;s recap page immediately.
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="button" onClick={handleSave} disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Yes, save changes"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {!canSave && (
                <p role="status" className="text-hint text-center text-xs">
                  Add a session summary and a title for each homework item to continue.
                </p>
              )}
              <Button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={!canSave}
                aria-disabled={!canSave}
                className="w-full"
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
