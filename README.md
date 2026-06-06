# Kafka Order Platform

Nx monorepo for a Kafka-based order processing platform.

## Services

| Service | Responsibility |
|---|---|
| `order-service` | Order API and event publishing |
| `inventory-service` | Inventory reads and stock updates |
| `notification-service` | Event-driven notifications |

## Stack

NestJS, Nx, Kafka, PostgreSQL, Prisma, Docker, GitHub Actions

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
