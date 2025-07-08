from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers.api import api_router
import logging

#==================================== Lifespan events ========================================================

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

app = FastAPI(
    title="ML BugSense API",
    description="API for ML BugSense", 
    version="1", 
    )

#==================================== Middleware ========================================================

#==================================== Database dependencies ========================================================

# Define a list of trusted origins
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:8081",
    "http://localhost:8000",
]

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # use the specified origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "Parameters"],
)

# Include the API router
app.include_router(api_router)

        
@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)