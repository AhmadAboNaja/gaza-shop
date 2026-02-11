"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { useActionToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string };

type FormState = { errors?: Record<string, string>; ok?: boolean; message?: string };

export default function EditProductForm({
  product,
  categories,
  action,
  labels,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    categoryId: string;
  };
  categories: Category[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  labels: {
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    stock: string;
    selectCategory: string;
    save: string;
    delete: string;
    descriptionHint: string;
  };
}) {
  const [state, formAction] = useFormState(action, {});
  useActionToast(state);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: String(product.price),
    stock: String(product.stock),
    categoryId: product.categoryId,
  });

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Input
          name="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        {state.errors?.name && (
          <p className="text-xs text-destructive">{state.errors.name}</p>
        )}
      </div>
      <div className="space-y-1">
        <Input
          name="description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          required
        />
        <p className="text-xs text-muted-foreground">
          {labels.descriptionHint}
        </p>
        {state.errors?.description && (
          <p className="text-xs text-destructive">{state.errors.description}</p>
        )}
      </div>
      <div className="space-y-1">
        <Input
          name="imageUrl"
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          required
        />
        {state.errors?.imageUrl && (
          <p className="text-xs text-destructive">{state.errors.imageUrl}</p>
        )}
      </div>
      <div className="space-y-1">
        <Input
          name="price"
          type="number"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
        />
        {state.errors?.price && (
          <p className="text-xs text-destructive">{state.errors.price}</p>
        )}
      </div>
      <div className="space-y-1">
        <Input
          name="stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          required
        />
        {state.errors?.stock && (
          <p className="text-xs text-destructive">{state.errors.stock}</p>
        )}
      </div>
      <div className="space-y-1">
        <select
          name="categoryId"
          required
          value={form.categoryId}
          onChange={(e) =>
            setForm((f) => ({ ...f, categoryId: e.target.value }))
          }
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="">{labels.selectCategory}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {state.errors?.categoryId && (
          <p className="text-xs text-destructive">{state.errors.categoryId}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit">{labels.save}</Button>
      </div>
    </form>
  );
}
