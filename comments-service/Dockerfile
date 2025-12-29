FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

FROM node:lts-alpine
WORKDIR /app
COPY .env .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
EXPOSE 3001
CMD ["npm", "start"]
