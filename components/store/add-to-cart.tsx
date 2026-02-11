"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

type AddToCartProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  label?: string;
};

export function AddToCart({ id, name, price, imageUrl, label = "Add to cart" }: AddToCartProps) {
  const add = useCart((s) => s.add);
  return (
    <Button onClick={() => add({ id, name, price, imageUrl })}>
      {label}
    </Button>
  );
}
