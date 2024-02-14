FROM node:21-alpine3.19

WORKDIR /NodeApp

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD [ "nodemon" ]