#!/usr/bin/env bash

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NGINX_CONF=$CURRENT_DIR/nginx/nginx-prod.conf

exec nginx -c $NGINX_CONF
