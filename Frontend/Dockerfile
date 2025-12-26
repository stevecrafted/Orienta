FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm","start"]
FROM node:18-alpine

WORKDIR /app

# copier seulement package.json pour installer vite
COPY package.json package-lock.json ./

RUN npm install

# copier tout le projet
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
