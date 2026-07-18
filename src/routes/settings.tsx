import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp, currencies, languages } from "@/lib/app-context";
import { generateCode } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Shield, Globe, Building } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const { can, roles, modules, addRole, addModule, currency, setCurrency, language, setLanguage, users, updateUserCode, regenerateUserCode } = useApp();
  if (!can("settings")) return <AppShell><AccessDenied moduleName="Settings" /></AppShell>;

  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Settings" subtitle="Roles, permissions, church profile, and localization." />

        <Tabs defaultValue="roles">
          <TabsList className="mb-4">
            <TabsTrigger value="roles"><Shield className="h-4 w-4 mr-2" />Roles & Permissions</TabsTrigger>
            <TabsTrigger value="profile"><Building className="h-4 w-4 mr-2" />Church Profile</TabsTrigger>
            <TabsTrigger value="locale"><Globe className="h-4 w-4 mr-2" />Language & Currency</TabsTrigger>
          </TabsList>

          <TabsContent value="roles">
            <RolesTab 
              roles={roles} 
              modules={modules} 
              addRole={addRole} 
              addModule={addModule} 
              users={users}
              updateUserCode={updateUserCode}
              regenerateUserCode={regenerateUserCode}
            />
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">Church name</label><Input defaultValue="Eternal Springs Church" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Short code</label><Input defaultValue="ETS" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Head Pastor</label><Input defaultValue="Patrick Osborn" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Founded</label><Input defaultValue="2008" /></div>
                <div className="sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">Address</label><Input defaultValue="1200 Springfield Avenue, Global HQ" /></div>
              </div>
              <div className="mt-4 flex justify-end"><Button className="bg-navy text-navy-foreground hover:bg-navy/90">Save profile</Button></div>
            </Card>
          </TabsContent>

          <TabsContent value="locale">
            <Card className="p-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Language</label>
                  <Select value={language.code} onValueChange={(v) => setLanguage(languages.find(l=>l.code===v)!)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">More languages can be added anytime.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Currency</label>
                  <Select value={currency.code} onValueChange={(v) => setCurrency(currencies.find(c=>c.code===v)!)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => <SelectItem key={c.code} value={c.code}>{c.symbol} — {c.code}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">Locale-safe formatting; extensible to any ISO currency.</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  );
}

function RolesTab({ roles, modules, addRole, addModule, users, updateUserCode, regenerateUserCode }: {
  roles: ReturnType<typeof useApp>["roles"];
  modules: ReturnType<typeof useApp>["modules"];
  addRole: ReturnType<typeof useApp>["addRole"];
  addModule: ReturnType<typeof useApp>["addModule"];
  users: ReturnType<typeof useApp>["users"];
  updateUserCode: ReturnType<typeof useApp>["updateUserCode"];
  regenerateUserCode: ReturnType<typeof useApp>["regenerateUserCode"];
}) {
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [userName, setUserName] = useState("");
  const [generatedCode, setGeneratedCode] = useState(() => generateCode());
  const [selected, setSelected] = useState<string[]>([]);
  const [editable, setEditable] = useState<string[]>([]);
  const [fullAccess, setFullAccess] = useState(false);

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState("");

  const [newModName, setNewModName] = useState("");
  const [newModGroup, setNewModGroup] = useState("Operations");

  const toggle = (arr: string[], id: string, setter: (v: string[]) => void) => {
    setter(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };

  const groups = Array.from(new Set(modules.map(m => m.group)));

  // Get user for a role (each role has exactly one user)
  const getUserForRole = (roleId: string) => users.find(u => u.roleId === roleId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Roles</h3>
            <p className="text-xs text-muted-foreground">Extensible — new roles are instantly assignable with user accounts.</p>
          </div>
          <Button size="sm" onClick={() => {
            setShowNew(v => !v);
            if (!showNew) {
              setGeneratedCode(generateCode());
            }
          }} className="bg-navy text-navy-foreground hover:bg-navy/90"><Plus className="h-4 w-4 mr-2" />New role</Button>
        </div>

        {showNew && (
          <div className="border rounded-lg p-4 mb-4 bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-muted-foreground">User Full Name</label><Input value={userName} onChange={e=>setUserName(e.target.value)} placeholder="e.g. John Doe" /></div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">Generated Code</label>
                  <Input value={generatedCode} readOnly className="font-mono" />
                </div>
                <div className="flex items-end">
                  <Button size="sm" variant="outline" onClick={() => setGeneratedCode(generateCode())}>Regenerate</Button>
                </div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Role name</label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Youth Pastor" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Description</label><Input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={fullAccess} onCheckedChange={(v) => setFullAccess(!!v)} />
              Grant full access (acts as a second Super Admin)
            </label>
            {!fullAccess && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Module access</div>
                <div className="space-y-3">
                  {groups.map(g => (
                    <div key={g}>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{g}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {modules.filter(m => m.group === g).map(m => (
                          <div key={m.id} className="flex items-center justify-between border rounded-md px-3 py-2 bg-surface">
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox checked={selected.includes(m.id)} onCheckedChange={()=>toggle(selected, m.id, setSelected)} />
                              {m.name}
                            </label>
                            {selected.includes(m.id) && (
                              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Checkbox checked={editable.includes(m.id)} onCheckedChange={()=>toggle(editable, m.id, setEditable)} />
                                Edit
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={()=>setShowNew(false)}>Cancel</Button>
              <Button size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90" onClick={() => {
                if (!name || !userName) return;
                addRole({
                  name, description: desc || "Custom role",
                  fullAccess, modules: fullAccess ? modules.map(m=>m.id) : selected,
                  editable: fullAccess ? modules.map(m=>m.id) : editable,
                  userName,
                  code: generatedCode,
                });
                setName(""); setDesc(""); setSelected([]); setEditable([]); setFullAccess(false); setShowNew(false); setUserName(""); setGeneratedCode(generateCode());
              }}>Create role & account</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {roles.map((r) => {
            const user = getUserForRole(r.id);
            return (
            <div key={r.id} className="border rounded-lg p-4 hover:bg-muted/30">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{r.name}</h4>
                    {r.fullAccess && <Badge className="bg-gold text-gold-foreground border-0">Full access</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>
                  {user && (
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{user.name}</Badge>
                      {editingRoleId === r.id ? (
                        <>
                          <Input 
                            className="w-32 font-mono" 
                            value={editingCode}
                            onChange={(e) => setEditingCode(e.target.value)} 
                          />
                          <Button 
                            size="sm" 
                            className="bg-navy text-navy-foreground hover:bg-navy/90"
                            onClick={() => {
                              updateUserCode(user.id, editingCode);
                              setEditingRoleId(null);
                            }}
                          >Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingRoleId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Badge className="font-mono bg-muted">{user.code}</Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingCode(user.code);
                              setEditingRoleId(r.id);
                            }}
                          >Edit Code</Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => regenerateUserCode(user.id)}
                          >Regenerate</Button>
                        </>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.fullAccess ? (
                      <Badge variant="secondary" className="bg-muted border-0 text-xs">All modules</Badge>
                    ) : r.modules.map(mid => {
                      const m = modules.find(x => x.id === mid);
                      const editable = r.editable.includes(mid);
                      return <Badge key={mid} variant="secondary" className={`border-0 text-xs ${editable ? "bg-navy text-navy-foreground" : "bg-muted"}`}>{m?.name}{editable ? "" : " · view"}</Badge>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );})}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Modules</h3>
        <p className="text-xs text-muted-foreground mb-4">Add new modules or departments to make them assignable to roles.</p>
        <div className="space-y-1.5 mb-4 max-h-64 overflow-y-auto">
          {modules.map(m => (
            <div key={m.id} className="flex items-center justify-between text-sm border rounded-md px-3 py-2">
              <span>{m.name}</span>
              <span className="text-xs text-muted-foreground">{m.group}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t pt-3">
          <Input placeholder="Module or department name" value={newModName} onChange={e=>setNewModName(e.target.value)} />
          <Select value={newModGroup} onValueChange={setNewModGroup}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Overview","People","Finance","Operations","Admin"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => {
            if (!newModName) return;
            addModule({ name: newModName, group: newModGroup });
            setNewModName("");
          }}><Plus className="h-4 w-4 mr-2" />Add module</Button>
        </div>
      </Card>
    </div>
  );
}
