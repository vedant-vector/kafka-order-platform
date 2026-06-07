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
