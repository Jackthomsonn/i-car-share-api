FROM node:10
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install && \
  npm install nodemon -g && \
  npm install typescript -g
COPY . /usr/src/app

CMD tail -f /dev/null

EXPOSE 8080