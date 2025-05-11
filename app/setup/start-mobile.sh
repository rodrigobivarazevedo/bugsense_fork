#!/bin/sh

# Create tmp directory if it doesn't exist
mkdir -p /app/tmp

# Start the mobile app in the background
yarn start --lan > /app/tmp/mobile.log 2>&1 &

# Wait for the app to be ready
while ! grep -q "Waiting on http://localhost:8081" /app/tmp/mobile.log; do
    sleep 1
done

# Show the URL message
echo "✨✨✨ Mobile App visible on exp://${HOST_IP}:8081 ✨✨✨"

# Keep the container running and show the logs
tail -f /app/tmp/mobile.log 
