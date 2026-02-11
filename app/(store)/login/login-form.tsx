"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm({
  labels,
}: {
  labels: {
    signInTitle: string;
    email: string;
    password: string;
    continue: string;
    signedIn: string;
  };
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{labels.signInTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder={labels.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder={labels.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={async () => {
              const res = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/",
              });
              if (res?.error) toast.error(res.error);
              else toast.success(labels.signedIn);
            }}
          >
            {labels.continue}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
