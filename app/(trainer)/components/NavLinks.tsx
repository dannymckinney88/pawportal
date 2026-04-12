"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/dashboard"
        aria-current={pathname === "/dashboard" ? "page" : undefined}
        className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-background"
      >
        Clients
      </Link>

      <Link
        href="/templates"
        aria-current={pathname.startsWith("/templates") ? "page" : undefined}
        className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-background"
      >
        Templates
      </Link>
    </div>
  );
}
