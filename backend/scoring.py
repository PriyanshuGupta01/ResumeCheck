"""Scoring engine and ATS analysis for ResumeCheck.

Implements weighted scoring (Skill match 50%, Text relevance 25%, Structure 15%, ATS quality 10%)
and comprehensive ATS compliance verification with Indian-market resume tips.
"""

import collections
import math
from pathlib import Path
import re
from typing import Any, Dict, List, Set

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_SKLEARN = True
except (ImportError, Exception):
    HAS_SKLEARN = False
    TfidfVectorizer = None
    cosine_similarity = None
from backend.sections import detect_personal_biodata_fields, extract_education_details

DATA_DIR = Path(__file__).resolve().parent / "data"
ACTION_VERBS_FILE = DATA_DIR / "action_verbs.txt"


def load_action_verbs() -> Set[str]:
    """Load list of standard resume action verbs."""
    if not ACTION_VERBS_FILE.exists():
        return {
            "achieved", "accelerated", "analyzed", "architected", "automated",
            "built", "championed", "created", "delivered", "deployed",
            "designed", "developed", "engineered", "enhanced", "established",
            "executed", "expanded", "generated", "guided", "implemented",
            "improved", "increased", "initiated", "integrated", "launched",
            "led", "managed", "maximized", "mentored", "migrated",
            "modernized", "monitored", "optimized", "orchestrated", "organized",
            "overhauled", "pioneered", "planned", "produced", "programmed",
            "reduced", "refactored", "resolved", "restructured", "revamped",
            "scaled", "secured", "simplified", "solved", "spearheaded",
            "standardized", "streamlined", "supervised", "tested", "transformed",
            "upgraded", "validated", "yielded"
        }
    with open(ACTION_VERBS_FILE, "r", encoding="utf-8") as f:
        return {line.strip().lower() for line in f if line.strip()}


ACTION_VERBS = load_action_verbs()


def compute_text_similarity(resume_text: str, jd_text: str) -> float:
    """Calculate TF-IDF cosine similarity between resume and job description (0-100)."""
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    if HAS_SKLEARN and TfidfVectorizer is not None:
        try:
            vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
            tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
            sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
            score = float(sim_matrix[0][0]) * 100.0
            return max(0.0, min(100.0, round(score, 1)))
        except Exception:
            pass

    # Pure-Python cosine similarity fallback (AppLocker-safe, zero DLL dependencies)
    try:
        words1 = re.findall(r"\b[a-zA-Z]{2,}\b", resume_text.lower())
        words2 = re.findall(r"\b[a-zA-Z]{2,}\b", jd_text.lower())
        stop_words = {
            "the", "and", "a", "an", "in", "to", "of", "for", "with", "on", "at",
            "from", "by", "is", "are", "was", "were", "be", "this", "that", "it",
            "as", "or", "our", "you", "your", "we", "will", "all", "can"
        }
        w1 = [w for w in words1 if w not in stop_words]
        w2 = [w for w in words2 if w not in stop_words]
        if not w1 or not w2:
            return 0.0
        c1 = collections.Counter(w1)
        c2 = collections.Counter(w2)
        common = set(c1.keys()) & set(c2.keys())
        if not common:
            return 0.0
        dot = sum(c1[w] * c2[w] for w in common)
        mag1 = math.sqrt(sum(v * v for v in c1.values()))
        mag2 = math.sqrt(sum(v * v for v in c2.values()))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return max(0.0, min(100.0, round((dot / (mag1 * mag2)) * 100.0, 1)))
    except Exception:
        return 0.0


def extract_bullet_points(text: str) -> List[str]:
    """Extract individual bullet points or line items from resume text."""
    lines = text.splitlines()
    bullets = []
    bullet_prefixes = ("•", "-", "*", "–", "—", "▪", "►", "✓", "o ")

    for line in lines:
        cleaned = line.strip()
        if not cleaned:
            continue
        if any(cleaned.startswith(p) for p in bullet_prefixes):
            stripped = re.sub(r"^[\s•\-*–—▪►✓o]+\s*", "", cleaned)
            if stripped:
                bullets.append(stripped)
        elif len(cleaned) > 20 and len(cleaned.split()) >= 4:
            bullets.append(cleaned)

    return bullets


