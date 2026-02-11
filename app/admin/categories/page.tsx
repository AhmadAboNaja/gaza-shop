import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";
import { getDictionary } from "@/components/store/i18n-provider";
import CategoriesForm from "@/app/admin/categories/categories-form";

async function createCategory(_prevState: any, formData: FormData) {
  "use server";
  const raw = { name: String(formData.get("name") ?? "") };
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: { name: parsed.error.issues[0]?.message ?? "Invalid" }, ok: false, message: "Fix the name." };
  }
  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  return { ok: true, message: "Category created." };
}

async function deleteCategory(id: string) {
  "use server";
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { ok: true, message: "Category deleted." };
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const { t } = await getDictionary();

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">{t.categoriesTitle}</h2>
      <CategoriesForm
        categories={categories}
        createAction={createCategory}
        deleteAction={deleteCategory}
        labels={{
          newCategory: t.newCategory,
          add: t.add,
          delete: t.delete,
          empty: t.noData,
        }}
      />
    </div>
  );
}
