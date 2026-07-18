import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Church } from "lucide-react";

export const Route = createFileRoute("/signin")({ component: SignInPage });

function SignInPage() {
  const { signIn } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = signIn(name, password);
    if (success) {
      navigate({ to: "/" });
    } else {
      setError("Invalid name or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-lg bg-gold text-gold-foreground grid place-items-center">
            <Church className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">ETS Congregation</h1>
            <p className="text-sm text-muted-foreground">Eternal Springs Church</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-navy text-navy-foreground hover:bg-navy/90"
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
