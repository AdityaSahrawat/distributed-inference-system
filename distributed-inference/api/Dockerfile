FROM node:22-alpine

WORKDIR /app/api

ENV NODE_ENV=production

COPY api/package*.json ./
RUN npm ci --omit=dev

COPY api/server.js ./
COPY proto /app/proto

EXPOSE 3000

CMD ["npm", "start"]
