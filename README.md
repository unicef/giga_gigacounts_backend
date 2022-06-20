# Unicef Giga API

# Getting started

Rename the `.env.example` file to `.env` and replace the credentials necessary for local setup.

```
PG_USER=admin
PG_PASSWORD=p@ssword
PG_DB_NAME=unicef-giga
```

## Instaling

You need a couple of things to be installed in order to run this application:

- [Node/NPM](https://nodejs.org/en/)
- [Docker](https://www.docker.com/products/docker-desktop/)

`$ npm install -g yarn `

After installing these programs, run the following commands:

### Setting up the database image

`$ docker-compose up -d`

### Installing project dependencies

`$ yarn install`

### Setting up tables and some users

`$ node ace migration:run`

`$ node ace seed:db`

> This command will create a couple of users/countries/roles on the database

## Running

`$ yarn run dev `

## Testing

`$ node ace test`

## DEV/STAGE envs (Azure)

DEV and STAGE environments deploys to Azure via GitHub actions.
There are 2 secrets configured in GitHub: DEV_ENV_FILE and STAGE_ENV_FILE.
Each secret contains base64 encoded .env file for the corresponding environment.

In order to update GitHub secret for any environment, prepare .env file locally (look into .env.azure.example), encode it with base64 and provide the result with the repo admin.

Example:

`$ cat .env.azure.dev | base64 > env_azure_dev.txt`
