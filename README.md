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

## Sample Login Credentials

For first-time users, you can find a full list of sample users (patients and doctors) with their credentials in the [`app/user_database.md`](app/user_database.md) file.

This file contains:
- Patient accounts (emails, passwords, security questions)
- Doctor accounts (IDs, emails, passwords, institution IDs)
- Institution information

Refer to that file for up-to-date test credentials for all roles.

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

## Testing the AI API

The AI API includes comprehensive testing capabilities for both the upload and prediction endpoints. You can test the machine learning functionality independently.

### Running the AI API Independently

1. **Start the AI API service**:
```bash
cd app/ai-api
docker compose up
```

The service will be available at `http://localhost:5001`

2. **Access API Documentation**:
- **Swagger UI**: http://localhost:5001/docs
- **ReDoc**: http://localhost:5001/redoc

### Testing Upload Functionality

The upload test simulates sending images to the API and tests the complete prediction pipeline:

```bash
cd app/ai-api
python tests/test_upload.py
```

**What it tests**:
- Image upload to local storage
- Image upload to Google Cloud Storage (if configured) currently commented out
- Automatic species and concentration prediction

**Test Data**: The test uses sample bacterial images from `tests/test_data/` with known species and concentrations:
- `E.C_L_0039_top/` - E. Coli (high concentration)
- `E.F_L_0035_top/` - E. Faecalis (high concentration)
- `E.H_L_0059_top/` - E. Hormaechei (high concentration)
- `K.P_L_0050_top/` - K. Pneumoniae (high concentration)
- `P.A_L_0018_top/` - P. Aeruginosa (low concentration)
- `P.M_L_0052_top/` - P. Mirabilis (high concentration)
- `S.A_L_0026_top/` - S. Aureus (high concentration)
- `S.S_L_0023_top/` - S. Saprophyticus (low concentration)
- `Ste_L_0036_top/` - Sterile (low concentration)

### Testing Prediction Endpoints

Test the prediction endpoints directly:

```bash
cd app/ai-api
python tests/test_prediction.py
```
**What it tests**:
- Species prediction endpoint (`/ml_api/prediction/species/`)
- Concentration prediction endpoint (`/ml_api/prediction/concentration/`)
- Date-specific predictions

### Manual API Testing

You can also test the API manually using curl or any HTTP client:

**Upload an image**:
```bash
curl -X POST "http://localhost:5001/ml_api/upload/" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@path/to/your/image.png" \
  -F "qr_data=test_user_123" \
  -F "storage=local"
```

**Get species prediction**:
```bash
curl -X GET "http://localhost:5001/ml_api/prediction/species/?qr_data=test_user_123&storage=local"
```

**Get concentration prediction**:
```bash
curl -X GET "http://localhost:5001/ml_api/prediction/concentration/?qr_data=test_user_123&storage=local"
```

### Configuration

The AI API can be configured for different storage backends:

- **Local Storage**: Images stored locally in `storage/uploads/`
- **Google Cloud Storage**: Images uploaded to GCS bucket (requires credentials)

Set environment variables in your `.env` file:
```bash
GCS_BUCKET_NAME=your-bucket-name
GOOGLE_CREDENTIALS=base64 encoded google credentials.json
ML_API_KEY=your-ml-api-key
DJANGO_SECRET_KEY=your-django-api-key
```

### Expected Test Results

When running the tests, you should see:
- Successful image uploads
- Species predictions (e.g., "Ecoli", "Saureus", "Kpneumoniae")
- Concentration predictions (e.g., "high", "low")
- Integration with the main backend (results posted to Django API)

The tests will show how many images are needed before a prediction is made, typically requiring a time series of images for accurate results.
