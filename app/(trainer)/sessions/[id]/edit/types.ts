export type DBHomeworkItem = {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
};

export type EditSession = {
  id: string;
  summary: string;
  session_number: number;
  client_id: string;
};

export type EditSessionDog = {
  dog_name: string;
  owner_name: string;
};
