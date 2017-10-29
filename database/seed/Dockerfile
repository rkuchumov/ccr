FROM mongo
MAINTAINER Ruslan Kuchumov <kuchumovri@gmail.com>

COPY seed.js /seed.js

CMD for i in {1..5}; do mongo mongodb://database:27017/ccr /seed.js && break || sleep 3; done
