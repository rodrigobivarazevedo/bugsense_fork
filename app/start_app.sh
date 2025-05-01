#!/usr/bin/env bash
export HOST_IP=$(ifconfig en0 \
  | awk '/inet / && !/127/ {print $2; exit}')
docker-compose up --build
