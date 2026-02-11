import Link from "next/link";
import { getDictionary } from "@/components/store/i18n-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/store/theme-toggle";
import { LocaleSwitcher } from "@/components/store/locale-switcher";
import AdminNav from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale } = await getDictionary();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              AS
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.adminTitle}</p>
              <h1 className="text-lg font-semibold">Gaza Shop</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocaleSwitcher current={locale} />
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/">{t.store}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-3">
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm font-medium shadow-sm"
          >
            {t.adminTitle}
            <span className="text-xs text-muted-foreground">{t.overview}</span>
          </Link>
          <AdminNav
            labels={{
              adminTitle: t.adminTitle,
              overview: t.overview,
              products: t.products,
              categoriesTitle: t.categoriesTitle,
              ordersTitle: t.ordersTitle,
              newProduct: t.newProduct,
            }}
          />
          <div className="rounded-xl border bg-card p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Quick tips</p>
            <p className="mt-2">Keep stock updated to avoid overselling.</p>
            <p className="mt-1">Review orders daily to manage status.</p>
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
