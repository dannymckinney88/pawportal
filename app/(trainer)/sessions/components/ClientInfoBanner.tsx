export function ClientInfoBanner({
  dogName,
  ownerName,
}: {
  dogName: string;
  ownerName: string;
}) {
  return (
    <div className="bg-accent rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
      <span className="text-2xl" aria-hidden="true">
        🐾
      </span>
      <div>
        <p className="font-semibold text-foreground">{dogName}</p>
        <p className="text-sm text-muted-foreground">{ownerName}</p>
      </div>
    </div>
  );
}