def check_ats_compliance(
    resume_text: str,
    jd_text: str,
    sections_detected: Any,
    contact_info: Dict[str, Any],
    years_experience: float = 0.0,
) -> Dict[str, Any]:
    """Run comprehensive ATS friendliness and structure checks with Indian localization."""
    checks = []
    total_checks = 8  # 8 standard ATS criteria
    passed_count = 0

    # Normalize sections_detected to a set of lowercased section names
    if isinstance(sections_detected, dict):
        present_set = {k.lower() for k, v in sections_detected.items() if v}
    elif isinstance(sections_detected, (list, set)):
        present_set = {str(s).lower() for s in sections_detected}
    else:
        present_set = set()

    # 1. Section Headings Check
    essential_sections = ["contact", "experience", "education", "skills"]
    missing_essential = [
        s.capitalize() for s in essential_sections if s not in present_set
    ]
    if not missing_essential:
        passed_count += 1
        checks.append({
            "id": "section_headings",
            "name": "Standard Section Headings",
            "status": "pass",
            "message": "All essential sections (Contact, Experience/Internships, Education, Skills) are clearly recognized.",
            "impact": "High",
        })
    else:
        checks.append({
            "id": "section_headings",
            "name": "Standard Section Headings",
            "status": "warn",
            "message": f"Missing recommended headings: {', '.join(missing_essential)}. Using standard headings ensures ATS parsers index your details correctly.",
            "impact": "High",
        })

    # 2. Contact Information Check
    has_email = bool(contact_info.get("email"))
    has_phone = bool(contact_info.get("phone"))
    has_linkedin = bool(contact_info.get("linkedin"))
    has_github = bool(contact_info.get("github"))
    has_portfolio = bool(contact_info.get("portfolio"))

    if has_email and has_phone:
        passed_count += 1
        socials = []
        if has_linkedin: socials.append("LinkedIn")
        if has_github: socials.append("GitHub")
        if has_portfolio: socials.append("Portfolio")
        social_note = f" with {', '.join(socials)}" if socials else ""
        checks.append({
            "id": "contact_info",
            "name": "Contact Information",
            "status": "pass",
            "message": f"Professional contact details verified: Phone ({contact_info['phone']}) and Email{social_note}.",
            "impact": "High",
        })
    else:
        missing_contacts = []
        if not has_email: missing_contacts.append("Email")
        if not has_phone: missing_contacts.append("Mobile Number")
        checks.append({
            "id": "contact_info",
            "name": "Contact Information",
            "status": "warn",
            "message": f"Incomplete contact details: missing {', '.join(missing_contacts)}. Include a valid 10-digit mobile number and email at the top.",
            "impact": "High",
        })

    # 3. Action Verbs Check
    bullets = extract_bullet_points(resume_text)
    action_verb_count = 0
    for bullet in bullets:
        first_few_words = bullet.split()[:3]
        for word in first_few_words:
            cleaned_word = re.sub(r"[^a-zA-Z]", "", word).lower()
            if cleaned_word in ACTION_VERBS:
                action_verb_count += 1
                break

    action_verb_ratio = action_verb_count / max(1, len(bullets))
    if action_verb_count >= 3 or action_verb_ratio >= 0.4:
        passed_count += 1
        checks.append({
            "id": "action_verbs",
            "name": "Strong Action Verbs",
            "status": "pass",
            "message": f"Found {action_verb_count} bullet points starting with strong action verbs (e.g. Built, Architected, Optimized).",
            "impact": "Medium",
        })
    else:
        checks.append({
            "id": "action_verbs",
            "name": "Strong Action Verbs",
            "status": "warn",
            "message": f"Only {action_verb_count} bullets use strong action verbs. Begin experience bullets with active verbs rather than passive duties.",
            "impact": "Medium",
        })

    # 4. Quantified Metrics Check (Includes CGPA, Percentages, and Financial/User Metrics)
    edu_details = extract_education_details(resume_text)
    metric_pattern = re.compile(
        r"(?:[\$€£₹]|Rs\.?|INR)?\s*\d+(?:\.\d+)?\s*(?:%|k|m|b|lpa|cr|lakh|crore|users|x|pts|points|cgpa|hours?|mins?|days?)?\b",
        re.IGNORECASE,
    )
    metric_matches = metric_pattern.findall(resume_text)
    # Check if education has CGPA or percentage
    has_academic_metrics = bool(edu_details.get("cgpa") or edu_details.get("percentage"))
    metric_count = len([m for m in metric_matches if re.search(r"\d", m)])

    if metric_count >= 3 or (metric_count >= 1 and has_academic_metrics):
        passed_count += 1
        metric_note = f" (including academic CGPA/percentage: {edu_details.get('cgpa_or_percentage')})" if has_academic_metrics else ""
        checks.append({
            "id": "quantified_metrics",
            "name": "Quantified Achievements & Metrics",
            "status": "pass",
            "message": f"Resume effectively demonstrates impact with measurable numbers and performance data{metric_note}.",
            "impact": "Medium",
        })
    else:
        checks.append({
            "id": "quantified_metrics",
            "name": "Quantified Achievements & Metrics",
            "status": "warn",
            "message": "Few measurable numbers found. Quantify your achievements (e.g. 'reduced latency by 35%', 'processed 2M records', or list CGPA/marks).",
            "impact": "Medium",
        })

    # 5. Word Count & Length Check
    words = resume_text.split()
    word_count = len(words)

    # Detect years of experience (defaults to 3 if unspecified)
    exp_matches = re.findall(r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)", resume_text, re.IGNORECASE)
    years_exp = float(exp_matches[0]) if exp_matches else 3.0
    est_pages = max(1, round(word_count / 420))

    if est_pages > 2 and years_exp < 8:
        checks.append({
            "id": "word_count",
            "name": "Document Length & Page Count",
            "status": "warn",
            "message": f"Resume appears to exceed 2 pages (~{est_pages} pages, {word_count} words). For candidates with under 8 years of experience, keeping your resume to 1-2 pages ensures recruiters and ATS focus on your most relevant achievements.",
            "impact": "Medium",
        })
    elif 300 <= word_count <= 1100:
        passed_count += 1
        checks.append({
            "id": "word_count",
            "name": "Document Length & Page Count",
            "status": "pass",
            "message": f"Optimal length: {word_count} words (~{est_pages} page{'s' if est_pages > 1 else ''}) fits neatly into the ideal 1-to-2 page industry standard.",
            "impact": "Low",
        })
    elif word_count < 300:
        checks.append({
            "id": "word_count",
            "name": "Document Length & Page Count",
            "status": "warn",
            "message": f"Resume is brief ({word_count} words). Expand on project details, technologies used, and responsibilities.",
            "impact": "Low",
        })
    else:
        checks.append({
            "id": "word_count",
            "name": "Document Length & Page Count",
            "status": "warn",
            "message": f"Resume is lengthy ({word_count} words, ~{est_pages} pages). Aim for under 1,000 words (1-2 pages) to ensure recruiters can scan it in 30 seconds.",
            "impact": "Low",
        })

    # 6. Paragraph Length Check
    long_paragraphs = [b for b in bullets if len(b.split()) > 60]
    if not long_paragraphs:
        passed_count += 1
        checks.append({
            "id": "paragraph_length",
            "name": "Paragraph Readability",
            "status": "pass",
            "message": "All bullet points and descriptions are concise (under 60 words each), ensuring fast human and ATS reading.",
            "impact": "Low",
        })
    else:
        checks.append({
            "id": "paragraph_length",
            "name": "Paragraph Readability",
            "status": "warn",
            "message": f"Found {len(long_paragraphs)} lengthy bullet points (>60 words). Split complex duties into shorter, punchy points.",
            "impact": "Low",
        })

    # 7. Indian Biodata / Privacy Fields Check (Crucial for fair screening & ATS)
    biodata_fields = detect_personal_biodata_fields(resume_text)
    if not biodata_fields:
        passed_count += 1
        checks.append({
            "id": "biodata_check",
            "name": "Fair Screening & Anti-Bias Formatting",
            "status": "pass",
            "message": "Clean modern format: no personal biodata fields (photo, date of birth, marital status, or father's name) detected.",
            "impact": "Medium",
        })
    else:
        detected_names = [b["field"] for b in biodata_fields]
        checks.append({
            "id": "biodata_check",
            "name": "Personal Biodata / Fair Screening",
            "status": "warn",
            "message": f"Detected personal biodata fields: {', '.join(detected_names)}. Modern Indian and global tech ATS recommend omitting photos, marital status, DOB, and father's name for objective, bias-free evaluation.",
            "impact": "Medium",
        })

    # 8. Target Keyword Coverage Check
    jd_words = re.findall(r"\b[a-zA-Z]{3,}\b", jd_text.lower())
    stop_words = {
        "and", "the", "for", "with", "that", "this", "from", "have", "will",
        "are", "you", "your", "our", "work", "team", "role", "must", "years",
        "experience", "skills", "ability", "strong", "knowledge", "working"
    }
    unique_jd_words = set(jd_words) - stop_words
    resume_lower = resume_text.lower()

    if unique_jd_words:
        matched_kw = [w for w in unique_jd_words if re.search(r"\b" + re.escape(w) + r"\b", resume_lower)]
        coverage_pct = round((len(matched_kw) / len(unique_jd_words)) * 100, 1)
    else:
        coverage_pct = 100.0

    if coverage_pct >= 40.0:
        passed_count += 1
        checks.append({
            "id": "keyword_coverage",
            "name": "Target Keyword Coverage",
            "status": "pass",
            "message": f"Strong vocabulary alignment: {coverage_pct}% of core target job keywords found throughout the resume.",
            "impact": "High",
        })
    else:
        checks.append({
            "id": "keyword_coverage",
            "name": "Target Keyword Coverage",
            "status": "warn",
            "message": f"Moderate keyword coverage ({coverage_pct}%). Incorporate more direct terminology from the target job posting.",
            "impact": "High",
        })

    ats_score = round((passed_count / total_checks) * 100)

    return {
        "score": ats_score,
        "passed_count": passed_count,
        "total_checks": total_checks,
        "keyword_coverage_pct": coverage_pct if unique_jd_words else 100,
        "checks": checks,
    }


