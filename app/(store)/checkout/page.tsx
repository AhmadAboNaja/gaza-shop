import { getDictionary } from "@/components/store/i18n-provider";

export default async function CheckoutPage() {
  const { t } = await getDictionary();
  return (
    <div className="rounded-lg border p-8 text-center">
      <h1 className="text-xl font-semibold">{t.checkout}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.checkoutSoon}</p>
    </div>
  );
}
