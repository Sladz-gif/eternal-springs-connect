import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Download, ReceiptText, TrendingUp, PiggyBank, Target, Check, X, ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance")({ component: FinancePage });

const FUND_COLORS = ["var(--navy)", "var(--sky)", "var(--gold)", "oklch(0.65 0.16 150)", "oklch(0.6 0.15 300)"];

function FinancePage() {
  const { can, currentRole, givingList, expensesList, fundsList, projectsList, membersList, addGiving, addExpense, updateExpenseStatus, addFund, addProject } = useApp();
  const anyFinance = ["finance.giving","finance.expenses","finance.funds","finance.projects","finance.reports"].some(can);
  if (!anyFinance) return <AppShell><AccessDenied moduleName="Finance" /></AppShell>;

  const totalGiving = givingList.reduce((s, g) => s + g.amount, 0);
  const totalExpense = expensesList.filter(e=>e.status==="Approved").reduce((s,e)=>s+e.amount,0);
  const pendingCount = expensesList.filter(e=>e.status==="Pending").length;

  const [q, setQ] = useState("");
  const [isGivingModalOpen, setIsGivingModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Determine which tab to show by default based on permissions
  const defaultTab = can("finance.giving") ? "giving" : can("finance.expenses") ? "expenses" : can("finance.funds") ? "funds" : can("finance.projects") ? "projects" : "reports";

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Finance, Accounting & Fundraising"
          subtitle={`Signed in as ${currentRole.name}`}
          actions={
            <>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90"><Plus className="h-4 w-4 mr-2" />New entry <ChevronDown className="h-4 w-4 ml-2" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {can("finance.giving") && (
                    <DropdownMenuItem onClick={() => setIsGivingModalOpen(true)}>
                      <ReceiptText className="h-4 w-4 mr-2" />
                      Log giving
                    </DropdownMenuItem>
                  )}
                  {can("finance.expenses") && (
                    <DropdownMenuItem onClick={() => setIsExpenseModalOpen(true)}>
                      <ReceiptText className="h-4 w-4 mr-2" />
                      Submit expense
                    </DropdownMenuItem>
                  )}
                  {can("finance.funds") && (
                    <DropdownMenuItem onClick={() => setIsFundModalOpen(true)}>
                      <PiggyBank className="h-4 w-4 mr-2" />
                      Add fund
                    </DropdownMenuItem>
                  )}
                  {can("finance.projects") && (
                    <DropdownMenuItem onClick={() => setIsProjectModalOpen(true)}>
                      <Target className="h-4 w-4 mr-2" />
                      Add project
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Total giving</div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-semibold mt-2">{formatCurrency(totalGiving)}</div>
            <div className="text-xs text-muted-foreground mt-1">{givingList.length} contributions logged</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Approved expenses</div>
              <ReceiptText className="h-4 w-4 text-navy" />
            </div>
            <div className="text-2xl font-semibold mt-2">{formatCurrency(totalExpense)}</div>
            <div className="text-xs text-muted-foreground mt-1">{pendingCount} pending approval</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Total fund balance</div>
              <PiggyBank className="h-4 w-4 text-gold" />
            </div>
            <div className="text-2xl font-semibold mt-2">{formatCurrency(fundsList.reduce((s,f)=>s+f.balance,0))}</div>
            <div className="text-xs text-muted-foreground mt-1">Across {fundsList.length} funds</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Active projects</div>
              <Target className="h-4 w-4 text-sky" />
            </div>
            <div className="text-2xl font-semibold mt-2">{projectsList.filter(p=>p.status==="Active").length}</div>
            <div className="text-xs text-muted-foreground mt-1">{formatCurrency(projectsList.filter(p=>p.status==="Active").reduce((s,p)=>s+p.raised,0))} raised</div>
          </Card>
        </div>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4">
            {can("finance.giving") && <TabsTrigger value="giving">Giving</TabsTrigger>}
            {can("finance.expenses") && <TabsTrigger value="expenses">Expenses</TabsTrigger>}
            {can("finance.funds") && <TabsTrigger value="funds">Funds</TabsTrigger>}
            {can("finance.projects") && <TabsTrigger value="projects">Projects</TabsTrigger>}
            {can("finance.reports") && <TabsTrigger value="reports">Reports</TabsTrigger>}
          </TabsList>

          {can("finance.giving") && (
            <TabsContent value="giving">
              <Card className="overflow-hidden">
                <div className="p-4 border-b flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search receipt or member…" value={q} onChange={(e)=>setQ(e.target.value)} className="pl-9" />
                  </div>
                  <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => setIsGivingModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Log giving</Button>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead>
                      <tr className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3 font-medium">Receipt</th>
                        <th className="px-4 py-3 font-medium">Member</th>
                        <th className="px-4 py-3 font-medium">Fund</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {givingList.filter(g => !q || g.receipt.toLowerCase().includes(q.toLowerCase()) || g.memberName.toLowerCase().includes(q.toLowerCase())).map((g) => (
                        <tr key={g.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-xs">{g.receipt}</td>
                          <td className="px-4 py-3">{g.memberName}</td>
                          <td className="px-4 py-3">{fundsList.find(f=>f.id===g.fundId)?.name}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className={g.type === "Recurring" ? "bg-sky/15 text-sky-foreground border-0" : "bg-muted border-0"}>{g.type}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{g.date}</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(g.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          )}

          {can("finance.expenses") && (
            <TabsContent value="expenses">
              <Card className="overflow-hidden">
                <div className="p-4 border-b flex flex-wrap gap-3 items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Expense ledger</h3>
                    <p className="text-xs text-muted-foreground">Approval workflow — pending items require a Finance Lead.</p>
                  </div>
                  <Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90" onClick={() => setIsExpenseModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Submit expense</Button>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead>
                      <tr className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3 font-medium">Ref</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                        <th className="px-4 py-3 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {expensesList.map((e) => (
                        <tr key={e.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-xs">{e.id}</td>
                          <td className="px-4 py-3">{e.department}</td>
                          <td className="px-4 py-3">{e.category}</td>
                          <td className="px-4 py-3">
                            <div>{e.description}</div>
                            {e.receipt && <div className="text-xs text-muted-foreground">📎 {e.receipt}</div>}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                          <td className="px-4 py-3">
                            <Badge className={
                              e.status === "Approved" ? "bg-success text-success-foreground border-0" :
                              e.status === "Pending" ? "bg-gold text-gold-foreground border-0" :
                              "bg-destructive text-destructive-foreground border-0"
                            }>{e.status}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            {e.status === "Pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => updateExpenseStatus(e.id, "Approved")}><Check className="h-4 w-4 text-success" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => updateExpenseStatus(e.id, "Rejected")}><X className="h-4 w-4 text-destructive" /></Button>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(e.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          )}

          {can("finance.funds") && (
            <TabsContent value="funds">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-5 lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Fund balances</h3>
                    <Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90" onClick={() => setIsFundModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Add fund</Button>
                  </div>
                  <div className="space-y-3">
                    {fundsList.map((f, i) => {
                      const max = Math.max(...fundsList.map(x=>x.balance));
                      const pct = (f.balance / max) * 100;
                      return (
                        <div key={f.id}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-sm font-medium">{f.name}</span>
                            <span className="text-sm font-semibold">{formatCurrency(f.balance)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: FUND_COLORS[i % FUND_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold mb-4">Distribution</h3>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={fundsList} dataKey="balance" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                          {fundsList.map((_, i) => <Cell key={i} fill={FUND_COLORS[i % FUND_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>
          )}

          {can("finance.projects") && (
            <TabsContent value="projects">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Projects</h3>
                <Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90" onClick={() => setIsProjectModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Add project</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsList.map((p) => {
                  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
                  return (
                    <Card key={p.id} className="p-5 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold pr-3">{p.name}</h3>
                        <Badge className={p.status === "Active" ? "bg-sky text-sky-foreground border-0" : "bg-muted border-0 text-foreground"}>{p.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-semibold">{formatCurrency(p.raised)}</span>
                          <span className="text-muted-foreground">of {formatCurrency(p.goal)}</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                        <div className="mt-1.5 text-xs text-muted-foreground flex justify-between">
                          <span>{pct}% funded • {p.contributors} contributors</span>
                          <span>Deadline {p.deadline}</span>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-3">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Timeline</div>
                        <ul className="space-y-2 text-sm">
                          {p.updates.map((u, i) => (
                            <li key={i} className="flex gap-3">
                              <div className="h-2 w-2 rounded-full bg-gold mt-1.5 shrink-0" />
                              <div>
                                <div className="text-xs text-muted-foreground">{u.date}</div>
                                <div>{u.note}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          )}

          {can("finance.reports") && (
            <TabsContent value="reports">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h3 className="font-semibold mb-4">Income vs. Expense (last 6 months)</h3>
                  <div className="h-72">
                    <ResponsiveContainer>
                      <BarChart data={[
                        { m: "Feb", income: 42100, expense: 28400 },
                        { m: "Mar", income: 47200, expense: 31200 },
                        { m: "Apr", income: 51000, expense: 29800 },
                        { m: "May", income: 48900, expense: 33100 },
                        { m: "Jun", income: 53400, expense: 30600 },
                        { m: "Jul", income: 58200, expense: 27900 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="m" fontSize={12} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }} />
                        <Legend />
                        <Bar dataKey="income" fill="var(--navy)" radius={[4,4,0,0]} />
                        <Bar dataKey="expense" fill="var(--gold)" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="font-semibold mb-4">Budget vs. Actual by department</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                        <th className="py-2 font-medium">Department</th>
                        <th className="py-2 font-medium text-right">Budget</th>
                        <th className="py-2 font-medium text-right">Actual</th>
                        <th className="py-2 font-medium text-right">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { d: "Media", b: 3500, a: 1920 },
                        { d: "Hospitality", b: 1500, a: 1420 },
                        { d: "Flow Choir", b: 3000, a: 2100 },
                        { d: "Bussing", b: 2000, a: 2380 },
                        { d: "Drama", b: 800, a: 490 },
                      ].map((r) => {
                        const v = r.b - r.a;
                        return (
                          <tr key={r.d}>
                            <td className="py-2.5">{r.d}</td>
                            <td className="py-2.5 text-right">{formatCurrency(r.b)}</td>
                            <td className="py-2.5 text-right">{formatCurrency(r.a)}</td>
                            <td className={`py-2.5 text-right font-medium ${v >= 0 ? "text-success" : "text-destructive"}`}>
                              {v >= 0 ? "+" : ""}{formatCurrency(v)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </PageContainer>

      {/* Log Giving Modal */}
      <Modal isOpen={isGivingModalOpen} onClose={() => setIsGivingModalOpen(false)} title="Log Giving">
        <GivingForm onSubmit={(data) => { addGiving(data); setIsGivingModalOpen(false); }} onCancel={() => setIsGivingModalOpen(false)} members={membersList} funds={fundsList} />
      </Modal>

      {/* Submit Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Submit Expense">
        <ExpenseForm onSubmit={(data) => { addExpense(data); setIsExpenseModalOpen(false); }} onCancel={() => setIsExpenseModalOpen(false)} departments={["Elders", "Flow Choir", "Ushering", "Hospitality", "Bussing", "Dance", "Drama", "Media", "Protocol"]} />
      </Modal>

      {/* Add Fund Modal */}
      <Modal isOpen={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} title="Add Fund">
        <FundForm onSubmit={(data) => { addFund(data); setIsFundModalOpen(false); }} onCancel={() => setIsFundModalOpen(false)} />
      </Modal>

      {/* Add Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Add Project">
        <ProjectForm onSubmit={(data) => { addProject(data); setIsProjectModalOpen(false); }} onCancel={() => setIsProjectModalOpen(false)} />
      </Modal>
    </AppShell>
  );
}

// Form Components

function GivingForm({ onSubmit, onCancel, members, funds }: { onSubmit: (data: { memberId: string; memberName: string; fundId: string; amount: number; type: "One-time" | "Recurring"; date: string; }) => void; onCancel: () => void; members: any[]; funds: any[]; }) {
  const [openMember, setOpenMember] = useState(false);
  const [memberId, setMemberId] = useState(members[0]?.id || "");
  const [fundId, setFundId] = useState(funds[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"One-time" | "Recurring">("One-time");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const member = members.find(m => m.id === memberId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Member</label>
        <Popover open={openMember} onOpenChange={setOpenMember}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {member ? member.name : "Select member"}
              <Search className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search member..." />
              <CommandList>
                <CommandEmpty>No member found.</CommandEmpty>
                <CommandGroup>
                  {members.map((m) => (
                    <CommandItem
                      key={m.id}
                      value={m.name}
                      onSelect={() => {
                        setMemberId(m.id);
                        setOpenMember(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", memberId === m.id ? "opacity-100" : "opacity-0")} />
                      {m.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fund</label>
        <Select value={fundId} onValueChange={setFundId}>
          <SelectTrigger><SelectValue placeholder="Select fund" /></SelectTrigger>
          <SelectContent>{funds.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select value={type} onValueChange={(v) => setType(v as "One-time" | "Recurring")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="One-time">One-time</SelectItem>
            <SelectItem value="Recurring">Recurring</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-gold text-gold-foreground" onClick={() => onSubmit({ memberId, memberName: member?.name || "", fundId, amount: Number(amount), type, date })}>Log Giving</Button>
      </div>
    </div>
  );
}

function ExpenseForm({ onSubmit, onCancel, departments }: { onSubmit: (data: { department: string; category: string; description: string; date: string; amount: number; receipt?: string; }) => void; onCancel: () => void; departments: string[]; }) {
  const [department, setDepartment] = useState(departments[0] || "");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Supplies, Equipment" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-navy text-navy-foreground" onClick={() => onSubmit({ department, category, description, date, amount: Number(amount) })}>Submit Expense</Button>
      </div>
    </div>
  );
}

function FundForm({ onSubmit, onCancel }: { onSubmit: (data: { name: string; }) => void; onCancel: () => void; }) {
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Fund Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter fund name" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-navy text-navy-foreground" onClick={() => onSubmit({ name })}>Add Fund</Button>
      </div>
    </div>
  );
}

function ProjectForm({ onSubmit, onCancel }: { onSubmit: (data: { name: string; description: string; goal: number; deadline: string; }) => void; onCancel: () => void; }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Goal Amount</label>
        <Input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Enter goal amount" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-navy text-navy-foreground" onClick={() => onSubmit({ name, description, goal: Number(goal), deadline })}>Add Project</Button>
      </div>
    </div>
  );
}
