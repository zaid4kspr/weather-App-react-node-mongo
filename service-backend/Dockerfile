FROM node:lts
RUN apt-get update && apt-get install -y \
    vim \
    git 
WORKDIR /home/node/app
RUN mkdir -p /home/node/app/upload
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
#COPY .env.dev /home/node/app/.env
COPY ecosystem.config.dev.js /home/node/app/ecosystem.config.js

EXPOSE 3300
CMD ["pm2-runtime","start","ecosystem.config.js"]