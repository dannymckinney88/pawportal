export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="/dashboard"
            className="text-base font-bold text-gray-900 hover:text-blue-600"
          >
            PawPortal
          </a>
          <div className="flex items-center gap-1">
            <a
              href="/dashboard"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Clients
            </a>
            <a
              href="/templates"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Templates
            </a>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
