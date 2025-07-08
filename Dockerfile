FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install
ENV PORT 8080

EXPOSE 8080

CMD ["node", "app.js"]