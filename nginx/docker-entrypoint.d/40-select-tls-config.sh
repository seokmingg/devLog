#!/bin/sh
set -eu

certificate_path="/etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem"
template_path="/opt/devlog/nginx/http.conf.template"

if [ -f "$certificate_path" ]; then
  template_path="/opt/devlog/nginx/https.conf.template"
  echo "Enabling HTTPS for ${SERVER_NAME}"
else
  echo "TLS certificate not found; starting HTTP for ${SERVER_NAME}"
fi

envsubst '${SERVER_NAME}' < "$template_path" > /etc/nginx/conf.d/default.conf
