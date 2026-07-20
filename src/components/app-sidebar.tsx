import { Link, useRouterState } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import {
  Church,
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Building2,
  Megaphone,
  Settings,
  X,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, moduleIds: ["dashboard"] },
  { to: "/members", label: "Members", icon: Users, moduleIds: ["members"] },
  { to: "/attendance", label: "Attendance", icon: ClipboardList, moduleIds: ["members"] },
  { to: "/departments", label: "Departments", icon: Building2, moduleIds: ["departments"] },
  { to: "/events", label: "Events", icon: CalendarDays, moduleIds: ["events"] },
  { to: "/finance", label: "Finance", icon: FileText, moduleIds: ["finance"] },
  { to: "/settings", label: "Settings", icon: Settings, moduleIds: ["settings"] },
];

interface AppSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function DesktopSidebar({ open }: { open: boolean }) {
  const { can, currentUser } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className="hidden lg:flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
      style={{ width: open ? "256px" : "64px", height: "100vh", transition: "width 0.2s ease" }}
    >
      <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border shrink-0">
        <div className="h-9 w-9 rounded-md bg-gold text-gold-foreground grid place-items-center shrink-0">
          <Church className="h-5 w-5" />
        </div>
        {open && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold tracking-tight truncate">ETS Congregation</div>
            <div className="text-[11px] text-sidebar-foreground/70 truncate">
              Eternal Springs Church
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems
          .filter((item) =>
            item.to === "/settings" ? Boolean(currentUser) : item.moduleIds.some((id) => can(id)),
          )
          .map((item) => {
            const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-gold"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60"
                  }
                  ${!open ? "justify-center" : ""}
                `}
                title={!open ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      {open && (
        <div className="p-3 border-t border-sidebar-border shrink-0">
          <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60 mb-1">
            Head Pastor
          </div>
          <div className="text-sm font-medium">Patrick Osborn</div>
        </div>
      )}
    </aside>
  );
}

function MobileSidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { can, currentUser } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
        style={{ height: "100vh" }}
      >
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border shrink-0">
          <div className="h-9 w-9 rounded-md bg-gold text-gold-foreground grid place-items-center shrink-0">
            <Church className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold tracking-tight truncate">ETS Congregation</div>
            <div className="text-[11px] text-sidebar-foreground/70 truncate">
              Eternal Springs Church
            </div>
          </div>
          <button
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-sidebar-accent"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems
            .filter((item) =>
              item.to === "/settings" ? Boolean(currentUser) : item.moduleIds.some((id) => can(id)),
            )
            .map((item) => {
              const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                    ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-gold"
                        : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
        </nav>

        <div className="p-3 border-t border-sidebar-border shrink-0">
          <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60 mb-1">
            Head Pastor
          </div>
          <div className="text-sm font-medium">Patrick Osborn</div>
        </div>
      </aside>
    </>
  );
}

export function AppSidebar({ open, setOpen }: AppSidebarProps) {
  return (
    <>
      <MobileSidebar open={open} setOpen={setOpen} />
      <DesktopSidebar open={open} />
    </>
  );
}
