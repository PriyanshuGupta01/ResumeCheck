# ResumeCheck — AI Resume Analyzer

An end-to-end web application that evaluates job resumes against target job postings. It provides weighted match scoring (0–100), skill gap analysis, ATS formatting verification, actionable AI-powered bullet rewrites, downloadable PDF reports, and optional user accounts with zero resume storage.

---

## Current Status: Production Ready with Optional Accounts

All core milestones and optional user account capabilities are fully implemented and verified:

1. **Backend Core**:
   - In-memory PDF (`pdfplumber`) & Word DOCX (`python-docx`) parsing up to 5 MB with validation for scanned/empty/encrypted files.
   - Standard section detection (Contact, Summary, Skills, Experience, Projects, Education, Certifications) and contact extraction (email, phone, LinkedIn, GitHub).
   - Skill extraction and gap analysis with a comprehensive catalog of 200+ skills and alias normalization.
2. **Scoring & ATS Engine**:
   - Weighted match score (50% skills, 25% TF-IDF cosine similarity, 15% structure completeness, 10% ATS quality).
   - ATS compliance checking: section headings, word count (300–1200 words), contact info, long paragraphs (>60 words), action verbs, quantified metrics, and keyword coverage.
3. **AI Feedback (Dual-Mode)**:
   - Google Gemini API integration producing executive summaries, strengths/weaknesses, keyword suggestions, tailored summaries, and bullet rewrites.
   - Dual-mode architecture: runs in **Basic Mode** without an API key and seamlessly activates **AI Mode** when `GEMINI_API_KEY` is provided.
4. **Optional User Accounts & Saved Analyses**:
   - SQLite persistent storage (`backend/data/resumecheck.db`) for user accounts and saved analysis summaries.
   - Passwords hashed with salted bcrypt; tamper-proof HMAC-SHA256 session cookies; in-memory sliding window rate limiting.
   - **Strict Privacy Guarantee**: Resumes and raw resume text are NEVER stored on disk or in the database. Core analysis works 100% without logging in.
5. **Modern Animated Frontend**:
   - Responsive multi-page UI: Home (with animated hero illustration and SVG scanning beam), Analyze, Results, My Analyses dashboard, and About/Privacy.
   - Navbar with dynamic session state: Sign in/Sign up buttons for guests, email initial avatar with dropdown menu for logged-in users.
   - Framer Motion animations with full `prefers-reduced-motion` accessibility support.
   - Downloadable PDF report generation powered by `fpdf2`.
6. **Tests & Production Build**:
   - 16 automated unit tests covering API endpoints, authentication flows, database CRUD, privacy verification, scoring formulas, ATS checks, and skill extractions.
   - Pre-built production SPA served directly from FastAPI at `http://localhost:8000`.

---

## Project Structure

