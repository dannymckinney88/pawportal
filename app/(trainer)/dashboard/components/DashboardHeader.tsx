import Link from "next/link";
import { PageHeading } from "@/app/(trainer)/components/PageHeading";

export const DashboardHeader = () => {
  return (
    <div className="border-border mb-6 flex items-center justify-between border-b pb-6">
      <div>
        <PageHeading className="text-foreground text-3xl font-bold">PawPortal</PageHeading>
        <p className="text-muted-foreground mt-1 text-sm">Your clients</p>
      </div>

      <Link
        href="/clients/new"
        className="bg-primary text-primary-foreground hover:bg-primary-hover flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium"
      >
        + Add Client
      </Link>
    </div>
  );
};
