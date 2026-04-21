FROM node:lts-alpine3.22 AS base

RUN apk add openssl

FROM base AS deps

WORKDIR /app

COPY package*.json .

RUN npm i

FROM base AS dev

WORKDIR /internsystem-v2

COPY --from=deps /app/node_modules ./node_modules
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./prisma.config.ts .
COPY ./app ./app
COPY ./prisma ./prisma
COPY ./sanity ./sanity

RUN npx prisma generate

CMD ["npx", "next", "dev", "-p", "3005"]
