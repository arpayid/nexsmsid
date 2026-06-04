const foundations = [
  "Monorepo pnpm workspace",
  "Turborepo task runner",
  "NestJS API minimal",
  "Next.js App Router minimal",
  "PostgreSQL dan Redis via Docker"
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Phase 0 Foundation</p>
        <h1>NexSMSID</h1>
        <p className="lead">
          School Management System modern untuk SMK dan sekolah. Fase ini hanya menyiapkan pondasi
          monorepo, API minimal, web minimal, dan service database/cache.
        </p>
        <div className="status-grid" aria-label="Foundation status">
          {foundations.map((item) => (
            <div className="status-card" key={item}>
              <span aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
