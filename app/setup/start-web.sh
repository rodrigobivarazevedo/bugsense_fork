#!/bin/sh

# Create tmp directory if it doesn't exist
mkdir -p /app/tmp

# Start the web app in the background
yarn start --lan > /app/tmp/web.log 2>&1 &

# Wait for the app to be ready
while ! grep -q "You can now view web in the browser" /app/tmp/web.log; do
    sleep 1
done

# Show the URL message
echo "✨✨✨ Web App visible on http://${HOST_IP}:3000 ✨✨✨"
echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"

# Keep the container running and show the logs
tail -f /app/tmp/web.log 
