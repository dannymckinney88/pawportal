import Link from "next/link";
import { NavLinks } from "./components/NavLinks";
import { LogoutButton } from "./components/LogoutButton";
import { PawPrint } from "lucide-react";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-border-subtle bg-card border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="text-foreground focus-visible:ring-primary/20 flex items-center gap-2 rounded-md transition hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
          >
            <PawPrint className="text-primary h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="text-lg font-semibold tracking-tight">HeelFlow</span>
          </Link>

          <div className="flex items-center gap-1">
            <NavLinks />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}
