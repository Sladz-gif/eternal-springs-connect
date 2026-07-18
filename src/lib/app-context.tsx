import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  roles as seedRoles,
  modules as seedModules,
  type Role,
  type Module,
  seedUsers,
  type User,
  forms as seedForms,
  type FormDef,
  attendanceRecords as seedAttendanceRecords,
  type AttendanceRecord,
  members as seedMembers,
  type Member,
  events as seedEvents,
  type Event,
  giving as seedGiving,
  type Giving,
  expenses as seedExpenses,
  type Expense,
  funds as seedFunds,
  type Fund,
  projects as seedProjects,
  type Project,
  seedNotifications,
  type Notification,
} from "./mock-data";
import { generateCode } from "./utils";

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", locale: "en-US" },
  { code: "EUR", symbol: "€", locale: "en-IE" },
  { code: "GBP", symbol: "£", locale: "en-GB" },
  { code: "GHS", symbol: "₵", locale: "en-GH" },
  { code: "NGN", symbol: "₦", locale: "en-NG" },
];

export const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "sw", name: "Kiswahili" },
];

type Ctx = {
  roles: Role[];
  modules: Module[];
  currentRoleId: string;
  setCurrentRoleId: (id: string) => void;
  currentRole: Role;
  can: (moduleId: string) => boolean;
  canEdit: (moduleId: string) => boolean;
  addRole: (r: Omit<Role, "id"> & { userName: string; code?: string }) => void;
  addModule: (m: Omit<Module, "id"> & { id?: string }) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  users: User[];
  currentUser: User | null;
  signIn: (name: string, code: string) => boolean;
  signOut: () => void;
  updateUserCode: (userId: string, newCode: string) => void;
  regenerateUserCode: (userId: string) => void;
  forms: FormDef[];
  setForms: (forms: FormDef[]) => void;
  addFormSubmission: (formId: string, submission: Record<string, any>) => void;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: (records: AttendanceRecord[]) => void;
  membersList: Member[];
  setMembersList: (members: Member[]) => void;
  eventsList: Event[];
  setEventsList: (events: Event[]) => void;
  givingList: Giving[];
  setGivingList: (giving: Giving[]) => void;
  addGiving: (giving: Omit<Giving, "id" | "receipt">) => void;
  expensesList: Expense[];
  setExpensesList: (expenses: Expense[]) => void;
  addExpense: (expense: Omit<Expense, "id" | "status">) => void;
  updateExpenseStatus: (expenseId: string, status: Expense["status"]) => void;
  fundsList: Fund[];
  setFundsList: (funds: Fund[]) => void;
  addFund: (fund: Omit<Fund, "id" | "balance">) => void;
  projectsList: Project[];
  setProjectsList: (projects: Project[]) => void;
  addProject: (
    project: Omit<Project, "id" | "raised" | "contributors" | "updates" | "status">,
  ) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, "id" | "date">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [modules, setModules] = useState<Module[]>(seedModules);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoleId, setCurrentRoleId] = useState("super-admin");
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [forms, setForms] = useState<FormDef[]>(seedForms);
  const [attendanceRecords, setAttendanceRecords] =
    useState<AttendanceRecord[]>(seedAttendanceRecords);
  const [membersList, setMembersList] = useState<Member[]>(seedMembers);
  const [eventsList, setEventsList] = useState<Event[]>(seedEvents);
  const [givingList, setGivingList] = useState<Giving[]>(seedGiving);
  const [expensesList, setExpensesList] = useState<Expense[]>(seedExpenses);
  const [fundsList, setFundsList] = useState<Fund[]>(seedFunds);
  const [projectsList, setProjectsList] = useState<Project[]>(seedProjects);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);

  const currentRole = useMemo(
    () => roles.find((r) => r.id === currentRoleId) ?? roles[0],
    [roles, currentRoleId],
  );

  const can = (id: string) => currentRole.fullAccess || currentRole.modules.includes(id);
  const canEdit = (id: string) => currentRole.fullAccess || currentRole.editable.includes(id);

  const signIn = (name: string, code: string): boolean => {
    const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase() && u.code === code);
    if (user) {
      setCurrentUser(user);
      setCurrentRoleId(user.roleId);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  const updateUserCode = (userId: string, newCode: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, code: newCode } : u)));
  };

  const regenerateUserCode = (userId: string) => {
    const newCode = generateCode();
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, code: newCode } : u)));
  };

  const addRole = (r: Omit<Role, "id"> & { userName: string; code?: string }) => {
    const roleId = `role-${Date.now()}`;
    const newRole = { ...r, id: roleId };
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: r.userName,
      code: r.code || generateCode(),
      roleId,
    };
    setRoles((prev) => [...prev, newRole]);
    setUsers((prev) => [...prev, newUser]);
  };

  const addModule = (m: Omit<Module, "id"> & { id?: string }) =>
    setModules((prev) => [
      ...prev,
      { id: m.id ?? `mod-${Date.now()}`, name: m.name, group: m.group },
    ]);

  const addFormSubmission = (formId: string, submission: Record<string, any>) => {
    setForms((prev) =>
      prev.map((form) => {
        if (form.id === formId) {
          return { ...form, submissions: [...form.submissions, submission] };
        }
        return form;
      }),
    );
  };

  const addGiving = (giving: Omit<Giving, "id" | "receipt">) => {
    const newId = `G-${2000 + givingList.length}`;
    const newReceipt = `ETS-2026-${String(4000 + givingList.length).padStart(5, "0")}`;
    setGivingList([...givingList, { ...giving, id: newId, receipt: newReceipt }]);
    // Update fund balance
    setFundsList((prev) =>
      prev.map((fund) => {
        if (fund.id === giving.fundId) {
          return { ...fund, balance: fund.balance + giving.amount };
        }
        return fund;
      }),
    );
  };

  const addExpense = (expense: Omit<Expense, "id" | "status">) => {
    const newId = `E-${3000 + expensesList.length}`;
    setExpensesList([...expensesList, { ...expense, id: newId, status: "Pending" }]);
  };

  const updateExpenseStatus = (expenseId: string, status: Expense["status"]) => {
    const expense = expensesList.find((e) => e.id === expenseId);
    if (expense) {
      setExpensesList((prev) => prev.map((e) => (e.id === expenseId ? { ...e, status } : e)));
      if (status === "Approved") {
        // Subtract from first fund (general) for simplicity
        setFundsList((prev) =>
          prev.map((f, i) => (i === 0 ? { ...f, balance: f.balance - expense.amount } : f)),
        );
      }
    }
  };

  const addFund = (fund: Omit<Fund, "id" | "balance">) => {
    const newId = fund.name.toLowerCase().replace(/\s+/g, "-");
    setFundsList([...fundsList, { ...fund, id: newId, balance: 0 }]);
  };

  const addProject = (
    project: Omit<Project, "id" | "raised" | "contributors" | "updates" | "status">,
  ) => {
    const newId = `P-${projectsList.length + 1}`;
    setProjectsList([
      ...projectsList,
      { ...project, id: newId, raised: 0, contributors: 0, status: "Active", updates: [] },
    ]);
  };

  const addNotification = (notification: Omit<Notification, "id" | "date">) => {
    const newId = `notif-${notifications.length + 1}`;
    setNotifications([
      {
        ...notification,
        id: newId,
        date: new Date().toISOString().split("T")[0],
      },
      ...notifications,
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        roles,
        modules,
        currentRoleId,
        setCurrentRoleId,
        currentRole,
        can,
        canEdit,
        addRole,
        addModule,
        currency,
        setCurrency,
        language,
        setLanguage,
        users,
        currentUser,
        signIn,
        signOut,
        updateUserCode,
        regenerateUserCode,
        forms,
        setForms,
        addFormSubmission,
        attendanceRecords,
        setAttendanceRecords,
        membersList,
        setMembersList,
        eventsList,
        setEventsList,
        givingList,
        setGivingList,
        addGiving,
        expensesList,
        setExpensesList,
        addExpense,
        updateExpenseStatus,
        fundsList,
        setFundsList,
        addFund,
        projectsList,
        setProjectsList,
        addProject,
        notifications,
        setNotifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
