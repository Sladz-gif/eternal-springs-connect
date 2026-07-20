import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { type Event } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Calendar, Search, Filter, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/events")({
  component: RouteComponent,
});

function RouteComponent() {
  const { can, canEdit, eventsList, addEvent, updateEvent, deleteEvent } = useApp();

  if (!can("events")) {
    return <AccessDenied module="Events & Planning" />;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [filterView, setFilterView] = useState("all"); // all, upcoming, past
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    location: "",
    rsvp: 0,
    capacity: 100,
  });

  const filteredEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return eventsList
      .filter((event) => {
        const matchesSearch =
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesView =
          filterView === "all"
            ? true
            : filterView === "upcoming"
              ? event.date >= today
              : filterView === "past"
                ? event.date < today
                : true;
        return matchesSearch && matchesView;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [eventsList, searchQuery, filterView]);

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.time && newEvent.location) {
      addEvent(newEvent as Omit<Event, "id">);
      setNewEvent({
        name: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM",
        location: "",
        rsvp: 0,
        capacity: 100,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleEditEvent = () => {
    if (currentEvent) {
      updateEvent(currentEvent.id, newEvent);
      setIsEditModalOpen(false);
      setCurrentEvent(null);
    }
  };

  const openEditModal = (event: Event) => {
    setCurrentEvent(event);
    setNewEvent({ ...event });
    setIsEditModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Events & Planning"
          subtitle="Manage church services, meetings, and activities"
          actions={
            canEdit("events") && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-navy text-navy-foreground hover:bg-navy/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            )
          }
        />

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterView} onValueChange={setFilterView}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="grid gap-4">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events found</p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="hover:border-navy transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-navy" />
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            RSVP: {event.rsvp} / {event.capacity}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((event.rsvp / event.capacity) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-navy h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min((event.rsvp / event.capacity) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {canEdit("events") && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => deleteEvent(event.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Event Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new church service, meeting, or activity
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <Input
                  placeholder="Sunday Worship Service"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Input
                    type="time"
                    value={
                      newEvent.time?.replace(/\s/g, "").toLowerCase() === "am" ||
                      newEvent.time?.replace(/\s/g, "").toLowerCase() === "pm"
                        ? ""
                        : newEvent.time
                    }
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  placeholder="Main Sanctuary"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current RSVP</label>
                  <Input
                    type="number"
                    min="0"
                    value={newEvent.rsvp}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, rsvp: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <Input
                    type="number"
                    min="1"
                    value={newEvent.capacity}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 100 })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-navy text-navy-foreground hover:bg-navy/90"
                onClick={handleAddEvent}
                disabled={!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.location}
              >
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Event Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update event details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <Input
                  placeholder="Sunday Worship Service"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  placeholder="Main Sanctuary"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current RSVP</label>
                  <Input
                    type="number"
                    min="0"
                    value={newEvent.rsvp}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, rsvp: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <Input
                    type="number"
                    min="1"
                    value={newEvent.capacity}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 100 })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-navy text-navy-foreground hover:bg-navy/90"
                onClick={handleEditEvent}
                disabled={!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.location}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </AppShell>
  );
}
