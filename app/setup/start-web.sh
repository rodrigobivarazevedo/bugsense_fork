#!/bin/sh

echo "Starting web service setup..."

mkdir -p /app/tmp
echo "Created tmp directory"

echo "Starting web app..."
yarn start --lan > /app/tmp/web.log 2>&1 &
echo "Web app started in background"

echo "Waiting for web app to be ready..."
while true; do
    if grep -q "webpack compiled" /app/tmp/web.log; then
        break
    fi
    sleep 2
done

echo "✨✨✨ Web App visible on http://${HOST_IP}:3000 ✨✨✨"
echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"

echo "Starting to show web app logs..."
tail -f /app/tmp/web.log 
