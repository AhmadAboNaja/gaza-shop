"use client";

import { useActionState } from "react";
import { useActionToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ConfirmAction({
  triggerLabel,
  confirmLabel,
  title,
  action,
  variant = "destructive",
}: {
  triggerLabel: string;
  confirmLabel: string;
  title: string;
  action: (formData: FormData) => Promise<{ ok?: boolean; message?: string }>;
  variant?: "destructive" | "default" | "outline";
}) {
  const [state, formAction] = useActionState(async (_: any, formData: FormData) => {
    return action(formData);
  }, {});
  useActionToast(state as any);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="flex justify-end gap-2">
            <Button type="submit" variant={variant}>
              {confirmLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
