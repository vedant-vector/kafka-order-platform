# Kafka Order Platform

Nx monorepo for a Kafka-based order processing platform.

## Layout

```text
apps/
├── order-service/
├── inventory-service/
└── notification-service/
libs/ (shared libraries at repo root: contracts, kafka, common)
```

## Services

| Service | Responsibility |
|---|---|
| `order-service` | Order API and event publishing |
| `inventory-service` | Inventory reads and stock updates |
| `notification-service` | Event-driven notifications |

## Stack

NestJS, Nx, Kafka, PostgreSQL, Prisma, Docker, GitHub Actions

## Shared libraries

| Library | Import alias | Purpose |
|---|---|---|
| `contracts` | `@kafka-order-platform/contracts` | Event names, topic constants, payload types |
| `kafka` | `@kafka-order-platform/kafka` | Kafka client config, producer module, microservice helpers |
| `common` | `@kafka-order-platform/common` | Validation pipe, global exception filter |

## Database (PostgreSQL + Prisma)

Each data-owning service has its own Prisma schema and database:

| Service | Schema | Database |
|---|---|---|
| `order-service` | `prisma/order-service/schema.prisma` | `order_db` |
| `inventory-service` | `prisma/inventory-service/schema.prisma` | `inventory_db` |

Setup (requires Docker):

```sh
cp .env.example .env
npm run db:setup
```

Run a service with its database URL:

```sh
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/order_db?schema=public npx nx serve order-service
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public npx nx serve inventory-service
```

Useful commands:

```sh
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed:inventory
```

Health check includes database status on order and inventory services:

```sh
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
```

## Local development

Run order-service (needs PostgreSQL + Kafka for full flow):

```sh
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/order_db?schema=public \
KAFKA_BROKERS=localhost:9092 \
npx nx serve order-service
```

Run other services:

```sh
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public \
KAFKA_BROKERS=localhost:9092 \
npx nx serve inventory-service

KAFKA_BROKERS=localhost:9092 \
npx nx serve notification-service
```

### Notifications (`notification-service`)

Consumes `order.created` and `inventory.updated` and logs friendly notification messages. No database — logger-only, ready to extend to email/SMS later.

Health check:

```sh
curl http://localhost:3002/api/health
```

### Inventory API (`inventory-service`)

Consumes `order.created`, decrements stock, and publishes `inventory.updated`. Duplicate events for the same `orderId` are skipped (idempotency guard).

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory` | List all inventory records |
| GET | `/api/inventory/:productName` | Get stock for a product |

Example:

```sh
curl http://localhost:3001/api/inventory
curl http://localhost:3001/api/inventory/Laptop
```

### Order API (`order-service`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order and publish `order.created` |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get order by id |

Example:

```sh
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productName":"Laptop","quantity":2}'
```

Run tests:

```sh
npx nx run-many -t test --projects=order-service,inventory-service,notification-service
```

List workspace projects:

```sh
npx nx show projects
```
