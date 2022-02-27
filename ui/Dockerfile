FROM node:14.17.5-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./dist ./dist

RUN npm install && \
    npm run build

EXPOSE 8000

CMD [ "npm", "run", "start:prod" ]
