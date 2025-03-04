# Client/Front

This folder handles the webapp for Corum users. It's based on:
- React (19)
- Vite
- Typescript
- Jest
- Playwright

## Install

```
npm i
```

## Start

```
npm run dev
```

## Tests

### Unit/integration tests

```
npm run test # will run unit/integration tests
```

### E2E tests

Pre-requisites:

```
# follow the install from the server folder
# from root folder
docker compose up
# from server folder
npm run db-clear
# from client folder
npx playwright install
```

To run the tests:

```
npm run test-func # will run e2e tests
```

To run them in UI mode:

```
npm run test-func-dev
```