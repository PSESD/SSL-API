#!/bin/sh
# start-cron.sh

rsyslogd
cron -f &
touch /var/log/cron.log
tail -f /var/log/syslog /var/log/cron.log
