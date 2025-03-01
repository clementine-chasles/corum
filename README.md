# Corum

## Setup

You need to run both setups:

- [Setup client](client/README.md)
- [Setup server](server/README.md)

## Run

From root directory:

```
docker compose up
```

For first run only you also need to setup the database, so run:

```
npm run db-migrate
```

Application should now be accessible from: http://localhost:5173/

## Documentation

Swagger for the API can be found: http://localhost:8080/documentation