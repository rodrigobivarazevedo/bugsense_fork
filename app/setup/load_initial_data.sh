#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Drop all tables first
echo "Dropping existing tables..."
docker-compose exec -T db psql -U bugsenseadmin bugsense << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO bugsenseadmin;
GRANT ALL ON SCHEMA public TO public;
EOF

# First, load the SQL dump to create the database structure
echo "Loading database backup..."
docker-compose exec -T db psql -U bugsenseadmin bugsense < ./setup/database_backup.sql

# Then run migrations to ensure everything is up to date
echo "Running migrations..."
docker-compose exec backend python manage.py migrate

# Finally, load the user data JSON
echo "Loading user data..."
docker-compose exec backend python manage.py loaddata /app/setup/user_data.json

echo "Initial data loading completed!" 
