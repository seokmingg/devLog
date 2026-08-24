FROM nginx:1.29-alpine

RUN apk add --no-cache gettext

COPY conf /opt/devlog/nginx
COPY docker-entrypoint.d/40-select-tls-config.sh /docker-entrypoint.d/40-select-tls-config.sh

RUN chmod +x /docker-entrypoint.d/40-select-tls-config.sh

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/health || exit 1
