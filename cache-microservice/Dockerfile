FROM node:alpine
WORKDIR /app
EXPOSE 4040
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
CMD [ "node", "app.js" ]