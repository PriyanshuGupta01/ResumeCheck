"""Resume section headings, contact details, and Indian education detector.

Detects standard and Indian-market resume sections (Contact, Summary, Skills, Experience,
Projects, Education, Certifications, Achievements, Activities, Declaration),
extracts contact metadata (including Indian mobile numbers and portfolios),
and identifies degrees, CGPA/percentages, and personal biodata fields.
"""

import re
from typing import Dict, List, Optional, Any, Set

# Comprehensive resume section definitions with Indian and international variations
SECTION_PATTERNS: Dict[str, List[str]] = {
    "Contact": [
        r"contact(\s+(information|details|info))?",
        r"personal\s+(details|information|info|profile)",
        r"contact\s+me",
    ],
    "Summary": [
        r"(career\s+)?objective",
        r"(professional\s+|executive\s+)?summary(\s+of\s+qualifications)?",
        r"career\s+summary",
        r"professional\s+profile",
        r"profile\s+summary",
        r"about\s+me",
        r"overview",
        r"profile",
    ],
    "Skills": [
        r"(technical\s+|key\s+|core\s+)?skills(\s*(&|and)\s*(abilities|tools|competencies))?",
        r"core\s+competencies",
        r"technologies(\s*(&|and)\s*tools)?",
        r"tools\s*(&|and)\s*technologies",
        r"expertise",
        r"areas\s+of\s+expertise",
        r"skillset",
        r"technical\s+proficiencies",
        r"technical\s+expertise",
    ],
    "Experience": [
        r"(work|professional|employment)\s+experience",
        r"experience",
        r"employment\s+history",
        r"work\s+history",
        r"career\s+history",
        r"internships?",
        r"industrial\s+training",
        r"practical\s+experience",
    ],
    "Projects": [
        r"(personal|technical|academic|key|notable)?\s*projects?",
        r"project\s+(work|experience|details)",
        r"portfolio",
        r"academic\s+projects",
        r"capstone\s+projects?",
    ],
    "Education": [
        r"education(al\s+(background|qualifications?|details?))?",
        r"academic\s+(details?|qualifications?|background|record|profile)",
        r"academics",
        r"degrees?",
        r"educational?\s+credentials?",
        r"qualifications?",
        r"university\s+education",
    ],
    "Certifications": [
        r"certifications?",
        r"certificates?",
        r"licenses?(\s*(&|and)\s*certifications?)?",
        r"professional\s+(development|certifications?|training)",
        r"courses(\s*(&|and)\s*certifications?)?",
        r"trainings?(\s*(&|and)\s*certifications?)?",
    ],
    "Achievements": [
        r"(key\s+|academic\s+)?achievements?",
        r"honors?(\s*(&|and)\s*awards?)?",
        r"awards?(\s*(&|and)\s*honors?)?",
        r"accomplishments?",
        r"extracurricular\s+achievements?",
    ],
    "Activities": [
        r"extra[\s-]curricular\s+activities",
        r"co[\s-]curricular\s+activities",
        r"activities",
        r"leadership(\s*(&|and)\s*activities)?",
        r"volunteer(ing|\s+experience|\s+work)?",
    ],
    "Declaration": [
        r"declaration",
        r"personal\s+declaration",
    ],
}

# Regex patterns for contact information
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,12}\b"
)

# Indian mobile numbers: 10 digits starting with 6, 7, 8, or 9
# Supports: +91 98765 43210, +91-9876543210, 09876543210, 98765 43210, 9876543210, (+91) 98765 43210, +91-98765-43210
INDIAN_PHONE_PATTERNS = [
    re.compile(r"(?:\+91[\-\s\.]?|0)?([6-9]\d{4})[\-\s\.]?(\d{5})\b"),
    re.compile(r"\(\+91\)[\-\s\.]?([6-9]\d{4})[\-\s\.]?(\d{5})\b"),
    re.compile(r"\b([6-9]\d{9})\b"),
]

# Fallback generic international phone regex
GENERIC_PHONE_REGEX = re.compile(
    r"(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4})"
)

LINKEDIN_REGEX = re.compile(
    r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/([a-zA-Z0-9_\-\/%]+)",
    re.IGNORECASE,
)

GITHUB_REGEX = re.compile(
    r"(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\/]+)",
    re.IGNORECASE,
)

PORTFOLIO_REGEX = re.compile(
    r"\bhttps?:\/\/(?!www\.linkedin\.com|www\.github\.com|linkedin\.com|github\.com)[a-zA-Z0-9.\-_]+(?:\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?\b",
    re.IGNORECASE,
)

