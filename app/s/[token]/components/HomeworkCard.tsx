"use client";

import { useEffect, useState } from "react";

type HomeworkCardProps = {
  id: string;
  sessionToken: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
  initialChecked: boolean;
  onCheckedChange?: (homeworkId: string, isChecked: boolean) => void;
};

/**
 * Homework card
 */
export const HomeworkCard = ({
  id,
  sessionToken,
  title,
  description,
  link_url,
  dog_note,
  steps,
  initialChecked,
  onCheckedChange,
}: HomeworkCardProps) => {
  const [checked, setChecked] = useState(initialChecked);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const toggle = async () => {
    if (isSaving) return;

    const next = !checked;
    setChecked(next);
    onCheckedChange?.(id, next);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/sessions/${sessionToken}/homework/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isChecked: next,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to update homework item");
      }
    } catch (error) {
      console.error("[HomeworkCard] toggle failed", error);
      setChecked(!next);
      onCheckedChange?.(id, !next);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSteps = steps?.filter((step) => step.trim().length > 0) ?? [];
  const hasSteps = filteredSteps.length > 0;

  return (
    <div
      className={`mb-3 rounded-2xl border p-4 shadow-sm transition-all ${
        checked ? "border-border bg-success/40" : "border-border bg-card"
      }`}
    >
      <p
        className={`mb-2 text-base font-semibold ${
          checked ? "text-success-foreground" : "text-foreground"
        }`}
      >
        {title}
      </p>

      <div className="border-border-subtle my-2 border-t" />

      {description && description.trim().length > 0 && (
        <p className="text-text mb-3 text-sm leading-relaxed">{description}</p>
      )}

      {hasSteps && (
        <div className={description?.trim() ? "mt-3" : ""}>
          <p className="text-hint mb-2 text-xs font-medium tracking-wide uppercase">Steps</p>

          <ol>
            {filteredSteps.map((step, index) => (
              <li
                key={index}
                className="border-border-subtle flex items-start gap-3 border-b py-2 last:border-0"
              >
                <span className="bg-primary-subtle text-primary-subtle-foreground mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-label text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {link_url && (
        <a
          href={link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-3 block text-sm font-medium hover:underline"
          aria-label={`Watch video for ${title}`}
        >
          ▶ Watch video
        </a>
      )}

      {dog_note && (
        <div className="border-border-subtle mt-3 flex items-start gap-2 border-t pt-3">
          <span className="shrink-0" aria-hidden="true">
            🐾
          </span>
          <p className="text-accent-foreground text-sm italic">{dog_note}</p>
        </div>
      )}

      <div className="border-border-subtle mt-3 border-t pt-3">
        <button
          type="button"
          onClick={toggle}
          disabled={isSaving}
          aria-pressed={checked}
          aria-label={checked ? `Mark "${title}" incomplete` : `Mark "${title}" complete`}
          className="flex min-h-11 w-full items-center gap-2 disabled:opacity-60"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
              checked ? "border-primary bg-primary" : "border-border"
            }`}
          >
            {checked && (
              <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden="true">
                <polyline
                  points="2 6 5 9 10 3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>

          <span
            className={
              checked
                ? "text-success-foreground text-sm font-medium"
                : "text-muted-foreground text-sm"
            }
          >
            {checked ? "Done ✓" : "Mark as done"}
          </span>
        </button>
      </div>
    </div>
  );
};
