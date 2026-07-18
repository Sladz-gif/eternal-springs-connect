// Mock dataset for the ETS Congregation prototype.
// All data is in-memory / illustrative — no backend.

export type User = {
  id: string;
  name: string;
  code: string;
  roleId: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export const seedUsers: User[] = [
  { id: "user-1", name: "Patrick Osborn", code: "0000", roleId: "super-admin" },
];

export const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New Expense Submitted",
    message: "Media department submitted an expense for equipment rental",
    date: "2026-07-18",
    read: false,
  },
  {
    id: "notif-2",
    title: "Event RSVP Update",
    message: "15 new members RSVP'd to the upcoming Sunday service",
    date: "2026-07-17",
    read: false,
  },
  {
    id: "notif-3",
    title: "New Member Added",
    message: "Welcome Sarah Johnson to the Eternal Springs Church!",
    date: "2026-07-16",
    read: true,
  },
];

export type Role = {
  id: string;
  name: string;
  description: string;
  fullAccess?: boolean;
  modules: string[]; // module ids
  editable: string[]; // subset with edit rights
};

export type Module = { id: string; name: string; group: string };

export const modules: Module[] = [
  { id: "dashboard", name: "Dashboard", group: "Overview" },
  { id: "members", name: "Members Directory", group: "People" },
  { id: "attendance", name: "Attendance Tracking", group: "People" },
  { id: "departments", name: "Departments & Ministries", group: "People" },
  { id: "finance.giving", name: "Finance — Giving", group: "Finance" },
  { id: "finance.expenses", name: "Finance — Expenses", group: "Finance" },
  { id: "finance.funds", name: "Finance — Funds", group: "Finance" },
  { id: "finance.projects", name: "Finance — Fundraising Projects", group: "Finance" },
  { id: "finance.reports", name: "Finance — Reports", group: "Finance" },
  { id: "events", name: "Events & Planning", group: "Operations" },
  { id: "forms", name: "Forms & Data", group: "Operations" },
  { id: "settings", name: "Settings", group: "Admin" },
];

export const roles: Role[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full access to every module. Only role that can create users.",
    fullAccess: true,
    modules: modules.map((m) => m.id),
    editable: modules.map((m) => m.id),
  },
  {
    id: "finance-lead",
    name: "Finance Lead",
    description: "Full access to giving, expenses, funds, projects, and reports.",
    modules: ["dashboard", "finance.giving", "finance.expenses", "finance.funds", "finance.projects", "finance.reports"],
    editable: ["finance.giving", "finance.expenses", "finance.funds", "finance.projects"],
  },
  {
    id: "fundraising-coord",
    name: "Fundraising Coordinator",
    description: "Manages fundraising projects only. Cannot see the full ledger.",
    modules: ["dashboard", "finance.projects"],
    editable: ["finance.projects"],
  },
  {
    id: "media-lead",
    name: "Media Department Lead",
    description: "Manages the Media department roster.",
    modules: ["dashboard", "departments"],
    editable: ["departments"],
  },
  {
    id: "member-registrar",
    name: "Member Registrar",
    description: "Maintains the members directory and events RSVPs.",
    modules: ["dashboard", "members", "attendance", "events"],
    editable: ["members", "attendance", "events"],
  },
];

export type Department = {
  id: string;
  name: string;
  leader: string;
  members: number;
  meets: string;
  color: string;
};

export const departments: Department[] = [
  { id: "elders", name: "Elders", leader: "Pastor Patrick Osborn", members: 6, meets: "Mon 7pm • Sun 8am", color: "navy" },
  { id: "flow-choir", name: "Flow Choir", leader: "Deborah Ansah", members: 42, meets: "Thu 7pm • Sun 8am", color: "sky" },
  { id: "ushering", name: "Ushering", leader: "Michael Boateng", members: 28, meets: "Sun rotation", color: "navy" },
  { id: "hospitality", name: "Hospitality", leader: "Grace Mensah", members: 19, meets: "Sun 9am", color: "gold" },
  { id: "bussing", name: "Bussing (Transport)", leader: "Kwame Adjei", members: 12, meets: "Sun 6am pickup", color: "navy" },
  { id: "dance", name: "Dance", leader: "Abena Owusu", members: 24, meets: "Wed 6pm • Sat 10am", color: "sky" },
  { id: "drama", name: "Drama", leader: "Nathaniel Sarpong", members: 16, meets: "Fri 6pm", color: "gold" },
  { id: "media", name: "Media", leader: "Isaac Frimpong", members: 22, meets: "Sun rotation • Wed 5pm", color: "navy" },
  { id: "protocol", name: "Protocol", leader: "Ama Danso", members: 14, meets: "Sun 8am", color: "gold" },
];

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  departments: string[];
  attendance: number; // last 12 weeks pct
};

