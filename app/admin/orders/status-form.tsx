"use client";

import { useFormState } from "react-dom";
import { useActionToast } from "@/components/admin/toast";

type Row = {
  id: string;
  customer: string;
  total: number;
  status: string;
  items: number;
};

export default function OrdersStatusForm({
  rows,
  updateAction,
  labels,
}: {
  rows: Row[];
  updateAction: (id: string, formData: FormData) => Promise<{ ok?: boolean; message?: string }>;
  labels: { customer: string; total: string; status: string; items: string; empty: string };
}) {
  const [state, formAction] = useFormState(async (_: any, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    return updateAction(id, formData);
  }, {});
  useActionToast(state as any);

  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left">{labels.customer}</th>
            <th className="px-3 py-2 text-left">{labels.total}</th>
            <th className="px-3 py-2 text-left">{labels.status}</th>
            <th className="px-3 py-2 text-left">{labels.items}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-center text-muted-foreground" colSpan={4}>
                {labels.empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0">
              <td className="px-3 py-2">{row.customer}</td>
              <td className="px-3 py-2">${(row.total / 100).toFixed(2)}</td>
              <td className="px-3 py-2">
                <form action={formAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <select
                    name="status"
                    defaultValue={row.status}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="SHIPPED">SHIPPED</option>
                  </select>
                </form>
              </td>
              <td className="px-3 py-2">{row.items}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
