import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import ProductsTable from "@/components/admin/products-table";
import { getDictionary } from "@/components/store/i18n-provider";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category.name,
    price: product.price,
    stock: product.stock,
  }));

  const { t } = await getDictionary();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{t.products}</h2>
          <p className="text-sm text-muted-foreground">/admin/products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">{t.newProduct}</Link>
        </Button>
      </div>

      <ProductsTable
        data={rows}
        labels={{
          name: t.name,
          category: t.category,
          price: t.price,
          stock: t.stock,
          actions: t.actions,
          edit: t.edit,
        }}
        emptyLabel={t.noData}
      />
    </div>
  );
}
