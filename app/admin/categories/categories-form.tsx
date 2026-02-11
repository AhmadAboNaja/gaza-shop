"use client";

import { useFormState } from "react-dom";
import { useActionToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmAction from "@/components/admin/confirm-action";

type Category = { id: string; name: string };
type FormState = { errors?: Record<string, string>; ok?: boolean; message?: string };

export default function CategoriesForm({
  categories,
  createAction,
  deleteAction,
  labels,
}: {
  categories: Category[];
  createAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (id: string) => Promise<FormState>;
  labels: { newCategory: string; add: string; delete: string; empty: string };
}) {
  const [state, formAction] = useFormState(createAction, {});
  useActionToast(state);

  return (
    <div className="space-y-4">
      <form action={formAction} className="flex gap-2">
        <Input name="name" placeholder={labels.newCategory} required />
        <Button type="submit">{labels.add}</Button>
      </form>
      {state.errors?.name && (
        <p className="text-xs text-destructive">{state.errors.name}</p>
      )}
      <ul className="space-y-2">
        {categories.length === 0 && (
          <li className="rounded-md border px-3 py-3 text-sm text-muted-foreground">
            {labels.empty}
          </li>
        )}
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <span>{cat.name}</span>
            <ConfirmAction
              triggerLabel={labels.delete}
              confirmLabel={labels.delete}
              title={`${labels.delete}?`}
              action={deleteAction.bind(null, cat.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
