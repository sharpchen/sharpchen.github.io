FROM node:alpine
WORKDIR /app
RUN apk upgrade
COPY package*.json .
RUN npm install
COPY . .
# RUN addgroup app && adduser -S -G app app
# USER app
ENV API_URL=http://api.myapp.com
EXPOSE 8080
CMD ["npm", "run", "serve"]