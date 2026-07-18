import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageContainer } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Wallet, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  totals,
  events as evts,
  projects,
  formatCurrency,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Index,
});

const attendanceData = totals.attendanceTrend.map((v, i) => ({
  week: `W${i + 1}`,
  value: v,
}));
const givingData = totals.givingTrend.map((v, i) => ({
  week: `W${i + 1}`,
  value: v,
}));

function Kpi({ icon: Icon, label, value, delta, tone = "navy" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; tone?: "navy" | "gold" | "sky" }) {
  const toneClass = tone === "gold" ? "bg-gold/15 text-gold-foreground" : tone === "sky" ? "bg-sky/20 text-sky-foreground" : "bg-navy/10 text-navy";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold mt-2">{value}</div>
        </div>
        <div className={`h-10 w-10 rounded-lg grid place-items-center ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
        <ArrowUpRight className="h-3 w-3 text-success" />
        <span className="text-success font-medium">{delta}</span> vs last month
      </div>
    </Card>
  );
}

function Index() {
  const navigate = useNavigate();
  
  return (
    <AppShell>
      <PageContainer>
        {/* Welcome banner */}
        <div className="rounded-2xl bg-navy text-navy-foreground p-6 lg:p-8 mb-6 flex flex-wrap items-center gap-6 justify-between">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-gold font-semibold">Eternal Springs Church</div>
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mt-2">
              Welcome, Pastor Patrick Osborn
            </h1>
            <p className="text-sm text-navy-foreground/75 mt-2 max-w-xl">
              Here's what's happening across the congregation this week — attendance is
              trending up and two fundraising projects are within reach of their goals.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gold text-gold-foreground grid place-items-center text-xl font-bold ring-4 ring-navy-foreground/10">
              PO
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className="cursor-pointer" onClick={() => navigate({ to: "/members" })}>
            <Kpi icon={Users} label="Total Members" value={String(totals.members)} delta="+4.2%" tone="navy" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate({ to: "/attendance" })}>
            <Kpi icon={TrendingUp} label="Sunday Attendance" value={String(totals.attendance)} delta="+3.1%" tone="sky" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate({ to: "/finance" })}>
            <Kpi icon={Wallet} label="Giving (Month)" value={formatCurrency(totals.givingThisMonth)} delta="+8.7%" tone="gold" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate({ to: "/events" })}>
            <Kpi icon={CalendarIcon} label="Upcoming Events" value={String(evts.length)} delta="2 new" tone="navy" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="cursor-pointer" onClick={() => navigate({ to: "/attendance" })}>
                <h3 className="font-semibold hover:text-navy transition-colors">Attendance trend</h3>
                <p className="text-xs text-muted-foreground">Last 7 Sundays</p>
              </div>
              <Badge variant="secondary" className="bg-sky/15 text-sky-foreground border-0">Weekly</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--sky)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--sky)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }} />
                  <Area type="monotone" dataKey="value" stroke="var(--sky)" strokeWidth={2} fill="url(#attFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="cursor-pointer" onClick={() => navigate({ to: "/finance" })}>
                <h3 className="font-semibold hover:text-navy transition-colors">Giving trend</h3>
                <p className="text-xs text-muted-foreground">Weekly total</p>
              </div>
              <Badge className="bg-gold text-gold-foreground border-0">Live</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={givingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }} />
                  <Bar dataKey="value" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upcoming events</h3>
              <span className="text-xs text-muted-foreground">{evts.length} scheduled</span>
            </div>
            <ul className="divide-y">
              {evts.slice(0, 5).map((e) => (
                <li key={e.id} className="py-3 flex items-center gap-4 cursor-pointer hover:bg-muted/30 rounded-lg px-2 -mx-2" onClick={() => navigate({ to: "/events" })}>
                  <div className="h-11 w-11 rounded-lg bg-navy/10 text-navy grid place-items-center">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.date} • {e.time} • {e.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{e.rsvp}</div>
                    <div className="text-xs text-muted-foreground">RSVPs</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Active fundraising</h3>
              <span className="text-xs text-muted-foreground">{projects.filter(p=>p.status==="Active").length} projects</span>
            </div>
            <div className="space-y-4">
              {projects.filter((p) => p.status === "Active").map((p) => {
                const pct = Math.round((p.raised / p.goal) * 100);
                return (
                  <div key={p.id} className="cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2" onClick={() => navigate({ to: "/finance" })}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-sm font-medium truncate pr-3">{p.name}</div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {formatCurrency(p.raised)} <span className="text-muted-foreground/60">/ {formatCurrency(p.goal)}</span>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="mt-1 text-xs text-muted-foreground">{pct}% funded • {p.contributors} contributors</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
