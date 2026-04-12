import { getSessionEngagementStatus } from "@/lib/sessions/getSessionEngagementStatus";
import type { ClientSessionRow, ClientSessionWithMeta } from "./types";

export function enrichSessionsWithMeta(
  sessions: ClientSessionRow[],
): ClientSessionWithMeta[] {
  return sessions.map((session) => {
    const homeworkItems = session.homework_items ?? [];
    const homeworkTotal = homeworkItems.length;
    const homeworkCompleted = homeworkItems.filter(
      (item) => item.is_checked,
    ).length;

    const status = getSessionEngagementStatus({
      firstViewedAt: session.first_viewed_at,
      homeworkTotal,
      homeworkCompleted,
    });

    return { ...session, homeworkTotal, homeworkCompleted, status };
  });
}
