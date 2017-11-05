#!/bin/bash
cat << EOF > /etc/yum.repos.d/mongodb-org-3.4.repo
[mongodb-org-3.4]
name=mongodb repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc
EOF

yum install -y mongodb-org git

sed -i '/bindIp:/d' /etc/mongod.conf

service mongod start

git clone https://github.com/rkuchumov/ccr /ccr

cd /ccr/database/seed/
mongo mongodb://127.0.0.1:27017/ccr seed.js
