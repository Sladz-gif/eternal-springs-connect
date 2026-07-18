import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer, PageHeader, AccessDenied } from "@/components/app-shell";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Link2,
  Copy,
  ArrowLeft,
  FileSpreadsheet,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/forms")({ component: FormsPage });

function FormsPage() {
  const { can, forms, setForms } = useApp();
  if (!can("forms"))
    return (
      <AppShell>
        <AccessDenied moduleName="Forms & Data" />
      </AppShell>
    );

  const [selected, setSelected] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [newFormDescription, setNewFormDescription] = useState("");

  const handleCreateForm = () => {
    if (newFormName.trim()) {
      const newId = `F-${forms.length + 1}`;
      const newShareId = `${newFormName.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
      const newForm = {
        id: newId,
        name: newFormName.trim(),
        description: newFormDescription.trim(),
        fields: [],
        submissions: [],
        shareId: newShareId,
      };
      setForms([...forms, newForm]);
      setIsCreateModalOpen(false);
      setNewFormName("");
      setNewFormDescription("");
      setSelected(newId);
    }
  };

  if (selected) {
    return <FormDetail id={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Forms & Data"
          subtitle="Airtable-style form builder. Every published form gets a shareable link and a spreadsheet view."
          actions={
            <Button
              size="sm"
              className="bg-navy text-navy-foreground hover:bg-navy/90"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New form
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((f) => (
            <Card
              key={f.id}
              className="p-5 hover:border-navy cursor-pointer transition-colors"
              onClick={() => setSelected(f.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-navy/10 text-navy grid place-items-center">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="bg-muted border-0 text-xs">
                  {f.submissions.length} submissions
                </Badge>
              </div>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{f.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                <code className="text-muted-foreground font-mono truncate">
                  ets.church/f/{f.shareId}
                </code>
              </div>
            </Card>
          ))}
        </div>
      </PageContainer>

      {/* Create New Form Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Form</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Form Name</label>
                <Input
                  placeholder="e.g., Volunteer Signup"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  placeholder="Describe what this form is for"
                  value={newFormDescription}
                  onChange={(e) => setNewFormDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-navy text-navy-foreground" onClick={handleCreateForm}>
                  Create Form
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}

function FormDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { forms, setForms } = useApp();
  const formIndex = forms.findIndex((f) => f.id === id);
  const form = forms[formIndex];
  const [tab, setTab] = useState<"data" | "builder">("data");
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<
    "text" | "number" | "date" | "select" | "checkbox" | "file"
  >("text");
  const [newFieldOptions, setNewFieldOptions] = useState("");

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/f/${form.shareId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  const handleAddField = () => {
    if (newFieldLabel.trim()) {
      const newField = {
        id: `field-${Date.now()}`,
        label: newFieldLabel.trim(),
        type: newFieldType,
        options:
          newFieldType === "select"
            ? newFieldOptions
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean)
            : undefined,
      };
      const updatedForms = [...forms];
      updatedForms[formIndex] = { ...form, fields: [...form.fields, newField] };
      setForms(updatedForms);
      setIsAddFieldModalOpen(false);
      setNewFieldLabel("");
      setNewFieldType("text");
      setNewFieldOptions("");
    }
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedForms = [...forms];
    updatedForms[formIndex] = {
      ...form,
      fields: form.fields.filter((f) => f.id !== fieldId),
    };
    setForms(updatedForms);
  };

  return (
    <AppShell>
      <PageContainer>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> All forms
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/f/${form.shareId}`}
                className="w-[340px] font-mono text-xs"
              />
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border overflow-hidden">
              <button
                onClick={() => setTab("data")}
                className={`px-4 py-2 text-sm ${tab === "data" ? "bg-navy text-navy-foreground" : "hover:bg-muted"}`}
              >
                Data
              </button>
              <button
                onClick={() => setTab("builder")}
                className={`px-4 py-2 text-sm ${tab === "builder" ? "bg-navy text-navy-foreground" : "hover:bg-muted"}`}
              >
                Builder
              </button>
            </div>
          </div>
        </div>

        {tab === "data" ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium w-12">#</th>
                    {form.fields.map((f) => (
                      <th key={f.id} className="px-4 py-3 font-medium whitespace-nowrap">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {form.submissions.map((s, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      {form.fields.map((f) => (
                        <td key={f.id} className="px-4 py-3 whitespace-nowrap">
                          {f.type === "checkbox" ? (s[f.id] ? "✓" : "—") : String(s[f.id] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Form fields</h3>
            <div className="space-y-2">
              {form.fields.map((f) => (
                <div key={f.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.type}
                      {f.options ? ` • ${f.options.length} options` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-muted border-0 uppercase text-[10px] tracking-wider"
                    >
                      {f.type}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteField(f.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => setIsAddFieldModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add field
              </Button>
            </div>
          </Card>
        )}
      </PageContainer>

      {/* Add Field Modal */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add Form Field</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Field Label</label>
                <Input
                  placeholder="e.g., Full Name"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Field Type</label>
                <Select value={newFieldType} onValueChange={(value: any) => setNewFieldType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Dropdown (Select)</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newFieldType === "select" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Options (comma-separated)
                  </label>
                  <Input
                    placeholder="Option 1, Option 2, Option 3"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsAddFieldModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-navy text-navy-foreground" onClick={handleAddField}>
                  Add Field
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
