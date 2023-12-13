#!/bin/sh
SCRIPT=$(readlink -f $0)
MODDIR=$(dirname "$SCRIPT")
HOSTS_URL=

if [ -f $MODDIR/hosts_temp ]; then
  rm -f $MODDIR/hosts_temp
fi

busybox wget $HOSTS_URL -O $MODDIR/hosts_temp

if [ -f $MODDIR/hosts_temp ]; then
  rm -f $MODDIR/system/etc/hosts
  mv $MODDIR/hosts_temp $MODDIR/system/etc/hosts
  echo "$(date): The hosts file has been updated!" >> $MODDIR/updater.log
else
  echo "$(date): Download hosts file failed!" >> $MODDIR/updater.log
fi
