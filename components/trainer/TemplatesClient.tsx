"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Template = {
  id: string;
  title: string;
  description: string | null;
  steps: string[] | null;
  link_url: string | null;
  dog_note: string | null;
};

type TemplateItem = {
  title: string;
  description: string;
  steps: string[];
  link_url: string;
  dog_note: string;
};

const emptyItem = (): TemplateItem => ({
  title: "",
  description: "",
  steps: [""],
  link_url: "",
  dog_note: "",
});

function TemplateCard({
  template,
  onDelete,
}: {
  template: Template;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const filteredSteps = template.steps?.filter((s) => s.trim().length > 0) ?? [];

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${template.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("homework_templates").delete().eq("id", template.id);
    onDelete(template.id);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="font-semibold text-gray-900">{template.title}</span>
          {filteredSteps.length > 0 && (
            <span className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-0.5">
              {filteredSteps.length} {filteredSteps.length === 1 ? "step" : "steps"}
            </span>
          )}
          {template.link_url && (
            <span className="text-sm" aria-label="Has resource link">🔗</span>
          )}
          {template.dog_note && (
            <span className="text-sm" aria-label="Has dog note">🐾</span>
          )}
        </div>
        {template.description && template.description.trim().length > 0 && (
          <p className="text-sm text-gray-500 mt-1 truncate">{template.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label={`Delete template "${template.title}"`}
        className="text-red-500 text-sm hover:text-red-700 min-h-11 min-w-11 flex items-center justify-center shrink-0 disabled:opacity-50"
      >
        {deleting ? "…" : "Delete"}
      </button>
    </div>
  );
}

export function TemplatesClient({
  initialTemplates,
  trainerId,
}: {
  initialTemplates: Template[];
  trainerId: string;
}) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState<TemplateItem>(emptyItem());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = item.title.trim().length > 0;

  const updateField = (
    field: keyof Pick<TemplateItem, "title" | "description" | "link_url" | "dog_note">,
    value: string,
  ) => setItem((prev) => ({ ...prev, [field]: value }));

  const updateStep = (index: number, value: string) =>
    setItem((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? value : s)),
    }));

  const addStep = () =>
    setItem((prev) => ({ ...prev, steps: [...prev.steps, ""] }));

  const removeStep = (index: number) =>
    setItem((prev) => ({
      ...prev,
      steps:
        prev.steps.length > 1
          ? prev.steps.filter((_, i) => i !== index)
          : [""],
    }));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const filteredSteps = item.steps.filter((s) => s.trim().length > 0);
    const { data, error: insertError } = await supabase
      .from("homework_templates")
      .insert({
        trainer_id: trainerId,
        title: item.title.trim(),
        description: item.description.trim() || null,
        steps: filteredSteps.length > 0 ? filteredSteps : null,
        link_url: item.link_url.trim() || null,
        dog_note: item.dog_note.trim() || null,
      })
      .select("id, title, description, steps, link_url, dog_note")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "Failed to save template");
      setSaving(false);
      return;
    }

    setTemplates((prev) => [data as Template, ...prev]);
    setItem(emptyItem());
    setShowForm(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setItem(emptyItem());
    setShowForm(false);
    setError("");
  };

  const handleDelete = (id: string) =>
    setTemplates((prev) => prev.filter((t) => t.id !== id));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-blue-700 min-h-11"
          >
            + New Template
          </button>
        )}
      </div>

      {/* Inline create form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900">New Template</h2>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tmpl-title" className="text-sm font-medium text-gray-700">
              Title{" "}
              <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="tmpl-title"
              type="text"
              value={item.title}
              onChange={(e) => updateField("title", e.target.value)}
              aria-required="true"
              placeholder="Loose-leash walking"
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tmpl-description" className="text-sm font-medium text-gray-700">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="tmpl-description"
              value={item.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              placeholder="General notes or context for this exercise..."
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Steps{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </p>
            {item.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold text-gray-400 w-6 shrink-0 text-center"
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
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
                {item.steps.length > 1 && (
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
              className="w-full border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 text-sm hover:bg-gray-50 min-h-11"
            >
              + Add step
            </button>
          </div>

          {/* Link */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tmpl-link" className="text-sm font-medium text-gray-700">
              Resource link{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="tmpl-link"
              type="text"
              value={item.link_url}
              onChange={(e) => updateField("link_url", e.target.value)}
              placeholder="https://..."
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Dog note */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tmpl-dog-note" className="text-sm font-medium text-gray-700">
              Dog-specific note{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="tmpl-dog-note"
              type="text"
              value={item.dog_note}
              onChange={(e) => updateField("dog_note", e.target.value)}
              placeholder="Use high-value treats for distracted dogs"
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || saving}
              aria-disabled={!canSave || saving}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-11"
            >
              {saving ? "Saving…" : "Save Template"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-gray-200 text-gray-600 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-50 min-h-11"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Template list */}
      {templates.length > 0 ? (
        <div>
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">🐾</p>
          <p className="text-gray-400 text-sm">No templates yet</p>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 text-sm font-medium hover:underline min-h-11"
            >
              Create your first template
            </button>
          )}
        </div>
      )}
    </div>
  );
}
