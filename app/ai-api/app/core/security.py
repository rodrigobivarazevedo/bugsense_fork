from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Security, HTTPException, status, Depends
from fastapi.security.api_key import APIKeyHeader
from app.core.config import secrets_manager

# ==================================== Configuration ========================================================

SECRET_KEY = secrets_manager.security_secrets.get("SECRET_KEY")
ALLOWED_USERS = secrets_manager.security_secrets.get("ALLOWED_USERS")
ALLOWED_USERS_PASS = secrets_manager.security_secrets.get("ALLOWED_USERS_PASS")
ALGORITHM = secrets_manager.security_secrets.get("ENCRYPTION_ALGORITHM")
API_KEY = secrets_manager.security_secrets.get("API_KEY")

# ==================================== API Token ========================================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: AsyncSession, admin: bool = False):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
    )
    
    # 1) Decode JWT, check signature, expiry, etc.
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid: str = payload.get("sub")
        scope: str = payload.get("scope")
        
        if admin:
            if not uid or scope != "admin":
                raise credentials_exception
        else:
            if not uid or scope not in ("access", "admin"):
                raise credentials_exception

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401)
          
    return TokenData(uid=uid, scope=scope)


async def get_current_active_user_header(request: Request, db: AsyncSession, admin: bool = False): 
    """
    Extracts a token from the x-access-token header" and verifies it.

    :param request: FastAPI request object
    :param token_type: 'access_token' or 'refresh_token' (for error messages)
    :return: Extracted token as a string
    """
    access_token = request.headers.get("X-access-token")
    
    if not access_token:
        raise HTTPException(
            status_code=401,
        )
        
    token_data = await get_current_user(access_token, db, admin)
        
    return token_data


async def get_current_active_user(request: Request, db: AsyncSession, admin: bool = False): 
    """
    Extracts a token from the Authorization header in the format:
        Authorization: Bearer <token>

    :param request: FastAPI request object
    :param token_type: 'access_token' or 'refresh_token' (for error messages)
    :return: Extracted token as a string
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
        )
    
    access_token = auth_header.split("Bearer ")[1]
    
    token_data = await get_current_user(access_token, db, admin)
        
    return token_data
        
        
# ==================================== API Key Security ========================================================

import secrets

api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if not api_key_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    # Verify API key using constant-time comparison
    if not secrets.compare_digest(api_key_header, API_KEY):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    return api_key_header
    

