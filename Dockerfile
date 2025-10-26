FROM node:18.15 AS build

WORKDIR /usr/local/app

# Compilacion en servidor
#COPY ./ /usr/local/app/
#RUN npm install -g @ionic/cli@7.1.1
#RUN npm install
#RUN ionic build --prod  

# Compilacion Externa
COPY ./dist /usr/local/app/www/

FROM nginx:1.23.2-alpine

COPY --from=build /usr/local/app/www/ /usr/share/nginx/html

EXPOSE 80
