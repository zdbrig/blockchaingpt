FROM node:14
RUN apt-get update && apt-get install -y  netcat 
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
EXPOSE 3001
CMD [ "/app/wait-for-it.sh", "mongodb", "27017",  "rabbitmqservice", "5672", "--", "npm", "start" ]
