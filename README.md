# Smart Brain API

A Node Express server API for the Smart Brain app.

## How To Run Using Docker

You can run the app locally with Docker by using the instructions below. 

1. Create a docker.env file in the root project directory with the following environment variables:
```
NODE_ENV=development
JWT_SECRET=JWT_SECRET
DATABASE_URL=postgres://postgres:root@postgres:5432/smart-brain-docker
PORT=5000
REDIS_URI=redis://redis:6379
```

2. Create a postgres.env file in the root project directory with the following environment variables:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=smart-brain-docker
POSTGRES_HOST=postgres
```

3. Open a new terminal window and run the `docker compose up --build` command
4. Once the container is running, go to http://localhost:5000 to check that the app is running
5. To exit the server, press `CTRL` + `C` in the terminal window
6. To stop all Docker containers, run the `docker compose down` command
7. To run the app again, run the `docker compose up` command
8. If you make any changes to the Docker configuration files, you will need to run the `docker compose up --build`
   command to build new containers with the new configuration (run the `docker compose down` command first to close any
   containers that may be running)

## How To Run Without Using Docker

If you don't have Docker and are unable to download it:

1. Start a postgres server
2. Create a postgres database called smart-brain-docker
3. Create a users and login table - the table schemas are in the sql files in the `postgres/tables` directory.
4. Install redis and start the redis server
5. Create a .env file in the root project directory with the following environment variables:
```
NODE_ENV=development
JWT_SECRET=JWT_SECRET
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/smart-brain-docker
PORT=5000
REDIS_URI=redis://redis:6379
```
6. Open a new terminal window and run the `npm start` command
7. Once the app is running, go to http://localhost:5000 to open the running app
8. To close the app, press `CTRL` + `C` in the terminal window
