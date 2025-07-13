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

export HOST_IP=localhost

# Generate new keys
ML_API_KEY=$(generate_secret_key)
DJANGO_SECRET_KEY=$(generate_secret_key)

# Define env file paths
AI_ENV_FILE="/workspaces/bugsense/app/ai-api/.env"
CORE_ENV_FILE="/workspaces/bugsense/app/.env"

# Ensure env files exist
[ ! -f "$AI_ENV_FILE" ] && touch "$AI_ENV_FILE"
[ ! -f "$CORE_ENV_FILE" ] && touch "$CORE_ENV_FILE"

# Update ai-api .env
if grep -q '^DJANGO_SECRET_KEY=' "$AI_ENV_FILE"; then
    sed -i "s/^DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}/" "$AI_ENV_FILE"
else
    echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> "$AI_ENV_FILE"
fi

if grep -q '^ENVIRONMENT=' "$AI_ENV_FILE"; then
    sed -i "s/^ENVIRONMENT=.*/ENVIRONMENT=codespaces/" "$AI_ENV_FILE"
else
    echo "ENVIRONMENT=codespaces" >> "$AI_ENV_FILE"
fi

if grep -q '^ML_API_KEY=' "$AI_ENV_FILE"; then
    sed -i "s/^ML_API_KEY=.*/ML_API_KEY=${ML_API_KEY}/" "$AI_ENV_FILE"
else
    echo "ML_API_KEY=${ML_API_KEY}" >> "$AI_ENV_FILE"
fi

if grep -q '^HOST_IP=' "$AI_ENV_FILE"; then
    sed -i "s/^HOST_IP=.*/HOST_IP=localhost/" "$AI_ENV_FILE"
else
    echo "HOST_IP=localhost" >> "$AI_ENV_FILE"
fi

# Update core-api .env
if grep -q '^DJANGO_SECRET_KEY=' "$CORE_ENV_FILE"; then
    sed -i "s/^DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}/" "$CORE_ENV_FILE"
else
    echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> "$CORE_ENV_FILE"
fi

if grep -q '^ML_API_KEY=' "$CORE_ENV_FILE"; then
    sed -i "s/^ML_API_KEY=.*/ML_API_KEY=${ML_API_KEY}/" "$CORE_ENV_FILE"
else
    echo "ML_API_KEY=${ML_API_KEY}" >> "$CORE_ENV_FILE"
fi

if grep -q '^HOST_IP=' "$CORE_ENV_FILE"; then
    sed -i "s/^HOST_IP=.*/HOST_IP=localhost/" "$CORE_ENV_FILE"
else
    echo "HOST_IP=localhost" >> "$CORE_ENV_FILE"
fi

# Main CLI options
if [ "$1" = "--help" ]; then
  show_help
  exit 0
elif [ "$1" = "--build" ]; then
  echo "✨✨✨ Mobile App visible on exp://localhost:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://localhost:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  docker compose up --build
elif [ "$1" = "--load-data" ]; then
  echo "✨✨✨ Mobile App visible on exp://localhost:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://localhost:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  docker compose up -d
  
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
  echo "✨✨✨ Mobile App visible on exp://localhost:8081 ✨✨✨"
  echo "✨✨✨ Web App visible on http://localhost:3000 ✨✨✨"
  echo "✨✨✨ Local Web App visible on http://localhost:3000 ✨✨✨"
  docker compose up
fi
