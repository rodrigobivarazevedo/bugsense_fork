from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
#from app.db.orm_models import Base
# from app.db.database import get_db
from fastapi import FastAPI
from app.routers.api import api_router
import logging
from contextlib import asynccontextmanager

#==================================== Lifespan events ========================================================

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

# # Lifespan event handler
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup
#     logger.info("Starting FastAPI Application...")
#     try: 
#         # Initialize databases
#         await initialize_databases()
#     except Exception as e:
#         logger.error(f"Startup failed: {e}")
#         raise  # Re-raise to prevent app from starting if critical startup fails

#     yield  # Application runs here

app = FastAPI(
    title="ML BugSense API",
    description="API for ML BugSense", 
    version="1", 
    #docs_url=None,         # disables /docs
    #redoc_url=None,        # disables /redoc
    #openapi_url=None,       # disables /openapi.json
    #lifespan=lifespan,
    )

#==================================== Middleware ========================================================

#==================================== Database dependencies ========================================================

# Define a list of trusted origins
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:8081",
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

#==================================== Database initialization ========================================================

# async def initialize_databases():
#     """Asynchronously initialize databases and create tables if they don't exist."""
#     try:
#         # Create users database tables
#         create_tables("ml_bugsense", Base)
#         logger.info("Database tables initialized successfully")
#     except Exception as e:
#         logger.error(f"Error initializing databases: {str(e)}")
#         raise
#         # Raise here - dont allow the app to start if DB init fails

# def create_tables(db_name: str, base):
#     """Synchronously create tables if they don't exist."""
#     try:
#         with get_db(db_name) as session:
#             engine = session.bind
#             base.metadata.create_all(bind=engine)
#             inspector = inspect(engine)
#             tables = inspector.get_table_names()
#             logger.info(f"Tables created for {db_name}: {tables}")
#     except Exception as e:
#         logger.error(f"Error during table creation for {db_name}: {str(e)}")
#         raise  # Re-raise to allow parent function to handle the error

        
        
@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)