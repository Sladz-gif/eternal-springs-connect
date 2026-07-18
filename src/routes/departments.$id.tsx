import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { departments, members } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarClock, Megaphone } from "lucide-react";

export const Route = createFileRoute("/departments/$id")({ component: DepartmentDetail });

function DepartmentDetail() {
  const { id } = Route.useParams();
  const { can } = useApp();
  const dept = departments.find((d) => d.id === id);

  if (!can("departments")) return <AppShell><AccessDenied moduleName="Departments" /></AppShell>;
  if (!dept) return <AppShell><PageContainer><p>Department not found.</p></PageContainer></AppShell>;

  const roster = members.filter((m) => m.departments.includes(dept.id));
  const tone = dept.color === "gold" ? "bg-gold text-gold-foreground" : dept.color === "sky" ? "bg-sky text-sky-foreground" : "bg-navy text-navy-foreground";

  return (
    <AppShell>
      <PageContainer>
        <Link to="/departments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All departments
        </Link>

        <div className="rounded-2xl bg-surface border p-6 mb-6 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl grid place-items-center ${tone}`}>
              <span className="text-lg font-bold">{dept.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{dept.name}</h1>
              <p className="text-sm text-muted-foreground">Leader: {dept.leader} • {dept.members} members</p>
            </div>
          </div>
          <Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90">Manage roster</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-semibold mb-3">Roster</h3>
            <ul className="divide-y">
              {roster.map((m) => (
                <li key={m.id} className="py-2.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted text-xs grid place-items-center font-semibold">
                    {m.name.split(" ").map(s=>s[0]).slice(0,2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  </div>
                  <Badge variant="secondary" className="bg-muted border-0 text-xs">{m.attendance}% att.</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="h-4 w-4 text-navy" />
                <h3 className="font-semibold">Schedule</h3>
              </div>
              <p className="text-sm text-muted-foreground">{dept.meets}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2"><span>Next rehearsal</span><span className="font-medium">Thu 7:00 PM</span></div>
                <div className="flex justify-between border-b pb-2"><span>Service rotation</span><span className="font-medium">Sun 8:00 AM</span></div>
                <div className="flex justify-between"><span>Monthly review</span><span className="font-medium">Last Fri</span></div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="h-4 w-4 text-navy" />
                <h3 className="font-semibold">Announcements</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <div className="font-medium">Uniform fitting</div>
                  <div className="text-xs text-muted-foreground">Saturday 10am — Fellowship Hall</div>
                </li>
                <li>
                  <div className="font-medium">New members onboarding</div>
                  <div className="text-xs text-muted-foreground">Welcome kits ready for pickup</div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
