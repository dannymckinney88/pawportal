"use client";

import { useState } from "react";

type PastSessionRow = {
  id: string;
  session_date: string;
  created_at: string;
  notes: string | null;
  homework_items: { title: string }[];
};

export function PastSessionsAccordion({ sessions }: { sessions: PastSessionRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section>
      <h2 className="text-foreground mb-3 text-xl font-bold">Past Sessions</h2>
      <div className="bg-card divide-border-subtle divide-y overflow-hidden rounded-2xl shadow-sm">
        {sessions.map((session) => {
          const isOpen = openId === session.id;
          const date = new Date(session.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });

          return (
            <div key={session.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : session.id)}
                aria-expanded={isOpen}
                aria-controls={`past-session-${session.id}`}
                className="hover:bg-background focus-visible:ring-primary focus-visible:bg-background flex min-h-11 w-full cursor-pointer items-center justify-between px-4 py-3 text-left focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="text-foreground text-sm font-semibold">{date}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className={`text-hint h-4 w-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isOpen && (
                <div id={`past-session-${session.id}`} className="px-4 pb-4">
                  {session.homework_items.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {session.homework_items.map((item, i) => (
                        <li key={i} className="text-text flex items-start gap-2 text-sm">
                          <span aria-hidden="true" className="text-border shrink-0">
                            •
                          </span>
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-hint text-sm">No homework items</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
