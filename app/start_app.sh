#!/usr/bin/env bash

export HOST_IP=$(ifconfig en0 \
  | awk '/inet / && !/127/ {print $2; exit}')

echo "HOST_IP=$HOST_IP" > .env

echo "✨✨✨ Expo App visible on exp://$HOST_IP:8081 ✨✨✨"

if [ "$1" = "--build" ]; then
  docker-compose up --build
else
  docker-compose up
fi
