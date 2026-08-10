import { useParams } from "react-router";

export function ServiceDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();

  return (
    <section>
      <p className="text-sm font-medium text-violet-400">
        Service
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-white">
        Service Inspector
      </h1>

      <p className="mt-3 text-sm text-slate-400">
        Service ID: {id}
      </p>
    </section>
  );
}