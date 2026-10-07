# AI Resume Analyzer: Product Requirements Document

Version 1.1. Written to be handed to an AI coding agent (Antigravity) as the single source of truth for the build. The product is a website with a frontend and a backend, not a Streamlit or desktop app.

## 1. Instructions to the coding agent

- Build the product exactly as specified below. Follow the build order in section 11 and finish each milestone before starting the next.
- After each milestone, run the website locally, open it in the browser, fix errors, and confirm the acceptance criteria for that milestone pass.
- Keep the code simple, modular, and commented. Prefer standard libraries and well-known packages.
- Create a `requirements.txt`, a `.gitignore` (ignore `venv`, `__pycache__`, `.env`, uploads), a `.env.example`, and a `README.md` with setup and run steps.
- Never hard-code API keys. Read them from environment variables.
- If something in this document is ambiguous, choose the simplest option and note the assumption in the README.

## 2. Overview

AI Resume Analyzer is a responsive website where a job seeker uploads a resume (PDF or DOCX) and pastes a job description. The site extracts the resume content, scores how well it matches the job, lists missing skills, checks ATS (applicant tracking system) friendliness, and gives clear, AI-written suggestions to improve the resume. It is a real website: the frontend is the set of pages the user sees in the browser, and the backend is a Python API that does the analysis.

## 3. Goals and non-goals

**Goals**

- A working end-to-end website a student can demo in 5 minutes and later deploy online.
- Useful, specific feedback, not generic advice.
- Works even without an AI API key (basic mode), and gives richer feedback when a key is provided.

**Non-goals for v1**

- User accounts, login, payments, or a database of users.
- Storing resumes permanently.
- Multi-language resumes (English only).
- OCR for scanned or image-only PDFs (show a clear error instead).

## 4. Target users

- **Job seekers and students** who want to improve a resume for a specific job.
- **Recruiters (secondary)** who want a quick match score for one resume against one job.

## 5. Tech stack

- Languages: Python 3.10 or newer for the backend; JavaScript (ES modules) for the frontend. Node.js 18 or newer is required for the frontend.
- Frontend (the website): React 18 built with Vite, React Router for the pages, Tailwind CSS for styling, and Recharts for charts. Use functional components and hooks only. Call the API with `fetch`.
- Backend: FastAPI with `uvicorn`, plus `python-multipart` for file uploads. During development the Vite dev server proxies `/api` requests to the backend on port 8000. In production the backend serves the built `frontend/dist` folder, so the whole website runs from one server.
- PDF parsing: `pdfplumber`. DOCX parsing: `python-docx`.
- NLP and matching: `scikit-learn` (TF-IDF and cosine similarity) and `spaCy` (`en_core_web_sm`) for light text processing.
- AI feedback: Google Gemini API through the `google-genai` package, with the model name set in `.env` (variable `GEMINI_MODEL`) so it can be changed without code edits. Wrap the call in one function (`llm_client.py`) so the provider can be swapped later.
- Report export: `fpdf2` or `reportlab` for a downloadable PDF report.
- Deployment (optional): Render for the backend and the built frontend as one service, or the frontend on Vercel or Netlify and the backend on Render, with the API address set through the `VITE_API_URL` environment variable.

### 5.1 Backend API endpoints

- `GET /api/health`: returns a simple status message so the frontend can check the server is up.
- `POST /api/analyze`: multipart form with `resume` (file), `job_description` (text), and optional `job_title` and `years_experience`. Returns JSON with the scores, skills (matched, missing, extra), detected sections, ATS checks, and `ai_feedback` (null in basic mode).
- `POST /api/report`: takes the analysis JSON and returns the PDF report as a download.
- Every error returns JSON with a clear `message` and a suitable status code (400 for bad input, 413 for a file that is too large, 500 for unexpected errors).
- Enable CORS so the frontend works during local development.

## 6. Functional requirements

### F1. Resume upload and text extraction

- Accept `.pdf` and `.docx`, up to 5 MB.
- Extract plain text. Show a collapsible preview of the extracted text.
- Errors to handle with friendly messages: wrong file type, empty file, file too large, password-protected PDF, scanned PDF with no extractable text.
- Acceptance: uploading a normal text-based PDF and DOCX both produce readable text.

