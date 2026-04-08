import type { SessionEngagementStatus } from "@/lib/sessions/getSessionEngagementStatus";

export type HomeworkItemRow = {
  id: string;
  is_checked: boolean | null;
};

/**
 * Session row from Supabase
 */
export type ClientSessionRow = {
  id: string;
  token: string;
  summary: string | null;
  session_number: number;
  created_at: string;
  sent_at: string | null;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
  homework_items: HomeworkItemRow[] | null;
};

export type ClientSessionWithMeta = ClientSessionRow & {
  homeworkTotal: number;
  homeworkCompleted: number;
  status: SessionEngagementStatus;
};
