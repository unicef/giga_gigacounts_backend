FROM node:16-alpine AS build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=build-stage /app/build /app/
COPY .env /app/
RUN yarn install --production
EXPOSE 80
CMD ["node", "server.js"]
