"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

  const addStep = () =>
    setDraft((prev) => ({ ...prev, steps: [...prev.steps, ""] }));

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

    const { error: err } = await supabase
      .from("homework_templates")
      .delete()
      .eq("id", id);

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
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Reusable homework items
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={startCreate}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover min-h-11"
          >
            + New Template
          </button>
        )}
      </div>

      {/* Create / Edit form */}
      {isFormOpen && (
        <div className="bg-card rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">
            {editingId ? "Edit Template" : "New Template"}
          </h2>

          <p className="text-xs text-hint -mt-1">
            Fields marked{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tpl-title"
              className="text-sm font-medium text-gray-700"
            >
              Title{" "}
              <span className="text-danger" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="tpl-title"
              type="text"
              value={draft.title}
              onChange={(e) => updateDraft("title", e.target.value)}
              aria-required="true"
              placeholder="Loose-leash walking"
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tpl-description"
              className="text-sm font-medium text-gray-700"
            >
              Description{" "}
              <span className="text-hint font-normal">(optional)</span>
            </label>
            <textarea
              id="tpl-description"
              value={draft.description}
              onChange={(e) => updateDraft("description", e.target.value)}
              rows={3}
              placeholder="General notes or context for this exercise..."
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Steps{" "}
              <span className="text-hint font-normal">(optional)</span>
            </p>
            {draft.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold text-hint w-6 shrink-0 text-center"
                  aria-hidden="true"
                >
                  {i + 1}.
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  aria-label={`Step ${i + 1}`}
                  placeholder={`Step ${i + 1}`}
                  className="flex-1 border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                />
                {draft.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    aria-label={`Remove step ${i + 1}`}
                    className="text-red-400 hover:text-red-600 min-h-11 min-w-11 flex items-center justify-center shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="w-full border border-dashed border-border text-muted-foreground rounded-lg py-2 text-sm hover:bg-background min-h-11"
            >
              + Add step
            </button>
          </div>

          {/* Resource link */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tpl-link"
              className="text-sm font-medium text-gray-700"
            >
              Resource link{" "}
              <span className="text-hint font-normal">(optional)</span>
            </label>
            <input
              id="tpl-link"
              type="text"
              value={draft.link_url}
              onChange={(e) => updateDraft("link_url", e.target.value)}
              placeholder="https://..."
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Dog-specific note */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tpl-dog-note"
              className="text-sm font-medium text-gray-700"
            >
              Dog-specific note{" "}
              <span className="text-hint font-normal">(optional)</span>
            </label>
            <input
              id="tpl-dog-note"
              type="text"
              value={draft.dog_note}
              onChange={(e) => updateDraft("dog_note", e.target.value)}
              aria-describedby="tpl-dog-note-hint"
              placeholder="Personalized tip shown to the owner..."
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <p id="tpl-dog-note-hint" className="text-xs text-hint">
              This is pre-filled as a suggestion — trainers customize it per dog
              when adding this template to a session.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.title.trim()}
              aria-disabled={saving || !draft.title.trim()}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed min-h-11"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Template"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              disabled={saving}
              className="flex-1 bg-card border border-border text-secondary-foreground rounded-lg py-3 text-sm font-medium hover:bg-background disabled:opacity-50 min-h-11"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Template list */}
      {templates.length === 0 && !isFormOpen ? (
        <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">🐾</p>
          <p className="text-muted-foreground text-sm">No templates yet</p>
          <button
            type="button"
            onClick={startCreate}
            className="mt-4 text-primary text-sm hover:underline"
          >
            Create your first template
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {templates.map((template) => {
            const isConfirmingDelete = confirmDeleteId === template.id;
            const filteredSteps =
              template.steps?.filter((s) => s.trim().length > 0) ?? [];

            return (
              <div
                key={template.id}
                className="bg-card rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {template.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {filteredSteps.length > 0 && (
                        <span className="text-xs bg-primary-subtle text-primary-subtle-foreground rounded-full px-2 py-0.5">
                          {filteredSteps.length}{" "}
                          {filteredSteps.length === 1 ? "step" : "steps"}
                        </span>
                      )}
                      {template.link_url && (
                        <span className="text-xs text-hint">🔗 link</span>
                      )}
                      {template.dog_note && (
                        <span className="text-xs text-hint">🐾 note</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(template)}
                      disabled={isFormOpen}
                      className="text-sm text-muted-foreground hover:text-foreground min-h-11 px-2 disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(template.id)}
                      disabled={isFormOpen || isConfirmingDelete}
                      className="text-sm text-danger hover:text-red-700 min-h-11 px-2 disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {template.description}
                  </p>
                )}

                {/* Delete confirmation */}
                {isConfirmingDelete && (
                  <div
                    role="alertdialog"
                    aria-labelledby={`delete-tpl-${template.id}`}
                    className="mt-3 bg-danger-subtle border border-danger-border rounded-xl p-3 flex flex-col gap-2"
                  >
                    <p
                      id={`delete-tpl-${template.id}`}
                      className="text-sm font-semibold text-foreground"
                    >
                      Delete &quot;{template.title}&quot;?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This cannot be undone.
                    </p>
                    {error && (
                      <p role="alert" className="text-xs text-danger">
                        {error}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(template.id)}
                        disabled={deleting}
                        className="flex-1 bg-danger text-danger-foreground rounded-lg py-2 text-sm font-medium hover:bg-danger-hover disabled:opacity-50 min-h-11"
                      >
                        {deleting ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deleting}
                        className="flex-1 bg-card border border-border text-secondary-foreground rounded-lg py-2 text-sm font-medium hover:bg-background disabled:opacity-50 min-h-11"
                      >
                        Cancel
                      </button>
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
