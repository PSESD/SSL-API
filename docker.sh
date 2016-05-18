#!/bin/bash
sshpass -p '$SSH_PASSWORD' ssh $SSH_USERNAME@$SSH_HOST
cd /home/cbo/docker/api
git pull origin develop
docker rm -f api
docker build -t psesd/ssl-api:develop .
docker run -d --name api --link redis:redis -p 104.192.103.12:443:443 -e "NODE_ENV=development" -e "NODE_CONFIG_DIR=/config" -v /config:/config psesd/ssl-api:develop
