FROM node:4.7

MAINTAINER Ruslan Kuchumov <kuchumovri@gmail.com>

ADD bundle /opt/ccr-bundle

WORKDIR /opt/ccr-bundle/programs/server/
RUN npm install --production

WORKDIR /opt/ccr-bundle/

ENTRYPOINT ["node", "main.js"]

