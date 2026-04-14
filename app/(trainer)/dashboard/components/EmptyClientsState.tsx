import Link from "next/link";
import { PawPrint } from "lucide-react";

export const EmptyClientsState = () => {
  return (
    <div className="bg-card rounded-2xl px-8 py-16 text-center shadow-sm">
      <PawPrint className="text-primary h-10 w-10" aria-hidden="true" />
      <p className="text-foreground mb-6 text-base font-medium">No clients yet</p>

      <Link
        href="/clients/new"
        className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex min-h-11 items-center rounded-lg px-6 py-2 text-sm font-medium"
      >
        Add your first client
      </Link>
    </div>
  );
};
