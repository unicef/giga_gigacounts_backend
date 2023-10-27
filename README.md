# Gigacounts Backend

## Requirements

The App requires:

- [Node.js](https://nodejs.org/) v16+ to run (^16.14.2).
- [Yarn.js](https://classic.yarnpkg.com/en/docs/install) v1+ to run (^1.22.19).
- [Docker](https://www.docker.com/products/docker-desktop/) (in case that you desire to start app with docker).
- [Azure Active Directory B2C installed and configured in Azure Subscription](https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview)
- PostgreSql ([windows installation](https://www.postgresql.org/download), [linux installation](https://www.postgresql.org/download)).
- The Smart Contracts from Blockchain project deployed in Polygon Testnet Network.

- You could check version of packages (node, yarn) with these comamnds:

  ```sh
  node -v
  yarn -v
  ```

## Setting up the Database

You can set up the database either running manually installing the database on your local machine or running `docker-compose` command.

### Running Manually

You need to have postgreSql installed.

Then:

- Set postgres database password to the same in .env file (or vice versa). If you need to change password:

```sh
# linux: sudo -u postgres psql, windows: psql. Then:
# Important: use the same user name (here "postgres") that you put in .env file.
ALTER USER postgres PASSWORD 'p@ssword';
```

- Ensure that your postgres port is the same that .env file (default postgres port: 5432, actual in .env 54322 (additional "2")).

* Connect to postgresql and then create a database called **unicef_giga**

- Create user **admin** with any password (e.g.: **p@ssword**) and be sure that you put that user and password in .env file.

```sh
# command to create user with password in command lin
# important: use the same user name (here "postgres") that you put in .env file
psql -c "CREATE USER postgres WITH PASSWORD 'p@ssword';"
```

- Create the database schema and insert the initial and mock data, running all the scripts in the following folder: `./database/scripts`

  - Schema & Initial Data: [./database/scripts/initial-data](./database/scripts/initial-data)
  - Mock Data: [./database/scripts/mock-data](./database/scripts/mock-data)

  **Important**: The **00_shema.sql** script is using the **admin** user to leave as owner of the tables. That user has to be created in your local database (or put the one you have, in the script, before running it). Example:

  ```sql
  alter table countries
    owner to admin;
  ```

### Running via Docker-Compose

- Alternatively, you could start up the database with docker-compose:

```sh
docker-compose up -d
```

SQL Files located on folder `./database/scripts` will be executed automatically during `docker-compose` start-up

> This command executes SQL scripts alphabetically

The default **docker-compose.yml** file, start database with schema and initial data.  
If you want to include mock data (e.g.: dev environment), you must use **docker-compose-mocks.yml**.

```sh
docker-compose -f docker-compose-mock.yml up
```

## Install the dependencies

```sh
- yarn install # with yarn
- npm i OR npm i --legacy-peer-deps # with NPM
```

If you have troubles with dependencies, try this:

```sh
set http_proxy=
set https_proxy=
npm config rm https-proxy
npm config rm proxy
npm config set registry "https://registry.npmjs.org"
yarn cache clean
yarn config delete proxy
yarn --network-timeout 100000
```

Create a .env file running the command in terminal

```sh
touch .env
```

## Environment variables

The environment variables bellow needs to be set in the .env file when project is running locally.

```sh
SKIP_PREFLIGHT_CHECK=true
PG_USER=admin
PG_PASSWORD=some password
PG_DB_NAME=unicef-giga
```

> Note: You can find more info about the others required `.env` variables inside the `example_env` file.

## Start app

```sh
- yarn dev
# or
- npm run dev
```

---

## TODO (Improvements)

- Improve scalability in the face of data growth (for example: schools) so that there is no impact on performance.
- Move hardcoded sql code to database.

---

## Source Code additional Documentation

See [./doc/](./.doc/index.md), for documentation about source code and database commands.

## References

- [Convert JSON Data to SQL Inserts command](https://wtools.io/convert-json-to-sql-queries) - This link is useful to convert data from the project connect API to postgresql

- [cron-tasks](https://crontab.guru)
