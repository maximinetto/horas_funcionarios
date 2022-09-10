FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run migrate:test

EXPOSE 3000

CMD ["npm", "start"]