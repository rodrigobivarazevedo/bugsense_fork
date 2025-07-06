from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi import Security, HTTPException, status, Depends
from fastapi.security.api_key import APIKeyHeader
from app.core.config import secrets_manager
from pydantic import BaseModel
import secrets

# ==================================== Configuration ========================================================

SECRET_KEY = secrets_manager.security_secrets.get("DJANGO_SECRET_KEY")
API_KEY = secrets_manager.security_secrets.get("ML_API_KEY")
GOOGLE_CREDENTIALS = secrets_manager.security_secrets.get("GOOGLE_CREDENTIALS")
ALGORITHM = secrets_manager.security_secrets.get("ALGORITHM")

# ==================================== API Token ========================================================

class TokenData(BaseModel):
    uid: str
    scope: str
    username: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def verify_jwt_token(token: Annotated[str, Depends(oauth2_scheme)], admin: bool = False):
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


async def get_current_user(request: Request, admin: bool = False, auth_headers: bool = True): 
    """
    Extracts and verifies a JWT token from the request headers.

    Supported formats:
      - Authorization: Bearer <access_token>
      - X-access-token: <access_token> (used if auth_headers is False)

    Args:
        request (Request): FastAPI request object
        db: Database session or dependency
        admin (bool): If True, verifies user is admin
        auth_headers (bool): Whether to use standard 'Authorization' header or custom header

    Returns:
        dict: Token payload (e.g., user info)

    Raises:
        HTTPException: 401 if token is missing or invalid
    """
    
    if auth_headers:
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
            )
        
        access_token = auth_header.split("Bearer ")[1]
        
    else:
        access_token = request.headers.get("X-access-token")
        
    token_data = await verify_jwt_token(access_token, admin)
        
    return token_data
        
        
# ==================================== API Key Security ========================================================

api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if not api_key_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    # Verify API key using constant-time comparison
    if not secrets.compare_digest(api_key_header, API_KEY):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    return api_key_header
    

