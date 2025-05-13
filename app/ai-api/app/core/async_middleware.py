import json
import logging
import http
import os
from datetime import datetime, timedelta, timezone
from fastapi import Request, HTTPException 
from starlette.responses import Response
from time import perf_counter
import redis.asyncio as redis  # Using async Redis
from app.core.config import secrets_manager

API_KEY = secrets_manager.security_secrets.get("API_KEY")

# -----------------------------
#       GLOBAL SETTINGS
# -----------------------------

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

environment = os.getenv("ENVIRONMENT", "cloud")

if environment == "cloud":
    REDIS_HOST = os.getenv("PRODUCTION_REDIS_HOST", "redis-service.default.svc.cluster.local")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))
    REDIS_MAX_CONNECTIONS = int(os.getenv("REDIS_MAX_CONNECTIONS", "100"))
elif environment == "staging":
    REDIS_HOST = os.getenv("TEST_REDIS_HOST", "test-redis-service.default.svc.cluster.local")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "1"))
    REDIS_MAX_CONNECTIONS = int(os.getenv("REDIS_MAX_CONNECTIONS", "50"))
else:
    REDIS_HOST = os.getenv("LOCAL_REDIS_HOST", "redis-service")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))
    REDIS_MAX_CONNECTIONS = int(os.getenv("REDIS_MAX_CONNECTIONS", "20"))

FAILED_LOGIN_THRESHOLD = 5
FAILED_AUTHENTICATION_THRESHOLD = 15
RATE_LIMIT = 60
RATE_WINDOW = 60
ATTEMPTS_TTL = 86400
MAX_BACKOFF_MIN = 60       # cap backoff at 60 minutes

# Async Redis connection
redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    decode_responses=True,
    max_connections=REDIS_MAX_CONNECTIONS,
    socket_connect_timeout=5.0,   # seconds
    socket_timeout=5.0,           # prevents requests hanging indefinitely.
    retry_on_timeout=True         # helps mitigate transient network hiccups
)


