FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
