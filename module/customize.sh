#!/bin/sh
CRON_DIR=$MODPATH/crontabs
CRON_FILE=$CRON_DIR/root

if [ command -v crond &> /dev/null ]; then
  abort "Please install Busybox first!"
fi

ui_print "- Create crontab file"
if [[ -f $CRON_FILE ]]; then
  rm $CRON_FILE
fi
if [[ -d $CRON_DIR ]]; then
  rm -r $CRON_DIR
fi
mkdir -p $CRON_DIR
touch $CRON_FILE

ui_print "- Setting permissions"
set_perm_recursive $MODPATH 0    0    0755 0644
ui_print "- Now reboot to make changes."

