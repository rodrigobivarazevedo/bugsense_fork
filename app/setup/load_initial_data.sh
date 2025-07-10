#!/bin/bash

echo "Waiting for database to be ready..."
sleep 10

echo "Checking if database is empty..."
# Check if containers are running first
if ! docker-compose ps | grep -q "Up"; then
    echo "Containers are not running. Cannot check database."
    exit 1
fi

TABLE_COUNT=$(docker-compose exec -T db psql -U bugsenseadmin bugsense -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -eq "0" ]; then
    echo "Database is empty. Loading initial data..."
    
    echo "Loading database backup..."
    docker-compose exec -T db psql -U bugsenseadmin bugsense < ./setup/database_backup.sql

    echo "Running migrations..."
    docker-compose exec backend python manage.py migrate

    echo "Loading user data..."
    docker-compose exec backend python manage.py loaddata /app/setup/user_data.json

    echo "Initial data loading completed!"
else
    echo "Database already contains data. Skipping initial data load."
    echo "If you want to reset the database, manually run: docker-compose exec db psql -U bugsenseadmin bugsense -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'"
fi 
