export function ClientInfoBanner({ dogName, ownerName }: { dogName: string; ownerName: string }) {
  return (
    <div className="bg-accent mb-6 flex items-center gap-3 rounded-2xl px-4 py-3">
      <span className="text-2xl" aria-hidden="true">
        🐾
      </span>
      <div>
        <p className="text-foreground font-semibold">{dogName}</p>
        <p className="text-muted-foreground text-sm">{ownerName}</p>
      </div>
    </div>
  );
}
