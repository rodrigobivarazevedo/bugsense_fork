#!/bin/sh

# Start the mobile app in the background
yarn start --lan > /tmp/mobile.log 2>&1 &

# Wait for the app to be ready
while ! grep -q "Waiting on http://localhost:8081" /tmp/mobile.log; do
    sleep 1
done

# Show the URL message
echo "✨✨✨ Mobile App visible on exp://${HOST_IP}:8081 ✨✨✨"

# Keep the container running and show the logs
tail -f /tmp/mobile.log 
