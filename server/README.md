# Server/back

This folder handle the API for Corum users. It's based on:
- Fastify
- Typescript
- Drizzle ORM
- Postgres
- Jest
- Supertest

## Install

```
npm i
```

## Build

```
npm run build
```

## Swagger

Available at: http://localhost:8080/documentation

## Tests

### Unit tests

To run the unit tests:

```
npm run test-unit
```

### E2E tests

To run the unit tests:

```
npm run test-func
```

## Utils

```
npm run db-clear # will clear all tables in the database
```