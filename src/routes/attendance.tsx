import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { members, departments, type AttendanceStatus } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, CheckCircle, XCircle, Users, MinusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/attendance")({ component: AttendancePage });

const SERVICE_TYPES = [
  "Sunday Service",
  "Mid Week on Thursday",
  "Prayers on Friday"
] as const;

function AttendancePage() {
  const { can, attendanceRecords, setAttendanceRecords, membersList } = useApp();
  // Fall back to mock members if membersList isn't available (for now)
  const allMembers = membersList || members;
  
  if (!can("members")) return <AppShell><AccessDenied moduleName="Attendance" /></AppShell>;

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedService, setSelectedService] = useState<string>(SERVICE_TYPES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDep, setSelectedDep] = useState("all");
  const [memberStatuses, setMemberStatuses] = useState<Record<string, { status: AttendanceStatus; comment?: string }>>({});

  // Find the current record
  const currentRecord = attendanceRecords.find(r => r.date === selectedDate && r.serviceType === selectedService);

  // Update memberStatuses when date or service changes
  useEffect(() => {
    setMemberStatuses(currentRecord?.memberStatuses || {});
  }, [selectedDate, selectedService, currentRecord]);
  
  // Filter members
  const filteredMembers = allMembers.filter(m => {
    const matchesQuery = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDep = selectedDep === "all" || m.departments.includes(selectedDep);
    return matchesQuery && matchesDep;
  });

  const updateMemberStatus = (memberId: string, status: AttendanceStatus) => {
    setMemberStatuses(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], status }
    }));
  };

  const updateMemberComment = (memberId: string, comment: string) => {
    setMemberStatuses(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], comment }
    }));
  };

  const saveAttendance = () => {
    const updatedRecords = attendanceRecords.map(r => {
      if (r.date === selectedDate && r.serviceType === selectedService) {
        return { ...r, memberStatuses };
      }
      return r;
    });
    
    // If no record exists for this date/service, create one
    if (!currentRecord) {
      updatedRecords.push({
        id: `ATT-${selectedDate}-${selectedService.replace(/\s+/g, '-').toUpperCase()}`,
        date: selectedDate,
        serviceType: selectedService,
        memberStatuses
      });
    }
    
    setAttendanceRecords(updatedRecords);
    alert("Attendance saved successfully!");
  };

  const presentCount = Object.values(memberStatuses).filter(s => s.status === 'present').length;
  const totalCount = allMembers.length;
  const markedCount = Object.values(memberStatuses).filter(s => s.status !== null).length;
  const attendancePercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <AppShell>
      <PageContainer>
        <PageHeader 
          title="Attendance Tracking" 
          subtitle="Track attendance for services and events"
          actions={
            <Button onClick={saveAttendance} className="bg-navy text-navy-foreground hover:bg-navy/90">
              <CheckCircle className="h-4 w-4 mr-2" />Save Attendance
            </Button>
          }
        />

        {/* Stats and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Date</span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
            />
          </Card>
          
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Service Type</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
          
          <Card className="p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Attendance</span>
              <CheckCircle className="h-4 w-4 text-gold" />
            </div>
            <div className="text-2xl font-semibold">{presentCount} <span className="text-sm text-muted-foreground">/ {totalCount}</span></div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-navy" style={{ width: `${attendancePercent}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{attendancePercent}% Present | {markedCount} marked</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search by name…" 
                className="pl-9 w-full" 
              />
            </div>
            <Select value={selectedDep} onValueChange={setSelectedDep}>
              <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Member List */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium w-32">Status</th>
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Departments</th>
                  <th className="px-4 py-3 font-medium">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMembers.map((m) => {
                  const memberStatus = memberStatuses[m.id];
                  const initials = m.name.split(" ").map((s) => s[0]).slice(0, 2).join("");
                  return (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateMemberStatus(m.id, 'present')}
                            className={`p-1 ${memberStatus?.status === 'present' ? 'bg-green-100 text-green-700' : ''}`}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateMemberStatus(m.id, 'absent')}
                            className={`p-1 ${memberStatus?.status === 'absent' ? 'bg-red-100 text-red-700' : ''}`}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateMemberStatus(m.id, null)}
                            className={`p-1 ${memberStatus?.status === null ? 'bg-gray-100 text-gray-700' : ''}`}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-1">
                          {memberStatus?.status === 'present' && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">Present</Badge>
                          )}
                          {memberStatus?.status === 'absent' && (
                            <Badge className="bg-red-100 text-red-700 border-0 text-xs">Absent</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-navy/10 text-navy grid place-items-center text-xs font-semibold">{initials}</div>
                          <div>
                            <div className="font-medium">{m.name}</div>

                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {m.phone && <div className="text-xs sm:text-sm">{m.phone}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {m.departments.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                          {m.departments.map((d) => {
                            const dept = departments.find((x) => x.id === d);
                            return <Badge key={d} variant="secondary" className="bg-sky/15 text-sky-foreground border-0">{dept?.name}</Badge>;
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                          placeholder="Add comment…" 
                          value={memberStatus?.comment || ''}
                          onChange={(e) => updateMemberComment(m.id, e.target.value)}
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  );
}