"use client";

import Image from "next/image";
import {
  getSessionEngagementStatus,
  getSessionEngagementLabel,
} from "@/lib/sessions/getSessionEngagementStatus";
import { setFocusIntent } from "@/lib/focus-intent";

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
      id={`client-card-${clientId}`}
      href={`/clients/${clientId}`}
      onClick={(e) => {
        setFocusIntent(
          e.currentTarget.matches(":focus-visible")
            ? { targetId: "client-heading", visible: true }
            : { targetId: "main-content", visible: false }
        );
      }}
      className="bg-card focus-visible:ring-primary flex gap-4 rounded-2xl p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {dogPhotoUrl ? (
        <Image
          src={dogPhotoUrl}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="bg-accent flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl"
        >
          🐾
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-foreground truncate text-base font-semibold">{dogName}</p>
            <p className="text-muted-foreground truncate text-sm">{ownerName}</p>
          </div>

          {needsFollowUp && (
            <span className="border-warning-border bg-warning-subtle text-label shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium">
              Needs follow-up
            </span>
          )}
        </div>

        {latestSession ? (
          <div className="mt-3 flex flex-col gap-1.5">
            <p className="text-sm">
              <span className="text-muted-foreground">Latest:</span>{" "}
              <span className="text-label font-medium">Session {latestSession.sessionNumber}</span>
            </p>

            <p className="text-muted-foreground text-sm">
              {getSessionEngagementLabel(status!)} {" • "}
              {latestSession.homeworkCompleted}/{latestSession.homeworkTotal} done
            </p>

            {latestSession.homeworkTotal > 0 && (
              <div
                className="bg-muted mt-1 h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <div
                  className="bg-primary h-full rounded-full"
                  style={{
                    width: `${(latestSession.homeworkCompleted / latestSession.homeworkTotal) * 100}%`,
                  }}
                />
              </div>
            )}

            {latestSession.lastViewedAt && (
              <p className="text-hint mt-1 text-xs">
                Last viewed{" "}
                {new Date(latestSession.lastViewedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground mt-2 text-sm">No sessions yet</p>
        )}
      </div>
    </a>
  );
};
