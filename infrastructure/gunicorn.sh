#!/usr/bin/env bash

ACCESS_LOGFILE=$HOME/log/gunicorn-access.log
ERROR_LOGFILE=$HOME/log/gunicorn-error.log
LOGDIR=$HOME/log/
PID=$HOME/gunicorn.pid
test -d $LOGDIR || mkdir -p $LOGDIR

# user/group to run as
USER=ubuntu
GROUP=ubuntu

exec ../infrastructure/env_run.sh gunicorn_django -b 127.0.0.1:8000 \
    --user=$USER --group=$GROUP --pid=$PID --log-level=debug \
    --access-logfile=$ACCESS_LOGFILE --error-logfile=$ERROR_LOGFILE
