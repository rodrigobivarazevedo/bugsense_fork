#!/usr/bin/env bash

show_help() {
  echo "Usage: ./start_app.sh [OPTION]"
  echo ""
  echo "Options:"
  echo "  --help     Display this help message"
  echo "  --build    Build and start all services"
  echo "  --load-data Start services and load initial data"
  echo ""
  echo "Description:"
  echo "  This script manages the BugSense application services."
  echo "  Without any options, it starts all services without building."
  echo ""
  echo "Examples:"
  echo "  ./start_app.sh --help     # Show this help message"
  echo "  ./start_app.sh --build    # Build and start all services"
  echo "  ./start_app.sh --load-data # Start services and load initial data"
  echo "  ./start_app.sh            # Start services without building"
}

generate_secret_key() {
  python3 -c "import secrets; print(secrets.token_urlsafe(50))"
}

get_host_ip() {
  ifconfig en0 | awk '/inet / && $2 != "127.0.0.1" {print $2; exit}'
}

# Function to run docker compose with proper cleanup
run_docker_compose() {
  local compose_cmd="$1"
  echo "Starting services with: $compose_cmd"
  $compose_cmd &
  local docker_pid=$!
  
  # Wait for the docker compose process
  wait $docker_pid
  
  # When docker compose exits (either normally or via Ctrl+C), run down
  echo "Stopping and removing containers..."
  docker compose down
}

# Trap Ctrl+C (SIGINT) and run docker compose down
trap 'echo -e "\nCaught Ctrl+C, stopping containers..."; docker compose down; exit 0' SIGINT

export HOST_IP=$(get_host_ip)

# Generate new keys
ML_API_KEY=$(generate_secret_key)
DJANGO_SECRET_KEY=$(generate_secret_key)

# ai-api

if grep -q '^DJANGO_SECRET_KEY=' ./ai-api/.env; then
    sed -i '' "s/^DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}/" ./ai-api/.env  # macOS version
else
    echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> ./ai-api/.env
    
fi

if grep -q '^ML_API_KEY=' ./ai-api/.env; then
    sed -i '' "s/^ML_API_KEY=.*/ML_API_KEY=${ML_API_KEY}/" ./ai-api/.env  # macOS version
else
    echo "ML_API_KEY=${ML_API_KEY}" >> ./ai-api/.env
fi

if grep -q '^HOST_IP=' ./ai-api/.env; then
    sed -i '' "s/^HOST_IP=.*/HOST_IP=${HOST_IP}/" ./ai-api/.env  # macOS version
else
    echo "HOST_IP=${HOST_IP}" >> ./ai-api/.env
fi


# core-api

if grep -q '^DJANGO_SECRET_KEY=' .env; then
    sed -i '' "s/^DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}/" .env  # macOS version
else
    echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> .env
    
fi

if grep -q '^ML_API_KEY=' .env; then
    sed -i '' "s/^ML_API_KEY=.*/ML_API_KEY=${ML_API_KEY}/" .env  # macOS version
else
    echo "ML_API_KEY=${ML_API_KEY}" >> .env
    echo "ML_API_KEY=${ML_API_KEY}" >> ./ai-api/.env
fi

if grep -q '^HOST_IP=' .env; then
    sed -i '' "s/^HOST_IP=.*/HOST_IP=${HOST_IP}/" .env  # macOS version
else
    echo "HOST_IP=${HOST_IP}" >> .env
fi


if [ "$1" = "--help" ]; then
  show_help
  exit 0
elif [ "$1" = "--build" ]; then
  echo "✨✨✨ Mobile App visible on exp://$HOST_IP:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://$HOST_IP:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  run_docker_compose "docker compose up --build"
elif [ "$1" = "--load-data" ]; then
  echo "✨✨✨ Mobile App visible on exp://$HOST_IP:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://$HOST_IP:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  run_docker_compose "docker compose up --build"
  
  echo "Waiting for database to be ready..."
  sleep 10
  
  echo "Loading initial data..."
  docker compose exec db psql -U bugsenseadmin -d bugsense -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  
  echo "Copying SQL file to container..."
  docker cp ./setup/database_backup.sql $(docker compose ps -q db):/tmp/database_backup.sql
  
  echo "Loading SQL file..."
  docker compose exec db psql -U bugsenseadmin -d bugsense -f /tmp/database_backup.sql
  
  echo "Running database migrations..."
  docker compose exec backend python manage.py migrate
  
  docker compose logs -f
else
  echo "✨✨✨ Mobile App visible on exp://$HOST_IP:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://$HOST_IP:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  run_docker_compose "docker compose up"
fi
