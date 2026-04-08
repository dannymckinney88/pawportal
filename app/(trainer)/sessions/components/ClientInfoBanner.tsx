export function ClientInfoBanner({
  dogName,
  ownerName,
}: {
  dogName: string;
  ownerName: string;
}) {
  return (
    <div className="bg-blue-50 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
      <span className="text-2xl" aria-hidden="true">
        🐾
      </span>
      <div>
        <p className="font-semibold text-gray-900">{dogName}</p>
        <p className="text-sm text-gray-500">{ownerName}</p>
      </div>
    </div>
  );
}
