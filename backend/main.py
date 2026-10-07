"""FastAPI application for AI Resume Analyzer (ResumeCheck).

Provides core API endpoints:
- GET /api/health: health check and server status
- POST /api/analyze: full analysis (parsing, sections, skills, match scoring, ATS checks, AI feedback)
- POST /api/report: downloadable PDF report generation
- Authentication:
  - POST /api/auth/signup: create account & return session
  - POST /api/auth/login: authenticate & return session
  - POST /api/auth/logout: clear session cookie
  - GET /api/auth/me: get current user status
- Saved Analyses (optional accounts):
  - GET /api/analyses: list saved analyses for signed-in user
  - POST /api/analyses: save an analysis summary
  - GET /api/analyses/{id}: retrieve specific saved analysis
  - DELETE /api/analyses/{id}: delete saved analysis
- Production static asset serving
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, File, Form, HTTPException, Request, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.auth import (
    clear_auth_cookie,
    enforce_rate_limit,
    get_current_user_optional,
    get_current_user_required,
    hash_password,
    set_auth_cookie,
    validate_email_address,
    validate_password_strength,
    verify_password,
)
from backend.database import (
    create_user,
    delete_analysis,
    get_analysis_by_id,
    get_user_by_email,
    get_user_by_id,
    init_db,
    list_user_analyses,
    save_analysis,
)
from backend.llm_client import generate_ai_feedback
from backend.parser import parse_resume
from backend.report import generate_pdf_report
from backend.scoring import calculate_match_score, check_ats_compliance
from backend.sections import detect_sections, extract_contact_info
from backend.skills import skills_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensure database tables and schema are initialized on startup."""
    init_db()
    yield


# Initialize FastAPI application
app = FastAPI(
    title="ResumeCheck API",
    description="Backend API for parsing resumes, detecting sections, skill gap matching, scoring, ATS compliance, and optional user accounts.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"


# ---------------------------------------------------------
# Request & Response Schemas
# ---------------------------------------------------------

class AuthCredentials(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password (minimum 8 characters)")


class SaveAnalysisPayload(BaseModel):
    job_title: Optional[str] = Field(None, description="Job title for the analysis")
    score: int = Field(..., ge=0, le=100, description="Overall match score (0-100)")
    result_data: Dict[str, Any] = Field(..., description="Analysis result dictionary")


# ---------------------------------------------------------
# System & Core Public Endpoints
# ---------------------------------------------------------

@app.get("/api/health", tags=["System"])
async def health_check() -> dict:
    """Return backend health status, API version, and timestamp."""
    has_gemini = bool(os.environ.get("GEMINI_API_KEY", "").strip())
    return {
        "status": "ok",
        "service": "ResumeCheck API",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mode": "development" if not FRONTEND_DIST.exists() else "production",
        "ai_enabled": has_gemini,
    }


@app.post("/api/analyze", tags=["Analysis"])
async def analyze_resume(
    resume: UploadFile = File(..., description="Resume file (.pdf or .docx)"),
    job_description: str = Form(..., description="Target job description text"),
    job_title: Optional[str] = Form(None, description="Optional target job title"),
    years_experience: Optional[float] = Form(None, description="Optional years of experience"),
) -> dict:
    """Analyze uploaded resume against a target job description.

    Works 100% without signing in. Performs text extraction, resume section detection,
    contact parsing, skill gap analysis, ATS compliance checking, match scoring, and AI feedback.
    """
    # Validate job description length (minimum 50 characters per PRD F2)
    cleaned_jd = job_description.strip()
    if len(cleaned_jd) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description must be at least 50 characters long.",
        )

    # Validate file presence and filename
    if not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid resume file.",
        )

    # Read binary content in memory
    try:
        file_bytes = await resume.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read uploaded file: {str(e)}",
        )

    # 1. Parse text from PDF or DOCX in memory (F1)
    extracted_text = parse_resume(file_bytes, resume.filename)
    word_count = len(extracted_text.split())

    # 2. Detect resume structure & contact information (F3)
    sections_result = detect_sections(extracted_text)
    contact_result = extract_contact_info(extracted_text)

    # 3. Perform skill extraction and gap analysis (F4)
    skill_gap = skills_engine.analyze_gap(extracted_text, cleaned_jd)
    if not job_title:
        job_title = skill_gap.get("detected_role") or skills_engine.detect_role(cleaned_jd) or skills_engine.detect_role(extracted_text)

    # 4. ATS compliance & checks (F6)
    ats_result = check_ats_compliance(
        resume_text=extracted_text,
        jd_text=cleaned_jd,
        sections_detected=sections_result.get("sections", {}),
        contact_info=contact_result,
        years_experience=years_experience or 0.0,
    )

    # 5. Calculate overall match score & 4 sub-scores (F5)
    score_result = calculate_match_score(
        skills_data=skill_gap,
        resume_text=extracted_text,
        jd_text=cleaned_jd,
        sections_detected=sections_result.get("sections", {}),
        ats_score=ats_result.get("score", 0),
    )

    # 6. Generate AI feedback with basic mode fallback (F7)
    ai_feedback = generate_ai_feedback(
        resume_text=extracted_text,
        job_description=cleaned_jd,
        matched_skills=skill_gap.get("matched", []),
        missing_skills=skill_gap.get("missing", []),
    )

    return {
        "status": "success",
        "filename": resume.filename,
        "word_count": word_count,
        "extracted_text": extracted_text,
        "target_job": {
            "title": job_title,
            "years_experience": years_experience,
            "description_length": len(cleaned_jd),
        },
        "sections": sections_result,
        "contact_info": contact_result,
        "skills": skill_gap,
        "ats": ats_result,
        "scores": score_result,
        "ai_feedback": ai_feedback,
        "is_ai_enabled": bool(ai_feedback is not None),
    }


