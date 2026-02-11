import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/components/store/i18n-provider";
import EditProductForm from "@/app/admin/products/[id]/edit/edit-form";
import ConfirmAction from "@/components/admin/confirm-action";

async function updateProduct(id: string, _prevState: any, formData: FormData) {
  "use server";

  const raw = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: Number(formData.get("price") ?? 0),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    stock: Number(formData.get("stock") ?? 0),
    categoryId: String(formData.get("categoryId") ?? ""),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.join(".")] = issue.message;
    }
    return { errors, ok: false, message: "Fix the highlighted fields." };
  }

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin");
  return { ok: true, message: "Product updated." };
}

async function deleteProduct(id: string) {
  "use server";
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin");
  return { ok: true, message: "Product deleted." };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  if (!resolved?.id) return redirect("/admin/products");
  const product = await prisma.product.findUnique({
    where: { id: resolved.id },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const { t } = await getDictionary();

  if (!product) return redirect("/admin/products");

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{t.editProduct}</CardTitle>
      </CardHeader>
      <CardContent>
        <EditProductForm
          product={product}
          categories={categories}
          action={updateProduct.bind(null, product.id)}
          labels={{
            name: t.name,
            description: t.description,
            imageUrl: t.imageUrl,
            price: t.price,
            stock: t.stock,
            selectCategory: t.selectCategory,
            save: t.save,
            delete: t.delete,
            descriptionHint: "Description must be at least 10 characters.",
          }}
        />
        <div className="mt-3">
          <ConfirmAction
            triggerLabel={t.delete}
            confirmLabel={t.delete}
            title={`${t.delete}?`}
            action={deleteProduct.bind(null, product.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
