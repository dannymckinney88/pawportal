export type ClientRow = {
  id: string;
  dog_name: string;
  owner_name: string;
  dog_photo_url: string | null;
  created_at: string;
};

export type HomeworkItemRow = {
  id: string;
  is_checked: boolean | null;
};

export type SessionRow = {
  id: string;
  client_id: string;
  token: string;
  session_number: number;
  created_at: string;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  homework_items: HomeworkItemRow[] | null;
};

export type LatestSessionMeta = {
  id: string;
  token: string;
  sessionNumber: number;
  createdAt: string;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  homeworkTotal: number;
  homeworkCompleted: number;
};

export type ClientWithEngagement = {
  id: string;
  dogName: string;
  ownerName: string;
  dogPhotoUrl: string | null;
  latestSession: LatestSessionMeta | null;
  needsFollowUp: boolean;
};
