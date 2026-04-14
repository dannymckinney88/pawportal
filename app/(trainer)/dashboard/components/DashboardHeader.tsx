import { PageHeading } from "@/app/(trainer)/components/PageHeading";
import { AddClientLink } from "./AddClientLink";

export const DashboardHeader = () => {
  return (
    <div className="border-border mb-8 flex items-center justify-between border-b pb-6">
      <div>
        <PageHeading
          id="dashboard-heading"
          tabIndex={-1}
          className="text-foreground text-2xl font-bold focus:outline-none"
        >
          Clients
        </PageHeading>
        <p className="text-muted-foreground mt-1 text-sm">Manage your training clients</p>
      </div>

      <AddClientLink />
    </div>
  );
};
