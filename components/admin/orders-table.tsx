"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";

type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: string;
  items: number;
};

const makeColumns = (labels: {
  customer: string;
  total: string;
  status: string;
  items: string;
}): ColumnDef<OrderRow>[] => [
  { accessorKey: "customer", header: labels.customer },
  {
    accessorKey: "total",
    header: labels.total,
    cell: ({ row }) => `$${(row.original.total / 100).toFixed(2)}`,
  },
  { accessorKey: "status", header: labels.status },
  { accessorKey: "items", header: labels.items },
];

export default function OrdersTable({
  data,
  labels,
  emptyLabel,
}: {
  data: OrderRow[];
  labels: { customer: string; total: string; status: string; items: string };
  emptyLabel?: string;
}) {
  return (
    <DataTable data={data} columns={makeColumns(labels)} emptyLabel={emptyLabel} />
  );
}
