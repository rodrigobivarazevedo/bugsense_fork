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
- Image upload to Google Cloud Storage (if configured)
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


## Image Upload, Prediction, and Stopping Mechanism Flow

### 1. Image Upload

- **Endpoint:** `POST /upload/`
- **Inputs:**  
  - `qr_data` (query param): Unique identifier for the image series.
  - `image` (file): The image to upload.
  - `storage` (query param): `"local"` or `"gcs"` (default: `"local"`).
- **Auth:** JWT-based, validated via `get_current_user`.

- **Storage Logic:**
  - If `storage == "gcs"`:  
    The image is uploaded to Google Cloud Storage using `upload_image_to_gcs`.
  - If `storage == "local"`:  
    The image is saved to `storage/uploads/{qr_data}/{YYYY-MM-DD}/` using `save_file_locally`.

- **Response:**  
  - On success: 200 with a message.
  - On failure: 400 or 500 with an error message.

### 2. Prediction Triggering

- After a successful upload, the backend **immediately attempts to trigger a prediction** by calling `await send_results(request, qr_data, storage=storage)`.

### 3. Prediction Readiness: The Stopping Mechanism

- **Purpose:**  
  To ensure predictions are only made when enough meaningful image data is available (e.g., enough timepoints or significant change).

- **How it works:**
  - When a prediction is requested, the backend loads all images for the given `qr_data` and date.
  - The function `find_stopping_point` (in `app/utils/stopping_point.py`) analyzes the image series to determine the earliest index where a significant change is detected, using a sliding window and color difference metric (ΔE in LAB color space).
  - If the stopping point index is **less than 5**, the system determines that there is **not enough data for a reliable prediction** and aborts the prediction attempt.

- **Code Reference:**  
  - `prepare_input_tensor` in `app/ml_pipeline/features.py`:
    ```python
    stopping_point = find_stopping_point(images, threshold=23, mode="sliding_window")
    if stopping_point < 5:
        return None  # Not enough data for prediction
    ```
  - This logic is used for both species and concentration predictions.

### 4. Prediction Request and Logic

- **Species and Concentration Predictions:**
  - The backend makes two GET requests to its own ML API:
    - `/prediction/species/`
    - `/prediction/concentration/`
  - Each endpoint:
    - Loads the image series.
    - Uses the stopping mechanism to check readiness.
    - If ready, prepares the input tensor and runs the model.
    - If not ready, returns a message indicating insufficient data.

### 5. Sending Results to Django Backend

- If **both** predictions are successful (i.e., not `None`), the backend sends a POST request to the Django backend at `/api/results/` with:
  - `qr_data`
  - `species`
  - `concentration`
  - `infected` (True if concentration is `"high"`, else False)
- The request includes:
  - `Content-Type: application/json`
  - `X-ML-API-Key` (from secrets)

- **If either prediction is not ready (i.e., not enough data), no results are sent to Django.**

---

### Summary Table

| Step                | Success Path                                      | Failure/Not Enough Data Path                |
|---------------------|---------------------------------------------------|---------------------------------------------|
| Upload image        | Image saved (local or GCS)                        | 400/500 error returned to client            |
| Trigger prediction  | `send_results` called                             | -                                           |
| Stopping mechanism  | If stopping point ≥ 5, proceed to prediction      | If < 5, abort prediction, no results sent   |
| Prediction logic    | Both predictions made if ready                    | If not ready, returns message, no results   |
| Send to Django      | If both predictions present, POSTs to Django      | If either is None, does **not** send        |

---

### How the Stopping Mechanism Works

- **Sliding Window:**  
  Compares each image to the previous one using a region-of-interest (ROI) and color difference metric.
- **Threshold:**  
  If the mean color difference in any ROI exceeds the threshold (default: 23), that index is considered the stopping point.
- **Minimum Data:**  
  At least 5 images (timepoints) are required after the stopping point for a valid prediction.

---

## Example: When is a Prediction Triggered?

- **Scenario 1:**  
  - User uploads 3 images.
  - Stopping mechanism finds stopping point at index 2 (< 5).
  - **No prediction is made.**
- **Scenario 2:**  
  - User uploads 6 images.
  - Stopping mechanism does **not** find a stopping point (no significant change detected in the image series).
  - **No prediction is made.**
- **Scenario 3:**  
  - User uploads around 40 images.
  - Stopping mechanism finds stopping point at index 30.
  - **Prediction is made and results are sent to Django.** 