const firstNames = ["Patrick", "Sarah", "Emmanuel", "Rebecca", "Daniel", "Esther", "Joshua", "Ruth", "Samuel", "Naomi", "David", "Hannah", "Isaac", "Priscilla", "Kwame", "Abena", "Michael", "Grace", "Nathaniel", "Ama", "Deborah", "Elijah", "Miriam", "Caleb", "Lydia"];
const lastNames = ["Osborn", "Ansah", "Boateng", "Mensah", "Adjei", "Owusu", "Sarpong", "Frimpong", "Danso", "Otieno", "Nkrumah", "Asante", "Appiah", "Okafor", "Bediako", "Yeboah"];

export const members: Member[] = Array.from({ length: 48 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 3) % lastNames.length];
  const depIds = departments.map((d) => d.id);
  const deps = [depIds[i % depIds.length]];
  if (i % 4 === 0) deps.push(depIds[(i + 3) % depIds.length]);
  
  // Generate Ghanaian phone numbers (format: +233 XX XXX XXXX)
  const prefix = ["020", "024", "027", "050", "054", "055"][i % 6];
  const mid = String(100 + (i * 17) % 900);
  const end = String(1000 + (i * 23) % 9000);
  const phone = `+233 ${prefix.slice(1)} ${mid} ${end}`;
  
  return {
    id: `M-${String(1000 + i)}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@ets.church`,
    phone: phone,
    joined: String(2015 + (i % 10)),
    departments: deps,
    attendance: 60 + ((i * 13) % 40),
  };
});

// Override the first member to Pastor Patrick
members[0] = {
  id: "M-1000",
  name: "Patrick Osborn",
  email: "patrick.osborn@ets.church",
  phone: "+233 24 123 4567",
  joined: "2008",
  departments: ["elders"],
  attendance: 100,
};

export type Fund = { id: string; name: string; balance: number };
export const funds: Fund[] = [
  { id: "general", name: "General Fund", balance: 184230 },
  { id: "missions", name: "Missions", balance: 42890 },
  { id: "building", name: "Building Project", balance: 213540 },
  { id: "benevolence", name: "Benevolence", balance: 18770 },
  { id: "youth", name: "Youth Ministry", balance: 9420 },
];

export type Giving = {
  id: string;
  receipt: string;
  memberId: string;
  memberName: string;
  fundId: string;
  amount: number;
  type: "One-time" | "Recurring";
  date: string;
};

export const giving: Giving[] = Array.from({ length: 40 }, (_, i) => {
  const m = members[(i * 3) % members.length];
  const f = funds[i % funds.length];
  return {
    id: `G-${2000 + i}`,
    receipt: `ETS-2026-${String(4000 + i).padStart(5, "0")}`,
    memberId: m.id,
    memberName: m.name,
    fundId: f.id,
    amount: 50 + ((i * 37) % 950),
    type: i % 5 === 0 ? "Recurring" : "One-time",
    date: `2026-0${((i % 7) + 1)}-${String((i % 27) + 1).padStart(2, "0")}`,
  };
});

export type Expense = {
  id: string;
  department: string;
  category: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  description: string;
  receipt?: string;
};

