if [ -n "${1}" ]; then
  PG=${1} docker-compose up web
fi