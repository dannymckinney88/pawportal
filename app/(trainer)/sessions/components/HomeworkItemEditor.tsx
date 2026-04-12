"use client";

// Shared per-item homework editor used by both the new-session form and the
// fields simultaneously (new flow).

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

  onUpdate: (
    field: "title" | "description" | "link_url" | "dog_note",
    value: string,
  ) => void;
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
    <div className="flex flex-col gap-3 border border-border-subtle rounded-xl p-4">
      {/* Item header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-label">Item {index + 1}</p>
        {itemsCount > 1 && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove homework item ${index + 1}`}
            className="text-danger text-sm hover:text-danger min-h-11 min-w-11 flex items-center justify-center"
          >
            Remove
          </button>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`title-${index}`}
          className="text-sm font-medium text-label"
        >
          Title{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id={`title-${index}`}
          type="text"
          value={item.title}
          onChange={(e) => onUpdate("title", e.target.value)}
          aria-required="true"
          aria-describedby={`title-hint-${index}`}
          placeholder="Loose-leash walking"
          className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <p id={`title-hint-${index}`} className="text-xs text-hint">
          A short name for this exercise or skill.
        </p>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`description-${index}`}
          className="text-sm font-medium text-label"
        >
          Description <span className="text-hint font-normal">(optional)</span>
        </label>
        <textarea
          id={`description-${index}`}
          value={item.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          rows={3}
          placeholder="General notes or context for this exercise..."
          className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-label">
          Steps <span className="text-hint font-normal">(optional)</span>
        </p>

        {item.steps.map((step, stepIndex) => (
          <div key={stepIndex} className="flex items-center gap-2">
            <span
              className="w-6 shrink-0 text-center text-xs font-semibold text-hint"
              aria-hidden="true"
            >
              {stepIndex + 1}.
            </span>

            <input
              type="text"
              value={step}
              onChange={(e) => onUpdateStep(stepIndex, e.target.value)}
              aria-label={`Item ${index + 1}, step ${stepIndex + 1}`}
              placeholder={`Step ${stepIndex + 1}`}
              className="flex-1 border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {item.steps.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveStep(stepIndex)}
                aria-label={`Remove step ${stepIndex + 1} from item ${index + 1}`}
                className="text-danger hover:text-danger min-h-11 min-w-11 flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={onAddStep}
          className="w-full border border-dashed border-border text-muted-foreground rounded-lg py-2 text-sm hover:bg-background min-h-11"
        >
          + Add step
        </button>
      </div>

      {/* Resource link */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`link-${index}`}
          className="text-sm font-medium text-label"
        >
          Resource link{" "}
          <span className="text-hint font-normal">(optional)</span>
        </label>
        <input
          id={`link-${index}`}
          type="text"
          value={item.link_url}
          onChange={(e) => onUpdate("link_url", e.target.value)}
          aria-describedby={`link-hint-${index}`}
          placeholder="https://..."
          className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <p id={`link-hint-${index}`} className="text-xs text-hint">
          A YouTube video, article, or any helpful URL for this exercise.
        </p>
      </div>

      {/* Dog-specific note */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`dog_note-${index}`}
          className="text-sm font-medium text-label"
        >
          Note for {dogName ?? "this dog"}{" "}
          <span className="text-hint font-normal">(optional)</span>
        </label>
        <input
          id={`dog_note-${index}`}
          type="text"
          value={item.dog_note}
          onChange={(e) => onUpdate("dog_note", e.target.value)}
          aria-describedby={`dog-note-hint-${index}`}
          placeholder="Buddy tends to pull when he sees other dogs — use high-value treats"
          className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <p id={`dog-note-hint-${index}`} className="text-xs text-hint">
          Personalized tip shown to the owner about their specific dog.
        </p>
      </div>
    </div>
  );
}
