FROM node:18-alpine 

COPY package.json /home/app/

COPY . /home/app/

WORKDIR /home/app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

