import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { orderStatusSchema } from "@/lib/validators";
import OrdersTable from "@/components/admin/orders-table";
import { getDictionary } from "@/components/store/i18n-provider";
import OrdersStatusForm from "@/app/admin/orders/status-form";

async function updateStatus(id: string, formData: FormData) {
  "use server";
  const raw = { status: String(formData.get("status") ?? "") };
  const parsed = orderStatusSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid status");
  await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  revalidatePath("/admin/orders");
  return { ok: true, message: "Order updated." };
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.map((order) => ({
    id: order.id,
    customer: order.user.email,
    total: order.totalPrice,
    status: order.status,
    items: order.items.length,
  }));

  const { t } = await getDictionary();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{t.ordersTitle}</h2>
      <OrdersStatusForm
        rows={rows}
        updateAction={updateStatus}
        labels={{
          customer: t.customer,
          total: t.total,
          status: t.status,
          items: t.itemsLabel,
          empty: t.noData,
        }}
      />
    </div>
  );
}
