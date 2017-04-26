FROM node:latest

RUN mkdir -p /usr/src
COPY . /usr/src
WORKDIR /usr/src

RUN npm install

# a very simple test
RUN NODE_ENV=test npm start

EXPOSE 3000

CMD [ "npm", "start" ]
