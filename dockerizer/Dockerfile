# Misma definición que /Dockerfile en la raíz (npm run docker:* usa esta ruta).
# build stage
FROM node:20 AS build
WORKDIR /app

RUN npm cache clean --force && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY package*.json ./
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

COPY . .
RUN rm -rf node_modules/.cache dist && \
    npm run build && \
    npm cache clean --force && \
    npm prune --production

# production stage
FROM nginx:stable AS production

RUN rm -rf /var/cache/nginx/* /tmp/* /var/tmp/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./dockerizer/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
