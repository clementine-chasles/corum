# Corum users

## Install

You need to run `npm i` for both client and server folders.

## Run

From root directory:

```
docker compose up
```

For first run only you also need to setup the database, so from server directory run:

```
npm run db-migrate
```

Application should now be accessible from: http://localhost:5173/

## Documentation

Swagger for the API can be found: http://localhost:8080/documentation

## Next steps

As this is only a technical test, I had to stop somewhere, but here are a few things I would have liked to improve/implement next:
- Improve design and handle smaller screens (tablet/mobile)
- Remove the possibility to delete a user with a login (password), or at least to delete the user currently logged in
- Add roles & permissions on routes, at the moment any logged in user can add/update/delete any user
- Add logs to the API to trace the requests/responses
- Deploy the app and monitor its health