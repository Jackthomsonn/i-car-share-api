FROM node:10
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
COPY /build /usr/src/app

CMD node index.js

EXPOSE 8080