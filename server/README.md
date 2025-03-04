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

## Start

```
npm run dev
```

## Swagger

Available at: http://localhost:8080/documentation

## Database

Database is postgres and we use drizzle ORM to handle queries and migration scripts. So when you want to modify the DB schema, you change the schema file: `src/db/schema.ts`.
You then have to run:
- `npm run db-generate` which will generate migration scripts in the drizzle folder
- `npm run db-migrate` to actually do the migration in the DB

## Tests

### Unit tests

To run the unit tests:

```
npm run test-unit
```

### E2E tests

To run the e2e tests:

```
npm run test-func
```

## Utils

```
npm run db-clear # will clear all tables in the database
```