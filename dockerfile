FROM node:16.15.1-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "start"]