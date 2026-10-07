"""Unit tests for FastAPI endpoints (Health, Analyze, Report)."""

import io
import unittest
from fastapi.testclient import TestClient
from backend.main import app


class TestAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app, raise_server_exceptions=False)

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "ok")
        self.assertEqual(data.get("service"), "ResumeCheck API")

    def test_analyze_endpoint_validation(self):
        # Short JD test (less than 50 chars)
        dummy_file = io.BytesIO(b"Candidate Name\nSummary of experience\nPython Developer with 5 years experience")
        response = self.client.post(
            "/api/analyze",
            files={"resume": ("sample.txt", dummy_file, "text/plain")},
            data={"job_description": "Too short"},
        )
        self.assertEqual(response.status_code, 400)

    def test_report_endpoint(self):
        payload = {
            "filename": "Alex_Morgan_Resume.pdf",
            "word_count": 450,
            "scores": {
                "overall_score": 85,
                "label": "Excellent",
                "sub_scores": {
                    "skill_match": 90,
                    "text_similarity": 80,
                    "structure_completeness": 85,
                    "ats_quality": 85,
                },
            },
            "skills": {
                "matched": ["React", "TypeScript", "Tailwind CSS"],
                "missing": ["GraphQL"],
                "extra": ["Docker"],
            },
            "ats": {
                "score": 85,
                "checks": [
                    {"name": "Standard Headings", "status": "pass", "message": "All essential sections found."},
                    {"name": "Action Verbs", "status": "pass", "message": "Strong action verbs detected."},
                ],
            },
        }

        response = self.client.post("/api/report", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("content-type"), "application/pdf")
        self.assertTrue(len(response.content) > 500)


if __name__ == "__main__":
    unittest.main()
