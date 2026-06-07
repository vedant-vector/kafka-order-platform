-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "available_stock" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_product_name_key" ON "inventory"("product_name");
