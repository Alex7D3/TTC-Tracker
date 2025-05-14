#!/usr/bin/env bash

cd "${0%/*}"

[ ! -f ../.env ] && >&2 echo "error: no .env file" && exit 1

sed -e 's/\r//g' ../.env

export $(grep -v '^#' ../.env | xargs -d '\n')

[ -z "${PG_USER}" ] && >&2 echo "error: no user" && exit 1
[ -z "${PG_PASSWORD}" ] && >&2 echo "error: no password" && exit 1
[ -z "${PG_HOST}" ] && >&2 echo "error: no host" && exit 1
[ -z "${PG_PORT}" ] && >&2 echo "error: no port" && exit 1
[ -z "${PG_DATABASE}" ] && >&2 echo "error: no database" && exit 1

echo ""

psql -v datadir="$PWD/TTC Routes and Schedules Data" \
    -f "$PWD/init.sql" \
    "postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}"