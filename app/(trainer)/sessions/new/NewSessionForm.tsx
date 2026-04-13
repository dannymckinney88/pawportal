"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ClientInfoBanner } from "../components/ClientInfoBanner";
import {
  HomeworkItemEditor,
  emptyItem,
  type ItemEditorItem,
} from "../components/HomeworkItemEditor";
import { TemplatePickerSheet } from "./components/TemplatePickerSheet";
import { LandingFocus } from "@/app/components/LandingFocus";
import { setFocusIntent } from "@/lib/focus-intent";
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
          item.steps.every((s) => s.trim().length === 0))
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

  const applyTemplate = (template: HomeworkTemplate) => {
    const filled: ItemEditorItem = {
      title: template.title,
      description: template.description ?? "",
      link_url: template.link_url ?? "",
      dog_note: template.dog_note ?? "",
      steps: template.steps && template.steps.length > 0 ? template.steps : [""],
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
        }))
      );

      if (hwError) {
        setError(hwError.message);
        setLoading(false);
        return;
      }
    }

    setFocusIntent({ targetId: "client-heading", visible: true });
    router.push(`/clients/${clientId}`);
  };

  if (!clientId) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">No client selected.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`/clients/${clientId}`}
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
          <h1 id="new-session-heading" tabIndex={-1} className="text-foreground text-xl font-bold focus:outline-none">
            New Session
          </h1>
        </div>

        {client && <ClientInfoBanner dogName={client.dog_name} ownerName={client.owner_name} />}

        <p className="text-hint mb-4 text-xs">
          Fields marked{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Session Summary */}
          <div className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">Session Summary</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="summary" className="text-label text-sm font-medium">
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
                className="border-border bg-muted text-foreground placeholder:text-hint hover:border-primary/50 focus:border-primary focus:ring-primary/20 focus:bg-background w-full resize-none rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2"
              />
              <p id="summary-hint" className="text-hint text-xs">
                Briefly describe what you worked on. This appears on the client&apos;s recap page.
              </p>
            </div>
          </div>

          {/* Homework Items */}
          <div className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-foreground text-lg font-semibold">Homework</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="bg-primary-subtle text-primary hover:bg-primary-subtle/70 focus-visible:ring-primary/20 shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none"
              >
                + From template
              </button>
            </div>

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

          {!canSave && !loading && (
            <p role="status" className="text-hint text-center text-xs">
              Add a session summary to continue. Each homework item needs a title.
            </p>
          )}

          <Button
            type="submit"
            disabled={!canSave || loading}
            aria-disabled={!canSave || loading}
            className="w-full"
          >
            {loading ? "Saving session..." : "Save Session"}
          </Button>
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
