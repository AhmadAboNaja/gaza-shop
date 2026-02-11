import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().int().min(1),
  imageUrl: z.string().min(2),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
});

export const categorySchema = z.object({
  name: z.string().min(2),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED"]),
});
