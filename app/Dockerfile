FROM node:8.8

MAINTAINER Ruslan Kuchumov <kuchumovri@gmail.com>

ADD api /opt/api
ADD webui-static /opt/webui-static

WORKDIR /opt/api

RUN npm install --production

EXPOSE 80

ENTRYPOINT ["node", "src/index.js"]