# Indian Education Degrees & Boards
INDIAN_DEGREES = [
    "b.tech", "btech", "b.e", "be", "bca", "b.sc", "bsc", "b.com", "bcom", "bba",
    "m.tech", "mtech", "mca", "m.sc", "msc", "m.com", "mcom", "mba", "diploma",
    "ph.d", "phd", "higher secondary", "senior secondary", "hsc", "ssc", "10th", "12th"
]

INDIAN_EXAMS_COMPETITIONS = [
    "jee", "jee mains", "jee advanced", "gate", "nptel", "smart india hackathon",
    "sih", "cat", "gre", "gmat"
]


def detect_sections(text: str) -> Dict[str, Any]:
    """Detect presence of standard resume sections with support for Indian variations.

    Handles colons, case differences, all-caps headings, markdown markers, and underlines.
    Returns both 'present'/'missing' lists and a case-insensitive 'sections' dictionary
    so downstream scoring engines never miss a section.
    """
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    present_sections: Set[str] = set()

    for line in lines:
        # Check headings: usually short lines under 60 characters
        if len(line) <= 60:
            # Clean leading/trailing markdown characters, bullets, dashes, colons
            cleaned = line.strip("#*:-> \t_~|=").rstrip(":").strip().lower()
            if not cleaned:
                continue

            for section_name, patterns in SECTION_PATTERNS.items():
                if section_name in present_sections:
                    continue
                for pattern in patterns:
                    regex = rf"^{pattern}$"
                    if re.match(regex, cleaned, re.IGNORECASE):
                        present_sections.add(section_name)
                        break

    # If contact header wasn't an explicit heading, but email or phone is found,
    # count contact details as present
    contact_info = extract_contact_info(text)
    if contact_info.get("email") or contact_info.get("phone"):
        present_sections.add("Contact")

    # If Education wasn't caught as an explicit heading, check if degrees or institutions appear
    if "Education" not in present_sections:
        edu_details = extract_education_details(text)
        if edu_details.get("degrees") or edu_details.get("cgpa_or_percentage"):
            present_sections.add("Education")

    # If Skills wasn't caught as an explicit heading, check for skill lines
    if "Skills" not in present_sections:
        for line in lines:
            lower_line = line.lower()
            if any(lower_line.startswith(prefix) for prefix in [
                "languages:", "programming:", "developer tools:", "frameworks:", "technologies:"
            ]):
                present_sections.add("Skills")
                break

    all_sections = list(SECTION_PATTERNS.keys())
    present_list = [s for s in all_sections if s in present_sections]
    missing_list = [s for s in all_sections if s not in present_sections]

    # Map both lowercase and capitalized keys into the sections dictionary
    # so scoring.py and ats checks never fail regardless of key casing
    sections_dict = {}
    for s in all_sections:
        is_present = s in present_sections
        sections_dict[s] = is_present
        sections_dict[s.lower()] = is_present

    return {
        "sections": sections_dict,
        "present": present_list,
        "missing": missing_list,
        "present_count": len(present_list),
        "total_count": len(all_sections),
        "education_details": extract_education_details(text),
    }