```
p:/IT Project/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI server, endpoints, CORS, static SPA serving
│   ├── auth.py              # Bcrypt hashing, signed session cookies, rate limiting
│   ├── database.py          # SQLite database schema, user accounts & saved analyses
│   ├── parser.py            # In-memory PDF and DOCX text extraction
│   ├── sections.py          # Resume section detection & contact info parsing
│   ├── skills.py            # 200+ skill dictionary extraction & gap analysis
│   ├── scoring.py           # Weighted scoring algorithm & ATS compliance checks
│   ├── llm_client.py        # Gemini API integration with basic mode fallback
│   ├── report.py            # Styled PDF report generator (fpdf2)
│   └── data/
│       ├── resumecheck.db   # SQLite database for accounts and saved analyses
│       ├── skills.json      # 200+ skills across Tech, Data, Cloud & Soft skills
│       └── action_verbs.txt # 60+ resume action verbs for ATS validation
├── frontend/
│   ├── index.html           # HTML template with Inter and Source Serif fonts
│   ├── package.json         # React 18, Vite, Tailwind CSS, Lucide icons, Recharts
│   ├── vite.config.js       # Vite configuration with /api reverse proxy
│   ├── tailwind.config.js   # Custom editorial color tokens & typography
│   ├── postcss.config.js
│   ├── dist/                # Production build assets served by FastAPI
│   └── src/
│       ├── main.jsx         # React DOM mount point
│       ├── App.jsx          # React Router layout and routes
│       ├── index.css        # Clean CSS variables & styles
│       ├── api.js           # API fetch helpers (health, analyze, report, auth, analyses)
│       ├── context/
│       │   └── AuthContext.jsx # React context for authentication state
│       ├── pages/
│       │   ├── Home.jsx     # Hero section, animated illustration, sample preview, FAQ
│       │   ├── Analyze.jsx  # File drag-and-drop, job description input, sample autofill
│       │   ├── Results.jsx  # Score gauge, charts, skill tags, checklists, AI rewrites, save button
│       │   ├── Dashboard.jsx# My Analyses list with open and delete actions
│       │   ├── SignIn.jsx   # Clean sign in form with validation and show/hide password
│       │   ├── SignUp.jsx   # Free account creation with min 8 char password check
│       │   └── About.jsx    # Privacy policy, zero resume storage guarantee, architecture
│       └── components/
│           ├── Navbar.jsx        # Header with navigation & authenticated user avatar menu
│           ├── Footer.jsx        # Footer with real-time API health status dot
│           ├── FileUpload.jsx    # Drag-and-drop resume upload box
│           ├── ScoreGauge.jsx    # SVG circular gauge for overall score
│           ├── SkillTags.jsx     # Matched, missing, and extra skill tags
│           ├── ChecklistCard.jsx # ATS and structure checklist items
│           ├── FeedbackCard.jsx  # AI executive evaluation & bullet rewrites
│           ├── HeroIllustration.jsx # Animated SVG resume scan illustration
│           └── Spinner.jsx       # Loading indicator
├── tests/
│   ├── run_tests.py         # Test discovery and execution runner
│   ├── test_api.py          # API route unit tests (/api/health, /api/analyze, /api/report)
│   ├── test_auth.py         # Auth & analyses tests (signup, login, cookie, privacy, CRUD)
│   ├── test_scoring.py      # TF-IDF similarity, weighted score, ATS tests
│   ├── test_skills.py       # Skill extraction, alias normalization, gap analysis
│   └── samples/
│       ├── sample_resume.pdf       # Test PDF resume
│       ├── resume_frontend.txt     # Sample frontend developer resume
│       ├── jd_frontend.txt         # Sample frontend developer job description
│       ├── resume_backend.txt      # Sample backend engineer resume
│       ├── jd_backend.txt          # Sample backend engineer job description
│       ├── resume_datascience.txt  # Sample data science resume
│       └── jd_datascience.txt      # Sample data science job description
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variable template
├── .gitignore               # Ignored files (venv, node_modules, dist, .env)
├── AI Resume Analyzer - PRD.md # Single source of truth PRD
└── README.md                # Documentation and run instructions
```

---

## How to Run Locally

### 1. Backend Server (Development Mode)

```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run FastAPI with auto-reload on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Health check URL**: `http://127.0.0.1:8000/api/health`
- **Interactive API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Development Server (Port 5173)

In a separate terminal:

```powershell
cd frontend
npm run dev
```

- **Website URL**: `http://localhost:5173`
- The Vite dev server automatically proxies `/api/*` requests to `http://127.0.0.1:8000`.

---

### 3. Unified Production Mode (Single Port 8000)

You can run the entire frontend and backend as a unified web application directly from the FastAPI server:

```powershell
# Build the frontend production bundle (already built in frontend/dist)
cd frontend
npm.cmd run build
cd ..

# Run the FastAPI server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

- Open `http://localhost:8000` to access the full application.

---

### 4. Running Automated Tests

```powershell
.\venv\Scripts\python tests/run_tests.py
```

All 16 unit tests validate:
- Server health and input validation
- PDF report generation
- Authentication (signup, duplicate email prevention, weak password rejection, login, logout, `/api/auth/me`)
- Saved analyses CRUD and zero resume storage privacy verification
- TF-IDF cosine similarity calculations
- ATS check validations
- Match score formula weights
- Skill dictionary extraction and alias normalization

---

## Troubleshooting

If the site looks outdated or goes blank after code changes, run `npm run build` and restart the backend.

