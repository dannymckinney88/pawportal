"use client";

import { useEffect, useRef } from "react";
import type { HomeworkTemplate } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  templates: HomeworkTemplate[];
  onApply: (template: HomeworkTemplate) => void;
};

export function TemplatePickerSheet({ open, onClose, templates, onApply }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Set inert on dialog when closed so it is unreachable by keyboard and AT
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.removeAttribute("inert");
    } else {
      el.setAttribute("inert", "");
    }
  }, [open]);

  // Capture trigger element when opening; restore focus on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Move focus into dialog after paint so the CSS transition has started
      const raf = requestAnimationFrame(() => {
        const closeBtn = dialogRef.current?.querySelector<HTMLElement>("button");
        closeBtn?.focus();
      });
      return () => cancelAnimationFrame(raf);
    } else {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Prevent background scroll on mobile when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tab focus trap + Escape to close
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop — click to close, hidden from AT */}
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-picker-title"
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl max-h-[70vh] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle — decorative */}
        <div
          aria-hidden="true"
          className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-2 shrink-0"
        />

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0">
          <p
            id="template-picker-title"
            className="text-base font-semibold text-foreground"
          >
            Add from Template
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template picker"
            className="min-h-11 min-w-11 flex items-center justify-center text-hint hover:text-muted-foreground"
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
                  className="w-full bg-background rounded-xl p-3 mb-2 min-h-14 flex flex-col justify-center text-left active:bg-accent"
                >
                  <span className="font-medium text-foreground text-sm">
                    {template.title}
                  </span>
                  {(filteredSteps.length > 0 ||
                    template.link_url ||
                    template.dog_note) && (
                    <span
                      aria-hidden="true"
                      className="flex items-center gap-1.5 mt-1 flex-wrap"
                    >
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
