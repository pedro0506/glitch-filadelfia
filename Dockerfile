FROM node:20

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 1337

CMD ["node", "app.js"]