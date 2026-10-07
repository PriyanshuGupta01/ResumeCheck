"""LLM client for AI-powered resume enhancement and feedback.

Implements PRD F7 (AI Feedback) using Google Gemini API with fallback to basic mode.
"""

import json
import os
import re
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv

# Ensure .env is loaded
load_dotenv()

# Read environment variables
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-flash-latest")


def _clean_json_text(text: str) -> str:
    """Extract raw JSON text, stripping markdown code blocks if present."""
    text = text.strip()
    # Remove markdown code fences like ```json ... ``` or ``` ... ```
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    return text.strip()


def _format_skill_list(skills: Any) -> str:
    """Safely convert a list of skill strings or dictionaries into comma-separated text."""
    if not skills:
        return "None explicitly identified"
    items = []
    for s in skills[:25]:
        if isinstance(s, dict):
            name = s.get("name") or s.get("skill") or str(s)
            items.append(str(name))
        else:
            items.append(str(s))
    return ", ".join(items) if items else "None explicitly identified"


def _build_prompt(resume_text: str, job_description: str, matched_skills: Any, missing_skills: Any) -> str:
    """Construct structured prompt for LLM feedback."""
    formatted_matched = _format_skill_list(matched_skills)
    formatted_missing = _format_skill_list(missing_skills)

    return f"""You are an expert executive resume reviewer and hiring manager.
Analyze the provided resume against the target job description and return a strict JSON object.

CRITICAL RULES:
1. Return ONLY valid JSON. Do not wrap in commentary, markdown explanations, or preamble.
2. Ground all suggestions strictly in the candidate's actual experience. Do NOT fabricate or hallucinate qualifications.
3. Quantify bullet improvements using realistic placeholders like [X%] or [N] if exact figures are unstated.

Resume Text:
{resume_text[:4000]}

Target Job Description:
{job_description[:3000]}

Identified Matched Skills:
{formatted_matched}

Identified Missing Skills:
{formatted_missing}

Required Output Schema (Strict JSON):
{{
  "summary": "2-3 sentences providing an executive evaluation of alignment and candidacy.",
  "strengths": [
    "Specific candidate strength 1",
    "Specific candidate strength 2",
    "Specific candidate strength 3"
  ],
  "weaknesses": [
    "Specific candidate weakness or gap 1",
    "Specific candidate weakness or gap 2"
  ],
  "missing_keywords": [
    "Keyword 1",
    "Keyword 2",
    "Keyword 3"
  ],
  "improved_bullets": [
    {{
      "original": "Exact or summarized weak line from the resume",
      "improved": "Action-verb-led, high-impact rewrite with metric placeholder",
      "explanation": "Why this improved version appeals to recruiters"
    }}
  ],
  "tailored_summary": "A high-impact 40-60 word professional summary tailored directly for this job opportunity.",
  "interview_questions": [
    "Targeted behavioral or technical interview question 1",
    "Targeted interview question 2",
    "Targeted interview question 3",
    "Targeted interview question 4",
    "Targeted interview question 5"
  ]
}}
"""


def generate_ai_feedback(
    resume_text: str,
    job_description: str,
    matched_skills: Optional[List[Any]] = None,
    missing_skills: Optional[List[Any]] = None,
) -> Optional[Dict[str, Any]]:
    """Generate LLM-driven resume critique and recommendations.

    Returns parsed JSON dictionary if successful, or None if in basic mode / error.
    """
    try:
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        if not api_key:
            # Basic mode: API key not provided
            return None

        matched_skills = matched_skills or []
        missing_skills = missing_skills or []

        prompt = _build_prompt(resume_text, job_description, matched_skills, missing_skills)
        primary_model = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
        candidate_models = [primary_model, "gemini-3.5-flash", "gemini-flash-lite-latest", "gemini-flash-latest"]
        seen = set()
        models_to_try = [m for m in candidate_models if not (m in seen or seen.add(m))]

        import urllib.request
        for model_name in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.2,
                    },
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=20) as r:
                    res_data = json.loads(r.read().decode("utf-8"))
                    candidates = res_data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            raw_text = parts[0].get("text", "")
                            cleaned = _clean_json_text(raw_text)
                            parsed = json.loads(cleaned)
                            required_keys = ["summary", "strengths", "weaknesses", "missing_keywords", "improved_bullets"]
                            if all(k in parsed for k in required_keys):
                                return parsed
            except Exception as model_err:
                print(f"Model {model_name} invocation failed: {model_err}")
                continue

    except Exception as e:
        print(f"Gemini API invocation error: {e}")
        return None

    return None
