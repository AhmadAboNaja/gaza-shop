import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderStatusSchema } from "@/lib/validators";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
