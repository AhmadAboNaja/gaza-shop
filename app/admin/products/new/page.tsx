import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/components/store/i18n-provider";
import NewProductForm from "@/app/admin/products/new/new-form";

async function createProduct(_prevState: any, formData: FormData) {
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

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin");
  return { ok: true, message: "Product created." };
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const { t } = await getDictionary();

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{t.newProduct}</CardTitle>
      </CardHeader>
      <CardContent>
        <NewProductForm
          categories={categories}
          action={createProduct}
          labels={{
            name: t.name,
            description: t.description,
            imageUrl: t.imageUrl,
            price: t.price,
            stock: t.stock,
            selectCategory: t.selectCategory,
            add: t.add,
          }}
        />
      </CardContent>
    </Card>
  );
}
