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
};

export const ClientEngagementCard = ({
  clientId,
  dogName,
  ownerName,
  dogPhotoUrl,
  latestSession,
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
      className="bg-card rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all flex gap-4"
    >
      {dogPhotoUrl ? (
        <Image
          src={dogPhotoUrl}
          alt={dogName}
          width={56}
          height={56}
          className="w-14 h-14 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-2xl shrink-0">
          🐾
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-foreground truncate">
          {dogName}
        </p>

        <p className="text-sm text-muted-foreground truncate">{ownerName}</p>

        {latestSession ? (
          <div className="mt-2 flex flex-col gap-1">
            <p className="text-sm text-label">
              Latest: Session {latestSession.sessionNumber}
            </p>

            <p className="text-sm text-muted-foreground">
              {getSessionEngagementLabel(status!)}
              {" • "}
              {latestSession.homeworkCompleted}/{latestSession.homeworkTotal}{" "}
              done
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No sessions yet</p>
        )}
      </div>
    </a>
  );
};
