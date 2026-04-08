export const EmptyClientsState = () => {
  return (
    <div className="rounded-2xl bg-card px-8 py-16 text-center shadow-sm">
      <p className="mb-4 text-5xl">🐾</p>
      <p className="mb-6 text-base font-medium text-foreground">
        No clients yet
      </p>

      <a
        href="/clients/new"
        className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        Add your first client
      </a>
    </div>
  );
};
