import {
  Activity,
  Boxes,
  GitBranch,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import {
  useState,
} from "react";
import {
  NavLink,
  Outlet,
} from "react-router";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Dependency Graph",
    href: "/graph",
    icon: GitBranch,
  },
  {
    name: "Services",
    href: "/services",
    icon: Boxes,
  },
  {
    name: "Incidents",
    href: "/incidents",
    icon: Activity,
  },
];

function NavigationLinks({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-6">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-violet-500/10 text-violet-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={18} />

            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AppShell() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100">

      {/* Desktop Sidebar */}

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0b0f18] lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <GitBranch size={19} />
              </div>

              <span className="text-lg font-semibold tracking-tight text-white">
                TraceGraph
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Infrastructure Intelligence
            </p>
          </div>
        </div>

        <NavigationLinks />

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm font-medium text-slate-200">
                Production
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Connected to TraceGraph infrastructure.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#0b0f18] shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                  <GitBranch size={19} />
                </div>

                <span className="font-semibold text-white">
                  TraceGraph
                </span>
              </div>

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <NavigationLinks
              onNavigate={() => {
                setMobileMenuOpen(false);
              }}
            />

            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.025] px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-slate-300">
                  Production connected
                </span>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {/* Main Application */}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#080b12]/90 px-4 backdrop-blur-xl sm:px-5 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => {
                setMobileMenuOpen(true);
              }}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Menu size={20} />
            </button>

            <span className="font-semibold text-white">
              TraceGraph
            </span>
          </div>

          <div className="hidden text-sm text-slate-500 lg:block">
            Production Infrastructure
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1.5 sm:px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="hidden text-xs font-medium text-emerald-300 sm:inline">
              System connected
            </span>

            <span className="text-xs font-medium text-emerald-300 sm:hidden">
              Online
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}