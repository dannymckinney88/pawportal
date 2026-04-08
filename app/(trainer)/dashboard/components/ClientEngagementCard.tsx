import Image from "next/image";
import {
  getSessionEngagementStatus,
  getSessionEngagementLabel,
} from "@/lib/sessions/getSessionEngagementStatus";

type ClientEngagementCardProps = {
  clientId: string;
  dogName: string;
  ownerName: string;
  dogPhotoUrl: string | null;
  latestSession: {
    id: string;
    token: string;
    sessionNumber: number;
    createdAt: string;
    firstViewedAt: string | null;
    lastViewedAt: string | null;
    homeworkTotal: number;
    homeworkCompleted: number;
  } | null;
  needsFollowUp: boolean;
};

export const ClientEngagementCard = ({
  clientId,
  dogName,
  ownerName,
  dogPhotoUrl,
  latestSession,
  needsFollowUp,
}: ClientEngagementCardProps) => {
  const status = latestSession
    ? getSessionEngagementStatus({
        firstViewedAt: latestSession.firstViewedAt,
        homeworkTotal: latestSession.homeworkTotal,
        homeworkCompleted: latestSession.homeworkCompleted,
      })
    : null;

  return (
    <a
      href={`/clients/${clientId}`}
      className="flex gap-4 rounded-2xl bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {dogPhotoUrl ? (
        <Image
          src={dogPhotoUrl}
          alt={dogName}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl">
          🐾
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {dogName}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {ownerName}
            </p>
          </div>

          {needsFollowUp && (
            <span className="shrink-0 rounded-full border border-warning-border bg-warning-subtle px-2.5 py-1 text-xs font-medium text-label">
              Needs follow-up
            </span>
          )}
        </div>

        {latestSession ? (
          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm text-label">
              Latest: Session {latestSession.sessionNumber}
            </p>

            <p className="text-sm text-muted-foreground">
              {getSessionEngagementLabel(status!)}
              {" • "}
              {latestSession.homeworkCompleted}/{latestSession.homeworkTotal}{" "}
              done
            </p>

            {latestSession.lastViewedAt && (
              <p className="text-sm text-muted-foreground">
                Last viewed{" "}
                {new Date(latestSession.lastViewedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No sessions yet</p>
        )}
      </div>
    </a>
  );
};
