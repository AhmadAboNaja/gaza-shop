"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  perPageOptions: number[];
  labels: {
    itemsPerPage: string;
    goTo: string;
  };
};

export default function PaginationControls({
  page,
  totalPages,
  pageSize,
  perPageOptions,
  labels,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [inputValue, setInputValue] = useState(String(page));

  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const commit = useMemo(() => {
    let timer: NodeJS.Timeout | null = null;
    return (value: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => goToPage(value), 400);
    };
  }, []);

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "") next.delete(key);
    else next.set(key, value);
    router.replace(`/?${next.toString()}`);
    router.refresh();
  };

  const goToPage = (value: number) => {
    const nextPage = Math.max(1, Math.min(totalPages, value));
    setParam("page", nextPage > 1 ? String(nextPage) : "");
  };

  const onPerPageChange = (value: number) => {
    const next = new URLSearchParams(params.toString());
    if (value === 9) next.delete("perPage");
    else next.set("perPage", String(value));
    next.delete("page");
    router.replace(`/?${next.toString()}`);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {labels.itemsPerPage}
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPerPageChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-[140px] rounded-full border bg-background px-3 text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Per page" />
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {perPageOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt} items
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 rounded-full border bg-background px-2 py-1 shadow-sm">
        <span className="text-xs text-muted-foreground">{labels.goTo}</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            const num = Number(value);
            if (!Number.isNaN(num)) commit(num);
          }}
          className="h-7 w-16 bg-transparent text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = Number((e.target as HTMLInputElement).value);
              goToPage(value);
            }
          }}
        />
        <span className="text-xs text-muted-foreground">/ {totalPages}</span>
      </div>
    </div>
  );
}
