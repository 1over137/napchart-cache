FROM node:latest
WORKDIR /usr/src/
COPY api.js ./
COPY package*.json ./
RUN mkdir /napcharts
RUN npm install
EXPOSE 3000
CMD ["node", "api.js"]
