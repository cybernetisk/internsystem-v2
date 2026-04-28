# ===== BASE STAGE ======

FROM node:lts-alpine3.22 AS base

RUN apk add openssl

FROM base AS deps

WORKDIR /app

COPY package*.json .

RUN npm ci

# ===== DEV STAGE ======
FROM base AS dev

WORKDIR /internsystem-v2

COPY --from=deps /app/node_modules ./node_modules
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./prisma.config.ts .
COPY ./sanity*.js .
COPY ./next.config.mjs .

COPY ./app ./app
COPY ./prisma ./prisma
COPY ./sanity ./sanity
COPY ./public ./public

RUN npx prisma generate

CMD ["npm", "run", "dev"]

# ===== PROD-BUILDER STAGE =====
FROM base AS builder

ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION

ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION

WORKDIR /internsystem-v2

COPY --from=deps /app/node_modules ./node_modules
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./prisma.config.ts .
COPY ./sanity*.js .
COPY ./next.config.mjs .

COPY ./app ./app
COPY ./prisma ./prisma
COPY ./sanity ./sanity
COPY ./public ./public


RUN npx prisma generate
RUN npx next build

# ===== PROD STAGE =====
FROM base AS prod

WORKDIR /app

COPY --from=builder /internsystem-v2/.next/standalone ./
COPY --from=builder /internsystem-v2/.next/static ./.next/static
COPY --from=builder /internsystem-v2/public ./public

EXPOSE 3000

CMD ["node", "server.js"]