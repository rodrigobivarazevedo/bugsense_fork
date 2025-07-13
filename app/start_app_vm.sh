#!/usr/bin/env bash

show_help() {
  echo "Usage: ./start_app.sh [OPTION]"
  echo ""
  echo "Options:"
  echo "  --help     Display this help message"
  echo "  --build    Build and start all services"
  echo "  --load-data Start services and load initial data (will reset database if data exists)"
  echo ""
  echo "Description:"
  echo "  This script manages the BugSense application services."
  echo "  Without any options, it starts all services without building."
  echo "  The --load-data option will always reset the database and load fresh data."
  echo ""
  echo "Examples:"
  echo "  ./start_app.sh --help     # Show this help message"
  echo "  ./start_app.sh --build    # Build and start all services"
  echo "  ./start_app.sh --load-data # Start services and load initial data (resets DB)"
  echo "  ./start_app.sh            # Start services without building"
}

generate_secret_key() {
  python3 -c "import secrets; print(secrets.token_urlsafe(50))"
}

get_host_ip() {
  local configured="172.208.64.16"

  # 1. Try Azure IMDS
  echo "Trying Azure IMDS…" >&2
  local imds
  imds=$(curl -s -H Metadata:true \
    "http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2021-02-01&format=text")
  if [[ -n "$imds" ]]; then
    echo "Host IP retrieved from IMDS: $imds" >&2
    echo "$imds"
    return
  fi

  # 2. Try external echo service
  echo "IMDS failed; trying ifconfig.me…" >&2
  local ext
  ext=$(curl -s https://ifconfig.me)
  if [[ -n "$ext" ]]; then
    if [[ "$ext" != "$configured" ]]; then
      echo "WARNING: external IP ($ext) differs from configured Public IP ($configured)" >&2
    else
      echo "Host IP retrieved from ifconfig.me: $ext" >&2
    fi
    echo "$ext"
    return
  fi

  # 3. Fallback to the hard-coded value
  echo "External lookup failed; using configured Public IP: $configured" >&2
  echo "$configured"
}

export HOST_IP=$(get_host_ip)
echo "Using host IP: $HOST_IP"

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
trap 'echo -e "\nCaught Ctrl+C, stopping containers..."; docker compose down; exit 0' SIGINT SIGTERM

export HOST_IP=$(get_host_ip)

# Generate new keys
ML_API_KEY=$(generate_secret_key)
DJANGO_SECRET_KEY=$(generate_secret_key)

# ai-api

if grep -q '^DJANGO_SECRET_KEY=' ./ai-api/.env; then
    sed -i "s/^DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}/" ./ai-api/.env  # macOS version
else
    echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> ./ai-api/.env
    
fi

if grep -q '^ML_API_KEY=' ./ai-api/.env; then
    sed -i "s/^ML_API_KEY=.*/ML_API_KEY=${ML_API_KEY}/" ./ai-api/.env  # macOS version
else
    echo "ML_API_KEY=${ML_API_KEY}" >> ./ai-api/.env
fi

if grep -q '^HOST_IP=' ./ai-api/.env; then
    sed -i "s/^HOST_IP=.*/HOST_IP=${HOST_IP}/" ./ai-api/.env  # macOS version
else
    echo "HOST_IP=${HOST_IP}" >> ./ai-api/.env
fi


# core-api

if grep -q '^DJANGO_SECRET_KEY=' .env; then
    sed -i "s/^DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}/" .env  # macOS version
else
    echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> .env
    
fi

if grep -q '^ML_API_KEY=' .env; then
    sed -i "s/^ML_API_KEY=.*/ML_API_KEY=${ML_API_KEY}/" .env  # macOS version
else
    echo "ML_API_KEY=${ML_API_KEY}" >> .env
    echo "ML_API_KEY=${ML_API_KEY}" >> ./ai-api/.env
fi

if grep -q '^HOST_IP=' .env; then
    sed -i "s/^HOST_IP=.*/HOST_IP=${HOST_IP}/" .env  # macOS version
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
  
  # Start services first
  docker compose up --build -d
  
  # Wait a moment for services to start
  sleep 5
  
  # Load data only if containers are running
  if docker compose ps | grep -q "Up"; then
    echo "Resetting database and loading fresh data..."
    
    # Reset the database completely
    echo "Dropping all existing data..."
    docker compose exec -T db psql -U bugsenseadmin bugsense -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    
    # Load the database backup
    echo "Loading database backup..."
    docker compose exec -T db psql -U bugsenseadmin bugsense < ./setup/database_backup.sql
    
    # Run migrations to ensure everything is up to date
    echo "Running migrations..."
    docker compose exec backend python manage.py migrate
    
    # Load additional user data if needed
    echo "Loading user data..."
    docker compose exec backend python manage.py loaddata /app/setup/user_data.json
    
    echo "Database reset and data loading completed!"
    
    echo "Showing logs..."
    docker compose logs -f
  else
    echo "Services failed to start. Check logs with: docker compose logs"
  fi
else
  echo "✨✨✨ Mobile App visible on exp://$HOST_IP:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://$HOST_IP:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  run_docker_compose "docker compose up"
fi
