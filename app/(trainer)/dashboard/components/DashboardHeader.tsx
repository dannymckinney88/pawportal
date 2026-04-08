import Link from "next/link";

export const DashboardHeader = () => {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-border pb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">PawPortal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your clients</p>
      </div>

      <Link
        href="/clients/new"
        className="flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        + Add Client
      </Link>
    </div>
  );
};
