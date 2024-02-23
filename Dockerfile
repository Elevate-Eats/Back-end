FROM node:18-slim

COPY ./ /var/aapi/codes/

WORKDIR /var/aapi/codes/

RUN npm install

CMD ["node", "index.js"]
