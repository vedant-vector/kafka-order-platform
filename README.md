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

Run a service:

```sh
npx nx serve order-service
npx nx serve inventory-service
npx nx serve notification-service
```

Run tests:

```sh
npx nx run-many -t test --projects=order-service,inventory-service,notification-service
```

List workspace projects:

```sh
npx nx show projects
```
