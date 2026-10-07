"""Unit tests for resume section structure detection and Indian localization."""

import unittest
from backend.sections import detect_sections, extract_contact_info, extract_education_details, detect_personal_biodata_fields
from backend.scoring import calculate_match_score, check_ats_compliance


SAMPLE_RESUME_1 = """
AARAV SHARMA
Bengaluru, Karnataka | +91 98765 43210 | aarav.sharma@gmail.com | linkedin.com/in/aarav-sharma | github.com/aarav

CAREER OBJECTIVE:
Detail-oriented Computer Science graduate with strong hands-on expertise in Python, React, and FastAPI, seeking a Software Engineer role.

TECHNICAL SKILLS:
Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3
Frameworks: React, FastAPI, Node.js, Express, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, Git

INTERNSHIPS:
Software Engineering Intern | TechLabs India, Bengaluru (June 2023 - Dec 2023)
- Built 12 RESTful API endpoints in FastAPI that improved API response speeds by 35% for 45,000 monthly active users.
- Designed clean React dashboard components with Tailwind CSS, increasing conversion rate by 18%.

ACADEMIC PROJECTS:
ResumeCheck AI | Personal Project (2024)
- Developed an automated resume matching engine using FastAPI, scikit-learn, and React.
- Deployed on AWS with Docker containerization.

ACADEMIC DETAILS:
- B.Tech in Computer Science and Engineering | VTU Bengaluru (2020 - 2024) | 8.6 CGPA
- CBSE Class XII (Senior Secondary) | Delhi Public School, Bengaluru | 91.4%

ACHIEVEMENTS:
- Finalist at Smart India Hackathon (SIH 2023) out of 1,200 national teams.
- NPTEL Elite Certification in Cloud Computing.

DECLARATION:
I hereby declare that all the information provided above is true and correct to the best of my knowledge.
"""

SAMPLE_RESUME_2 = """
PRIYA PATEL
Pune, Maharashtra | +91-9823456789 | priya.patel@gmail.com | https://linkedin.com/in/priya-patel | https://priyapatel.dev

PROFESSIONAL SUMMARY:
Full Stack Engineer with 3 years of experience architecting resilient cloud web applications with React, Node.js, and AWS.

SKILLS & TOOLS:
- Frontend: React, Next.js, Redux, Tailwind CSS, TypeScript
- Backend: Node.js, Python, PostgreSQL, REST APIs, Microservices
- DevOps: AWS, Docker, Kubernetes, CI/CD, Git

WORK EXPERIENCE:
Full Stack Developer | CloudScale Solutions, Pune (Jan 2022 - Present)
- Architected and delivered 15 microservices supporting 250,000 active customer transactions.
- Reduced database query latency by 40% through Redis caching and PostgreSQL query indexing.

KEY PROJECTS:
Automated Billing Portal
- Integrated Razorpay payment gateway and GST-compliant invoicing system handling INR 50L monthly turnover.

EDUCATION QUALIFICATION:
- B.E. in Information Technology | Savitribai Phule Pune University | 8.4 CGPA (2021)
- Higher Secondary Certificate (HSC) | Maharashtra State Board | 86.8%

CERTIFICATIONS:
- AWS Certified Solutions Architect - Associate
"""

SAMPLE_RESUME_3 = """
ROHAN VERMA
Gurugram, Haryana | 09812345678 | rohan.verma@gmail.com | linkedin.com/in/rohan-verma

PROFILE SUMMARY:
Senior Financial & Data Analyst with 4 years experience leading MIS reporting, financial modeling, and GST reconciliations.

CORE COMPETENCIES:
Financial Analysis, Advanced Excel (VLookup, Pivot Tables, Macros), Power BI, Tally Prime, GST, SQL, Salesforce

EMPLOYMENT HISTORY:
Financial Data Analyst | Apex Corporate Services, Gurugram (2021 - Present)
- Automated monthly GST reconciliation reports using Advanced Excel and Tally, reducing processing time from 4 days to 4 hours.
- Created Power BI interactive executive dashboards for monitoring INR 25 Cr annual revenue.

EDUCATIONAL QUALIFICATIONS:
- MBA in Finance & Analytics | MDI Gurgaon | 8.2 CGPA (2021)
- B.Com (Honors) | Delhi University | 78% (2019)

CERTIFICATES:
- Microsoft Certified: Power BI Data Analyst Associate
- NISM Series Certification

EXTRA-CURRICULAR ACTIVITIES:
- Head of Finance Club at MDI Gurgaon, leading annual budget allocations.
"""


