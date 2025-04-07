FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY startup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/startup.sh

COPY . .

EXPOSE 5000

ENTRYPOINT ["/usr/local/bin/startup.sh"]

CMD ["npm", "run", "start"]
