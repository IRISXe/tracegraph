import {
  Search,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { ServiceCard } from "../features/services/ServiceCard";
import { ServicesError } from "../features/services/ServicesError";
import { ServicesSkeleton } from "../features/services/ServicesSkeleton";
import { useServices } from "../features/services/use-services";

export function ServicesPage() {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useServices();

  const filteredServices = useMemo(() => {
    if (!data) {
      return [];
    }

    const query =
      search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((service) => {
      return (
        service.name
          .toLowerCase()
          .includes(query) ||
        service.description
          .toLowerCase()
          .includes(query)
      );
    });
  }, [data, search]);

  if (isLoading) {
    return <ServicesSkeleton />;
  }

  if (isError || !data) {
    return (
      <ServicesError
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-violet-400">
            Infrastructure
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Services
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore production services,
            ownership and infrastructure
            dependencies.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {data.length} services monitored
        </div>
      </div>

      <div className="relative mt-8 max-w-md">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          placeholder="Search services..."
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/30 focus:bg-white/[0.04]"
        />
      </div>

      {data.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No services available
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Services will appear here once
            infrastructure data is available.
          </p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No matching services
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Try searching with a different
            service name.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filteredServices.map(
            (service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}