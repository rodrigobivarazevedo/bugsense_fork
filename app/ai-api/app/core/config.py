import os
from dotenv import load_dotenv

# ==================================== Configuration ========================================================

env_path = os.path.join(os.path.dirname(__file__), '../.env')
if not os.path.exists(env_path):
        raise FileNotFoundError(f".env file not found at {env_path}")
load_dotenv(dotenv_path=env_path)  # Load variables from .env file

class SecretsManager:
    def __init__(self, alembic=False):
        self.env = os.getenv("ENVIRONMENT", "local")
        if self.env in ("cloud", "staging", "production"):
            print("Using cloud environment")
        elif self.env == "local":
            print("Using local environment")
        
        self.alembic = alembic
        self.security_secrets = self.get_security_secrets()
       
    def get_database_url(self, db_name: str) -> str:
        """
        Construct database URL using secrets from Google Secret Manager.
        """
        if self.env == 'cloud':
            print("Using cloud database")
            secrets = {}
            secrets["DB_USER"] = os.getenv("CLOUD_DB_USER")
            secrets["DB_PASS"] = os.getenv("CLOUD_DB_PASS")
            secrets["IP_ADRESS"] = os.getenv("IP_ADDRESS")
            if db_name == "users":
                port = "5433"
                
            return f"postgresql+psycopg://{secrets['DB_USER']}:{secrets['DB_PASS']}@{secrets['IP_ADRESS']}:{port}/{db_name}"
        
        elif self.env == 'staging':
            print("Using staging database")
            secrets = {}
            secrets["DB_USER"] = os.getenv("TEST_CLOUD_DB_USER")
            secrets["DB_PASS"] = os.getenv("TEST_CLOUD_DB_PASS")
            secrets["IP_ADRESS"] = os.getenv("TEST_IP_ADDRESS")
            if db_name == "users":
                port = "5433"
        
            return f"postgresql+psycopg://{secrets['DB_USER']}:{secrets['DB_PASS']}@{secrets['IP_ADRESS']}:{port}/{db_name}"
        
        elif self.env == 'local':
            print("Using local database")
            db_user = os.getenv("LOCAL_DB_USER")  
            db_password = os.getenv("LOCAL_DB_PASS")
            
            if self.alembic:
                print("Using Localhost for Alembic")
                if db_name == "ml_bugsense":
                    port = "5433"
                    ip_adress = "localhost" 
            else:
                print("Using Docker for Local Development")
                if db_name == "ml_bugsense":
                    port = "5432"
                    ip_adress = "ml-db" 
                
            return f"postgresql+psycopg://{db_user}:{db_password}@{ip_adress}:{port}/{db_name}"
        
    
    def get_security_secrets(self) -> str:
        """
        Construct database URL using secrets from Google Secret Manager.
        """
        if self.env in ('cloud', 'staging'):
            print("Using cloud environment for security secrets")
            security_secrets = {
                "ENCRYPTION_KEY": os.getenv("ENCRYPTION_KEY"),
                "SECRET_KEY": os.getenv("SECRET_KEY"),
                "ALLOWED_USERS": os.getenv("ALLOWED_USERS"),
                "ALLOWED_USERS_PASS": os.getenv("ALLOWED_USERS_PASS"),
                "ENCRYPTION_ALGORITHM": os.getenv("ENCRYPTION_ALGORITHM"),
                "ACCESS_TOKEN_EXPIRE_MINUTES": os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"),
                "REFRESH_TOKEN_EXPIRE_DAYS": os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"),
                "API_KEY": os.getenv("API_KEY"),
                "TEST_EMAIL": os.getenv("TEST_EMAIL"),
                "TEST_PASSWORD": os.getenv("TEST_PASSWORD"),
                "ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN": os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN"),
                "REFRESH_TOKEN_EXPIRE_DAYS_ADMIN": os.getenv("REFRESH_TOKEN_EXPIRE_DAYS_ADMIN"),
            
            }
            return security_secrets
        
        elif self.env == 'local':
            print("Using local environment for security secrets")
            
            security_secrets = {
                "ENCRYPTION_KEY": os.getenv("ENCRYPTION_KEY"),
                "SECRET_KEY": os.getenv("SECRET_KEY"),
                "ALLOWED_USERS": os.getenv("ALLOWED_USERS"),
                "ALLOWED_USERS_PASS": os.getenv("ALLOWED_USERS_PASS"),
                "ENCRYPTION_ALGORITHM": os.getenv("ENCRYPTION_ALGORITHM"),
                "ACCESS_TOKEN_EXPIRE_MINUTES": os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"),
                "REFRESH_TOKEN_EXPIRE_DAYS": os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"),
                "API_KEY": os.getenv("API_KEY"),
                "TEST_EMAIL": os.getenv("TEST_EMAIL"),
                "TEST_PASSWORD": os.getenv("TEST_PASSWORD"),
                "ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN": os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN"),
                "REFRESH_TOKEN_EXPIRE_DAYS_ADMIN": os.getenv("REFRESH_TOKEN_EXPIRE_DAYS_ADMIN"),
                
            }
            
            return security_secrets
        
secrets_manager = SecretsManager()

