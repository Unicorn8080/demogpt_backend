FROM node:16.15.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 8000

CMD [ "npm", "start"]