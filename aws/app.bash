#!/bin/bash

set -ex

yum install -y git

git clone https://github.com/creationix/nvm /nvm
cd /nvm
git checkout tags/v0.33.6
source nvm.sh
nvm install 9.0.0
cp -r /nvm/versions/node/v9.0.0/* /usr/

git clone https://github.com/rkuchumov/ccr /ccr
cd /ccr/app/webui/
npm i --unsafe-perm
npm run build

cd /ccr/app/api/
npm i --unsafe-perm

sed 's/CCR_HOST/localhost/' -i config/production.json 
sed 's/CCR_PORT/80/' -i config/production.json 
sed 's/CCR_MONGO_URL/mongodb:\/\/CCR_MONGO_HOST:27017\/ccr/' -i config/production.json 

NODE_ENV=production nohup node src/index.js &
