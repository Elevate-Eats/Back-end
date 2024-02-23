FROM node:18-slim

RUN npm install

CMD ["node", "index.js"]
