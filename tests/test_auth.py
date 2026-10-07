"""Automated tests for Authentication and Saved Analyses endpoints."""

import os
import unittest
from fastapi.testclient import TestClient

# Ensure test DB is used or clean state
from backend.main import app
from backend.database import init_db


class TestAuthAndAnalyses(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app, raise_server_exceptions=False)
        cls.test_email = "testuser_auth@example.com"
        cls.test_password = "SecurePassword123!"

    def test_01_signup_validation(self):
        # 1. Invalid email
        res = self.client.post("/api/auth/signup", json={"email": "invalid-email", "password": "Password123!"})
        self.assertEqual(res.status_code, 400)

        # 2. Too short password (< 8 chars)
        res = self.client.post("/api/auth/signup", json={"email": "valid@example.com", "password": "short"})
        self.assertEqual(res.status_code, 400)

        # 3. Successful signup
        res = self.client.post(
            "/api/auth/signup",
            json={"email": self.test_email, "password": self.test_password},
        )
        self.assertIn(res.status_code, [200, 400])  # If already exists from prior run, 400 is expected

    def test_02_duplicate_signup_rejection(self):
        # Trying to register the same email should return 400
        res = self.client.post(
            "/api/auth/signup",
            json={"email": self.test_email, "password": self.test_password},
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("already registered", res.json().get("detail", "").lower())

    def test_03_login_wrong_password(self):
        res = self.client.post(
            "/api/auth/login",
            json={"email": self.test_email, "password": "WrongPassword999!"},
        )
        self.assertEqual(res.status_code, 401)
        self.assertIn("wrong password", res.json().get("detail", "").lower())

    def test_04_login_success_and_cookie(self):
        res = self.client.post(
            "/api/auth/login",
            json={"email": self.test_email, "password": self.test_password},
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "success")
        self.assertEqual(data.get("user", {}).get("email"), self.test_email)
        # Verify session cookie was set
        self.assertIn("resumecheck_session", res.cookies)

    def test_05_auth_me_endpoint(self):
        # Authenticated client
        auth_client = TestClient(app, raise_server_exceptions=False)
        login_res = auth_client.post(
            "/api/auth/login",
            json={"email": self.test_email, "password": self.test_password},
        )
        self.assertEqual(login_res.status_code, 200)

        me_res = auth_client.get("/api/auth/me")
        self.assertEqual(me_res.status_code, 200)
        user_info = me_res.json().get("user", {})
        self.assertEqual(user_info.get("email"), self.test_email)
        self.assertNotIn("password_hash", user_info)  # Crucial security check: never leak hash

    def test_06_logout(self):
        auth_client = TestClient(app, raise_server_exceptions=False)
        auth_client.post(
            "/api/auth/login",
            json={"email": self.test_email, "password": self.test_password},
        )
        logout_res = auth_client.post("/api/auth/logout")
        self.assertEqual(logout_res.status_code, 200)

        # /api/auth/me should now fail with 401
        me_res = auth_client.get("/api/auth/me")
        self.assertEqual(me_res.status_code, 401)

    def test_07_saved_analyses_crud(self):
        auth_client = TestClient(app, raise_server_exceptions=False)
        auth_client.post(
            "/api/auth/login",
            json={"email": self.test_email, "password": self.test_password},
        )

        # 1. Save an analysis
        sample_payload = {
            "job_title": "Senior Cloud Engineer",
            "score": 88,
            "result_data": {
                "filename": "resume.pdf",
                "extracted_text": "Sensitive raw resume content that MUST NOT be stored",
                "scores": {"overall_score": 88},
                "skills": {"matched": ["AWS", "Docker"], "missing": ["Kubernetes"]},
            },
        }

        save_res = auth_client.post("/api/analyses", json=sample_payload)
        self.assertEqual(save_res.status_code, 200)
        saved_id = save_res.json()["analysis"]["id"]

        # 2. List analyses
        list_res = auth_client.get("/api/analyses")
        self.assertEqual(list_res.status_code, 200)
        analyses = list_res.json()["analyses"]
        self.assertTrue(any(a["id"] == saved_id for a in analyses))

        # 3. Retrieve detail and verify extracted_text was stripped for privacy
        detail_res = auth_client.get(f"/api/analyses/{saved_id}")
        self.assertEqual(detail_res.status_code, 200)
        result_json = detail_res.json()["analysis"]["result_data"]
        self.assertNotIn("extracted_text", result_json)  # Privacy requirement check
        self.assertIn("scores", result_json)

        # 4. Delete analysis
        del_res = auth_client.delete(f"/api/analyses/{saved_id}")
        self.assertEqual(del_res.status_code, 200)

        # 5. Verify deleted
        detail_res2 = auth_client.get(f"/api/analyses/{saved_id}")
        self.assertEqual(detail_res2.status_code, 404)


if __name__ == "__main__":
    unittest.main()