class TestStructureDetection(unittest.TestCase):
    def test_sample_resume_1_structure_and_contact(self):
        # 1. Check sections
        res = detect_sections(SAMPLE_RESUME_1)
        present = res["present"]
        self.assertIn("Contact", present)
        self.assertIn("Summary", present)
        self.assertIn("Skills", present)
        self.assertIn("Experience", present)
        self.assertIn("Education", present)
        self.assertIn("Projects", present)
        self.assertIn("Achievements", present)
        self.assertIn("Declaration", present)

        # 2. Check structure score is high (>= 80%)
        dummy_skills = {"matched": ["Python", "React", "FastAPI"], "missing": []}
        score_res = calculate_match_score(
            skills_data=dummy_skills,
            resume_text=SAMPLE_RESUME_1,
            jd_text="Software engineer with Python and React experience in Bengaluru.",
            sections_detected=res["sections"],
            ats_score=90,
        )
        structure_score = score_res["sub_scores"]["structure_completeness"]
        self.assertGreaterEqual(structure_score, 85.0)
        self.assertIn("formula_text", score_res)
        self.assertIn("weighted_points", score_res)

        # 3. Check Indian phone detection
        contacts = extract_contact_info(SAMPLE_RESUME_1)
        self.assertEqual(contacts["phone"], "+91 98765 43210")
        self.assertEqual(contacts["email"], "aarav.sharma@gmail.com")

        # 4. Check education details
        edu = extract_education_details(SAMPLE_RESUME_1)
        self.assertEqual(edu["cgpa"], "8.6")
        self.assertIn("CBSE", edu["boards"])
        self.assertTrue(any("Smart India Hackathon" in ex for ex in edu["competitive_exams_or_hackathons"]))

    def test_sample_resume_2_structure_and_phone(self):
        res = detect_sections(SAMPLE_RESUME_2)
        present = res["present"]
        self.assertIn("Contact", present)
        self.assertIn("Summary", present)
        self.assertIn("Skills", present)
        self.assertIn("Experience", present)
        self.assertIn("Education", present)
        self.assertIn("Projects", present)
        self.assertIn("Certifications", present)

        score_res = calculate_match_score(
            skills_data={"matched": ["React", "AWS"], "missing": []},
            resume_text=SAMPLE_RESUME_2,
            jd_text="Full stack developer with Node.js and AWS experience in Pune.",
            sections_detected=res["sections"],
            ats_score=85,
        )
        self.assertGreaterEqual(score_res["sub_scores"]["structure_completeness"], 85.0)

        # Check phone format +91-9823456789
        contacts = extract_contact_info(SAMPLE_RESUME_2)
        self.assertEqual(contacts["phone"], "+91 98234 56789")
        self.assertIsNotNone(contacts["portfolio"])

    def test_sample_resume_3_business_analyst_structure(self):
        res = detect_sections(SAMPLE_RESUME_3)
        present = res["present"]
        self.assertIn("Contact", present)
        self.assertIn("Summary", present)
        self.assertIn("Skills", present)
        self.assertIn("Experience", present)
        self.assertIn("Education", present)
        self.assertIn("Certifications", present)
        self.assertIn("Activities", present)

        score_res = calculate_match_score(
            skills_data={"matched": ["Power BI", "Excel"], "missing": []},
            resume_text=SAMPLE_RESUME_3,
            jd_text="Data Analyst with Power BI and Tally experience in Gurugram.",
            sections_detected=res["sections"],
            ats_score=85,
        )
        self.assertGreaterEqual(score_res["sub_scores"]["structure_completeness"], 85.0)

        # Check phone format 09812345678
        contacts = extract_contact_info(SAMPLE_RESUME_3)
        self.assertEqual(contacts["phone"], "+91 98123 45678")

    def test_indian_ats_biodata_warning(self):
        biodata_text = """
        RAJESH KUMAR
        Permanent Address: House No 42, 3rd Cross, Indiranagar, Bengaluru - 560038
        Father's Name: Shri Ramesh Kumar
        Date of Birth: 15/08/1996 | Marital Status: Married
        Photo attached in top right corner.
        Experience: 2 years in customer support.
        """
        findings = detect_personal_biodata_fields(biodata_text)
        detected_fields = [f["field"] for f in findings]
        self.assertIn("Date of Birth", detected_fields)
        self.assertIn("Marital Status", detected_fields)
        self.assertIn("Father's/Guardian's Name", detected_fields)
        self.assertIn("Full Home Address", detected_fields)
        self.assertIn("Photo Reference", detected_fields)

        # In ATS compliance check, this triggers a warning
        ats_res = check_ats_compliance(
            resume_text=biodata_text,
            jd_text="Customer support executive in Bengaluru.",
            sections_detected={"contact": True},
            contact_info={"email": "rajesh@gmail.com", "phone": "+91 98765 43210"},
        )
        biodata_check = next((c for c in ats_res["checks"] if c["id"] == "biodata_check"), None)
        self.assertIsNotNone(biodata_check)
        self.assertEqual(biodata_check["status"], "warn")

    def test_indian_phone_formats_and_contact_channels(self):
        # Test case 1: +91 98765 43210
        text1 = "Rohit Kumar | Phone: +91 98765 43210 | rohit@tech.co.in | linkedin.com/in/rohit-k | github.com/rohitk"
        c1 = extract_contact_info(text1)
        self.assertEqual(c1["phone"], "+91 98765 43210")
        self.assertEqual(c1["email"], "rohit@tech.co.in")
        self.assertIn("rohit-k", c1["linkedin"])
        self.assertIn("rohitk", c1["github"])
        s1 = detect_sections(text1)
        self.assertIn("Contact", s1["present"])

        # Test case 2: +91-9876543210
        text2 = "Ananya Sen\nEmail: ananya.sen@outlook.com\nMobile: +91-9876543210\nLinkedIn: https://www.linkedin.com/in/ananya-sen\nGitHub: https://github.com/ananyasen"
        c2 = extract_contact_info(text2)
        self.assertEqual(c2["phone"], "+91 98765 43210")
        self.assertEqual(c2["email"], "ananya.sen@outlook.com")
        self.assertEqual(c2["linkedin"], "https://www.linkedin.com/in/ananya-sen")
        self.assertEqual(c2["github"], "https://github.com/ananyasen")
        s2 = detect_sections(text2)
        self.assertIn("Contact", s2["present"])

        # Test case 3: 9876543210
        text3 = "Vikram Reddy, 9876543210, vikram.reddy@gmail.com, github.com/vikramr"
        c3 = extract_contact_info(text3)
        self.assertEqual(c3["phone"], "+91 98765 43210")
        self.assertEqual(c3["email"], "vikram.reddy@gmail.com")
        self.assertIn("vikramr", c3["github"])
        s3 = detect_sections(text3)
        self.assertIn("Contact", s3["present"])

    def test_contact_section_detected_without_heading_when_email_and_phone_present(self):
        raw_resume = """
        SNEHA DESHMUKH
        sneha.deshmukh@gmail.com | +91 98765 43210 | linkedin.com/in/snehadeshmukh
        
        EXPERIENCE
        Junior Developer at TCS (2022-2024)
        
        EDUCATION
        B.Tech Computer Engineering - 8.9 CGPA
        """
        sections = detect_sections(raw_resume)
        # Verify Contact is considered present despite having no explicit 'Contact' header
        self.assertIn("Contact", sections["present"])
        self.assertTrue(sections["sections"]["contact"])
        self.assertTrue(sections["sections"]["Contact"])


if __name__ == "__main__":
    unittest.main()