def calculate_match_score(
    skills_data: Dict[str, Any],
    resume_text: str,
    jd_text: str,
    sections_detected: Any,
    ats_score: float,
) -> Dict[str, Any]:
    """Calculate overall match score and 4 sub-scores with single source of truth formula.

    Weights:
    - Skill match: 50%
    - Text relevance: 25%
    - Structure: 15%
    - ATS quality: 10%
    """
    # 1. Skill Match Sub-score (50%)
    stats = skills_data.get("stats", {})
    matched_list = skills_data.get("matched", [])
    missing_list = skills_data.get("missing", [])

    matched_skills_count = stats.get("matched_count") if stats.get("matched_count") is not None else skills_data.get("matched_count", len(matched_list))
    total_required = stats.get("total_required") if stats.get("total_required") is not None else skills_data.get("job_skills_count", len(matched_list) + len(missing_list))
    confidence = skills_data.get("confidence", stats.get("confidence", 1.0))

    if total_required > 0:
        base_skill_score = min(100.0, (matched_skills_count / total_required) * 100.0)
        skill_score = round(base_skill_score * confidence, 1)
    else:
        skill_score = 70.0

    # 2. Text Relevance Sub-score (25%)
    text_sim_score = compute_text_similarity(resume_text, jd_text)

    # 3. Structure Sub-score (15%)
    # Standard sections: Contact, Summary/Objective, Skills, Experience/Internships, Education, Projects, Certifications
    if isinstance(sections_detected, dict):
        detected_set = {k.lower() for k, v in sections_detected.items() if v}
    elif isinstance(sections_detected, (list, set)):
        detected_set = {str(s).lower() for s in sections_detected}
    else:
        detected_set = set()

    core_sections = ["contact", "summary", "skills", "experience", "education", "projects", "certifications"]
    present_sections = [s for s in core_sections if s in detected_set]

    # Standard resumes typically contain 5 to 6 of these 7 sections
    structure_score = min(100.0, (len(present_sections) / len(core_sections)) * 100.0)

    # 4. ATS Quality Sub-score (10%)
    ats_subscore = float(ats_score)

    # Calculate weighted points accurately
    skill_points = round(0.50 * skill_score, 1)
    text_points = round(0.25 * text_sim_score, 1)
    structure_points = round(0.15 * structure_score, 1)
    ats_points = round(0.10 * ats_subscore, 1)

    overall_score = round(skill_points + text_points + structure_points + ats_points)
    overall_score = max(0, min(100, overall_score))

    # Plain text formula for transparent display across frontend and PDF
    formula_text = (
        f"Overall {overall_score} = 50% x {round(skill_score, 1)} + "
        f"25% x {round(text_sim_score, 1)} + "
        f"15% x {round(structure_score, 1)} + "
        f"10% x {round(ats_subscore, 1)}"
    )

    # Score Category Label
    if overall_score >= 85:
        label = "Excellent"
        summary = "Your resume matches the target job description exceptionally well."
    elif overall_score >= 70:
        label = "Good"
        summary = "Strong alignment with the core requirements. Minor enhancements will maximize ATS ranking."
    elif overall_score >= 40:
        label = "Fair"
        summary = "Moderate fit. Bridging missing technical keywords and tuning bullet points will substantially improve your rating."
    else:
        label = "Weak"
        summary = "Low requirement alignment. Key skills and role-specific competencies are currently missing."

    return {
        "overall_score": overall_score,
        "label": label,
        "summary": summary,
        "sub_scores": {
            "skill_match": round(skill_score, 1),
            "text_similarity": round(text_sim_score, 1),
            "structure_completeness": round(structure_score, 1),
            "ats_quality": round(ats_subscore, 1),
        },
        "weights": {
            "skill_match": 50,
            "text_similarity": 25,
            "structure_completeness": 15,
            "ats_quality": 10,
        },
        "weighted_points": {
            "skill_match": skill_points,
            "text_similarity": text_points,
            "structure_completeness": structure_points,
            "ats_quality": ats_points,
        },
        "max_points": {
            "skill_match": 50.0,
            "text_similarity": 25.0,
            "structure_completeness": 15.0,
            "ats_quality": 10.0,
        },
        "formula_text": formula_text,
    }