### F2. Job description input

- A large text box for the job description (minimum 50 characters).
- Optional fields: target job title and years of experience.
- Acceptance: the Analyze button is disabled until both a resume and a valid job description are provided.

### F3. Resume structure detection

Detect these sections by common headings: Contact, Summary or Objective, Skills, Experience, Projects, Education, Certifications. Report which are present and which are missing. Also detect email, phone number, and LinkedIn or GitHub links.

### F4. Skill extraction and gap analysis

- Maintain a skills dictionary in `data/skills.json` covering at least 200 skills across software, data, AI/ML, web, mobile, cloud, databases, tools, and common soft skills. Include aliases (for example JS = JavaScript, ML = Machine Learning).
- Extract skills from the resume and from the job description using case-insensitive matching with word boundaries.
- Output three lists: matched skills, missing skills (in the job description but not in the resume), and extra skills (in the resume only).
- Acceptance: a resume mentioning Python and SQL against a job requiring Python, SQL, and Docker shows Docker as missing.

### F5. Match score

Compute an overall score from 0 to 100 using these weights:

- Skill match: 50 percent (matched required skills divided by total job skills).
- Text similarity: 25 percent (TF-IDF cosine similarity between resume and job description, scaled to 0-100).
- Structure completeness: 15 percent (share of key sections present).
- ATS quality: 10 percent (from F6).

Show the overall score with a label: below 40 is Weak, 40 to 69 is Fair, 70 to 84 is Good, 85 and above is Excellent. Show the four sub-scores as well.

### F6. ATS check

Check and report pass or warn for each item:

- Standard section headings present.
- Resume length is reasonable (300 to 1200 words).
- Contact details found.
- No very long paragraphs (flag any bullet or paragraph over 60 words).
- Bullets begin with action verbs (use a list of about 60 action verbs).
- Quantified results present (numbers, percentages, or currency in experience bullets).
- Keyword coverage: percent of job description keywords found in the resume.

### F7. AI feedback (requires API key)

Send the resume text and job description to the LLM and request a strict JSON reply with these fields:

- `summary`: 2 to 3 sentences of overall assessment.
- `strengths`: list of up to 5 items.
- `weaknesses`: list of up to 5 items.
- `missing_keywords`: list of important keywords to add.
- `improved_bullets`: list of up to 5 objects, each with `original` and `improved` (improved version starts with an action verb and adds a metric placeholder where appropriate).
- `tailored_summary`: a rewritten professional summary tailored to the job, up to 60 words.
- `interview_questions`: 5 likely interview questions based on the resume and job.

Requirements: instruct the model to return JSON only, strip any code fences before parsing, validate the fields, retry once on parse failure, and never invent experience that is not in the resume. If there is no API key or the call fails, skip this section and show a notice that basic mode is active. The app must still work fully for F1 to F6.

### F8. Results dashboard

Show, in this order: overall score and label, the four sub-scores, matched and missing skills as colored tags, section checklist, ATS checklist, AI feedback, and improved bullets in an original versus improved comparison.

### F9. Export report

A Download Report button that produces a PDF containing the score, skill gaps, ATS results, and AI suggestions.

## 7. Website pages and user interface

- A multi-page website built as a React app with React Router, a shared Navbar and Footer, and these pages: **Home** (landing page with a headline, a three-step explanation of how it works, and a Try it now button), **Analyze** (resume upload, job description box, optional fields, Analyze button), **Results** (scores, charts, skill tags, checklists, AI feedback, Download Report button), and **About and Privacy**.
- The Results page shows the data returned by the API, held in React state, without a full page reload. If the user opens Results with no data, redirect to Analyze.
- Fully responsive: mobile-first Tailwind classes that look right on a phone (360 px wide) and a laptop (1366 px wide).
- Clean, modern design: one consistent color palette, readable fonts, rounded cards, a visible loading spinner while analyzing, and clear error messages.
- Drag-and-drop file upload component that shows the file name and size.
- Show the overall score as a circular gauge or progress bar, skills as colored tags (green for matched, red for missing), and the four sub-scores in a Recharts radar or bar chart.
- Basic accessibility: labels on all inputs, good color contrast, and keyboard-friendly buttons.

