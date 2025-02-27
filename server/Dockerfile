FROM node:22
WORKDIR /data

COPY package.json package-lock.json ./
RUN npm install

COPY . .
COPY src/ src/
RUN npm run build

EXPOSE 8080

CMD ["node", "index.js"]