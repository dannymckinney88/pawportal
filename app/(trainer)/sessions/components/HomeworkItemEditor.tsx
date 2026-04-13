"use client";

// Shared per-item homework editor used by both the new-session form and the
// fields simultaneously (new flow).

import { Input } from "@/components/ui/input";

export type ItemEditorItem = {
  id?: string;
  title: string;
  description: string;
  link_url: string;
  dog_note: string;
  steps: string[];
};

export const emptyItem = (): ItemEditorItem => ({
  title: "",
  description: "",
  link_url: "",
  dog_note: "",
  steps: [""],
});

type Props = {
  item: ItemEditorItem;
  index: number;
  itemsCount: number;
  dogName: string | undefined;

  onUpdate: (field: "title" | "description" | "link_url" | "dog_note", value: string) => void;
  onRemove: () => void;

  onUpdateStep: (stepIndex: number, value: string) => void;
  onAddStep: () => void;
  onRemoveStep: (stepIndex: number) => void;
};

export function HomeworkItemEditor({
  item,
  index,
  itemsCount,
  dogName,

  onUpdate,
  onRemove,

  onUpdateStep,
  onAddStep,
  onRemoveStep,
}: Props) {
  return (
    <div className="border-border-subtle flex flex-col gap-2.5 rounded-xl border p-4">
      {/* Item header */}
      <div className="flex items-center justify-between">
        <p className="text-label text-sm font-medium">Item {index + 1}</p>
        {itemsCount > 1 && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove homework item ${index + 1}`}
            className="text-danger hover:text-danger flex min-h-11 min-w-11 items-center justify-center text-sm"
          >
            Remove
          </button>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`title-${index}`} className="text-label text-sm font-medium">
          Title{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        </label>
        <Input
          id={`title-${index}`}
          type="text"
          value={item.title}
          onChange={(e) => onUpdate("title", e.target.value)}
          aria-required="true"
          aria-describedby={`title-hint-${index}`}
          placeholder="Loose-leash walking"
        />
        <p id={`title-hint-${index}`} className="text-hint text-xs">
          A short name for this exercise or skill.
        </p>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`description-${index}`} className="text-label text-sm font-medium">
          Description <span className="text-hint font-normal">(optional)</span>
        </label>
        <textarea
          id={`description-${index}`}
          value={item.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          rows={2}
          placeholder="General notes or context for this exercise..."
          className="border-border bg-muted text-foreground placeholder:text-hint hover:border-primary/50 focus:border-primary focus:ring-primary/20 focus:bg-background w-full resize-none rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2"
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2">
        <p className="text-label text-sm font-medium">
          Steps <span className="text-hint font-normal">(optional)</span>
        </p>

        {item.steps.map((step, stepIndex) => (
          <div key={stepIndex} className="flex items-center gap-2">
            <span
              className="text-hint w-6 shrink-0 text-center text-xs font-semibold"
              aria-hidden="true"
            >
              {stepIndex + 1}.
            </span>

            <Input
              type="text"
              value={step}
              onChange={(e) => onUpdateStep(stepIndex, e.target.value)}
              aria-label={`Item ${index + 1}, step ${stepIndex + 1}`}
              placeholder={`Step ${stepIndex + 1}`}
              className="w-auto flex-1"
            />

            {item.steps.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveStep(stepIndex)}
                aria-label={`Remove step ${stepIndex + 1} from item ${index + 1}`}
                className="text-danger hover:text-danger flex min-h-11 min-w-11 shrink-0 items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={onAddStep}
          className="border-border text-muted-foreground hover:bg-background min-h-11 w-full rounded-lg border border-dashed py-2 text-sm"
        >
          <span aria-hidden="true">+ </span>
          Add step
        </button>
      </div>

      {/* Resource link */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`link-${index}`} className="text-label text-sm font-medium">
          Resource link <span className="text-hint font-normal">(optional)</span>
        </label>
        <Input
          id={`link-${index}`}
          type="text"
          value={item.link_url}
          onChange={(e) => onUpdate("link_url", e.target.value)}
          aria-describedby={`link-hint-${index}`}
          placeholder="https://..."
        />
        <p id={`link-hint-${index}`} className="text-hint text-xs">
          A YouTube video, article, or any helpful URL for this exercise.
        </p>
      </div>

      {/* Dog-specific note */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`dog_note-${index}`} className="text-label text-sm font-medium">
          Note for {dogName ?? "this dog"} <span className="text-hint font-normal">(optional)</span>
        </label>
        <Input
          id={`dog_note-${index}`}
          type="text"
          value={item.dog_note}
          onChange={(e) => onUpdate("dog_note", e.target.value)}
          aria-describedby={`dog-note-hint-${index}`}
          placeholder="Buddy tends to pull when he sees other dogs — use high-value treats"
        />
        <p id={`dog-note-hint-${index}`} className="text-hint text-xs">
          Personalized tip shown to the owner about their specific dog.
        </p>
      </div>
    </div>
  );
}
