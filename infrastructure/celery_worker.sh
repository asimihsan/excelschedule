#!/usr/bin/env bash

LOGFILE=$HOME/log/celery_worker.log
LOGDIR=$HOME/log/
test -d $LOGDIR || mkdir -p $LOGDIR

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ../backend
exec ../infrastructure/env_run.sh python -u manage.py celery worker \
    --maxtasksperchild=4 --soft-time-limit 60 --time-limit 120 --beat \
    --loglevel=info --logfile=$LOGFILE
