"""Authentication, password security, session signing, and rate limiting for ResumeCheck.

Implements bcrypt password hashing, signed httpOnly cookies, email/password validation,
and in-memory brute-force rate limiting.
"""

import base64
import hashlib
import hmac
import json
import os
import re
import time
from typing import Any, Dict, List, Optional
import bcrypt
from fastapi import HTTPException, Request, Response, status

SECRET_KEY = os.environ.get("SECRET_KEY", "resumecheck-default-dev-secret-key-32bytes!")
COOKIE_NAME = "resumecheck_session"
SESSION_DURATION_SECONDS = 7 * 24 * 3600  # 7 days

# Basic in-memory rate limiter: tracks attempts per client IP in a 60-second window
# Format: { ip_address: [timestamp1, timestamp2, ...] }
RATE_LIMIT_STORE: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW = 60  # seconds
MAX_AUTH_ATTEMPTS_PER_WINDOW = 12


def enforce_rate_limit(request: Request) -> None:
    """Enforce basic IP rate limiting on sensitive authentication endpoints."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    attempts = RATE_LIMIT_STORE.get(client_ip, [])
    # Filter attempts within the active sliding window
    attempts = [t for t in attempts if now - t < RATE_LIMIT_WINDOW]
    
    if len(attempts) >= MAX_AUTH_ATTEMPTS_PER_WINDOW:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many authentication attempts. Please wait a minute and try again.",
        )
    
    attempts.append(now)
    RATE_LIMIT_STORE[client_ip] = attempts


def validate_email_address(email: str) -> str:
    """Validate email syntax and return normalized lowercased string."""
    cleaned = (email or "").strip().lower()
    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is required.",
        )
    # RFC 5322 compatible pragmatic email regex
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if not re.match(email_regex, cleaned):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address.",
        )
    return cleaned


def validate_password_strength(password: str) -> str:
    """Validate password meets minimum security criteria (>= 8 characters)."""
    if not password or len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )
    if len(password) > 128:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password exceeds the maximum length of 128 characters.",
        )
    return password


def hash_password(password: str) -> str:
    """Hash password using bcrypt with standard salt rounds."""
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify raw password against bcrypt hash in constant time."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False


def create_signed_session_token(user_id: int, email: str) -> str:
    """Generate a tamper-proof HMAC-SHA256 signed session token."""
    payload = {
        "uid": user_id,
        "email": email,
        "exp": int(time.time()) + SESSION_DURATION_SECONDS,
    }
    payload_json = json.dumps(payload, separators=(",", ":"))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode("utf-8")).decode("utf-8").rstrip("=")
    
    # Compute signature
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    
    return f"{payload_b64}.{signature}"


def verify_signed_session_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify token signature and expiration, returning user payload or None."""
    if not token or "." not in token:
        return None
    try:
        payload_b64, signature = token.split(".", 1)
        expected_sig = hmac.new(
            SECRET_KEY.encode("utf-8"),
            payload_b64.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        
        # Constant-time comparison to prevent timing attacks
        if not hmac.compare_digest(signature, expected_sig):
            return None
        
        # Restore base64 padding
        padding = "=" * ((4 - len(payload_b64) % 4) % 4)
        payload_json = base64.urlsafe_b64decode(payload_b64 + padding).decode("utf-8")
        payload = json.loads(payload_json)
        
        # Verify expiration
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None


def set_auth_cookie(response: Response, user_id: int, email: str) -> None:
    """Set secure httpOnly signed cookie on response."""
    token = create_signed_session_token(user_id, email)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=SESSION_DURATION_SECONDS,
        httponly=True,
        samesite="lax",
        secure=False,  # Set to True in HTTPS production environments
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    """Clear session cookie on logout."""
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        httponly=True,
        samesite="lax",
    )


def get_current_user_optional(request: Request) -> Optional[Dict[str, Any]]:
    """Extract authenticated user from request cookie if present and valid."""
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        # Also check Authorization Bearer header as fallback
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            
    payload = verify_signed_session_token(token)
    if not payload:
        return None
        
    return {
        "id": payload.get("uid"),
        "email": payload.get("email"),
    }


def get_current_user_required(request: Request) -> Dict[str, Any]:
    """FastAPI dependency requiring authentication, raises 401 if unauthenticated."""
    user = get_current_user_optional(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in to access this resource.",
        )
    return user
