type Props = {
  sessionDate: string;
  summary: string | null;
  trainerName: string | null | undefined;
};

export function SessionSummaryCard({ sessionDate, summary, trainerName }: Props) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <h2 className="text-hint mb-2 text-xs font-semibold tracking-wide uppercase">
        Session Summary
      </h2>
      <p className="text-foreground font-semibold">{sessionDate}</p>

      {summary && <p className="text-text mt-1 text-sm">{summary}</p>}

      {trainerName && <p className="text-hint mt-3 text-xs">— {trainerName}</p>}
    </div>
  );
}
