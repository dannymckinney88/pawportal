"use client";

// Shared per-item homework editor used by both the new-session form and the
// edit-session form.  The `showModeToggle` prop controls whether the item
// shows a Description / Steps mode toggle (edit flow) or always shows both
// fields simultaneously (new flow).

export type ItemEditorItem = {
  title: string;
  description: string;
  link_url: string;
  dog_note: string;
  steps: string[];
  mode?: "description" | "steps";
};

type Props = {
  item: ItemEditorItem;
  index: number;
  itemsCount: number;
  dogName: string | undefined;
  /** When true, renders a Description / Steps mode toggle (edit form).
   *  When false, both description and steps fields are always visible (new form). */
  showModeToggle: boolean;
  onUpdate: (
    field: "title" | "description" | "link_url" | "dog_note",
    value: string,
  ) => void;
  onRemove: () => void;
  onSetMode?: (mode: "description" | "steps") => void;
  onUpdateStep: (stepIndex: number, value: string) => void;
  onAddStep: () => void;
  onRemoveStep: (stepIndex: number) => void;
};

export function HomeworkItemEditor({
  item,
  index,
  itemsCount,
  dogName,
  showModeToggle,
  onUpdate,
  onRemove,
  onSetMode,
  onUpdateStep,
  onAddStep,
  onRemoveStep,
}: Props) {
  const showDescription = !showModeToggle || item.mode === "description";
  const showSteps = !showModeToggle || item.mode === "steps";

  return (
    <div className="flex flex-col gap-3 border border-gray-100 rounded-xl p-4">
      {/* Item header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Item {index + 1}</p>
        {itemsCount > 1 && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove homework item ${index + 1}`}
            className="text-red-500 text-sm hover:text-red-700 min-h-11 min-w-11 flex items-center justify-center"
          >
            Remove
          </button>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`title-${index}`}
          className="text-sm font-medium text-gray-700"
        >
          Title{" "}
          <span className="text-red-500" aria-hidden="true">
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
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        <p id={`title-hint-${index}`} className="text-xs text-gray-400">
          A short name for this exercise or skill.
        </p>
      </div>

      {/* Mode toggle — edit form only */}
      {showModeToggle && (
        <div role="group" aria-label={`Content type for item ${index + 1}`}>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={() => onSetMode?.("description")}
              aria-pressed={item.mode === "description"}
              className={`px-4 py-2 rounded-md text-sm font-medium min-h-11 transition-colors ${
                item.mode === "description"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => onSetMode?.("steps")}
              aria-pressed={item.mode === "steps"}
              className={`px-4 py-2 rounded-md text-sm font-medium min-h-11 transition-colors ${
                item.mode === "steps"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Steps
            </button>
          </div>
        </div>
      )}

      {/* Description */}
      {showDescription && (
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`description-${index}`}
            className="text-sm font-medium text-gray-700"
          >
            Description{" "}
            {!showModeToggle && (
              <span className="text-gray-400 font-normal">(optional)</span>
            )}
          </label>
          <textarea
            id={`description-${index}`}
            value={item.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            rows={3}
            placeholder="General notes or context for this exercise..."
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
          />
        </div>
      )}

      {/* Steps */}
      {showSteps && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">
            Steps{" "}
            {!showModeToggle && (
              <span className="text-gray-400 font-normal">(optional)</span>
            )}
          </p>
          {item.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="flex items-center gap-2">
              <span
                className="text-xs font-semibold text-gray-400 w-6 shrink-0 text-center"
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
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              {item.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveStep(stepIndex)}
                  aria-label={`Remove step ${stepIndex + 1} from item ${index + 1}`}
                  className="text-red-400 hover:text-red-600 min-h-11 min-w-11 flex items-center justify-center shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={onAddStep}
            className="w-full border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 text-sm hover:bg-gray-50 min-h-11"
          >
            + Add step
          </button>
        </div>
      )}

      {/* Resource link */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`link-${index}`}
          className="text-sm font-medium text-gray-700"
        >
          Resource link{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id={`link-${index}`}
          type="text"
          value={item.link_url}
          onChange={(e) => onUpdate("link_url", e.target.value)}
          aria-describedby={`link-hint-${index}`}
          placeholder="https://..."
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        <p id={`link-hint-${index}`} className="text-xs text-gray-400">
          A YouTube video, article, or any helpful URL for this exercise.
        </p>
      </div>

      {/* Dog-specific note */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`dog_note-${index}`}
          className="text-sm font-medium text-gray-700"
        >
          Note for {dogName ?? "this dog"}{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id={`dog_note-${index}`}
          type="text"
          value={item.dog_note}
          onChange={(e) => onUpdate("dog_note", e.target.value)}
          aria-describedby={`dog-note-hint-${index}`}
          placeholder="Buddy tends to pull when he sees other dogs — use high-value treats"
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        <p id={`dog-note-hint-${index}`} className="text-xs text-gray-400">
          Personalized tip shown to the owner about their specific dog.
        </p>
      </div>
    </div>
  );
}
