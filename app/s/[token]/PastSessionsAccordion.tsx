"use client";

import { useState } from "react";

type PastSessionRow = {
  id: string;
  session_date: string;
  created_at: string;
  notes: string | null;
  homework_items: { title: string }[];
};

export function PastSessionsAccordion({
  sessions,
}: {
  sessions: PastSessionRow[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section aria-label="Past sessions">
      <h2 className="text-xl font-bold text-foreground mb-3">Past Sessions</h2>
      <div className="bg-card rounded-2xl shadow-sm divide-y divide-border-subtle overflow-hidden">
        {sessions.map((session) => {
          const isOpen = openId === session.id;
          const date = new Date(session.created_at).toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric" },
          );

          return (
            <div key={session.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : session.id)}
                aria-expanded={isOpen}
                aria-controls={`past-session-${session.id}`}
                className="w-full flex items-center justify-between px-4 py-3 text-left min-h-11 hover:bg-background focus:outline-none focus-visible:bg-background"
              >
                <span className="text-sm font-semibold text-foreground">
                  {date}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className={`w-4 h-4 text-hint shrink-0 transition-transform duration-200 ${
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
                        <li
                          key={i}
                          className="text-sm text-gray-600 flex gap-2 items-start"
                        >
                          <span
                            aria-hidden="true"
                            className="text-border shrink-0"
                          >
                            •
                          </span>
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No homework items
                    </p>
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
