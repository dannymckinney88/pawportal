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
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
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
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sheet */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-picker-title"
        className={`bg-card fixed right-0 bottom-0 left-0 z-50 flex max-h-[70vh] flex-col rounded-t-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle — decorative */}
        <div
          aria-hidden="true"
          className="bg-border mx-auto mt-3 mb-2 h-1 w-10 shrink-0 rounded-full"
        />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <p id="template-picker-title" className="text-foreground text-base font-semibold">
            Add from Template
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template picker"
            className="text-hint hover:text-muted-foreground flex min-h-11 min-w-11 items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {templates.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">No templates saved yet</p>
              <a href="/templates" className="text-primary mt-2 inline-block text-sm">
                Create your first template
              </a>
            </div>
          ) : (
            templates.map((template) => {
              const filteredSteps = template.steps?.filter((s) => s.trim().length > 0) ?? [];
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onApply(template)}
                  className="bg-background active:bg-accent mb-2 flex min-h-14 w-full flex-col justify-center rounded-xl p-3 text-left"
                >
                  <span className="text-foreground text-sm font-medium">{template.title}</span>
                  {(filteredSteps.length > 0 || template.link_url || template.dog_note) && (
                    <span aria-hidden="true" className="mt-1 flex flex-wrap items-center gap-1.5">
                      {filteredSteps.length > 0 && (
                        <span className="bg-primary-subtle text-primary-subtle-foreground rounded-full px-2 py-0.5 text-xs">
                          {filteredSteps.length} {filteredSteps.length === 1 ? "step" : "steps"}
                        </span>
                      )}
                      {template.link_url && <span className="text-hint text-xs">🔗</span>}
                      {template.dog_note && <span className="text-hint text-xs">🐾</span>}
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
