export type NewSessionClient = {
  id: string;
  dog_name: string;
  owner_name: string;
};

export type HomeworkTemplate = {
  id: string;
  title: string;
  description: string | null;
  steps: string[] | null;
  link_url: string | null;
  dog_note: string | null;
};
