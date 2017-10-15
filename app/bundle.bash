#!/bin/bash
set -x

rm -rf bundle

cd src/
npm install --production
meteor build ../ --architecture os.linux.x86_64

cd ../
tar xvzf src.tar.gz

