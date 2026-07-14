# AGENTS.md — Outboxify

## Response Format
- Every response must start with "Dear Mrfroxik:"

## About
Outboxify is a microservices-based ticket booking system for events with
seat selection on a venue map. Pet project for learning distributed
architecture patterns. No frontend (API only).

## Architectural Rules
- **Database per Service** — each service has its own database (single Postgres container, 4 DBs)
- **Transactional Outbox Pattern** — events published via outbox table
- **Polling Publisher** — poll outbox → RabbitMQ (primary mechanism)
- **CDC** — one stream Event DB → Debezium → Kafka (technology demo)
- **gRPC** — for synchronous calls (Gateway → services)
- **RabbitMQ** — for commands and events between services
- **Redis** — seat locks (SETNX with TTL) + venue map cache
- **CQRS** — Booking Service stores cache tables (events_cache, users_cache)
- **Eventual Consistency** — data synchronized via events
- No direct SQL queries between databases of different services

## Stack
- Node.js 20+ LTS, TypeScript (strict mode)
- NestJS + @nestjs/microservices (hybrid applications)
- Prisma ORM
- gRPC (@grpc/grpc-js + proto files in proto/)
- RabbitMQ (amqplib) + Kafka (@nestjs/microservices Transport.KAFKA)
- Debezium (Kafka Connect for CDC)
- Redis (ioredis)
- Stripe (test mode)
- Passport (JWT + Google OAuth + GitHub OAuth)
- Jest (unit + e2e)
- Pino (logging)
- ESLint + Prettier
- Docker Compose for infrastructure
- NestJS CLI monorepo, npm

## Code Conventions
- No comments in code (unless required for README)
- DTO classes with class-validator decorators
- All inter-service contracts — in libs/contracts/
- Proto files — in proto/ at root
- Use existing NestJS patterns (modules, DI, guards, interceptors)
- No service may modify another service's database schema
- E2E test for booking flow — mandatory
- Each service — a separate Nest CLI application

## Monorepo Structure
```
outboxify/
├── apps/
│   ├── gateway/
│   ├── auth-service/
│   ├── event-service/
│   ├── booking-service/
│   ├── payment-service/
│   └── notification-service/
├── libs/
│   ├── contracts/      # Shared DTOs, event interfaces
│   ├── database/       # Prisma clients, shared DB modules
│   ├── rmq/            # RabbitMQ wrappers
│   └── common/         # Guards, filters, interceptors, utils
├── proto/              # .proto files for gRPC
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Infrastructure (docker-compose)
| Container | Port | Purpose |
|-----------|------|---------|
| postgres | 5432 | Auth DB, Event DB, Booking DB, Payment DB |
| redis | 6379 | Locks + cache |
| rabbitmq | 5672/15672 | Message broker |
| zookeeper | 2181 | Kafka coordination |
| kafka | 9092 | CDC stream |
| debezium | 8083 | Kafka Connect |

## Roadmap
1. **Stage 0:** NestJS CLI monorepo — workspace structure, apps, libs, tsconfig
2. **Stage 1:** Docker Compose — single Postgres (4 DBs) + Redis + RabbitMQ + Kafka + Debezium
3. **Stage 2:** Auth Service (JWT + Google/GitHub OAuth)
4. **Stage 3:** Event+Venue Service + Outbox + CDC (Debezium)
5. **Stage 4:** Booking Service (core — locks, cache tables, gRPC)
6. **Stage 5:** Payment Service (Stripe + webhooks)
7. **Stage 6:** Notification Service (email)
8. **Stage 7:** API Gateway (REST → gRPC, venue map cache)
9. **Stage 8:** E2E tests + README

## Commands
(to be filled during development)
- npm run lint
- npm run build
- nest build <service>
- nest start <service>
- nest start <service> --watch
- nest test <service>
- docker-compose up -d