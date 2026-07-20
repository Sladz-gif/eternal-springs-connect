import { useState, useEffect, type ReactNode } from "react";
import { Bell, Search, PanelLeft, ChevronDown, Menu, LogOut, Settings } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import { useApp } from "@/lib/app-context";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

function Shell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    currentRole,
    roles,
    setCurrentRoleId,
    currentUser,
    signOut,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    users,
  } = useApp();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/signin" });
  };

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen h-screen flex w-full max-w-full bg-background text-foreground">
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 w-full h-full">
        <header className="h-16 border-b bg-surface flex items-center gap-3 px-4 sticky top-0 z-20 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <PanelLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="relative flex-1 min-w-0">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members, funds, projects, forms…"
              className="pl-9 h-10 bg-background w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted relative flex-shrink-0"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-gold text-gold-foreground text-xs font-semibold grid place-items-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNotifications}
                    className="text-xs text-muted-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3 py-1 w-full">
                        <div
                          className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? "bg-gold" : "bg-muted"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium truncate">{notif.title}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {notif.date}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 h-9 pl-2 pr-3 rounded-md hover:bg-muted flex-shrink-0">
              <div className="h-7 w-7 rounded-full bg-navy text-navy-foreground grid place-items-center text-xs font-semibold">
                {currentUser?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium leading-tight">
                  {currentUser?.name || "User"}
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight">
                  {currentRole.name}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Switch role</DropdownMenuLabel>
              {roles
                .filter((r) => users.some((u) => u.roleId === r.id))
                .map((r) => {
                  const userForRole = users.find((u) => u.roleId === r.id);
                  return (
                    <DropdownMenuItem key={r.id} onClick={() => setCurrentRoleId(r.id)}>
                      <div>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {userForRole?.name || r.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 min-w-0 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">{children}</div>;
}

export function AccessDenied({ moduleName }: { moduleName: string }) {
  return (
    <PageContainer>
      <div className="border rounded-xl bg-surface p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
          <span className="text-lg">🔒</span>
        </div>
        <h2 className="text-lg font-semibold">Access restricted</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your role does not include access to{" "}
          <span className="font-medium text-foreground">{moduleName}</span>.
          <br />
          Ask a Super Admin to grant permission.
        </p>
      </div>
    </PageContainer>
  );
}
