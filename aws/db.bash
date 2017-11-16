#!/bin/bash

logger "in db.bash"

set -ex

logger "repos"

cat << EOF > /etc/yum.repos.d/mongodb-org-3.4.repo
[mongodb-org-3.4]
name=mongodb repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc
EOF

logger "yum"

yum install -y mongodb-org 

sed -i '/bindIp:/d' /etc/mongod.conf

logger "service"

service mongod start

logger "chkconfig"

chkconfig mongod on

