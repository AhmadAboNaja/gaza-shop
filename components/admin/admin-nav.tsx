"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Labels = {
  adminTitle: string;
  overview: string;
  products: string;
  categoriesTitle: string;
  ordersTitle: string;
  newProduct: string;
};

export default function AdminNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string, accent = false) =>
    [
      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
      isActive(href)
        ? "bg-primary text-primary-foreground shadow-sm"
        : accent
        ? "bg-primary/10 text-primary hover:bg-primary/15"
        : "hover:bg-muted",
    ].join(" ");

  return (
    <div className="rounded-xl border bg-card p-2 shadow-sm">
      <nav className="space-y-1 text-sm">
        <Link href="/admin" className={linkClass("/admin")}>
          {labels.overview}
          <span className="text-xs opacity-70">/admin</span>
        </Link>
        <Link href="/admin/products" className={linkClass("/admin/products")}>
          {labels.products}
          <span className="text-xs opacity-70">/products</span>
        </Link>
        <Link
          href="/admin/categories"
          className={linkClass("/admin/categories")}
        >
          {labels.categoriesTitle}
          <span className="text-xs opacity-70">/categories</span>
        </Link>
        <Link href="/admin/orders" className={linkClass("/admin/orders")}>
          {labels.ordersTitle}
          <span className="text-xs opacity-70">/orders</span>
        </Link>
        <Link
          href="/admin/products/new"
          className={linkClass("/admin/products/new", true)}
        >
          {labels.newProduct}
          <span className="text-xs">+</span>
        </Link>
      </nav>
    </div>
  );
}
