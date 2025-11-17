export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          PlushifyMe
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Transform Your Photos into Adorable Plushies
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <span className="text-sm text-muted-foreground">
            Setting up the application...
          </span>
        </div>
      </div>
    </main>
  );
}
