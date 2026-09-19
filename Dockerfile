FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js storage.js notifications.js index.html logo.png data.json README.md IMPORT_GUIDE.md .env.example ./
COPY templates ./templates
ENV NODE_ENV=production
ENV PORT=4173
EXPOSE 4173
CMD ["npm", "start"]