@app.post("/api/report", tags=["Report"])
async def download_report(request: Request) -> Response:
    """Generate and download a PDF report from analysis JSON data (PRD F9)."""
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload provided for report generation.",
        )

    if not isinstance(body, dict) or "scores" not in body:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis data is missing required score/skills information.",
        )

    try:
        pdf_bytes = generate_pdf_report(body)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF report: {str(e)}",
        )

    filename = body.get("filename", "resume")
    clean_base = Path(filename).stem or "resume"
    download_name = f"ResumeCheck_Report_{clean_base}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
    )


# ---------------------------------------------------------
# Authentication Endpoints (Optional Accounts)
# ---------------------------------------------------------

@app.post("/api/auth/signup", tags=["Authentication"])
async def sign_up(payload: AuthCredentials, request: Request, response: Response) -> dict:
    """Register a new user account with email and password."""
    enforce_rate_limit(request)
    email = validate_email_address(payload.email)
    password = validate_password_strength(payload.password)

    # Check uniqueness
    existing_user = get_user_by_email(email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please sign in.",
        )

    hashed = hash_password(password)
    user = create_user(email=email, password_hash=hashed)
    set_auth_cookie(response, user_id=user["id"], email=user["email"])

    return {
        "status": "success",
        "message": "Account created successfully.",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "created_at": user["created_at"],
        },
    }


@app.post("/api/auth/login", tags=["Authentication"])
async def sign_in(payload: AuthCredentials, request: Request, response: Response) -> dict:
    """Authenticate existing user and set httpOnly session cookie."""
    enforce_rate_limit(request)
    email = validate_email_address(payload.email)
    
    user = get_user_by_email(email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password or email. Please check your credentials.",
        )

    set_auth_cookie(response, user_id=user["id"], email=user["email"])

    return {
        "status": "success",
        "message": "Signed in successfully.",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "created_at": user["created_at"],
        },
    }


@app.post("/api/auth/logout", tags=["Authentication"])
async def sign_out(response: Response) -> dict:
    """Clear session cookie and sign user out."""
    clear_auth_cookie(response)
    return {
        "status": "success",
        "message": "Signed out successfully.",
    }


@app.get("/api/auth/me", tags=["Authentication"])
async def get_current_user_profile(request: Request) -> dict:
    """Retrieve currently authenticated user session or return 401."""
    session_user = get_current_user_optional(request)
    if not session_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No active authentication session found.",
        )

    user = get_user_by_id(session_user["id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists.",
        )

    return {
        "status": "success",
        "user": user,
    }


# ---------------------------------------------------------
# Analyses Endpoints (Saved Analyses for Signed-In Users)
# ---------------------------------------------------------

@app.get("/api/analyses", tags=["Analyses"])
async def get_saved_analyses(request: Request) -> dict:
    """List all saved analyses for the currently signed-in user."""
    user = get_current_user_required(request)
    analyses = list_user_analyses(user_id=user["id"])
    return {
        "status": "success",
        "analyses": analyses,
    }


@app.post("/api/analyses", tags=["Analyses"])
async def save_new_analysis(payload: SaveAnalysisPayload, request: Request) -> dict:
    """Save an analysis summary to the signed-in user's account.

    Strict zero-storage privacy rule: Raw resume text is completely removed before persisting.
    """
    user = get_current_user_required(request)
    saved = save_analysis(
        user_id=user["id"],
        job_title=payload.job_title or "Target Job Analysis",
        score=payload.score,
        result_data=payload.result_data,
    )
    return {
        "status": "success",
        "message": "Analysis saved to your account.",
        "analysis": saved,
    }


@app.get("/api/analyses/{analysis_id}", tags=["Analyses"])
async def get_saved_analysis_detail(analysis_id: int, request: Request) -> dict:
    """Retrieve full analysis result for a specific saved entry."""
    user = get_current_user_required(request)
    analysis = get_analysis_by_id(analysis_id=analysis_id, user_id=user["id"])
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved analysis not found or not authorized to access.",
        )
    return {
        "status": "success",
        "analysis": analysis,
    }


@app.delete("/api/analyses/{analysis_id}", tags=["Analyses"])
async def delete_saved_analysis(analysis_id: int, request: Request) -> dict:
    """Delete a saved analysis from user's account."""
    user = get_current_user_required(request)
    deleted = delete_analysis(analysis_id=analysis_id, user_id=user["id"])
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved analysis not found or already deleted.",
        )
    return {
        "status": "success",
        "message": "Saved analysis deleted successfully.",
    }


# ---------------------------------------------------------
# Production Static Asset Serving (Vite SPA)
# ---------------------------------------------------------

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Serve index.html for client-side routing on any non-API route."""
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"message": "API route not found"})

        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return FileResponse(index_file)

        return JSONResponse(status_code=404, content={"message": "Frontend build not found"})


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="127.0.0.1", port=port, reload=True)
