import os
import base64
import json
from typing import Dict, Optional
from dotenv import load_dotenv

# ==================================== Configuration ========================================================

env_path = os.path.join(os.path.dirname(__file__), '../../.env')
if not os.path.exists(env_path):
        raise FileNotFoundError(f".env file not found at {env_path}")
load_dotenv(dotenv_path=env_path)  # Load variables from .env file

class SecretsManager:
    def __init__(self):
        self.security_secrets = self.get_security_secrets()

    def get_security_secrets(self) -> Dict[str, Optional[str]]:
        keys = [
            "GOOGLE_CREDENTIALS",
            "ML_API_KEY",
            "DJANGO_SECRET_KEY",
            "GCS_BUCKET_NAME",
            "ALGORITHM",
            "HOST_IP"
        ]

        print(f"Loading security secrets for {self.env} environment")

        secrets = {}
        for key in keys:
            value = os.getenv(key)

            if key == "GOOGLE_CREDENTIALS" and value:
                try:
                    decoded = base64.b64decode(value)
                    value = json.loads(decoded)
                except Exception as e:
                    print(f"⚠️ Failed to decode GOOGLE_CREDENTIALS: {e}")
                    value = None

            secrets[key] = value

        return secrets


secrets_manager = SecretsManager()

