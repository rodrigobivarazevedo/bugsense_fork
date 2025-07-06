import os
import base64
import json
from typing import Dict, Optional


class SecretsManager:
    def __init__(self, alembic: bool = False):
        self.env = os.getenv("ENVIRONMENT", "local").lower()
        self.alembic = alembic

        if self.env in "cloud":
            print(f"Using {self.env} environment")
        elif self.env == "local":
            print("Using local environment")
        else:
            print(f"Warning: Unknown environment '{self.env}', defaulting to local")

        self.security_secrets = self.get_security_secrets()

    def get_security_secrets(self) -> Dict[str, Optional[str]]:
        keys = [
            "GOOGLE_CREDENTIALS",
            "ML_API_KEY",
            "DJANGO_SECRET_KEY"
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

print(secrets_manager.security_secrets)