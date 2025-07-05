# Image Classification Microservice

A robust microservice for image classification using FastAPI, TensorFlow, and Inference (FTI) architecture.

## Architecture Overview

The system follows a microservice architecture pattern with the following components:

1. **API Layer (FastAPI)**
   - RESTful endpoints for image upload and prediction
   - Input validation and request handling
   - Response formatting

2. **Model Layer (TensorFlow)**
   - Image classification model
   - Model inference service
   - Model versioning and management

3. **Storage Layer**
   - PostgreSQL for metadata and predictions
   - MinIO for image storage (S3-compatible object storage)

## Database Schema

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES images(id),
    model_version VARCHAR(50) NOT NULL,
    confidence_score FLOAT NOT NULL,
    predicted_class VARCHAR(255) NOT NULL,
    prediction_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Model versions table
CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(50) UNIQUE NOT NULL,
    model_path VARCHAR(512) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Storage Architecture

### Image Storage (MinIO)
- Images are stored in MinIO buckets
- Each image is stored with a unique UUID as the filename
- Images are organized in buckets by date (YYYY/MM/DD)
- Original images are preserved for audit and retraining purposes

## API Endpoints

### Image Upload and Prediction
```
POST /api/v1/predict
Content-Type: multipart/form-data

Parameters:
- file: Image file (required)
- user_id: UUID (required)

Response:
{
    "prediction_id": "uuid",
    "image_id": "uuid",
    "predicted_class": "string",
    "confidence_score": float,
    "prediction_time_ms": integer
}
```

### Get Prediction History
```
GET /api/v1/predictions
Parameters:
- user_id: UUID (required)
- page: integer (optional)
- limit: integer (optional)

Response:
{
    "predictions": [
        {
            "prediction_id": "uuid",
            "image_id": "uuid",
            "predicted_class": "string",
            "confidence_score": float,
            "created_at": "timestamp"
        }
    ],
    "total": integer,
    "page": integer,
    "limit": integer
}
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL 13+
- MinIO Server
- Docker and Docker Compose

### Environment Variables
```env
# Database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=image_classification
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET_NAME=images

# API
API_HOST=0.0.0.0
API_PORT=8000
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-classification-service
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the services using Docker Compose:
```bash
docker-compose up -d
```

## Development

### Running Tests
```bash
pytest
```

### Code Style
The project follows PEP 8 guidelines. Use the following command to check code style:
```bash
flake8
```

## Monitoring and Logging

- Application logs are stored in `/logs`
- Prometheus metrics are available at `/metrics`
- Health check endpoint at `/health`

## Security Considerations

1. All API endpoints are protected with JWT authentication
2. Images are validated for size and type before processing
3. Rate limiting is implemented to prevent abuse
4. Input sanitization is performed on all endpoints
5. Regular security audits are performed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 