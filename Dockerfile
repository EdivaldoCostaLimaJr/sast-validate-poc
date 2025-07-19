FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

CMD ["node", "server.js"]
