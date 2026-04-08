export type Dog = {
  dog_name: string;
  dog_photo_url: string | null;
  owner_name: string;
};

export type Trainer = {
  name: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  google_review_url: string | null;
};

export type HomeworkItemRow = {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
  is_checked: boolean;
};

export type PastSessionRow = {
  id: string;
  session_date: string;
  created_at: string;
  notes: string | null;
  homework_items: { title: string }[];
};

export type SessionRow = {
  id: string;
  summary: string | null;
  created_at: string;
  client_id: string;
  trainer_id: string;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
};
