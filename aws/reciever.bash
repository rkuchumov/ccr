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
cd /ccr/reciever/src
npm i --unsafe-perm

./ccr-reciever -D mongodb://CCR_MONGO_HOST:27017/ccr -S tcp://*:5000
