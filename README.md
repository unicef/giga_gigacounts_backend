# Unicef Giga API

# Getting started

Rename the `.env.example` file to `.env` and replace the credentials necessary for local setup.

```
PG_USER=admin
PG_PASSWORD=p@ssword
PG_DB_NAME=unicef-giga
```

> Note: You can find more info about the others required `.env` variables inside the `.env.example` file.

## Instaling

You need a couple of things to be installed in order to run this application:

- [Node/NPM](https://nodejs.org/en/)

  > Minimum Version: 16

- [Docker](https://www.docker.com/products/docker-desktop/)

`$ npm install -g yarn `

After installing these programs, run the following commands:

### Setting up the database image

To set up a local database connection:

`$ docker-compose up -d`

### Setting up tables and some users

`$ node ace migration:run`

`$ NODE_ENV=test node ace migration:run`

`$ node ace seed:db`

> This command will create a couple of users/countries/roles on the database
> Don't run this command on the test database

### Installing project dependencies

`$ yarn install`

## Running

`$ yarn run dev`

## Testing

`$ node ace test`

## Github Actions

### Cron

This action is responsible for handling two daily routines:

- Updating contracts status based on they dates.
- Getting daily internet measures from the Unicef API
  > By default the cron action automatic run is disabled, can only be activated manually.

If you want turn on schedule runs of this actions, uncomment the following code (lines 4 to 6) inside the `cron.yml` file, inside `.github/workflows`

```
name: Cron Job

on:
# schedule:
# - cron: '2 0 * * *'
# - cron: '58 23 * * *'
```

### Create Safe

This action is responsible for creating a new gnosis safe on Ethereum blockchain.

> Note: The exact chain and the private key of the master wallet has to be defined inside the .env file

Before running this action you need to input an name for the Safe and the target environment.

#### Running remotely

Inside this repository's github page, go to `Actions` tab. Choose the `Create Safe` workflow and click `Run workflow`.

#### Running locally

`$ npm run deploy:safe --private_key='...' --name='name for the safe'`

### Assign a User to a Safe

This actions is responsible for adding a users wallet to an gnosis safe.

> Note: The exact chain and the private key of the master wallet has to be defined inside the .env file
> Note: Make sure that the safe for the user's role is already created.

Before running this action you need to input the User's email and the target environment.

#### Running remotely

Inside this repository's github page, go to `Actions` tab. Choose the `Assign User to Safe` workflow and click `Run workflow`.

#### Running locally

`$ npm run add:user_safe --env=dev --email='user email'`

## DEV/STAGE envs (Azure)

DEV and STAGE environments deploys to Azure via GitHub actions.
There are 2 secrets configured in GitHub: DEV_ENV_FILE and STAGE_ENV_FILE.
Each secret contains base64 encoded .env file for the corresponding environment.

In order to update GitHub secret for any environment, prepare .env file locally (look into .env.azure.example), encode it with base64 and provide the result with the repo admin.

Example:

`$ cat .env.azure.dev | base64 > env_azure_dev.txt`
