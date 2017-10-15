FROM node:8.7

MAINTAINER Ruslan Kuchumov <kuchumovri@gmail.com>

ADD src /opt/ccr-reciever

WORKDIR /opt/ccr-reciever

RUN npm install --production

EXPOSE 5000

ENTRYPOINT ["node", "ccr-reciever"]

