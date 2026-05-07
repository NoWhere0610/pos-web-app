FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Tạo Prisma Client bên trong Docker
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]