import Link from "next/link";
import { PageHeading } from "@/app/(trainer)/components/PageHeading";

export const DashboardHeader = () => {
  return (
    <div className="border-border mb-8 flex items-center justify-between border-b pb-6">
      <div>
        <PageHeading className="text-foreground text-2xl font-bold">Clients</PageHeading>
        <p className="text-muted-foreground mt-1 text-sm">Manage your training clients</p>
      </div>

      <Link
        href="/clients/new"
        className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary/20 flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      >
        + Add Client
      </Link>
    </div>
  );
};
