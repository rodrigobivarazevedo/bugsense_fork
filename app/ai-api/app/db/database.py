from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import secrets_manager
from contextlib import asynccontextmanager
from sqlalchemy.exc import OperationalError, SQLAlchemyError

# Database Connection Pool Settings (Optimized for Kubernetes Scaling)
POOL_SIZE = 50  # Number of persistent connections in the pool
MAX_OVERFLOW = 100  # Allow temporary burst connections
POOL_RECYCLE = 1800  # Recycle connections every 30 minutes to prevent stale connections
POOL_TIMEOUT = 30  # Time to wait before timing out

# Singleton Database Engine (Ensures one connection pool per replica)
def init_async_connection_engine(db_url: str) -> AsyncEngine:
    return create_async_engine(
        db_url,
        echo=False,  # Set to True for debugging
        future=True,
        pool_size=POOL_SIZE,
        max_overflow=MAX_OVERFLOW,
        pool_recycle=POOL_RECYCLE,
        pool_timeout=POOL_TIMEOUT,
        #connect_args={"command_timeout": 20},  # ⬅ Sets a 20s timeout for queries. If a query takes longer than 20s, it automatically cancels
    )

# Ensure the engine is created once per replica (Prevents unnecessary connection exhaustion)
USERS_ENGINE = init_async_connection_engine(secrets_manager.get_database_url("ml_bugsense"))

# Create an async session factory (Reuse connections from the pool)
AsyncUsersSessionLocal = sessionmaker(
    bind=USERS_ENGINE,
    class_=AsyncSession,
    expire_on_commit=False
)

# Async Database Session Manager (Handles DB connections properly)
@asynccontextmanager
async def get_async_db(db_name: str):
    """
    Provides an async session for database interactions.
    Ensures connections are properly closed to avoid pool exhaustion.
    """
    if db_name == "ml_bugsense":
        async_db = AsyncUsersSessionLocal()
    else:
        raise ValueError(f"Unknown database: {db_name}")
    
    try:
        yield async_db  # Provide session for the request
    
    except OperationalError as op_err:
        # Handle connection timeouts or other operational errors gracefully
        print("Database OperationalError encountered: %s", op_err)
    except SQLAlchemyError as sa_err:
        # Catch-all for other SQLAlchemy-related errors
        print("SQLAlchemyError encountered: %s", sa_err)
    finally:
        # Ensure session closure after request
        await async_db.close()
        
    
# Dependency Injection for FastAPI Routes
async def get_async_users_db():
    async with get_async_db("ml_bugsense") as session:
        yield session  # Automatically closes after request





# sync version

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

#create_engine(DATABASE_URL, ...): This function creates a connection to the database specified by DATABASE_URL.
#pool_size=20: The connection pool can hold up to 20 connections at a time.
#max_overflow=0: Prevents the creation of additional connections beyond pool_size. If all 20 connections are in use, new requests will be queued instead of creating new connections.

# Determine which engine to use based on the environment
def get_engine(db_name):
    db_url = secrets_manager.get_database_url(db_name)
    engine = create_engine(db_url, pool_size=10, max_overflow=20)
    return engine

users_engine = get_engine("ml_bugsense")
UsersSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=users_engine)

# Dependency to get the appropriate database session
from contextlib import contextmanager
from sqlalchemy.exc import OperationalError, SQLAlchemyError

@contextmanager
def get_db(db_name: str):
    """
    Provides a synchronous database session.
    
    Yields:
        Session: The database session.
    """
    if db_name == "ml_bugsense":
        db = UsersSessionLocal()  # Create session
    else:
        raise ValueError(f"Unknown database: {db_name}")
    try:
        yield db  # Yield session for use
        
    except OperationalError as op_err:
        # Handle connection timeouts or other operational errors gracefully
        print("Database OperationalError encountered: %s", op_err)
        # Optionally, re-raise a custom exception or handle gracefully
        # raise HTTPException(status_code=503, detail="Database service unavailable.")
    except SQLAlchemyError as sa_err:
        # Catch-all for other SQLAlchemy-related errors
        print("SQLAlchemyError encountered: %s", sa_err)
        # Optionally handle or re-raise
        
    finally:
        # Ensure session closure after request
        db.close()
        
def get_users_db():
    with get_db("ml_bugsense") as session:
        yield session
