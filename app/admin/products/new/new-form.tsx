"use client";

import { useFormState } from "react-dom";
import { useActionToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string };
type FormState = { errors?: Record<string, string>; ok?: boolean; message?: string };

export default function NewProductForm({
  categories,
  action,
  labels,
}: {
  categories: Category[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  labels: {
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    stock: string;
    selectCategory: string;
    add: string;
  };
}) {
  const [state, formAction] = useFormState(action, {});
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <Input name="name" placeholder={labels.name} required />
      <Input name="description" placeholder={labels.description} required />
      <Input name="imageUrl" placeholder={labels.imageUrl} required />
      <Input name="price" type="number" placeholder={labels.price} required />
      <Input name="stock" type="number" placeholder={labels.stock} required />
      <select
        name="categoryId"
        required
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        <option value="">{labels.selectCategory}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {state.errors?.description && (
        <p className="text-xs text-destructive">{state.errors.description}</p>
      )}
      <Button type="submit">{labels.add}</Button>
    </form>
  );
}