export const expenses: Expense[] = [
  { id: "E-3001", department: "Media", category: "Equipment", amount: 1240, status: "Approved", date: "2026-06-04", description: "Wireless mic set — Shure BLX24", receipt: "media-mic.pdf" },
  { id: "E-3002", department: "Hospitality", category: "Supplies", amount: 320, status: "Approved", date: "2026-06-11", description: "Sunday refreshments — June" },
  { id: "E-3003", department: "Bussing", category: "Fuel", amount: 480, status: "Pending", date: "2026-07-02", description: "Van fuel — pickup routes" },
  { id: "E-3004", department: "Flow Choir", category: "Uniforms", amount: 2100, status: "Pending", date: "2026-07-08", description: "New robes — 14 members" },
  { id: "E-3005", department: "Drama", category: "Props", amount: 190, status: "Approved", date: "2026-05-22", description: "Easter drama props" },
  { id: "E-3006", department: "Media", category: "Software", amount: 680, status: "Approved", date: "2026-06-28", description: "ProPresenter license renewal" },
  { id: "E-3007", department: "Protocol", category: "Supplies", amount: 145, status: "Pending", date: "2026-07-10", description: "Guest lanyards & badges" },
];

export type Project = {
  id: string;
  name: string;
  description: string;
  goal: number;
  raised: number;
  deadline: string;
  status: "Active" | "Completed";
  contributors: number;
  updates: { date: string; note: string }[];
};

export const projects: Project[] = [
  {
    id: "P-1",
    name: "Sanctuary Expansion Phase II",
    description: "Extending the main auditorium to seat an additional 400 congregants, plus a new nursery wing.",
    goal: 350000,
    raised: 213540,
    deadline: "2026-12-31",
    status: "Active",
    contributors: 187,
    updates: [
      { date: "2026-07-01", note: "Foundation work begins next week." },
      { date: "2026-06-10", note: "Architect drawings finalized." },
      { date: "2026-04-02", note: "Campaign kickoff Sunday — thank you!" },
    ],
  },
  {
    id: "P-2",
    name: "Mission Trip — West Africa 2026",
    description: "Sponsoring 20 members for a two-week outreach mission across three regions.",
    goal: 60000,
    raised: 42890,
    deadline: "2026-09-15",
    status: "Active",
    contributors: 92,
    updates: [
      { date: "2026-06-22", note: "Team of 20 confirmed." },
      { date: "2026-05-01", note: "Visa applications submitted." },
    ],
  },
  {
    id: "P-3",
    name: "Community Food Drive",
    description: "Quarterly food packages for 500 families in the surrounding community.",
    goal: 25000,
    raised: 25000,
    deadline: "2026-05-01",
    status: "Completed",
    contributors: 143,
    updates: [
      { date: "2026-05-01", note: "500 families served. Goal reached!" },
      { date: "2026-03-15", note: "Partnering with two local grocers." },
    ],
  },
  {
    id: "P-4",
    name: "Youth Camp Scholarships",
    description: "Scholarships for 60 youth to attend summer camp.",
    goal: 18000,
    raised: 9420,
    deadline: "2026-08-01",
    status: "Active",
    contributors: 54,
    updates: [{ date: "2026-06-30", note: "34 scholarships secured so far." }],
  },
];

export type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  rsvp: number;
  capacity: number;
};

export const events: Event[] = [
  { id: "EV-1", name: "Sunday Worship Service", date: "2026-07-19", time: "9:00 AM", location: "Main Sanctuary", rsvp: 612, capacity: 800 },
  { id: "EV-2", name: "Midweek Bible Study", date: "2026-07-22", time: "7:00 PM", location: "Fellowship Hall", rsvp: 148, capacity: 200 },
  { id: "EV-3", name: "Youth Night", date: "2026-07-25", time: "6:30 PM", location: "Youth Center", rsvp: 89, capacity: 120 },
  { id: "EV-4", name: "Women's Conference", date: "2026-08-08", time: "9:00 AM", location: "Main Sanctuary", rsvp: 320, capacity: 500 },
  { id: "EV-5", name: "Baptism Sunday", date: "2026-08-16", time: "10:00 AM", location: "Main Sanctuary", rsvp: 24, capacity: 60 },
];

export type FormDef = {
  id: string;
  name: string;
  description: string;
  fields: { id: string; label: string; type: "text" | "number" | "date" | "select" | "checkbox" | "file"; options?: string[] }[];
  submissions: Record<string, string | number | boolean>[];
  shareId: string;
};

