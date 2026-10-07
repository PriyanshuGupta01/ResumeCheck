"""Unit tests for skills extraction and gap analysis."""

import unittest
from backend.skills import skills_engine


class TestSkillsEngine(unittest.TestCase):
    def test_skills_extraction(self):
        sample_text = "Proficient in Python, React, Docker, and PostgreSQL with experience in AWS and Git."
        extracted = skills_engine.extract_skills(sample_text)
        names = [s["name"] for s in extracted]
        self.assertIn("Python", names)
        self.assertIn("React", names)
        self.assertIn("Docker", names)
        self.assertIn("PostgreSQL", names)
        self.assertIn("AWS", names)
        self.assertIn("Git", names)

    def test_alias_normalization(self):
        sample_text = "Experienced in JS, TS, k8s, and ML models."
        extracted = skills_engine.extract_skills(sample_text)
        names = [s["name"] for s in extracted]
        self.assertIn("JavaScript", names)
        self.assertIn("TypeScript", names)
        self.assertIn("Kubernetes", names)
        self.assertIn("Machine Learning", names)

    def test_skill_gap_analysis(self):
        resume_text = "Expert in Python, FastAPI, and Docker."
        jd_text = "Looking for an engineer skilled in Python, Docker, Kubernetes, and PostgreSQL."

        gap = skills_engine.analyze_gap(resume_text, jd_text)
        matched_names = [s["name"] for s in gap["matched"]]
        missing_names = [s["name"] for s in gap["missing"]]
        extra_names = [s["name"] for s in gap["extra"]]

        self.assertIn("Python", matched_names)
        self.assertIn("Docker", matched_names)
        self.assertIn("Kubernetes", missing_names)
        self.assertIn("PostgreSQL", missing_names)
        self.assertIn("FastAPI", extra_names)
        self.assertEqual(gap["stats"]["matched_count"], 2)
        self.assertEqual(gap["stats"]["missing_count"], 2)

    def test_roles_excluded_from_skills(self):
        text = "Experienced Senior Software Engineer and Full Stack Developer skilled in Python, React, and PostgreSQL."
        extracted = skills_engine.extract_skills(text)
        names = [s["name"] for s in extracted]

        # Professional roles should NOT appear in extracted skills
        self.assertNotIn("Software Engineer", names)
        self.assertNotIn("Full Stack Developer", names)

        # Technical skills should appear
        self.assertIn("Python", names)
        self.assertIn("React", names)
        self.assertIn("PostgreSQL", names)

        # Role detection should work independently
        role = skills_engine.detect_role(text)
        self.assertTrue(role in ["Software Engineer", "Full Stack Developer"])

    def test_low_skill_count_warning_and_confidence(self):
        resume_text = "Proficient in Python and JavaScript."
        jd_text = "Looking for a coder who knows Python."  # Only 1 skill found in JD

        gap = skills_engine.analyze_gap(resume_text, jd_text)
        self.assertIsNotNone(gap["warning"])
        self.assertIn("We only found 1 skills in this job description. Paste the full posting for a better result.", gap["warning"])
        self.assertLess(gap["confidence"], 1.0)
        self.assertEqual(gap["confidence"], 0.4)  # max(0.4, 1/5)


if __name__ == "__main__":
    unittest.main()