def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract email, Indian phone number, LinkedIn, GitHub, and portfolio links."""
    # 1. Find email
    email_match = EMAIL_REGEX.search(text)
    email = email_match.group(0) if email_match else None

    # 2. Find phone: prioritize Indian mobile numbers (10 digits starting with 6-9)
    phone = None
    for pattern in INDIAN_PHONE_PATTERNS:
        match = pattern.search(text)
        if match:
            # Extract all digits
            candidate = match.group(0).strip()
            digits = re.sub(r"\D", "", candidate)
            if len(digits) == 10 and digits[0] in "6789":
                phone = f"+91 {digits[:5]} {digits[5:]}"
                break
            elif len(digits) == 12 and digits.startswith("91") and digits[2] in "6789":
                phone = f"+91 {digits[2:7]} {digits[7:]}"
                break
            elif len(digits) == 11 and digits.startswith("0") and digits[1] in "6789":
                phone = f"+91 {digits[1:6]} {digits[6:]}"
                break
            elif len(digits) >= 10:
                phone = candidate
                break

    if not phone:
        # Fallback to general phone match
        for match in GENERIC_PHONE_REGEX.finditer(text):
            candidate = match.group(0).strip()
            digits = re.sub(r"\D", "", candidate)
            if 7 <= len(digits) <= 15:
                phone = candidate
                break

    # 3. Find LinkedIn
    linkedin_match = LINKEDIN_REGEX.search(text)
    linkedin = None
    if linkedin_match:
        full_match = linkedin_match.group(0)
        linkedin = full_match if full_match.startswith("http") else f"https://{full_match}"

    # 4. Find GitHub
    github_match = GITHUB_REGEX.search(text)
    github = None
    if github_match:
        full_match = github_match.group(0)
        github = full_match if full_match.startswith("http") else f"https://{full_match}"

    # 5. Find Portfolio Link
    portfolio_match = PORTFOLIO_REGEX.search(text)
    portfolio = None
    if portfolio_match:
        portfolio = portfolio_match.group(0)

    return {
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "portfolio": portfolio,
    }


def extract_education_details(text: str) -> Dict[str, Any]:
    """Detect Indian degrees, CGPA/percentage, board results, and hackathons/exams."""
    text_lower = text.lower()

    # Detect degrees
    degrees_found = []
    for deg in INDIAN_DEGREES:
        pattern = rf"\b{re.escape(deg)}\b"
        if re.search(pattern, text_lower):
            degrees_found.append(deg.upper() if len(deg) <= 5 else deg.title())

    # Detect CGPA (e.g. 8.4/10, 8.4 CGPA, CGPA: 9.1)
    cgpa_matches = re.findall(r"\b(?:cgpa[:\s]*)?([6-9]\.[0-9]{1,2})(?:\s*\/\s*10)?(?:\s*cgpa)?\b", text_lower)
    cgpa = cgpa_matches[0] if cgpa_matches else None

    # Detect Percentage (e.g. 85%, 92.4%)
    pct_matches = re.findall(r"\b([5-9][0-9](?:\.[0-9]{1,2})?)\s*%", text_lower)
    percentage = f"{pct_matches[0]}%" if pct_matches else None

    # Detect Boards (CBSE, ICSE, State Board)
    boards = []
    if "cbse" in text_lower:
        boards.append("CBSE")
    if "icse" in text_lower or "isc" in text_lower:
        boards.append("ICSE")
    if re.search(r"\b(state\s+board|msbshse|kseeb|up\s+board|rbse|bseb)\b", text_lower):
        boards.append("State Board")

    # Detect competitive exams / hackathons
    exams = []
    for ex in INDIAN_EXAMS_COMPETITIONS:
        if re.search(rf"\b{re.escape(ex)}\b", text_lower):
            exams.append(ex.upper() if len(ex) <= 4 else ex.title())

    return {
        "degrees": list(set(degrees_found)),
        "cgpa": cgpa,
        "percentage": percentage,
        "cgpa_or_percentage": cgpa or percentage,
        "boards": boards,
        "competitive_exams_or_hackathons": list(set(exams)),
    }


def detect_personal_biodata_fields(text: str) -> List[Dict[str, str]]:
    """Detect traditional biodata fields that ATS and modern recruiters advise omitting."""
    text_lower = text.lower()
    findings = []

    # 1. Date of Birth
    if re.search(r"\b(date\s+of\s+birth|dob|d\.o\.b\.)\b", text_lower):
        findings.append({
            "field": "Date of Birth",
            "reason": "Omitting birth dates prevents age bias and saves valuable resume space."
        })

    # 2. Marital Status
    if re.search(r"\b(marital\s+status|unmarried|married)\b", text_lower):
        findings.append({
            "field": "Marital Status",
            "reason": "Marital status is irrelevant for merit-based professional hiring."
        })

    # 3. Father's / Mother's Name
    if re.search(r"\b(father'?s?\s+name|mother'?s?\s+name)\b", text_lower):
        findings.append({
            "field": "Father's/Guardian's Name",
            "reason": "Parental details are common in traditional matrimonial biodatas but obsolete on modern corporate resumes."
        })

    # 4. Full Residential Address
    if re.search(r"\b(permanent\s+address|residential\s+address|h\.no|house\s+no|street\s+address)\b", text_lower):
        findings.append({
            "field": "Full Home Address",
            "reason": "Listing City and State (e.g. 'Bengaluru, India') is sufficient. Full street address poses privacy risks."
        })

    # 5. Photograph reference
    if re.search(r"\b(photograph|passport\s+size\s+photo|photo\s+attached)\b", text_lower):
        findings.append({
            "field": "Photo Reference",
            "reason": "Standard ATS scanners cannot parse graphic photos, and US/EU/multinational employers request photo-free resumes."
        })

    return findings
