#!/bin/sh

# Start the web app in the background
yarn start --lan > /tmp/web.log 2>&1 &

# Wait for the app to be ready
while ! grep -q "You can now view web in the browser" /tmp/web.log; do
    sleep 1
done

# Show the URL message
echo "✨✨✨ Web App visible on http://${HOST_IP}:3000 ✨✨✨"

# Keep the container running and show the logs
tail -f /tmp/web.log 
