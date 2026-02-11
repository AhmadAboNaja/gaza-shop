import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/components/store/i18n-provider";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import OverviewCharts from "@/components/admin/charts/overview-charts";

export default async function AdminPage() {
  const [productsCount, categoriesCount, ordersCount, revenueSum, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalPrice: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "asc" },
      select: { totalPrice: true, createdAt: true },
      take: 14,
    }),
  ]);

  const { t } = await getDictionary();
  const revenue = revenueSum._sum.totalPrice ?? 0;
  const revenueSeries = recentOrders.map((o) => ({
    label: o.createdAt.toISOString().slice(5, 10),
    value: Math.round((o.totalPrice ?? 0) / 100),
  }));
  const ordersSeries = recentOrders.map((o, idx) => ({
    label: o.createdAt.toISOString().slice(5, 10),
    value: idx + 1,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{t.adminTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {t.products} / {t.ordersTitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/orders">{t.viewOrders}</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">{t.newProduct}</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t.products}</p>
            <p className="text-2xl font-semibold">{productsCount}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t.categoriesTitle}</p>
            <p className="text-2xl font-semibold">{categoriesCount}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t.ordersTitle}</p>
            <p className="text-2xl font-semibold">{ordersCount}</p>
            <p className="text-xs text-muted-foreground">
              ${ (revenue / 100).toFixed(2) } {t.total}
            </p>
          </CardContent>
        </Card>
      </div>

      <OverviewCharts revenue={revenueSeries} orders={ordersSeries} />
      <div className="grid gap-3 md:grid-cols-3">
        <Button asChild variant="outline">
          <Link href="/admin/products">{t.products}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/categories">{t.manageCategories}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/orders">{t.viewOrders}</Link>
        </Button>
      </div>
    </div>
  );
}
