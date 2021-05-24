# stage1 - build react app first
FROM node:lts as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
RUN npm install
COPY . /app
COPY .env.prod /app/.env
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.prod /etc/nginx/conf.d/nginx.conf
EXPOSE 80
