export function DashboardPage() {
  return (
    <section>
      <div>
        <p className="text-sm font-medium text-violet-400">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          System Overview
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Monitor infrastructure health, dependencies and
          active incidents across your production environment.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-8">
        <p className="text-sm text-slate-400">
          Dashboard metrics will appear here.
        </p>
      </div>
    </section>
  );
}