"""Database layer for ResumeCheck user accounts and saved analyses.

Uses SQLite with persistent storage in backend/data/resumecheck.db.
Strict privacy guarantee: Resumes and raw resume texts are NEVER stored.
"""

from datetime import datetime, timezone
import json
from pathlib import Path
import sqlite3
from typing import Any, Dict, List, Optional

DB_PATH = Path(__file__).resolve().parent / "data" / "resumecheck.db"


def get_db_connection() -> sqlite3.Connection:
    """Return a configured SQLite database connection with row factory."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db() -> None:
    """Initialize database tables and indexes if they do not exist."""
    with get_db_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                job_title TEXT,
                score INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                result_json TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """)


def create_user(email: str, password_hash: str) -> Dict[str, Any]:
    """Create a new user and return the user dictionary."""
    now = datetime.now(timezone.utc).isoformat()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)",
            (email.strip().lower(), password_hash, now),
        )
        user_id = cursor.lastrowid
        conn.commit()
        return {
            "id": user_id,
            "email": email.strip().lower(),
            "created_at": now,
        }


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Retrieve user record by email, including password_hash."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, email, password_hash, created_at FROM users WHERE email = ? COLLATE NOCASE",
            (email.strip().lower(),),
        )
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve user record by ID (excludes password_hash for safety)."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, email, created_at FROM users WHERE id = ?",
            (user_id,),
        )
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None


def save_analysis(user_id: int, job_title: str, score: int, result_data: Dict[str, Any]) -> Dict[str, Any]:
    """Save an analysis summary for a signed-in user.

    Strict privacy rule: Strips any raw extracted resume text before persisting.
    """
    now = datetime.now(timezone.utc).isoformat()
    
    # Strip raw resume text if present to ensure zero file retention
    sanitized_data = dict(result_data)
    sanitized_data.pop("extracted_text", None)
    
    serialized_json = json.dumps(sanitized_data)

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO analyses (user_id, job_title, score, created_at, result_json)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, job_title or "Target Job Analysis", score, now, serialized_json),
        )
        analysis_id = cursor.lastrowid
        conn.commit()

        return {
            "id": analysis_id,
            "user_id": user_id,
            "job_title": job_title or "Target Job Analysis",
            "score": score,
            "created_at": now,
        }


def list_user_analyses(user_id: int) -> List[Dict[str, Any]]:
    """Return all saved analyses for a user ordered by newest first."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, user_id, job_title, score, created_at
            FROM analyses
            WHERE user_id = ?
            ORDER BY id DESC
            """,
            (user_id,),
        )
        rows = cursor.fetchall()
        return [dict(r) for r in rows]


def get_analysis_by_id(analysis_id: int, user_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve specific analysis data including sanitized result JSON."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, user_id, job_title, score, created_at, result_json
            FROM analyses
            WHERE id = ? AND user_id = ?
            """,
            (analysis_id, user_id),
        )
        row = cursor.fetchone()
        if not row:
            return None
        data = dict(row)
        try:
            data["result_data"] = json.loads(data["result_json"])
        except Exception:
            data["result_data"] = {}
        return data


def delete_analysis(analysis_id: int, user_id: int) -> bool:
    """Delete a saved analysis for a specific user."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM analyses WHERE id = ? AND user_id = ?",
            (analysis_id, user_id),
        )
        conn.commit()
        return cursor.rowcount > 0
