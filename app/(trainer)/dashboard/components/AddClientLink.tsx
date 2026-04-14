"use client";
import Link from "next/link";
import { setFocusIntent } from "@/lib/focus-intent";

export const AddClientLink = () => {
  return (
    <Link
      href="/clients/new"
      className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary/20 flex min-h-11 items-center gap-1 rounded-lg px-4 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={(e) => {
        setFocusIntent(
          e.currentTarget.matches(":focus-visible")
            ? { targetId: "new-client-heading", visible: true }
            : { targetId: "main-content", visible: false }
        );
      }}
    >
      <span aria-hidden="true">+ </span>
      <span> Add Client</span>
    </Link>
  );
};
