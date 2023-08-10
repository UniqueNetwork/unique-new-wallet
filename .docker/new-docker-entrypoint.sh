#!/bin/sh
set -e
NGINX_CONF_FILE=/etc/nginx/nginx.conf.template
if [[ "$1" = 'nginx' && -f "$NGINX_CONF_FILE" ]]; then
  unlink /etc/nginx/nginx.conf 2>/dev/null
  envsubst "$(cat "$NGINX_CONF_FILE" | sed -n 's/.*${\([A-Z_]*\)}.*/$\1/p')" < $NGINX_CONF_FILE > /etc/nginx/nginx.conf
  if [[ -f "$ENV_FILE" ]]; then
    generate-env.sh $ENV_FILE
    cp $ENV_FILE $ENV_FILE\.template
    envsubst "$(cat $ENV_FILE\.template | sed -n 's/.*${\([A-Z_]*\)}.*/$\1/p')" < $ENV_FILE\.template > $ENV_FILE

    if [[ "$INDEX_FILE" != "" && -f "$INDEX_FILE" ]]; then
      today=$(date +%s)
      sed -i 's/env.js/env.js?v='$today'/' $INDEX_FILE
    fi

  fi

fi
exec "$@"
