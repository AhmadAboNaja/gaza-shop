import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PaginationControls from "@/components/store/pagination-controls";
import { getDictionary } from "@/components/store/i18n-provider";

type StorePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    perPage?: string;
  }>;
};

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const q = params.q?.trim();
  const category = params.category?.trim();
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const perPageOptions = [6, 9, 12, 24];
  const requestedPerPage = Number(params.perPage ?? "9") || 9;
  const pageSize = perPageOptions.includes(requestedPerPage)
    ? requestedPerPage
    : 9;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { categoryId: category } : {}),
  };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  });

  const makePageLink = (nextPage: number, perPageOverride?: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (nextPage > 1) params.set("page", String(nextPage));
    const per = perPageOverride ?? pageSize;
    if (per !== 9) params.set("perPage", String(per));
    return `/?${params.toString()}`;
  };

  const makeCategoryLink = (categoryId?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("category", categoryId);
    // reset page when category changes
    if (pageSize !== 9) params.set("perPage", String(pageSize));
    return `/?${params.toString()}`;
  };

  if (!perPageOptions.includes(requestedPerPage)) {
    // fall back to default page size silently
  }

  const { t } = await getDictionary();

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold">{t.categories}</h3>
          <div className="mt-3 space-y-2">
            <Button
              asChild
              variant={!category ? "default" : "outline"}
              className="w-full justify-start"
            >
              <Link href={makeCategoryLink()}>{t.all}</Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                asChild
                variant={category === cat.id ? "default" : "outline"}
                className="w-full justify-start"
              >
                <Link href={makeCategoryLink(cat.id)}>{cat.name}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold">{t.filters}</h3>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{t.itemsPerPage}</span>
              <span className="font-medium text-foreground">{pageSize}</span>
            </div>
            <p className="text-xs">{t.itemsPerPageHint}</p>
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{t.results}</p>
              <p className="text-lg font-semibold">
                {total} {t.items}
                {q ? ` ${t.resultsFor} "${q}"` : ""}
              </p>
            </div>
            <PaginationControls
              page={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              perPageOptions={perPageOptions}
              labels={{ itemsPerPage: t.itemsPerPage, goTo: t.goTo }}
            />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border p-10 text-center">
            <p className="text-sm text-muted-foreground">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                addLabel={t.addToCart}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="outline" disabled={safePage <= 1}>
              <Link href={makePageLink(safePage - 1)}>Prev</Link>
            </Button>
            <Button asChild variant="outline" disabled={safePage >= totalPages}>
              <Link href={makePageLink(safePage + 1)}>Next</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
