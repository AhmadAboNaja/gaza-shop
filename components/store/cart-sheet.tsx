"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartSheet({
  labels,
}: {
  labels: { cart: string; emptyCart: string; total: string; checkout: string };
}) {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const count = useCart((s) => s.count());
  const remove = useCart((s) => s.remove);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          {labels.cart}
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {count}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{labels.cart}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.emptyCart}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-md border">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>{labels.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button asChild className="mt-4 w-full" disabled={items.length === 0}>
            <Link href="/checkout">{labels.checkout}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
