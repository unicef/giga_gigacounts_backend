FROM node:16-alpine AS build-stage
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

FROM node:16-alpine
WORKDIR /app
COPY --from=build-stage /app/build /app/
COPY .env /app/
RUN yarn add reflect-metadata && yarn cache clean --all
EXPOSE 80
CMD ["yarn", "run", "start"]
