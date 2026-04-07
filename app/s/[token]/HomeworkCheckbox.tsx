"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function HomeworkCheckbox({
  id,
  initialCompleted,
  title,
}: {
  id: string;
  initialCompleted: boolean;
  title: string;
}) {
  const [completed, setCompleted] = useState(initialCompleted);

  const toggle = () => {
    const next = !completed;
    setCompleted(next);
    const supabase = createClient();
    supabase.from("homework_items").update({ completed: next }).eq("id", id);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        completed ? `Mark "${title}" incomplete` : `Mark "${title}" complete`
      }
      aria-pressed={completed}
      className="min-h-11 min-w-11 flex items-center justify-center shrink-0"
    >
      <span
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          completed ? "bg-blue-600 border-blue-600" : "border-gray-300"
        }`}
      >
        {completed && (
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
    </button>
  );
}
