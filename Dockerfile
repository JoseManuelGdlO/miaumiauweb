# Imagen de producción (nginx + estáticos Vite).
# Duplicado de dockerizer/Dockerfile: Easypanel y Docker por defecto buscan Dockerfile en la raíz.
# Si cambias uno, actualiza el otro.

FROM node:20 AS build
WORKDIR /app

RUN npm cache clean --force && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY package*.json ./
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN rm -rf node_modules/.cache dist && \
    npm run build && \
    npm cache clean --force && \
    npm prune --production

FROM nginx:stable AS production

RUN rm -rf /var/cache/nginx/* /tmp/* /var/tmp/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./dockerizer/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
