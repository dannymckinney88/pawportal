type HomeworkProgressCardProps = {
  completedCount: number;
  totalCount: number;
};

const getProgressPercent = (completedCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;

  return Math.round((completedCount / totalCount) * 100);
};

/**
 * Homework progress card
 */
export const HomeworkProgressCard = ({ completedCount, totalCount }: HomeworkProgressCardProps) => {
  const progressPercent = getProgressPercent(completedCount, totalCount);
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <section
      aria-label="Homework progress"
      className={`rounded-2xl border p-4 shadow-sm ${
        isComplete ? "border-border bg-success" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-sm font-medium ${
              isComplete ? "text-success-foreground" : "text-label"
            }`}
          >
            {isComplete ? "Session complete" : "Progress"}
          </p>

          <p
            className={`mt-1 text-base font-semibold ${
              isComplete ? "text-success-foreground" : "text-foreground"
            }`}
          >
            {completedCount} of {totalCount} homework item
            {totalCount === 1 ? "" : "s"} completed
          </p>

          <p
            className={`mt-1 text-sm ${
              isComplete ? "text-success-foreground" : "text-muted-foreground"
            }`}
          >
            {isComplete
              ? "Nice work — you finished this session’s homework."
              : "Keep going — finish these before your next lesson."}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isComplete
              ? "bg-card text-success-foreground"
              : "bg-primary-subtle text-primary-subtle-foreground"
          }`}
        >
          {progressPercent}%
        </span>
      </div>

      <div className="bg-muted mt-4 h-2 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all ${
            isComplete ? "bg-success-foreground" : "bg-primary"
          }`}
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
