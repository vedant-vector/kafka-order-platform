-- CreateTable
CREATE TABLE "processed_orders" (
    "order_id" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_orders_pkey" PRIMARY KEY ("order_id")
);
