FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY . .

RUN npm ci
RUN npm run migrate:dev

CMD ["npm", "dev"]