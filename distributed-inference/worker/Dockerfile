FROM node:22-alpine

WORKDIR /app/worker

ENV NODE_ENV=production

COPY worker/package*.json ./
RUN npm ci --omit=dev

COPY worker/server.js ./
COPY proto /app/proto

EXPOSE 50051

CMD ["npm", "start"]
