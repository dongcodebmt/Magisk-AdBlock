#!/bin/sh
if [ command -v crond &> /dev/null ]; then
  abort "Please install Busybox first!"
fi

ui_print "- Create crontab file"
mkdir $MODPATH/crontabs
echo "0 0 * * 3 sh ${MODPATH}/host_update.sh" >> $MODPATH/crontabs/root

ui_print "- Setting permissions"
set_perm_recursive $MODPATH 0    0    0755 0644
ui_print "- Now reboot to make changes."