export const forms: FormDef[] = [
  {
    id: "F-1",
    name: "New Members Welcome",
    description: "Collects contact info and interests from first-time visitors.",
    shareId: "welcome-2026",
    fields: [
      { id: "name", label: "Full Name", type: "text" },
      { id: "email", label: "Email", type: "text" },
      { id: "phone", label: "Phone", type: "text" },
      { id: "visited", label: "First Visit Date", type: "date" },
      { id: "interest", label: "Interested Department", type: "select", options: ["Flow Choir", "Ushering", "Media", "Dance", "Drama"] },
      { id: "prayer", label: "Prayer Request", type: "checkbox" },
    ],
    submissions: [
      { name: "Adaeze Okafor", email: "adaeze@example.com", phone: "+1 415 555 0134", visited: "2026-07-06", interest: "Flow Choir", prayer: true },
      { name: "Marcus Bediako", email: "marcus.b@example.com", phone: "+1 415 555 0177", visited: "2026-07-06", interest: "Media", prayer: false },
      { name: "Elena Rossi", email: "elena.rossi@example.com", phone: "+1 415 555 0192", visited: "2026-07-13", interest: "Dance", prayer: true },
    ],
  },
  {
    id: "F-2",
    name: "Volunteer Signup — Mission Trip",
    description: "Applications for the West Africa 2026 outreach.",
    shareId: "mission-2026",
    fields: [
      { id: "name", label: "Full Name", type: "text" },
      { id: "age", label: "Age", type: "number" },
      { id: "passport", label: "Passport Valid Through", type: "date" },
      { id: "role", label: "Preferred Role", type: "select", options: ["Teaching", "Medical", "Logistics", "Music"] },
    ],
    submissions: [
      { name: "Joshua Otieno", age: 27, passport: "2029-04-11", role: "Teaching" },
      { name: "Priscilla Yeboah", age: 34, passport: "2027-08-22", role: "Medical" },
    ],
  },
  {
    id: "F-3",
    name: "Baptism Registration",
    description: "Register for the August 16 baptism service.",
    shareId: "baptism-aug",
    fields: [
      { id: "name", label: "Full Name", type: "text" },
      { id: "age", label: "Age", type: "number" },
      { id: "testimony", label: "Brief Testimony", type: "text" },
    ],
    submissions: [
      { name: "Caleb Nkrumah", age: 19, testimony: "Came to faith at youth camp." },
    ],
  },
];

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  date: string;
  channel: "Email" | "SMS" | "In-App";
};

export const announcements: Announcement[] = [
  { id: "A-1", title: "Sanctuary Expansion — Groundbreaking Sunday", body: "Join us this Sunday after service for the official groundbreaking ceremony.", audience: "All members", date: "2026-07-15", channel: "In-App" },
  { id: "A-2", title: "Media Team — Sunday Rotation", body: "Reminder: Isaac's team is on rotation this weekend. Call time 7:30am.", audience: "Media", date: "2026-07-14", channel: "SMS" },
  { id: "A-3", title: "Women's Conference — Early Bird Ends Friday", body: "Register before Friday to reserve your seat and welcome kit.", audience: "All members", date: "2026-07-12", channel: "Email" },
];

export type AttendanceStatus = 'present' | 'absent' | null;

export type AttendanceRecord = {
  id: string;
  date: string;
  serviceType: string;
  memberStatuses: Record<string, { status: AttendanceStatus; comment?: string }>;
};

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT-2026-07-13-SUN",
    date: "2026-07-13",
    serviceType: "Sunday Service",
    memberStatuses: Object.fromEntries(
      members.slice(0, 40).map(m => [m.id, { status: 'present' as const }])
    ),
  }
];

// KPI helpers
export const totals = {
  members: members.length,
  attendance: 612,
  attendanceTrend: [520, 548, 561, 579, 594, 605, 612],
  givingTrend: [12400, 13820, 11950, 14210, 15380, 14990, 16240],
  givingThisMonth: giving.reduce((s, g) => s + g.amount, 0),
};

export function formatCurrency(v: number, currency = "GHS", locale = "en-GH") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(v);
}
