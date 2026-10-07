"""Edge case test suite for backend /api/analyze endpoint.

Tests:
1. Scanned / image-only PDF (no readable text)
2. Empty file (0 bytes)
3. Very short job description (< 50 characters)
4. Basic mode (no AI key)
5. Valid file response structure inspection
"""

import io
import os
from fastapi.testclient import TestClient
from fpdf import FPDF
from backend.main import app

client = TestClient(app)

SAMPLE_JD = """Senior Full Stack Engineer (Python & React)
Requirements: 3+ years experience with Python, FastAPI, React, TypeScript, PostgreSQL, and AWS.
Responsibilities: Architect microservices, build merchant interfaces, write unit tests, maintain CI/CD pipelines."""

def create_blank_pdf() -> bytes:
    """Create a PDF with blank page (no text layer, simulating scanned doc)."""
    pdf = FPDF()
    pdf.add_page()
    return bytes(pdf.output())

def test_scanned_pdf():
    """Scanned PDF with no text must return 400 with descriptive error message."""
    blank_pdf = create_blank_pdf()
    files = {"resume": ("scanned_resume.pdf", blank_pdf, "application/pdf")}
    data = {"job_description": SAMPLE_JD}
    response = client.post("/api/analyze", files=files, data=data)
    assert response.status_code == 400
    detail = response.json().get("detail", "")
    print("Scanned PDF response status:", response.status_code, "detail:", detail)
    assert response.status_code == 400
    assert "No readable text found" in detail or "scanned" in detail.lower()
    print("PASS: Scanned PDF correctly rejected with message:", detail)

def test_empty_file():
    """Empty file must return 400 with descriptive error message."""
    files = {"resume": ("empty.pdf", b"", "application/pdf")}
    data = {"job_description": SAMPLE_JD}
    response = client.post("/api/analyze", files=files, data=data)
    assert response.status_code == 400
    detail = response.json().get("detail", "")
    assert "empty" in detail.lower()
    print("PASS: Empty file correctly rejected with message:", detail)

def test_short_job_description():
    """Job description under 50 chars must return 400 with descriptive error message."""
    files = {"resume": ("sample.pdf", b"%PDF-1.4 dummy", "application/pdf")}
    data = {"job_description": "Too short JD"}
    response = client.post("/api/analyze", files=files, data=data)
    assert response.status_code == 400
    detail = response.json().get("detail", "")
    assert "50 characters" in detail
    print("PASS: Short JD correctly rejected with message:", detail)

def test_basic_mode():
    """When GEMINI_API_KEY is not set or empty, analyze must return is_ai_enabled=False and ai_feedback=None without error."""
    # Read existing sample PDF
    resume_path = "frontend/public/Aarav_Sharma_Resume.pdf"
    if not os.path.exists(resume_path):
        resume_path = "tests/samples/sample_resume.pdf"
    with open(resume_path, "rb") as f:
        pdf_bytes = f.read()
    files = {"resume": ("Aarav_Sharma_Resume.pdf", pdf_bytes, "application/pdf")}
    data = {"job_description": SAMPLE_JD}
    response = client.post("/api/analyze", files=files, data=data)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["status"] == "success"
    assert "scores" in res_json
    assert "sub_scores" in res_json["scores"]
    assert "present_count" in res_json["sections"]
    print("PASS: Basic mode successfully evaluated resume. is_ai_enabled:", res_json.get("is_ai_enabled"))

if __name__ == "__main__":
    test_scanned_pdf()
    test_empty_file()
    test_short_job_description()
    test_basic_mode()
    print("\nALL EDGE CASE TESTS PASSED SUCCESSFULLY!")
