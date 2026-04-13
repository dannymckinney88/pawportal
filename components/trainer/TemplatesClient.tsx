"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Template = {
  id: string;
  title: string;
  description: string | null;
  steps: string[] | null;
  link_url: string | null;
  dog_note: string | null;
};

type Draft = {
  title: string;
  description: string;
  steps: string[];
  link_url: string;
  dog_note: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyDraft = (): Draft => ({
  title: "",
  description: "",
  steps: [""],
  link_url: "",
  dog_note: "",
});

function templateToDraft(t: Template): Draft {
  return {
    title: t.title,
    description: t.description ?? "",
    steps: t.steps && t.steps.length > 0 ? t.steps : [""],
    link_url: t.link_url ?? "",
    dog_note: t.dog_note ?? "",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplatesClient({
  initialTemplates,
  trainerId,
}: {
  initialTemplates: Template[];
  trainerId: string;
}) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isFormOpen = creating || editingId !== null;

  // ── Draft helpers ──────────────────────────────────────────────────────────

  const updateDraft = (field: keyof Omit<Draft, "steps">, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateStep = (i: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      steps: prev.steps.map((s, si) => (si === i ? value : s)),
    }));
  };

  const addStep = () => setDraft((prev) => ({ ...prev, steps: [...prev.steps, ""] }));

  const removeStep = (i: number) => {
    setDraft((prev) => {
      const steps = prev.steps.filter((_, si) => si !== i);
      return { ...prev, steps: steps.length > 0 ? steps : [""] };
    });
  };

  // ── Form open / close ──────────────────────────────────────────────────────

  const startCreate = () => {
    setDraft(emptyDraft());
    setEditingId(null);
    setCreating(true);
    setError("");
  };

  const startEdit = (template: Template) => {
    setDraft(templateToDraft(template));
    setEditingId(template.id);
    setCreating(false);
    setError("");
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingId(null);
    setError("");
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!draft.title.trim()) return;
    setSaving(true);
    setError("");
    const supabase = createClient();

    const steps = draft.steps.filter((s) => s.trim().length > 0);
    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      steps: steps.length > 0 ? steps : null,
      link_url: draft.link_url.trim() || null,
      dog_note: draft.dog_note.trim() || null,
    };

    if (editingId) {
      const { data, error: err } = await supabase
        .from("homework_templates")
        .update(payload)
        .eq("id", editingId)
        .select("id, title, description, steps, link_url, dog_note")
        .single();

      if (err || !data) {
        setError(err?.message ?? "Failed to save");
        setSaving(false);
        return;
      }
      setTemplates((prev) => prev.map((t) => (t.id === editingId ? data : t)));
      setEditingId(null);
    } else {
      const { data, error: err } = await supabase
        .from("homework_templates")
        .insert({ ...payload, trainer_id: trainerId })
        .select("id, title, description, steps, link_url, dog_note")
        .single();

      if (err || !data) {
        setError(err?.message ?? "Failed to save");
        setSaving(false);
        return;
      }
      setTemplates((prev) => [data, ...prev]);
      setCreating(false);
    }

    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setError("");
    const supabase = createClient();

    const { error: err } = await supabase.from("homework_templates").delete().eq("id", id);

    if (err) {
      setError(err.message);
      setDeleting(false);
      return;
    }

    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setConfirmDeleteId(null);
    setDeleting(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-foreground text-2xl font-bold focus:outline-none"
            id="session-template-heading"
            tabIndex={-1}
          >
            Templates
          </h1>
          <p className="text-muted-foreground text-sm">Reusable homework items</p>
        </div>
        {!isFormOpen && (
          <Button type="button" onClick={startCreate}>
            + New Template
          </Button>
        )}
      </div>

      {/* Create / Edit form */}
      {isFormOpen && (
        <div className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-sm">
          <h2 className="text-foreground text-base font-semibold">
            {editingId ? "Edit Template" : "New Template"}
          </h2>

          <p className="text-hint -mt-1 text-xs">
            Fields marked{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-title" className="text-label text-sm font-medium">
              Title{" "}
              <span className="text-danger" aria-hidden="true">
                *
              </span>
            </label>
            <Input
              id="tpl-title"
              type="text"
              value={draft.title}
              onChange={(e) => updateDraft("title", e.target.value)}
              aria-required="true"
              placeholder="Loose-leash walking"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-description" className="text-label text-sm font-medium">
              Description <span className="text-hint font-normal">(optional)</span>
            </label>
            <textarea
              id="tpl-description"
              value={draft.description}
              onChange={(e) => updateDraft("description", e.target.value)}
              rows={3}
              placeholder="General notes or context for this exercise..."
              className="border-border bg-muted text-foreground placeholder:text-hint hover:border-primary/50 focus:border-primary focus:ring-primary/20 focus:bg-background w-full resize-none rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2"
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2">
            <p className="text-label text-sm font-medium">
              Steps <span className="text-hint font-normal">(optional)</span>
            </p>
            {draft.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="text-hint w-6 shrink-0 text-center text-xs font-semibold"
                  aria-hidden="true"
                >
                  {i + 1}.
                </span>
                <Input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  aria-label={`Step ${i + 1}`}
                  placeholder={`Step ${i + 1}`}
                  className="w-auto flex-1"
                />
                {draft.steps.length > 1 && (
                  <Button
                    type="button"
                    variant="danger-outline"
                    onClick={() => removeStep(i)}
                    aria-label={`Remove step ${i + 1}`}
                    className="min-w-11 shrink-0 px-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addStep}
              className="w-full border-dashed"
            >
              + Add step
            </Button>
          </div>

          {/* Resource link */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-link" className="text-label text-sm font-medium">
              Resource link <span className="text-hint font-normal">(optional)</span>
            </label>
            <Input
              id="tpl-link"
              type="text"
              value={draft.link_url}
              onChange={(e) => updateDraft("link_url", e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Dog-specific note */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-dog-note" className="text-label text-sm font-medium">
              Dog-specific note <span className="text-hint font-normal">(optional)</span>
            </label>
            <Input
              id="tpl-dog-note"
              type="text"
              value={draft.dog_note}
              onChange={(e) => updateDraft("dog_note", e.target.value)}
              aria-describedby="tpl-dog-note-hint"
              placeholder="Personalized tip shown to the owner..."
            />
            <p id="tpl-dog-note-hint" className="text-hint text-xs">
              This is pre-filled as a suggestion — trainers customize it per dog when adding this
              template to a session.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.title.trim()}
              aria-disabled={saving || !draft.title.trim()}
              className="flex-1"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Template"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={cancelForm}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Template list */}
      {templates.length === 0 && !isFormOpen ? (
        <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
          <p className="mb-4 text-4xl">🐾</p>
          <p className="text-muted-foreground text-sm">No templates yet</p>
          <button
            type="button"
            onClick={startCreate}
            className="text-primary mt-4 text-sm hover:underline"
          >
            Create your first template
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {templates.map((template) => {
            const isConfirmingDelete = confirmDeleteId === template.id;
            const filteredSteps = template.steps?.filter((s) => s.trim().length > 0) ?? [];

            return (
              <div key={template.id} className="bg-card rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-semibold">{template.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {filteredSteps.length > 0 && (
                        <span className="bg-primary-subtle text-primary-subtle-foreground rounded-full px-2 py-0.5 text-xs">
                          {filteredSteps.length} {filteredSteps.length === 1 ? "step" : "steps"}
                        </span>
                      )}
                      {template.link_url && <span className="text-hint text-xs">🔗 link</span>}
                      {template.dog_note && <span className="text-hint text-xs">🐾 note</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(template)}
                      disabled={isFormOpen}
                      aria-label={`Edit "${template.title}"`}
                      className="text-muted-foreground hover:text-foreground min-h-11 px-2 text-sm disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(template.id)}
                      disabled={isFormOpen || isConfirmingDelete}
                      aria-label={`Delete "${template.title}"`}
                      className="text-danger hover:text-danger min-h-11 px-2 text-sm disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {template.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {template.description}
                  </p>
                )}

                {/* Delete confirmation */}
                {isConfirmingDelete && (
                  <div
                    role="alertdialog"
                    aria-labelledby={`delete-tpl-${template.id}`}
                    aria-describedby={`delete-tpl-desc-${template.id}`}
                    className="bg-danger-subtle border-danger-border mt-3 flex flex-col gap-2 rounded-xl border p-3"
                  >
                    <p
                      id={`delete-tpl-${template.id}`}
                      className="text-foreground text-sm font-semibold"
                    >
                      Delete &quot;{template.title}&quot;?
                    </p>
                    <p
                      id={`delete-tpl-desc-${template.id}`}
                      className="text-muted-foreground text-xs"
                    >
                      This cannot be undone.
                    </p>
                    {error && (
                      <p role="alert" className="text-danger text-xs">
                        {error}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDelete(template.id)}
                        disabled={deleting}
                        className="flex-1"
                      >
                        {deleting ? "Deleting..." : "Yes, delete"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deleting}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
