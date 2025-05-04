#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running migrations..."
docker-compose exec backend python manage.py migrate

# Load the SQL dump
echo "Loading database backup..."
docker-compose exec -T db psql -U bugsenseadmin bugsense < database_backup.sql

# Load the user data JSON
echo "Loading user data..."
docker-compose exec backend python manage.py loaddata user_data.json

echo "Initial data loading completed!" 
