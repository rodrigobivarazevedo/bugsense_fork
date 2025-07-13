# BugSense

BugSense is a full-stack application with a Django backend, React web frontend, React Native mobile app, and a Python-based machine learning (ML) service for automated analysis.

## 🚀 Live Demo

### Web Application
**URL**: http://172.208.64.16:3000

### Mobile Application
**URL**: exp://172.208.64.16:8081

#### Installing Expo Go for Mobile App
To access the mobile application, you need to install Expo Go on your device:

**For iOS:**
- Download from the [App Store](https://apps.apple.com/app/expo-go/id982107779)

**For Android:**
- Download from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

**Alternative for Android:**
- Download the APK directly from [Expo's website](https://expo.dev/tools#client)

After installing Expo Go, enter the URL `exp://172.208.64.16:8081` in the Expo Go app to access the mobile application.

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

For first-time users, you can find a full list of sample users (patients and doctors) with their credentials in the [`app/user_database.md`](app/user_database.md) file.

This file contains:
- Patient accounts (emails, passwords, security questions)
- Doctor accounts (IDs, emails, passwords, institution IDs)
- Institution information

Refer to that file for up-to-date test credentials for all roles.

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
