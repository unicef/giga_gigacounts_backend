FROM node:16 AS build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:16
WORKDIR /app
COPY --from=build-stage /app/build /app/
COPY .env /app/
RUN npm i concurrently -g
RUN yarn install --production
RUN env
EXPOSE 80
CMD ["concurrently", "\"node server.js\"", "\"npm run scheduler\""]
