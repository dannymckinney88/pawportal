import type { ClientWithEngagement } from "../types";
import { ClientEngagementCard } from "./ClientEngagementCard";

type ClientSectionProps = {
  title: string;
  description?: string;
  clients: ClientWithEngagement[];
};

export const ClientSection = ({ title, description, clients }: ClientSectionProps) => {
  if (clients.length === 0) return null;

  return (
    <section className="mb-8" aria-labelledby={`${title}-heading`}>
      <div className="mb-4">
        <h2 id={`${title}-heading`} className="text-foreground text-lg font-semibold">
          {title}
        </h2>

        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {clients.map((client) => (
          <ClientEngagementCard
            key={client.id}
            clientId={client.id}
            dogName={client.dogName}
            ownerName={client.ownerName}
            dogPhotoUrl={client.dogPhotoUrl}
            latestSession={client.latestSession}
            needsFollowUp={client.needsFollowUp}
          />
        ))}
      </div>
    </section>
  );
};
