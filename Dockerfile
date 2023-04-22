FROM node:19-alpine3.16

WORKDIR /moneymap
COPY . .
RUN npm ci
WORKDIR  /moneymap/server
RUN npx prisma migrate dev --name init
WORKDIR /moneymap
RUN npm run build

EXPOSE 4000
EXPOSE 4001

CMD [ "npm", "start" ]
