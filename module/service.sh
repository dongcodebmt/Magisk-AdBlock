#!/system/bin/sh
MODDIR=${0%/*}
UPDATER_FILE=./updater.sh
CRON_DIR=./crontabs
CRON_FILE=$CRON_DIR/root
CRON_EX="0 0 * * 2"

# This script will be executed in late_start service mode
cd "$MODDIR"

while [ command -v crond &> /dev/null ]; do
  sleep 3
done
while [ ! -f $CRON_FILE ]; do
  sleep 3
done

CRON_EXISTS=$(cat $CRON_FILE | grep $(realpath $UPDATER_FILE))

if [ -z "$CRON_EXISTS" ]; then
  echo "$CRON_EX sh $(realpath $UPDATER_FILE)" >> $CRON_FILE
fi

crond -b -c $(realpath $CRON_DIR)
