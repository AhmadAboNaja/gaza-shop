import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "@/components/store/add-to-cart";
import { getDictionary } from "@/components/store/i18n-provider";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const resolved = await params;
  if (!resolved?.id) return notFound();
  const { t } = await getDictionary();
  const product = await prisma.product.findUnique({
    where: { id: resolved.id },
    include: { category: true },
  });

  if (!product) return notFound();
  const src =
    product.imageUrl?.startsWith("/") || product.imageUrl?.startsWith("http")
      ? product.imageUrl
      : "/products/placeholder.svg";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative h-80 w-full overflow-hidden rounded-lg border">
        <Image
          src={src}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">{product.category.name}</p>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
        <AddToCart
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          label={t.addToCart}
        />
      </div>
    </div>
  );
}
