FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY package-lock.json ./build/

WORKDIR /app/build

RUN npm ci --omit=dev

EXPOSE 3333

CMD ["node", "bin/server.js"]
