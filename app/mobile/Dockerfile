FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl

RUN npm install -g expo-cli

COPY package.json yarn.lock ./

RUN yarn install

ARG API_URL
ENV API_URL=$API_URL

COPY . .

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

CMD ["yarn", "start", "--lan"]
