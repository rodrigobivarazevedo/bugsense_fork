#!/bin/sh

mkdir -p /app/tmp

yarn start --lan > /app/tmp/mobile.log 2>&1 &

while ! grep -q "Waiting on http://localhost:8081" /app/tmp/mobile.log; do
    sleep 1
done

echo "✨✨✨ Mobile App visible on exp://${HOST_IP}:8081 ✨✨✨"

tail -f /app/tmp/mobile.log 
