const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gaza-shop.local";
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { name: "Electronics" },
      update: {},
      create: { name: "Electronics" },
    }),
    prisma.category.upsert({
      where: { name: "Home" },
      update: {},
      create: { name: "Home" },
    }),
    prisma.category.upsert({
      where: { name: "Apparel" },
      update: {},
      create: { name: "Apparel" },
    }),
  ]);

  const [electronics, home, apparel] = categories;

  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones.",
        price: 12999,
        imageUrl: "/products/headphones.svg",
        stock: 25,
        categoryId: electronics.id,
      },
      {
        name: "Smart Watch",
        description: "Fitness tracking and notifications on your wrist.",
        price: 8999,
        imageUrl: "/products/watch.svg",
        stock: 40,
        categoryId: electronics.id,
      },
      {
        name: "Ceramic Mug Set",
        description: "Set of 4 matte ceramic mugs.",
        price: 3499,
        imageUrl: "/products/mugs.svg",
        stock: 60,
        categoryId: home.id,
      },
      {
        name: "Minimal Desk Lamp",
        description: "Soft warm light with adjustable arm.",
        price: 4599,
        imageUrl: "/products/lamp.svg",
        stock: 30,
        categoryId: home.id,
      },
      {
        name: "Classic Hoodie",
        description: "Heavyweight cotton fleece hoodie.",
        price: 5499,
        imageUrl: "/products/hoodie.svg",
        stock: 50,
        categoryId: apparel.id,
      },
      {
        name: "Everyday Tee",
        description: "Soft cotton tee for daily wear.",
        price: 1999,
        imageUrl: "/products/tee.svg",
        stock: 100,
        categoryId: apparel.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete:", { admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
