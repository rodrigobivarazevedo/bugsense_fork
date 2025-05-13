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
USERS_ENGINE = init_async_connection_engine(secrets_manager.get_database_url("users"))

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
    if db_name == "users":
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
    async with get_async_db("users") as session:
        yield session  # Automatically closes after request
