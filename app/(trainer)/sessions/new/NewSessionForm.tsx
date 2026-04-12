"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ClientInfoBanner } from "../components/ClientInfoBanner";
import {
  HomeworkItemEditor,
  emptyItem,
  type ItemEditorItem,
} from "../components/HomeworkItemEditor";
import { TemplatePickerSheet } from "./components/TemplatePickerSheet";
import type { NewSessionClient, HomeworkTemplate } from "./types";

export function NewSessionForm() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const router = useRouter();
  const supabase = createClient();

  const [client, setClient] = useState<NewSessionClient | null>(null);
  const [summary, setSummary] = useState("");
  const [items, setItems] = useState<ItemEditorItem[]>([emptyItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [templates, setTemplates] = useState<HomeworkTemplate[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // A blank item (no title, description, link, note, or steps) is a draft
  // placeholder — the submit handler filters these out. Only block save if an
  // item has *some* content entered but is missing its title.
  const canSave =
    summary.trim().length > 0 &&
    items.every(
      (item) =>
        item.title.trim().length > 0 ||
        (item.description.trim().length === 0 &&
          item.link_url.trim().length === 0 &&
          item.dog_note.trim().length === 0 &&
          item.steps.every((s) => s.trim().length === 0)),
    );

  useEffect(() => {
    if (!clientId) return;
    supabase
      .from("clients")
      .select("id, dog_name, owner_name")
      .eq("id", clientId)
      .single()
      .then(({ data }) => {
        if (data) setClient(data);
      });
  }, [clientId, supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("homework_templates")
        .select("id, title, description, steps, link_url, dog_note")
        .eq("trainer_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setTemplates(data);
        });
    });
  }, [supabase]);

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

  const applyTemplate = (template: HomeworkTemplate) => {
    const filled: ItemEditorItem = {
      title: template.title,
      description: template.description ?? "",
      link_url: template.link_url ?? "",
      dog_note: template.dog_note ?? "",
      steps:
        template.steps && template.steps.length > 0 ? template.steps : [""],
    };
    setItems((prev) => {
      const blankIndex = prev.findIndex((item) => item.title.trim() === "");
      if (blankIndex !== -1) {
        return prev.map((item, i) => (i === blankIndex ? filled : item));
      }
      return [...prev, filled];
    });
    setSheetOpen(false);
  };

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
          description: item.description.trim() || null,
          link_url: item.link_url.trim() || null,
          dog_note: item.dog_note.trim() || null,
          steps:
            item.steps.filter((s) => s.trim().length > 0).length > 0
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No client selected.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <a
            href={`/clients/${clientId}`}
            className="text-hint hover:text-muted-foreground text-sm"
          >
            ← Back
          </a>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-foreground"
          >
            New Session
          </h1>
        </div>

        {client && (
          <ClientInfoBanner
            dogName={client.dog_name}
            ownerName={client.owner_name}
          />
        )}

        <p className="text-xs text-hint mb-4">
          Fields marked{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                What did you cover today?{" "}
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
                placeholder="We worked on loose-leash walking and sit-stay. Buddy did great with focus exercises..."
                className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none"
              />
              <p id="summary-hint" className="text-xs text-hint">
                Briefly describe what you worked on. This appears on the
                client&apos;s recap page.
              </p>
            </div>
          </div>

          {/* Homework Items */}
          <div className="bg-card rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">Homework</h2>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="w-full border border-dashed border-primary/50 text-primary rounded-xl py-3 text-sm font-medium hover:bg-primary-subtle min-h-11"
            >
              ＋ Add from template
            </button>

            {items.map((item, index) => (
              <HomeworkItemEditor
                key={index}
                item={item}
                index={index}
                itemsCount={items.length}
                dogName={client?.dog_name}
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

          {!canSave && !loading && (
            <p role="status" className="text-xs text-hint text-center">
              Add a session summary to continue. Each homework item needs a
              title.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSave || loading}
            aria-disabled={!canSave || loading}
            className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 text-sm font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed min-h-11"
          >
            {loading ? "Saving session..." : "Save Session"}
          </button>
        </form>
      </div>

      <TemplatePickerSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        templates={templates}
        onApply={applyTemplate}
      />
    </div>
  );
}
