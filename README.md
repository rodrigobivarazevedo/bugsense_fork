# BugSense

BugSense is a full-stack application with a Django backend, React web frontend, and React Native mobile app.

## Getting Started

### Prerequisites
- Docker
- Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Joumanasalahedin/bugsense.git
cd bugsense
```

2. Navigate to the app directory:
```bash
cd app
```

### Running the Application

The application can be started using the `start_app.sh` script with different options:

```bash
# Show all available options
./start_app.sh --help

# First time setup (loads initial data)
./start_app.sh --load-data

# Regular startup (after first time)
./start_app.sh

# Rebuild and start (if you make changes to Dockerfiles)
./start_app.sh --build
```

### Accessing the Application

Once started, you can access the application through:

- **Web App**: http://{HOST_IP}:3000
- **Mobile App**: exp://{HOST_IP}:8081
- **API Documentation (Swagger UI)**: http://{HOST_IP}:8000/api/docs/
- **API Documentation (ReDoc)**: http://{HOST_IP}:8000/api/redoc/

Note: Your host IP will be displayed in the logs when the application starts.

### Sample Login Credentials

For first-time users, you can log in with these sample credentials:

- Email: test@example.com
- Password: Password123!

### API Documentation

The application includes comprehensive API documentation powered by drf-spectacular:

- **Swagger UI**: Interactive documentation with try-it-out functionality
- **ReDoc**: Clean, responsive documentation interface

All API endpoints are documented with examples, request/response schemas, and authentication requirements.

### Troubleshooting

If you encounter any issues:

1. Make sure all containers are running:
```bash
docker-compose ps
```

2. Check the logs:
```bash
docker-compose logs
```

3. If you need to start fresh:
```bash
docker-compose down -v
docker system prune
./start_app.sh --load-data
```
