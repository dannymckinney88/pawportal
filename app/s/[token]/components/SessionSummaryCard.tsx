type Props = {
  sessionDate: string;
  summary: string | null;
  trainerName: string | null | undefined;
};

export function SessionSummaryCard({ sessionDate, summary, trainerName }: Props) {
  return (
    <section aria-label="Session summary" className="bg-card rounded-2xl p-4 shadow-sm">
      <p className="text-foreground font-semibold">{sessionDate}</p>

      {summary && <p className="text-text mt-1 text-sm">{summary}</p>}

      {trainerName && <p className="text-hint mt-3 text-xs">— {trainerName}</p>}
    </section>
  );
}
