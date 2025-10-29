# Solo “serve” (sin etapa de build)
FROM nginx:1.27-alpine

# Conf SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajusta el nombre de la carpeta real que te genera el build
# EJEMPLO: dist/jireh-web/browser/
COPY ./JirehWeb/dist/frontend/browser/ /usr/share/nginx/html/

EXPOSE 80

