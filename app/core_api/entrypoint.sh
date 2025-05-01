#!/usr/bin/env bash
set -e

# Wait for DB (Postgres example)
until python manage.py migrate --noinput; do
  >&2 echo "Postgres unavailable - sleeping"
  sleep 1
done

exec "$@"
