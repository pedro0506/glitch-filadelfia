FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 1337

CMD ["node", "app.js"]