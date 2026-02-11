"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useActionToast(state?: { ok?: boolean; message?: string }) {
  useEffect(() => {
    if (state?.ok) toast.success(state.message ?? "Done");
    if (state && state.ok === false) toast.error(state.message ?? "Failed");
  }, [state]);
}
