FROM node:20

WORKDIR .

COPY package.json .

RUN npm install

EXPOSE 1337

CMD ["node", "app.js"]