async def middleware_monitoring(request: Request, call_next):
    """
    Unified middleware that:
    1) Applies IP-based rate limiting (sliding window + exponential backoff)
    2) Logs each request
    3) Tracks failed logins and brute-force detection
    """
    start_time = perf_counter()

    # ------------------------------------------------------------------
    #          1) IDENTIFY CLIENT IP (X-Forwarded-For or request.client)
    # ------------------------------------------------------------------
     
    request_api_key = request.headers.get("X-API-Key")
    ip = request.headers.get("X-Forwarded-For")
    if not ip:
        client = request.client
        ip = client.host if client else "unknown"
        
    # Prepare Redis keys
    counter_key = f"rate:counter:{ip}"       # Sliding window
    block_key = f"rate:block:{ip}"           # Rate-limit block info
    attempts_key = f"rate:attempts:{ip}"     # Rate-limit backoff attempts
    
    # ------------------------------------------------------------------
    #               2) RATE LIMIT ENFORCEMENT (Sliding Window)
    # ------------------------------------------------------------------
    try:
        # Check if IP is already blocked (exponential block)
        block_data = await redis_client.get(block_key)
        if block_data:
            block_info = json.loads(block_data)
            expires_str = block_info.get("expires")
            attempts = block_info.get("attempts")
            blocked_at = block_info.get("blocked_at")
            reason = block_info.get("reason")
            if expires_str:
                expires_dt = datetime.fromisoformat(expires_str)
                if expires_dt > datetime.now(timezone.utc):
                    logger.warning(
                        f"[RATE BLOCK] IP={ip} still blocked; "
                        f"blocked_at={blocked_at}, reason={reason}, "
                        f"attempts={attempts}, expires={expires_dt}"
                    )
                    return Response(status_code=429, content="Too Many Requests")
                
        # Fixed-window counter
        count = await redis_client.incr(counter_key)  # Atomic increment + expire
        if count == 1:
            await redis_client.expire(counter_key, RATE_WINDOW)

        # Exceed allowed rate => block IP
        if count > RATE_LIMIT:
            # Exponential backoff
            attempts = await redis_client.hincrby(attempts_key, "count", 1)
            await redis_client.expire(attempts_key, ATTEMPTS_TTL)
            
            raw = 2 ** attempts
            minutes = min(raw, MAX_BACKOFF_MIN)
            block_duration = timedelta(minutes=minutes)

            #block_duration = timedelta(minutes=2 ** attempts)
            expires_dt = datetime.now(timezone.utc) + block_duration
            block_info = {
                "blocked_at": datetime.now(timezone.utc).isoformat(),
                "attempts": attempts,
                "expires": expires_dt.isoformat(),
                "reason": "rate limit exceeded"
            }
            await redis_client.setex(
                block_key,
                int(block_duration.total_seconds()),
                json.dumps(block_info)
            )
            # Reset sliding window after blocking
            await redis_client.delete(counter_key)

            logger.warning(
                f"[RATE BLOCK] IP={ip} exceeded limit={RATE_LIMIT}, "
                f"blocked for {block_duration}, count={count}, attempts={attempts}"
            )
            return Response(status_code=429, content="Too Many Requests")


    except Exception as e:
        logger.error(f"[RATE LIMIT EXCEPTION] {e}")
  
    
    try:
        response = await call_next(request)
    except Exception as downstream:
        logger.error("[DOWNSTREAM ERROR]", exc_info=downstream)
        return HTTPException(status_code=500, detail="Internal Server Error")

   
    # ------------------------------------------------------------------
    #     3) DDoS detection: DDoS CHECK, & FAILED AUTHENTICATION CHECK
    # ------------------------------------------------------------------
    url_path = request.url.path
    
    try:
        failed_auth_attempts = 0

        # If the response is 401, 403, or 429
        if response.status_code in [401, 403] or request_api_key != API_KEY:
            failed_auth_key = f"auth:attempts:{ip}"
            
            await redis_client.incr(failed_auth_key)
            await redis_client.expire(failed_auth_key, 600)  # 10 min window
            failed_auth_attempts = int(await redis_client.get(failed_auth_key) or 0)

            # If user has more than FAILED_LOGIN_THRESHOLD => exponential block
            if failed_auth_attempts >= FAILED_AUTHENTICATION_THRESHOLD:
                            
                auth_backoff_key = f"auth:backoff:{ip}"
                auth_attempts = await redis_client.hincrby(auth_backoff_key, "count", 1)
                await redis_client.expire(auth_backoff_key, ATTEMPTS_TTL)
                
                # Exponential backoff
                raw = 2 ** auth_attempts
                minutes = min(raw, MAX_BACKOFF_MIN)
                block_duration = timedelta(minutes=minutes)

                #block_duration = timedelta(minutes=2 ** auth_attempts)
                expires_dt = datetime.now(timezone.utc) + block_duration

                block_info = {
                    "blocked_at": datetime.now(timezone.utc).isoformat(),
                    "attempts": auth_attempts,
                    "expires": expires_dt.isoformat(),
                    "reason": "repeated failed authentifications"
                }

                # We can use the *same* block_key if we want to unify rate-limits & login blocks
                # or use a separate key. Here, let's reuse block_key for simplicity:
                await redis_client.setex(
                    block_key, 
                    int(block_duration.total_seconds()), 
                    json.dumps(block_info)
                )
                
                logger.critical(
                    f"[SECURITY ALERT] Frequent blocks detected for IP={ip}. Immediate investigation recommended."
                )

                # Reset the failed auth counter
                await redis_client.delete(failed_auth_key)

                logger.warning(
                    f"[AUTH BLOCK] IP={ip} after {failed_auth_attempts} failed authentications, "
                    f"blocked for {block_duration} (attempts={auth_attempts})."
                )
                
                return Response(status_code=429, content="Too Many Requests")
            
    except Exception as e:
        logger.error(f"[AUTH BLOCK EXCEPTION] {e}")

    # ------------------------------------------------------------------
    #     4) FAILED LOGIN: FAILED LOGIN ATTEMPTS CHECK
    # ------------------------------------------------------------------
    try:
        failed_login_attempts = 0

        # If the endpoint path ends with "/login" (or "/login_admin") and response is 401, 403, or 429
        if url_path.rstrip("/").endswith(("/login", "/login_admin", "/register_admin")) and response.status_code in [401, 403, 429, 404]:
            
            failed_login_key = f"login:attempts:{ip}"
            
            await redis_client.incr(failed_login_key)
            await redis_client.expire(failed_login_key, 600)  # 10 min window
            failed_login_attempts = int(await redis_client.get(failed_login_key) or 0)

            # If user has more than FAILED_LOGIN_THRESHOLD => exponential block
            if failed_login_attempts >= FAILED_LOGIN_THRESHOLD:
                            
                login_backoff_key = f"login:backoff:{ip}"
                login_attempts = await redis_client.hincrby(login_backoff_key, "count", 1)
                await redis_client.expire(login_backoff_key, ATTEMPTS_TTL)
                
                raw = 2 ** login_attempts
                minutes = min(raw, MAX_BACKOFF_MIN)  # Cap at 60 min
                block_duration = timedelta(minutes=minutes)

                expires_dt = datetime.now(timezone.utc) + block_duration

                block_info = {
                    "blocked_at": datetime.now(timezone.utc).isoformat(),
                    "attempts": failed_login_attempts,
                    "expires": expires_dt.isoformat(),
                    "reason": "repeated failed logins"
                }

                # We can use the *same* block_key if we want to unify rate-limits & login blocks
                # or use a separate key. Here, let's reuse block_key for simplicity:
                await redis_client.setex(
                    block_key, 
                    int(block_duration.total_seconds()), 
                    json.dumps(block_info)
                )
                
                logger.critical(
                    f"[SECURITY ALERT] Frequent blocks detected for IP={ip}. Immediate investigation recommended."
                )

                # Reset the failed login counter
                await redis_client.delete(failed_login_key)

                logger.warning(
                    f"[LOGIN BLOCK] IP={ip} after {failed_login_attempts} failed logins, "
                    f"blocked for {block_duration} (attempts={login_attempts})."
                )
                
                return Response(status_code=429, content="Too Many Requests")
            
    except Exception as e:
        logger.error(f"[LOGIN BLOCK EXCEPTION] {e}")
        
    # ------------------------------------------------------------------
    #     5) POST-PROCESS: LOGGING & RESPONSE
    # ------------------------------------------------------------------
    elapsed_ms = (perf_counter() - start_time) * 1000
    formatted_process_time = f"{elapsed_ms:.2f}"
            
    # -------------------- Structured Logging ---------------------------
    user_agent = request.headers.get("User-Agent", "unknown")
    
    url = (
        f"{request.url.path}?{request.query_params}"
        if request.query_params
        else request.url.path
    )
    
    try:
        status_phrase = http.HTTPStatus(response.status_code).phrase
    except ValueError:
        status_phrase = ""
        
    try:
        # Log a concise line suitable for text-based logs    
        logger.info(
            '%s - %s agent="%s" - "%s %s" %d %s %sms',
            datetime.now(timezone.utc).isoformat(),  # (1) timestamp
            ip,                                      # (2) IP
            user_agent,                              # (3) user agent
            request.method,                          # (4) method
            url,                                     # (5) URL
            response.status_code,                    # (6) status code
            status_phrase,                           # (7) status phrase
            formatted_process_time,                  # (8) time in ms
        )
        
    except Exception as e:
        logger.error(f"[LOGGING EXCEPTION] {e}")

    return response






