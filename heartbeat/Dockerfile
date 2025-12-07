FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

ENV PORT=3230 \
    USE_HTTPS=false

EXPOSE 3230

CMD ["npm", "run", "start:prod"]
