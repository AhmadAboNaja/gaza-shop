"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const makeColumns = (labels: {
  name: string;
  category: string;
  price: string;
  stock: string;
  actions: string;
  edit: string;
}): ColumnDef<ProductRow>[] => [
  { accessorKey: "name", header: labels.name },
  { accessorKey: "category", header: labels.category },
  {
    accessorKey: "price",
    header: labels.price,
    cell: ({ row }) => `$${(row.original.price / 100).toFixed(2)}`,
  },
  { accessorKey: "stock", header: labels.stock },
  {
    id: "actions",
    header: labels.actions,
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/products/${row.original.id}/edit`}>
          {labels.edit}
        </Link>
      </Button>
    ),
  },
];

export default function ProductsTable({
  data,
  labels,
  emptyLabel,
}: {
  data: ProductRow[];
  labels: {
    name: string;
    category: string;
    price: string;
    stock: string;
    actions: string;
    edit: string;
  };
  emptyLabel?: string;
}) {
  return (
    <DataTable data={data} columns={makeColumns(labels)} emptyLabel={emptyLabel} />
  );
}
