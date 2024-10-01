FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --force
RUN npm install next --force
COPY . .
RUN npx prisma generate
CMD npm run dev
