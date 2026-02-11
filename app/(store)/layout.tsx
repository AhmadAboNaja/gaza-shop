import { getDictionary } from "@/components/store/i18n-provider";
import NavbarClient from "@/components/store/navbar-client";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, t } = await getDictionary();

  return (
    <div className="min-h-screen bg-background">
      <NavbarClient
        locale={locale}
        labels={{
          cart: t.cart,
          emptyCart: t.emptyCart,
          total: t.total,
          checkout: t.checkout,
          search: t.search,
          account: t.account,
          orders: t.orders,
          admin: t.admin,
          signIn: t.signIn,
          signOut: t.signOut,
          signedIn: t.signedIn,
          signedOut: t.signedOut,
        }}
      />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
