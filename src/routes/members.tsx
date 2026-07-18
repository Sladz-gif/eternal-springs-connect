import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { members, departments } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Search, UserPlus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/members")({ component: MembersPage });

function MembersPage() {
  const { can, membersList, setMembersList } = useApp();
  if (!can("members"))
    return (
      <AppShell>
        <AccessDenied moduleName="Members Directory" />
      </AppShell>
    );

  const [q, setQ] = useState("");
  const [dep, setDep] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberYearJoined, setNewMemberYearJoined] = useState(String(new Date().getFullYear()));
  const [newMemberDepartments, setNewMemberDepartments] = useState<string[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMemberDepartments, setEditingMemberDepartments] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return membersList.filter((m) => {
      const matchesQ = !q || m.name.toLowerCase().includes(q.toLowerCase());
      const matchesDep = dep === "all" || m.departments.includes(dep);
      return matchesQ && matchesDep;
    });
  }, [q, dep, membersList]);

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Members Directory"
          subtitle={`${membersList.length} congregants across ${departments.length} departments`}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={() => alert("Exporting members...")}>
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                className="bg-navy text-navy-foreground"
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add member
              </Button>
            </>
          }
        />

        <Card className="p-4 mb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name…"
                className="pl-9"
              />
            </div>
            <Select value={dep} onValueChange={setDep}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Departments</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Attendance</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((m) => {
                  const initials = m.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("");
                  return (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-navy/10 text-navy grid place-items-center text-xs font-semibold">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium">{m.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs sm:text-sm">{m.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {m.departments.length === 0 && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                          {m.departments.map((d) => {
                            const dept = departments.find((x) => x.id === d);
                            return (
                              <Badge
                                key={d}
                                variant="secondary"
                                className="bg-sky/15 text-sky-foreground border-0"
                              >
                                {dept?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-navy" style={{ width: `${m.attendance}%` }} />
                          </div>
                          <span className="text-xs font-medium">{m.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMemberId(m.id);
                            setEditingMemberDepartments([...m.departments]);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </PageContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewMemberName("");
          setNewMemberPhone("");
          setNewMemberYearJoined(String(new Date().getFullYear()));
          setNewMemberDepartments([]);
        }}
        title="Add New Member"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              placeholder="Enter full name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              placeholder="Enter phone number"
              type="tel"
              value={newMemberPhone}
              onChange={(e) => setNewMemberPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year Joined</label>
            <Input
              type="number"
              placeholder="YYYY"
              value={newMemberYearJoined}
              onChange={(e) => setNewMemberYearJoined(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departments</label>
            <div className="space-y-2">
              {departments.map((dept) => (
                <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMemberDepartments.includes(dept.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewMemberDepartments([...newMemberDepartments, dept.id]);
                      } else {
                        setNewMemberDepartments(
                          newMemberDepartments.filter((id) => id !== dept.id),
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <span className="text-sm">{dept.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setNewMemberName("");
                setNewMemberPhone("");
                setNewMemberDepartments([]);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-navy text-navy-foreground"
              onClick={() => {
                // Add new member to the mock data
                if (newMemberName.trim()) {
                  const newId = `M-${1000 + membersList.length}`;
                  const newMember = {
                    id: newId,
                    name: newMemberName.trim(),
                    email: "", // Keep email field for existing data
                    phone: newMemberPhone.trim(),
                    joined: newMemberYearJoined,
                    departments: newMemberDepartments,
                    attendance: 0,
                  };
                  setMembersList([...membersList, newMember]);
                  alert("Member added!");
                  setIsModalOpen(false);
                  setNewMemberName("");
                  setNewMemberPhone("");
                  setNewMemberYearJoined(String(new Date().getFullYear()));
                  setNewMemberDepartments([]);
                } else {
                  alert("Please enter a name for the new member.");
                }
              }}
            >
              Add Member
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editingMemberId}
        onClose={() => {
          setEditingMemberId(null);
          setEditingMemberDepartments([]);
        }}
        title="Edit Member Departments"
      >
        {(() => {
          const member = membersList.find((m) => m.id === editingMemberId);
          if (!member) return null;

          return (
            <div className="space-y-4">
              <div>
                <p className="text-sm">
                  <strong>Name:</strong> {member.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Phone:</strong> {member.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departments</label>
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingMemberDepartments.includes(dept.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingMemberDepartments([...editingMemberDepartments, dept.id]);
                          } else {
                            setEditingMemberDepartments(
                              editingMemberDepartments.filter((id) => id !== dept.id),
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-navy focus:ring-navy"
                      />
                      <span className="text-sm">{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingMemberId(null);
                    setEditingMemberDepartments([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-navy text-navy-foreground"
                  onClick={() => {
                    // Update the member's departments
                    setMembersList(
                      membersList.map((m) => {
                        if (m.id === editingMemberId) {
                          return { ...m, departments: editingMemberDepartments };
                        }
                        return m;
                      }),
                    );
                    alert("Member departments updated!");
                    setEditingMemberId(null);
                    setEditingMemberDepartments([]);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </AppShell>
  );
}
