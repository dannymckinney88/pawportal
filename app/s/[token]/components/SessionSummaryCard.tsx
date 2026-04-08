type Props = {
  sessionDate: string;
  summary: string | null;
  trainerName: string | null | undefined;
};

export function SessionSummaryCard({
  sessionDate,
  summary,
  trainerName,
}: Props) {
  return (
    <section
      aria-label="Session summary"
      className="bg-card rounded-2xl p-4 shadow-sm"
    >
      <p className="font-semibold text-foreground">{sessionDate}</p>

      {summary && <p className="text-sm text-text mt-1">{summary}</p>}

      {trainerName && (
        <p className="text-xs text-hint mt-3">— {trainerName}</p>
      )}
    </section>
  );
}
