import jwt
from datetime import datetime, timedelta
from app.core.config import secrets_manager

def create_test_token(expires_in_minutes: int = 60):
    """
    Generates a JWT token for testing.

    Args:
        uid (str): User ID (subject).
        scope (str): Token scope (e.g., "access", "admin").
        expires_in_minutes (int): Token expiration time.

    Returns:
        str: Encoded JWT token.
    """
    SECRET_KEY = secrets_manager.security_secrets.get("DJANGO_SECRET_KEY")
    ALGORITHM = secrets_manager.security_secrets.get("ALGORITHM")

    expiration = datetime.now() + timedelta(minutes=expires_in_minutes)
    payload = {
        "exp": expiration,
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token



if __name__ == "__main__":
    
    print(create_test_token())
    