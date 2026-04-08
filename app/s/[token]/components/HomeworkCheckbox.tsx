"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type HomeworkCardProps = {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
  initialChecked: boolean;
};

export function HomeworkCard({
  id,
  title,
  description,
  link_url,
  dog_note,
  steps,
  initialChecked,
}: HomeworkCardProps) {
  const [checked, setChecked] = useState(initialChecked);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    const supabase = createClient();
    supabase
      .from("homework_items")
      .update({
        is_checked: next,
        checked_at: next ? new Date().toISOString() : null,
      })
      .eq("id", id);
  };

  const filteredSteps = steps?.filter((s) => s.trim().length > 0) ?? [];
  const hasSteps = filteredSteps.length > 0;

  return (
    <div
      className={`bg-card rounded-2xl p-4 shadow-sm mb-3 transition-opacity ${
        checked ? "opacity-60" : ""
      }`}
    >
      {/* Title */}
      <p
        className={`text-base font-semibold text-foreground mb-2 ${
          checked ? "line-through" : ""
        }`}
      >
        {title}
      </p>

      {/* Divider */}
      <div className="border-t border-border-subtle my-2" />

      {/* Description */}
      {description && description.trim().length > 0 && (
        <p className="text-sm text-text leading-relaxed mb-3">{description}</p>
      )}

      {/* Steps */}
      {hasSteps && (
        <div className={description?.trim() ? "mt-3" : ""}>
          <p className="text-xs font-medium text-hint uppercase tracking-wide mb-2">
            Steps
          </p>
          <ol>
            {filteredSteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 py-2 border-b border-border-subtle last:border-0"
              >
                <span className="text-xs font-bold text-primary-subtle-foreground bg-primary-subtle rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-label">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Video link */}
      {link_url && (
        <a
          href={link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-sm text-primary font-medium hover:underline"
        >
          ▶ Watch video
        </a>
      )}

      {/* Dog note */}
      {dog_note && (
        <div className="mt-3 pt-3 border-t border-border-subtle flex items-start gap-2">
          <span className="shrink-0" aria-hidden="true">
            🐾
          </span>
          <p className="text-sm text-accent-foreground italic">{dog_note}</p>
        </div>
      )}

      {/* Completion toggle */}
      <div className="mt-3 pt-3 border-t border-border-subtle">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={checked}
          aria-label={
            checked ? `Mark "${title}" incomplete` : `Mark "${title}" complete`
          }
          className="flex items-center gap-2 min-h-11 w-full"
        >
          <span
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
              checked ? "bg-primary border-primary" : "border-border"
            }`}
          >
            {checked && (
              <svg
                viewBox="0 0 12 12"
                fill="none"
                className="w-3 h-3"
                aria-hidden="true"
              >
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
                ? "text-sm text-success-foreground font-medium"
                : "text-sm text-muted-foreground"
            }
          >
            {checked ? "Done ✓" : "Mark as done"}
          </span>
        </button>
      </div>
    </div>
  );
}
