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
      className="bg-white rounded-2xl p-4 shadow-sm"
    >
      <p className="font-semibold text-gray-900">{sessionDate}</p>

      {summary && <p className="text-sm text-gray-600 mt-1">{summary}</p>}

      {trainerName && (
        <p className="text-xs text-gray-400 mt-3">— {trainerName}</p>
      )}
    </section>
  );
}
