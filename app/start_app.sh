#!/usr/bin/env bash

export HOST_IP=$(ifconfig en0 \
  | awk '/inet / && !/127/ {print $2; exit}')

# Write HOST_IP to .env file for Docker Compose
echo "HOST_IP=$HOST_IP" > .env

echo "✨✨✨ Mobile App visible on exp://$HOST_IP:8081 ✨✨✨"
echo "✨✨✨ Web App visible on http://$HOST_IP:3000 ✨✨✨"

if [ "$1" = "--build" ]; then
  docker-compose up --build
else
  docker-compose up
fi
