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
#  echo "$(date): hosts file updated!" >> /storage/emulated/0/magisk_adblock.log
fi
