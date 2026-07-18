import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events")({ component: EventsPage });

function EventsPage() {
  const { can, eventsList, setEventsList } = useApp();
  if (!can("events")) return <AppShell><AccessDenied moduleName="Events & Planning" /></AppShell>;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventCapacity, setNewEventCapacity] = useState("100");

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Events & Planning"
          subtitle="Service planning, calendar, and RSVPs"
          actions={<Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90" onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Create event</Button>}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar strip */}
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-semibold mb-4">Upcoming service plan</h3>
            <div className="space-y-3">
              {eventsList.map((e) => {
                const rsvpPct = Math.round((e.rsvp / e.capacity) * 100);
                return (
                  <div key={e.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{e.name}</h4>
                          <Badge variant="secondary" className="bg-sky/15 text-sky-foreground border-0">{e.date}</Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{e.rsvp}<span className="text-muted-foreground text-sm font-normal"> / {e.capacity}</span></div>
                        <div className="text-xs text-muted-foreground">{rsvpPct}% RSVP</div>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-navy" style={{ width: `${rsvpPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-4">This week</h3>
            <div className="space-y-4 text-sm">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => (
                <div key={d} className="flex items-center gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center text-xs font-semibold shrink-0">{d}</div>
                  <div className="flex-1">
                    {i === 2 && <div><div className="font-medium">Bible Study</div><div className="text-xs text-muted-foreground">7:00 PM</div></div>}
                    {i === 3 && <div><div className="font-medium">Choir Rehearsal</div><div className="text-xs text-muted-foreground">7:00 PM</div></div>}
                    {i === 6 && <div><div className="font-medium">Sunday Service</div><div className="text-xs text-muted-foreground">9:00 AM</div></div>}
                    {![2,3,6].includes(i) && <div className="text-xs text-muted-foreground">No scheduled events</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageContainer>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setNewEventName("");
          setNewEventDate("");
          setNewEventTime("");
          setNewEventLocation("");
          setNewEventCapacity("100");
        }} 
        title="Create New Event"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <Input 
              placeholder="Enter event name" 
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input 
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <Input 
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input 
              placeholder="Enter location" 
              value={newEventLocation}
              onChange={(e) => setNewEventLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <Input 
              type="number"
              placeholder="Enter capacity" 
              value={newEventCapacity}
              onChange={(e) => setNewEventCapacity(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setNewEventName("");
                setNewEventDate("");
                setNewEventTime("");
                setNewEventLocation("");
                setNewEventCapacity("100");
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-navy text-navy-foreground" 
              onClick={() => {
                if (newEventName.trim() && newEventDate && newEventTime && newEventLocation.trim()) {
                  const newId = `EV-${Date.now()}`;
                  const newEvent = {
                    id: newId,
                    name: newEventName.trim(),
                    date: newEventDate,
                    time: newEventTime,
                    location: newEventLocation.trim(),
                    rsvp: 0,
                    capacity: parseInt(newEventCapacity) || 100
                  };
                  setEventsList([...eventsList, newEvent]);
                  alert("Event created successfully!");
                  setIsModalOpen(false);
                  setNewEventName("");
                  setNewEventDate("");
                  setNewEventTime("");
                  setNewEventLocation("");
                  setNewEventCapacity("100");
                } else {
                  alert("Please fill in all required fields.");
                }
              }}
            >
              Create Event
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
