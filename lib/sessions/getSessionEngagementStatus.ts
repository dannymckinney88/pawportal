export type SessionEngagementStatus = "not_viewed" | "viewed" | "in_progress" | "completed";

type GetSessionEngagementStatusArgs = {
  firstViewedAt: string | null;
  homeworkTotal: number;
  homeworkCompleted: number;
};

export const getSessionEngagementStatus = ({
  firstViewedAt,
  homeworkTotal,
  homeworkCompleted,
}: GetSessionEngagementStatusArgs): SessionEngagementStatus => {
  if (!firstViewedAt) return "not_viewed";

  if (homeworkTotal === 0) return "viewed";

  if (homeworkCompleted === 0) return "viewed";

  if (homeworkCompleted === homeworkTotal) return "completed";

  return "in_progress";
};

export const getSessionEngagementLabel = (status: SessionEngagementStatus): string => {
  switch (status) {
    case "not_viewed":
      return "Not viewed";
    case "viewed":
      return "Viewed";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
  }
};

export const getSessionEngagementClasses = (status: SessionEngagementStatus): string => {
  switch (status) {
    case "not_viewed":
      return "bg-secondary text-secondary-foreground";
    case "viewed":
      return "bg-accent text-accent-foreground";
    case "in_progress":
      return "bg-warning-subtle text-label border border-warning-border";
    case "completed":
      return "bg-success text-success-foreground";
  }
};
