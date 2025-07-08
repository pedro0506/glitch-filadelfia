FROM node:18-alpine

WORKDIR .

COPY package.json .

RUN npm install

EXPOSE 5000

CMD ["node", "app.js"]