## 8. Suggested folder structure

- `backend/main.py`: FastAPI app, routes, CORS, and serving `frontend/dist` in production.
- `backend/parser.py`: PDF and DOCX text extraction.
- `backend/sections.py`: section and contact detection.
- `backend/skills.py`: skill extraction and gap analysis.
- `backend/scoring.py`: match score and ATS checks.
- `backend/llm_client.py`: LLM call, prompt, JSON parsing, retry.
- `backend/report.py`: PDF report generation.
- `backend/data/skills.json` and `backend/data/action_verbs.txt`.
- `frontend/package.json`, `frontend/vite.config.js` (with the `/api` proxy to port 8000), `frontend/index.html`.
- `frontend/src/main.jsx` and `frontend/src/App.jsx` (routes), `frontend/src/api.js` (API calls).
- `frontend/src/pages/`: `Home.jsx`, `Analyze.jsx`, `Results.jsx`, `About.jsx`.
- `frontend/src/components/`: `Navbar`, `Footer`, `FileUpload`, `ScoreGauge`, `SkillTags`, `ChecklistCard`, `FeedbackCard`, `Spinner`.
- `tests/` with `tests/samples/`: unit tests and sample files.
- Project root: `requirements.txt`, `.env.example`, `.gitignore` (also ignore `node_modules` and `frontend/dist`), `README.md`.

## 9. Non-functional requirements

- **Performance:** basic analysis under 5 seconds; AI feedback under 30 seconds.
- **Privacy:** process resumes in memory only. Do not save uploads to disk or log resume text. Show a clear note that content is sent to the AI provider when AI feedback is on.
- **Reliability:** every external call (file parsing, LLM) is wrapped in error handling with a user-friendly message and no crashes.
- **Security:** keys only in environment variables; validate file type and size.
- **Code quality:** functions under about 40 lines, docstrings on public functions, type hints where simple.

## 10. Testing

- Unit tests for the parser, skill extraction, and score calculation using small sample texts.
- Include 3 sample resumes and 3 sample job descriptions in `tests/samples/` (plain text is fine).
- Manual test cases: empty file, huge file, scanned PDF, resume with no skills section, very short job description, and no API key.

## 11. Build order (milestones)

1. **Setup:** `backend/` with a FastAPI server and `GET /api/health`; `frontend/` created with Vite, React, Tailwind CSS, and React Router; both run, and the Home page shows the health status from the API.
2. **Backend core (F1, F3, F4):** file upload, text extraction, section detection, skills dictionary, and matched and missing skills, tested through the API.
3. **Scoring and ATS (F5, F6):** `POST /api/analyze` returns all scores and checks as JSON.
4. **Frontend pages (F2, F8):** Home, Analyze, and Results pages connected to the API, with loading states and error messages.
5. **AI feedback (F7):** LLM integration with basic-mode fallback, shown on the Results page.
6. **Polish and export (F9):** charts, responsive design, About and Privacy page, PDF report download.
7. **Tests and docs:** unit tests, production build served by the backend, README with a screenshots section, `.env.example`, and optional deployment.

## 12. Definition of done

- In development, the backend runs with `uvicorn backend.main:app --reload` (port 8000) and the frontend runs with `cd frontend && npm install && npm run dev` (open `http://localhost:5173`).
- In production mode, `npm run build` in `frontend/` creates `frontend/dist`, and the backend serves it so the full website works at `http://localhost:8000`.
- All acceptance criteria in section 6 pass in the browser.
- It works without an API key in basic mode, and with a key in full mode.
- No crashes on the manual test cases in section 10, and the pages look correct at phone width and laptop width.
- The README explains installation, configuration, usage, and how to deploy.

## 13. Future ideas (not in v1)

- Compare multiple resumes against one job for recruiters.
- Role-specific scoring profiles.
- OCR for scanned resumes.
- Save analysis history with user consent.
- Deploy publicly (for example on Render) and add a custom domain.
