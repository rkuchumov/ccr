#!/bin/sh
set -x

cd src/
npm install --production
meteor build ../ --architecture os.linux.x86_64

cd ../
tar xvzf src.tar.gz

