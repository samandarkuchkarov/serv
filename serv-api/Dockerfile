# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

# Install pg_dump for backup script
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/seed.ts ./seed.ts
COPY --from=builder /app/scripts ./scripts

RUN mkdir -p uploads logs backups

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
