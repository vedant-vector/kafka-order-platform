import { PrismaClient } from '../../apps/inventory-service/src/generated/prisma';

const prisma = new PrismaClient();

const seedProducts = [
  { productName: 'Laptop', availableStock: 100 },
  { productName: 'Phone', availableStock: 50 },
  { productName: 'Tablet', availableStock: 75 },
];

async function main(): Promise<void> {
  for (const product of seedProducts) {
    await prisma.inventory.upsert({
      where: { productName: product.productName },
      update: { availableStock: product.availableStock },
      create: product,
    });
  }

  console.log(`Seeded ${seedProducts.length} inventory records`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
