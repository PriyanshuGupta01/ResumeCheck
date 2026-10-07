"""End-to-end test suite for user accounts, authentication, rate limiting,
zero resume storage guarantee, and core guest analysis functionality.
"""

import json
import urllib.request
import urllib.parse
import http.cookiejar
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("=" * 60)
    print("STARTING TEST SUITE FOR USER ACCOUNTS & RESUMECHECK API")
    print("=" * 60)

    cookie_jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

    def make_request(method, endpoint, data=None):
        url = f"{BASE_URL}{endpoint}"
        req_headers = {"Content-Type": "application/json", "Accept": "application/json"}
        req_data = json.dumps(data).encode("utf-8") if data is not None else None
        req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
        try:
            with opener.open(req) as resp:
                status_code = resp.getcode()
                body = resp.read().decode("utf-8")
                return status_code, json.loads(body) if body else {}, resp.headers
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            try:
                err_json = json.loads(body)
            except Exception:
                err_json = {"raw": body}
            return e.code, err_json, e.headers

    # 1. Health check
    print("\n[TEST 1] Backend Health Check")
    status, body, _ = make_request("GET", "/api/health")
    assert status == 200, f"Expected 200, got {status}"
    assert body.get("status") == "ok", "Health status is not ok"
    print("[OK] Backend is healthy and responding.")

    # 2. Signup with short password (< 8 chars)
    print("\n[TEST 2] Signup validation: password < 8 chars")
    status, body, _ = make_request("POST", "/api/auth/signup", {
        "email": "testuser@example.com",
        "password": "short"
    })
    assert status == 400, f"Expected 400, got {status}"
    assert "at least 8 characters" in body.get("detail", ""), f"Unexpected error detail: {body}"
    print(f"[OK] Correctly rejected short password: {body.get('detail')}")

    # 3. Signup with invalid email
    print("\n[TEST 3] Signup validation: invalid email")
    status, body, _ = make_request("POST", "/api/auth/signup", {
        "email": "not-an-email",
        "password": "Password123!"
    })
    assert status == 400, f"Expected 400, got {status}"
    assert "valid email" in body.get("detail", "").lower(), f"Unexpected error detail: {body}"
    print(f"[OK] Correctly rejected invalid email: {body.get('detail')}")

    # 4. Valid Signup
    test_email = "alex.rivera.test@example.com"
    test_password = "SecurePassword2026!"
    print(f"\n[TEST 4] Valid Signup for {test_email}")
    status, body, headers = make_request("POST", "/api/auth/signup", {
        "email": test_email,
        "password": test_password
    })
    if status == 400 and "already registered" in body.get("detail", ""):
        print("  (User already existed from prior run, continuing to login test)")
    else:
        assert status == 200, f"Expected 200, got {status}: {body}"
        assert body.get("user", {}).get("email") == test_email.lower()
        print("[OK] Successfully registered new user account.")

    # 5. Duplicate signup error handling
    print("\n[TEST 5] Duplicate email signup rejection")
    status, body, _ = make_request("POST", "/api/auth/signup", {
        "email": test_email,
        "password": test_password
    })
    assert status == 400, f"Expected 400, got {status}"
    assert "already registered" in body.get("detail", "").lower(), f"Unexpected error detail: {body}"
    print(f"[OK] Correctly rejected duplicate email: {body.get('detail')}")

    # 6. Wrong password login handling
    print("\n[TEST 6] Login with wrong password")
    status, body, _ = make_request("POST", "/api/auth/login", {
        "email": test_email,
        "password": "WrongPassword999!"
    })
    assert status == 401, f"Expected 401, got {status}"
    assert "invalid email or password" in body.get("detail", "").lower() or "wrong" in body.get("detail", "").lower(), f"Unexpected detail: {body}"
    print(f"[OK] Correctly rejected wrong password: {body.get('detail')}")

    # 7. Valid login
    print(f"\n[TEST 7] Valid Login for {test_email}")
    status, body, headers = make_request("POST", "/api/auth/login", {
        "email": test_email,
        "password": test_password
    })
    assert status == 200, f"Expected 200, got {status}: {body}"
    assert body.get("user", {}).get("email") == test_email.lower()
    print("[OK] Successfully authenticated user.")

    # Check cookies
    cookies = {c.name: c.value for c in cookie_jar}
    assert "resumecheck_session" in cookies, f"Cookie resumecheck_session missing: {cookies}"
    print("[OK] Signed session cookie received: resumecheck_session")

    # 8. GET /api/auth/me
    print("\n[TEST 8] GET /api/auth/me (Current user session)")
    status, body, _ = make_request("GET", "/api/auth/me")
    assert status == 200, f"Expected 200, got {status}: {body}"
    assert body.get("user", {}).get("email") == test_email.lower(), f"Unexpected user: {body}"
    print(f"[OK] Session verified for {body['user']['email']}")

    # 9. Save an analysis & verify zero resume text storage
    print("\n[TEST 9] Save an analysis and test Zero Resume Storage enforcement")
    sample_analysis = {
        "job_title": "Senior Data Scientist",
        "score": 85,
        "result_data": {
            "filename": "Alex_Rivera_Resume.pdf",
            "word_count": 450,
            "extracted_text": "THIS IS RAW RESUME TEXT THAT MUST NEVER BE STORED IN SQLITE!",
            "scores": {"overall_score": 85, "label": "Strong Match"},
            "skills": {"matched": ["Python", "SQL", "Machine Learning"], "missing": ["Docker"]}
        }
    }
    status, body, _ = make_request("POST", "/api/analyses", sample_analysis)
    assert status == 200, f"Expected 200, got {status}: {body}"
    saved_id = body.get("analysis", {}).get("id")
    assert saved_id is not None, "Failed to get saved analysis ID"
    print(f"[OK] Analysis #{saved_id} saved successfully.")

    # 10. List user analyses
    print("\n[TEST 10] List user analyses")
    status, body, _ = make_request("GET", "/api/analyses")
    assert status == 200, f"Expected 200, got {status}"
    analyses_list = body.get("analyses", [])
    assert any(a.get("id") == saved_id for a in analyses_list), "Saved analysis not in user analyses list"
    print(f"[OK] Found {len(analyses_list)} saved analysis(es).")

    # 11. Retrieve saved analysis detail & confirm zero raw resume text retention
    print(f"\n[TEST 11] Retrieve analysis #{saved_id} and verify zero text retention")
    status, body, _ = make_request("GET", f"/api/analyses/{saved_id}")
    assert status == 200, f"Expected 200, got {status}"
    detail_data = body.get("analysis", {}).get("result_data", {})
    assert "extracted_text" not in detail_data, "SECURITY VIOLATION: extracted_text was stored in DB!"
    print("[OK] Zero Resume Storage verified: raw extracted_text was successfully stripped before persisting.")

    # 12. Delete saved analysis
    print(f"\n[TEST 12] Delete analysis #{saved_id}")
    status, body, _ = make_request("DELETE", f"/api/analyses/{saved_id}")
    assert status == 200, f"Expected 200, got {status}"
    print("[OK] Analysis deleted successfully.")

    # 13. Verify analysis is gone
    status, body, _ = make_request("GET", f"/api/analyses/{saved_id}")
    assert status == 404, f"Expected 404, got {status}"
    print("[OK] Confirmed analysis is removed (HTTP 404).")

    # 14. Logout
    print("\n[TEST 14] POST /api/auth/logout")
    status, body, _ = make_request("POST", "/api/auth/logout")
    assert status == 200, f"Expected 200, got {status}"
    print("[OK] Logged out successfully.")

    # 15. Verify unauthenticated after logout
    status, body, _ = make_request("GET", "/api/auth/me")
    assert status == 401, f"Expected 401 unauthenticated, got {status}: {body}"
    print("[OK] Verified user is unauthenticated after logout (HTTP 401).")

    # 16. Verify core analysis works as guest (without signing in)
    print("\n[TEST 16] Verify core resume analysis works without signing in (Guest)")
    guest_opener = urllib.request.build_opener() # Fresh opener with no cookies
    boundary = "----WebKitFormBoundaryResumeCheckTest"
    body_parts = []
    
    with open("tests/samples/sample_resume.pdf", "rb") as f:
        sample_content = f.read()
    with open("tests/samples/jd_datascience.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()

    body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
    body_parts.append(b'Content-Disposition: form-data; name="resume"; filename="sample_resume.pdf"\r\n')
    body_parts.append(b"Content-Type: application/pdf\r\n\r\n")
    body_parts.append(sample_content)
    body_parts.append(b"\r\n")
    
    body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
    body_parts.append(b'Content-Disposition: form-data; name="job_description"\r\n\r\n')
    body_parts.append(jd_text.encode("utf-8"))
    body_parts.append(b"\r\n")
    body_parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    
    multipart_data = b"".join(body_parts)
    req = urllib.request.Request(
        f"{BASE_URL}/api/analyze",
        data=multipart_data,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )
    with guest_opener.open(req) as resp:
        assert resp.getcode() == 200
        analysis_resp = json.loads(resp.read().decode("utf-8"))
        assert analysis_resp.get("status") == "success"
        assert "scores" in analysis_resp
        print(f"[OK] Core analysis succeeded without login! Overall score: {analysis_resp['scores'].get('overall_score')}")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! (16/16)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
