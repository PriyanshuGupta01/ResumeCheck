"""Skill extraction and gap analysis engine.

Loads a 200+ skill dictionary with aliases and performs case-insensitive,
word-boundary matching to identify matched, missing, and extra skills.
"""

import json
from pathlib import Path
import re
from typing import Dict, List, Set, Any, Tuple, Optional

# Path to skills dictionary
DATA_DIR = Path(__file__).resolve().parent / "data"
SKILLS_FILE = DATA_DIR / "skills.json"


class SkillsEngine:
    """Manages skill dictionary loading, regex extraction, and role detection."""

    def __init__(self, skills_path: Path = SKILLS_FILE):
        self.skills_path = skills_path
        self.skills_data: List[Dict[str, Any]] = []
        self.compiled_skills: List[Tuple[Dict[str, Any], List[re.Pattern]]] = []
        self.compiled_roles: List[Tuple[Dict[str, Any], List[re.Pattern]]] = []
        self._load_skills()

    def _load_skills(self) -> None:
        """Load and precompile skill match regex patterns, separating roles from skills."""
        if not self.skills_path.exists():
            raise FileNotFoundError(f"Skills dictionary not found at {self.skills_path}")

        with open(self.skills_path, "r", encoding="utf-8") as f:
            self.skills_data = json.load(f)

        self.compiled_skills = []
        self.compiled_roles = []

        for item in self.skills_data:
            patterns = []
            name = item["name"]
            aliases = item.get("aliases", [])
            all_terms = [name] + aliases

            for term in all_terms:
                escaped = re.escape(term.strip())
                # Use negative lookbehind and lookahead to support terms like C++, C#, .NET
                pattern_str = rf"(?<![a-zA-Z0-9_]){escaped}(?![a-zA-Z0-9_])"
                patterns.append(re.compile(pattern_str, re.IGNORECASE))

            item_type = item.get("type", "skill")
            if item_type == "role" or item.get("category") == "Professional Roles":
                self.compiled_roles.append((item, patterns))
            else:
                self.compiled_skills.append((item, patterns))

    def extract_skills(self, text: str) -> List[Dict[str, str]]:
        """Extract all known skills found within the given text (roles are excluded).

        Args:
            text: Resume or job description plain text.

        Returns:
            List of detected skill objects with name and category.
        """
        if not text:
            return []

        found_skills = []
        for skill, patterns in self.compiled_skills:
            for pattern in patterns:
                if pattern.search(text):
                    found_skills.append({
                        "name": skill["name"],
                        "category": skill["category"]
                    })
                    break

        return found_skills

    def detect_role(self, text: str) -> Optional[str]:
        """Detect professional role title in job description or resume text.

        Args:
            text: Resume or job description plain text.

        Returns:
            Role name if matched, else None.
        """
        if not text:
            return None

        for role, patterns in self.compiled_roles:
            for pattern in patterns:
                if pattern.search(text):
                    return role["name"]
        return None

    def analyze_gap(self, resume_text: str, job_text: str) -> Dict[str, Any]:
        """Compare resume skills against job description requirements.

        Args:
            resume_text: Text extracted from resume.
            job_text: Target job description text.

        Returns:
            Dict containing matched, missing, and extra skill lists, plus match stats.
        """
        resume_skills_list = self.extract_skills(resume_text)
        job_skills_list = self.extract_skills(job_text)

        resume_skills_dict = {s["name"]: s for s in resume_skills_list}
        job_skills_dict = {s["name"]: s for s in job_skills_list}

        matched_names = set(resume_skills_dict.keys()) & set(job_skills_dict.keys())
        missing_names = set(job_skills_dict.keys()) - set(resume_skills_dict.keys())
        extra_names = set(resume_skills_dict.keys()) - set(job_skills_dict.keys())

        matched = [job_skills_dict[name] for name in sorted(matched_names)]
        missing = [job_skills_dict[name] for name in sorted(missing_names)]
        extra = [resume_skills_dict[name] for name in sorted(extra_names)]

        total_required = len(matched) + len(missing)
        match_rate = round((len(matched) / total_required * 100), 1) if total_required > 0 else 0.0

        # Warning and confidence discount if fewer than 5 skills in JD
        warning = None
        confidence = 1.0
        if total_required < 5:
            warning = f"We only found {total_required} skills in this job description. Paste the full posting for a better result."
            confidence = max(0.4, round(total_required / 5.0, 2))

        detected_role = self.detect_role(job_text) or self.detect_role(resume_text)

        return {
            "matched": matched,
            "missing": missing,
            "extra": extra,
            "warning": warning,
            "confidence": confidence,
            "detected_role": detected_role,
            "stats": {
                "matched_count": len(matched),
                "missing_count": len(missing),
                "extra_count": len(extra),
                "total_required": total_required,
                "match_rate": match_rate,
                "warning": warning,
                "confidence": confidence,
            }
        }


# Singleton engine instance for reusable access
skills_engine = SkillsEngine()
