FROM node:10

WORKDIR /app

# COPY ./package.json /app/package.json
RUN npm install

# COPY . /app

EXPOSE 3000

RUN npm install -g nodemon

CMD [ "nodemon", "index.js" ]