#!/bin/bash

echo "Waiting for database to be ready..."
sleep 10

echo "Dropping existing tables..."
docker-compose exec -T db psql -U bugsenseadmin bugsense << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO bugsenseadmin;
GRANT ALL ON SCHEMA public TO public;
EOF

echo "Loading database backup..."
docker-compose exec -T db psql -U bugsenseadmin bugsense < ./setup/database_backup.sql

echo "Running migrations..."
docker-compose exec backend python manage.py migrate

echo "Loading user data..."
docker-compose exec backend python manage.py loaddata /app/setup/user_data.json

echo "Initial data loading completed!" 
