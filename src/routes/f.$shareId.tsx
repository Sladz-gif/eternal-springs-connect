import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/f/$shareId")({
  component: PublicFormPage,
});

function PublicFormPage() {
  const { shareId } = Route.useParams();
  const { forms, addFormSubmission } = useApp();
  const form = forms.find(f => f.shareId === shareId);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Form Not Found</h1>
          <p className="text-gray-500 mb-4">The form you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFormSubmission(form.id, formData);
    setSubmitted(true);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Thank You!</h1>
          <p className="text-gray-500 mb-4">Your response has been submitted successfully.</p>
          <Button onClick={() => {
            setSubmitted(false);
            setFormData({});
          }}>Submit Another Response</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
          {form.description && (
            <p className="text-sm text-gray-500 mt-2">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {form.fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              {field.type === "text" && (
                <Input
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
              {field.type === "number" && (
                <Input
                  type="number"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
              {field.type === "date" && (
                <Input
                  type="date"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
              {field.type === "select" && field.options && (
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData[field.id] || false}
                    onChange={(e) => handleInputChange(field.id, e.target.checked)}
                    className="rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <span className="ml-2 text-sm text-gray-600">Yes</span>
                </div>
              )}
              {field.type === "file" && (
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleInputChange(field.id, file?.name || "");
                  }}
                />
              )}
            </div>
          ))}

          <Button className="w-full mt-6 bg-navy text-navy-foreground" type="submit">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
