type SessionProgressMetaProps = {
  homeworkCompleted: number;
  homeworkTotal: number;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
};

const formatDate = (value: string | null): string | null => {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const SessionProgressMeta = ({
  homeworkCompleted,
  homeworkTotal,
  firstViewedAt,
  lastViewedAt,
}: SessionProgressMetaProps) => {
  const viewedLabel = lastViewedAt ?? firstViewedAt;

  return (
    <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
      <p>
        Homework:{" "}
        <span className="font-medium text-foreground">
          {homeworkCompleted}/{homeworkTotal}
        </span>
      </p>

      {viewedLabel && (
        <p>
          Last viewed:{" "}
          <span className="font-medium text-foreground">
            {formatDate(viewedLabel)}
          </span>
        </p>
      )}
    </div>
  );
};
