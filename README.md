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

After installing these programs, run the following commands:

### Setting up the database image

`$ docker-compose up -d`

### Installing project dependencies

`$ npm install`

### Setting up tables and some users

`$ node ace migration:run`

`$ node ace create:users`

> This command will create a couple of users/countries/roles on the database

## Running

`$ npm run dev `

## Testing

`$ node ace test`
