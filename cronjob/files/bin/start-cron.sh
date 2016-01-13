#!/bin/sh
# start-cron.sh
cron -f
touch /var/log/cron.log
