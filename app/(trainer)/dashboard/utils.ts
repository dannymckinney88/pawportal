import { getSessionEngagementStatus } from "@/lib/sessions/getSessionEngagementStatus";
import type { ClientRow, ClientWithEngagement, SessionRow } from "./types";

const DAYS_TO_FOLLOW_UP = 3;

/**
 * Check if a session needs follow-up
 */
export const getNeedsFollowUp = ({
  createdAt,
  firstViewedAt,
  status,
}: {
  createdAt: string;
  firstViewedAt: string | null;
  status: ReturnType<typeof getSessionEngagementStatus>;
}) => {
  const now = Date.now();
  const createdTime = new Date(createdAt).getTime();
  const viewedTime = firstViewedAt ? new Date(firstViewedAt).getTime() : null;

  const daysSinceCreated = (now - createdTime) / (1000 * 60 * 60 * 24);
  const daysSinceViewed = viewedTime !== null ? (now - viewedTime) / (1000 * 60 * 60 * 24) : null;

  if (status === "not_viewed" && daysSinceCreated >= DAYS_TO_FOLLOW_UP) {
    return true;
  }

  if (status === "viewed" && daysSinceViewed !== null && daysSinceViewed >= 2) {
    return true;
  }

  return false;
};

/**
 * Build latest session lookup by client
 */
export const buildLatestSessionByClient = (sessions: SessionRow[]) => {
  const latestSessionByClient = new Map<string, SessionRow>();

  sessions.forEach((session) => {
    if (!latestSessionByClient.has(session.client_id)) {
      latestSessionByClient.set(session.client_id, session);
    }
  });

  return latestSessionByClient;
};

/**
 * Build clients with engagement meta
 */
export const buildClientsWithEngagement = (
  clients: ClientRow[],
  sessions: SessionRow[]
): ClientWithEngagement[] => {
  const latestSessionByClient = buildLatestSessionByClient(sessions);

  return clients.map((client) => {
    const latestSession = latestSessionByClient.get(client.id);

    if (!latestSession) {
      return {
        id: client.id,
        dogName: client.dog_name,
        ownerName: client.owner_name,
        dogPhotoUrl: client.dog_photo_url,
        latestSession: null,
        needsFollowUp: false,
      };
    }

    const homeworkItems = latestSession.homework_items ?? [];
    const homeworkTotal = homeworkItems.length;
    const homeworkCompleted = homeworkItems.filter((item) => item.is_checked).length;

    const status = getSessionEngagementStatus({
      firstViewedAt: latestSession.first_viewed_at,
      homeworkTotal,
      homeworkCompleted,
    });

    return {
      id: client.id,
      dogName: client.dog_name,
      ownerName: client.owner_name,
      dogPhotoUrl: client.dog_photo_url,
      latestSession: {
        id: latestSession.id,
        token: latestSession.token,
        sessionNumber: latestSession.session_number,
        createdAt: latestSession.created_at,
        firstViewedAt: latestSession.first_viewed_at,
        lastViewedAt: latestSession.last_viewed_at,
        homeworkTotal,
        homeworkCompleted,
      },
      needsFollowUp: getNeedsFollowUp({
        createdAt: latestSession.created_at,
        firstViewedAt: latestSession.first_viewed_at,
        status,
      }),
    };
  });
};
