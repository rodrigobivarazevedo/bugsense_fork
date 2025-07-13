import jwt
from app.core.config import secrets_manager
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

# ==================================== Configuration ========================================================

env_path = os.path.join(os.path.dirname(__file__), '../../.env')
if not os.path.exists(env_path):
        raise FileNotFoundError(f".env file not found at {env_path}")
load_dotenv(dotenv_path=env_path)  # Load variables from .env file

def create_test_token(expires_in_minutes: int = 60):
    SECRET_KEY = secrets_manager.security_secrets.get("DJANGO_SECRET_KEY")
    ALGORITHM = secrets_manager.security_secrets.get("ALGORITHM")
    
    print(SECRET_KEY)

    #now = datetime.now(timezone.utc)
    now = datetime.now()
    expiration = now + timedelta(minutes=expires_in_minutes)

    payload = {
        "exp": int(expiration.timestamp()),
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_jwt_token(token):
    # 1) Decode JWT, check signature, expiry, etc.
    SECRET_KEY = secrets_manager.security_secrets.get("DJANGO_SECRET_KEY")
    ALGORITHM = secrets_manager.security_secrets.get("ALGORITHM")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError as e:
        return False
    return True


if __name__ == "__main__":
    
    token = create_test_token()
    print(token)

    print("valid token:", verify_jwt_token(token))
    