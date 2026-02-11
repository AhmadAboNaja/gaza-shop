"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  addLabel?: string;
};

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  addLabel = "Add to cart",
}: ProductCardProps) {
  const add = useCart((s) => s.add);
  const src = imageUrl?.startsWith("/") || imageUrl?.startsWith("http")
    ? imageUrl
    : "/products/placeholder.svg";

  return (
    <Card className="flex h-full flex-col">
      <Link href={`/products/${id}`} className="relative h-48 w-full">
        <Image src={src} alt={name} fill className="object-cover" />
      </Link>
      <CardContent className="flex-1 space-y-2 pt-4">
        <Link href={`/products/${id}`} className="font-semibold">
          {name}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-sm font-medium">{formatPrice(price)}</span>
        <Button
          size="sm"
          onClick={() => add({ id, name, price, imageUrl })}
        >
          {addLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
