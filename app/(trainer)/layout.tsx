export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="bg-card border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="/dashboard"
            className="text-base font-bold text-foreground hover:text-primary"
          >
            PawPortal
          </a>
          <div className="flex items-center gap-1">
            <a
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-background"
            >
              Clients
            </a>
            <a
              href="/templates"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-background"
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
