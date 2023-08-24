FROM node:18

WORKDIR /app

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE ${app_port}

# CMD npm start
CMD [ "npm", "start" ]
