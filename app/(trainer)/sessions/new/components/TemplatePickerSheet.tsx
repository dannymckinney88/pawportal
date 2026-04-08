"use client";

type Template = {
  id: string;
  title: string;
  description: string | null;
  steps: string[] | null;
  link_url: string | null;
  dog_note: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  templates: Template[];
  onApply: (template: Template) => void;
};

export function TemplatePickerSheet({
  open,
  onClose,
  templates,
  onApply,
}: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add from template"
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl max-h-[70vh] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-2 shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0">
          <p className="text-base font-semibold text-foreground">
            Add from Template
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template picker"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-hint hover:text-muted-foreground"
          >
            ✕
          </button>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto flex-1 px-4 pb-8">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No templates saved yet
              </p>
              <a
                href="/templates"
                className="mt-2 inline-block text-primary text-sm"
              >
                Create your first template
              </a>
            </div>
          ) : (
            templates.map((template) => {
              const filteredSteps =
                template.steps?.filter((s) => s.trim().length > 0) ?? [];
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onApply(template)}
                  className="w-full bg-background rounded-xl p-3 mb-2 min-h-[56px] flex flex-col justify-center text-left active:bg-accent"
                >
                  <span className="font-medium text-foreground text-sm">
                    {template.title}
                  </span>
                  {(filteredSteps.length > 0 ||
                    template.link_url ||
                    template.dog_note) && (
                    <span className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {filteredSteps.length > 0 && (
                        <span className="text-xs bg-primary-subtle text-primary-subtle-foreground rounded-full px-2 py-0.5">
                          {filteredSteps.length}{" "}
                          {filteredSteps.length === 1 ? "step" : "steps"}
                        </span>
                      )}
                      {template.link_url && (
                        <span className="text-xs text-hint">🔗</span>
                      )}
                      {template.dog_note && (
                        <span className="text-xs text-hint">🐾</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
