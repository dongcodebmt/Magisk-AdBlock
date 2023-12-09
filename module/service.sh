#!/system/bin/sh
MODDIR=${0%/*}

cd "$MODDIR"
crond -b -c $(realpath ./crontabs)
