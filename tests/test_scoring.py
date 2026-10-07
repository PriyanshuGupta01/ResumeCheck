"""Unit tests for ATS checks and scoring engine."""

import unittest
from backend.scoring import calculate_match_score, check_ats_compliance, compute_text_similarity


class TestScoringEngine(unittest.TestCase):
    def test_text_similarity(self):
        text_a = "Senior Software Engineer with deep experience in React, JavaScript, and Node.js."
        text_b = "Looking for a Software Engineer proficient in React, JavaScript, and Node.js applications."
        sim = compute_text_similarity(text_a, text_b)
        self.assertGreater(sim, 20.0)

    def test_ats_compliance_checks(self):
        sample_resume = """
        John Doe
        john@example.com | +1-234-567-8900 | linkedin.com/in/johndoe
        
        EXPERIENCE
        - Spearheaded modern cloud migration resulting in 40% cost reduction.
        - Engineered scalable backend microservices serving 100,000 requests per minute.
        - Deployed Docker containers on Kubernetes with 99.9% uptime.
        
        EDUCATION
        B.S. in Computer Science
        
        SKILLS
        Python, Docker, Kubernetes, AWS, PostgreSQL
        """
        sections = {"contact": True, "experience": True, "education": True, "skills": True}
        contact = {"email": "john@example.com", "phone": "+1-234-567-8900", "linkedin": "linkedin.com/in/johndoe"}

        ats_result = check_ats_compliance(
            resume_text=sample_resume,
            jd_text="Looking for a Python and Docker engineer.",
            sections_detected=sections,
            contact_info=contact,
        )

        self.assertIn("score", ats_result)
        self.assertGreater(ats_result["score"], 50)
        self.assertGreater(ats_result["passed_count"], 3)

    def test_calculate_match_score(self):
        skills_data = {
            "matched": ["Python", "Docker"],
            "missing": ["Kubernetes"],
            "extra": ["FastAPI"],
            "matched_count": 2,
            "job_skills_count": 3,
        }
        sections = {"contact": True, "experience": True, "education": True, "skills": True, "summary": True}
        resume = "Python Docker engineer with 5 years experience."
        jd = "Python Docker Kubernetes developer."

        score_res = calculate_match_score(
            skills_data=skills_data,
            resume_text=resume,
            jd_text=jd,
            sections_detected=sections,
            ats_score=85,
        )

        self.assertIn("overall_score", score_res)
        self.assertIn(score_res["label"], ["Weak", "Fair", "Good", "Excellent"])
        self.assertIn("sub_scores", score_res)


if __name__ == "__main__":
    unittest.main()
