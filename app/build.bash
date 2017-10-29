#!/bin/bash

set -ex

echo Building webui static files

rm -rf webui-static || true

cd webui
npm install 
npm run build
cd -

echo Done
