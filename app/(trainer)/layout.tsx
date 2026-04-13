import Link from "next/link";
import { NavLinks } from "./components/NavLinks";
import { LogoutButton } from "./components/LogoutButton";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="bg-card border-border-subtle border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-primary text-xl">🐾</span>
            <span className="text-foreground text-lg font-semibold">HeelFlow</span>
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
