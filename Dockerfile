FROM node:20-alpine AS builder

WORKDIR /base

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:release

# for running the app
FROM node:20-alpine AS server

ENV NODE_ENV=production
ENV TZ=GMT

RUN apk --update add \
		tzdata \
	&& cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

RUN mkdir -p /app/build
COPY --from=builder /base/build/src /app/build/

COPY package.json ./
RUN npm install --production

CMD ["node", "/app/build/main.js"]