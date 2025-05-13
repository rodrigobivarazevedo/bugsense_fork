from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from app.routers.api import api_router
from app.db.orm_models import Base
from app.db.database import get_db
from app.core.security import get_api_key
from fastapi import FastAPI, Depends
from app.core.async_middleware import redis_client, middleware_monitoring, logger

#==================================== Lifespan events ========================================================

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting FastAPI Application...")
    try:
        # Add any startup logic here if needed (e.g., test Redis connection)
        await redis_client.ping()
        logger.info("Redis connection established successfully")
        
        # Initialize databases
        await initialize_databases()
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise  # Re-raise to prevent app from starting if critical startup fails

    yield  # Application runs here

    # Shutdown
    logger.info("Shutting down FastAPI Application...")
    try:
        await redis_client.close()
        logger.info("Redis connection closed successfully")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")
    logger.info("FastAPI Application stopped.")


app = FastAPI(
    title="App service", 
    description="API for coreway app", 
    version="1", 
     docs_url=None,         # disables /docs
    redoc_url=None,        # disables /redoc
    openapi_url=None,       # disables /openapi.json
    lifespan=lifespan,
    dependencies=[Depends(get_api_key)]  # 🔐 Global API Key Protection
    )

#==================================== Middleware ========================================================

app.middleware("http")(middleware_monitoring)

#==================================== Database dependencies ========================================================

# Define a list of trusted origins
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:8081",
    "https://api-coreway.com",
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

async def initialize_databases():
    """Asynchronously initialize databases and create tables if they don't exist."""
    try:
        # Create users database tables
        create_tables("ml_bugsense", Base)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing databases: {str(e)}")
        raise
        # Raise here - dont allow the app to start if DB init fails

def create_tables(db_name: str, base):
    """Synchronously create tables if they don't exist."""
    try:
        with get_db(db_name) as session:
            engine = session.bind
            base.metadata.create_all(bind=engine)
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            logger.info(f"Tables created for {db_name}: {tables}")
    except Exception as e:
        logger.error(f"Error during table creation for {db_name}: {str(e)}")
        raise  # Re-raise to allow parent function to handle the error

        
        
@app.get("/health", dependencies=[Depends(get_api_key)])
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)