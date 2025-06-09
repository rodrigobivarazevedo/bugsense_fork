from fastapi import UploadFile, File, Form,  Query, APIRouter, status
from fastapi.responses import JSONResponse
from datetime import datetime
import os
import shutil


router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = "storage/uploads"  # Directory to store uploaded images

# uploads/{user_id}/{YYYY-MM-DD}/time{timestamp}.jpg
@router.post(
    "/",
    summary="Process and save an image",
    status_code=status.HTTP_201_CREATED,
)
async def upload_image(
    user_id: str = Query(...),
    image: UploadFile = File(...),
):
    '''
    Accepts an image and a user_id.
    Saves the image in a directory structure like:
    uploads/{user_id}/{YYYY-MM-DD}/{timestamp}.jpg
    Ensures multiple images on the same date are grouped in the same folder.
    Tags each image with the upload timestamp.
    '''
    try:
        # Get current date and timestamp
        current_date = datetime.now().strftime("%Y-%m-%d")
        timestamp = datetime.now().strftime("%H-%M-%S-%f")

        # Create directory path: uploads/{user_id}/{YYYY-MM-DD}/{timestamp}
        user_folder = os.path.join(UPLOAD_DIR, user_id, current_date)
        os.makedirs(user_folder, exist_ok=True)

        # Set file path with timestamp
        file_ext = os.path.splitext(image.filename)[1]
        file_name = f"{timestamp}{file_ext}"
        file_path = os.path.join(user_folder, file_name)

        # Save image
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        return JSONResponse(
            status_code=200,
            content={
                "message": "Image uploaded successfully.",
                "file_path": file_path
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get("/", summary="Get images for a user on a specific date")
def get_images(user_id: str = Query(...), date: str = Query(...)):
    """
    Returns a list of image file paths for a given user_id and date (YYYY-MM-DD)
    """
    folder_path = os.path.join(UPLOAD_DIR, user_id, date)
    
    folder_path =f"{UPLOAD_DIR}/{user_id}/{date}/"
        
    if not os.path.exists(folder_path):
        return JSONResponse(
            status_code=404,
            content={"error": f"No images found for user '{user_id}' on date '{date}'"}
        )

    # Get all image file paths
    image_files = [
        os.path.join(folder_path, f)
        for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f))
    ]

    return JSONResponse(
        status_code=200,
        content={
            "user_id": user_id,
            "date": date,
            "images": image_files
        }
    )
    
    
    