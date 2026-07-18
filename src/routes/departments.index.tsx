import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { departments, members } from "@/lib/mock-data";
import type { Department } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Plus, Users2, CalendarClock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/departments/")({ component: DepartmentsPage });

function DepartmentsPage() {
  const { can } = useApp();
  if (!can("departments")) return <AppShell><AccessDenied moduleName="Departments" /></AppShell>;

  const [depts, setDepts] = useState<Department[]>(departments);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState<Omit<Department, "id">>({
    name: "",
    leader: "",
    members: 0,
    meets: "",
    color: "navy",
  });

  const handleAddDepartment = () => {
    if (!newDept.name.trim() || !newDept.leader.trim() || !newDept.meets.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const id = newDept.name.toLowerCase().replace(/\s+/g, "-");
    const deptToAdd: Department = {
      id,
      ...newDept,
    };

    setDepts([...depts, deptToAdd]);
    setIsAddModalOpen(false);
    setNewDept({
      name: "",
      leader: "",
      members: 0,
      meets: "",
      color: "navy",
    });
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Departments & Ministries"
          subtitle={`${depts.length} active departments`}
          actions={
            <Button
              size="sm"
              className="bg-navy text-navy-foreground hover:bg-navy/90"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />Add department
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {depts.map((d) => {
            const roster = members.filter((m) => m.departments.includes(d.id));
            const tone = d.color === "gold" ? "bg-gold text-gold-foreground" : d.color === "sky" ? "bg-sky text-sky-foreground" : "bg-navy text-navy-foreground";
            return (
              <Card key={d.id} className="p-5 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-11 w-11 rounded-lg grid place-items-center ${tone}`}>
                    <Users2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{d.members} members</span>
                </div>
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Led by {d.leader}</p>
                <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" /> {d.meets}
                </div>

                <div className="mt-4 flex -space-x-2">
                  {roster.slice(0, 5).map((m) => (
                    <div key={m.id} className="h-7 w-7 rounded-full bg-muted border-2 border-surface text-[10px] grid place-items-center font-semibold">
                      {m.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                  ))}
                  {roster.length > 5 && <div className="h-7 w-7 rounded-full bg-muted border-2 border-surface text-[10px] grid place-items-center text-muted-foreground">+{roster.length - 5}</div>}
                </div>

                <Link to="/departments/$id" params={{ id: d.id }} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy hover:text-navy/80">
                  View department <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>
            );
          })}
        </div>
      </PageContainer>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Department"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name</label>
            <Input
              placeholder="e.g. Worship Team"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Leader Name</label>
            <Input
              placeholder="e.g. John Doe"
              value={newDept.leader}
              onChange={(e) => setNewDept({ ...newDept, leader: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Schedule</label>
            <Input
              placeholder="e.g. Wed 6pm • Sun 8am"
              value={newDept.meets}
              onChange={(e) => setNewDept({ ...newDept, meets: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Members</label>
            <Input
              type="number"
              placeholder="0"
              value={newDept.members}
              onChange={(e) => setNewDept({ ...newDept, members: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color Theme</label>
            <Select
              value={newDept.color}
              onValueChange={(v: "navy" | "gold" | "sky") => setNewDept({ ...newDept, color: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="navy">Navy</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="sky">Sky Blue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="bg-navy text-navy-foreground" onClick={handleAddDepartment}>Add Department</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
