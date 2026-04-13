export const EmptyClientsState = () => {
  return (
    <div className="bg-card rounded-2xl px-8 py-16 text-center shadow-sm">
      <p className="mb-4 text-5xl">🐾</p>
      <p className="text-foreground mb-6 text-base font-medium">No clients yet</p>

      <a
        href="/clients/new"
        className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex min-h-11 items-center rounded-lg px-6 py-2 text-sm font-medium"
      >
        Add your first client
      </a>
    </div>
  );
};
