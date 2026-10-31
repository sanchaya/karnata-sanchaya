FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# The static GitHub Pages edition sets this; the live server must never be built with it.
ARG VITE_STATIC_DATASET
RUN test "$VITE_STATIC_DATASET" != "true" || (echo "VITE_STATIC_DATASET=true must not be set for the live server build" && exit 1)
RUN npm run check

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src/data ./src/data
EXPOSE 8787
CMD ["sh", "-c", "npm run db:migrate && npm run db:sync-dataset && npm start"]
