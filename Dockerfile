# Common build stage
FROM node:17.1.0-alpine as common-build-stage

COPY . ./app

WORKDIR /app

# RUN apt-get -y update
# RUN apt-get -y install git

RUN apk update
RUN apk add git

RUN npm install

EXPOSE 8081

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]

# Test build stage
FROM common-build-stage as test-build-stage

ENV NODE_ENV test

CMD ["npm", "run", "start:test"]
