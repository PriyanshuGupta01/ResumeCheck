@echo off
title ResumeCheck Launcher
echo ============================================================
echo           Starting ResumeCheck (AI Resume Analyzer)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Backend API Server (Port 8000)...
start "ResumeCheck Backend (Port 8000)" cmd /k ".\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Web Server (Port 5173)...
start "ResumeCheck Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Opening Website in your browser...
start http://localhost:5173

echo.
echo ============================================================
echo   ResumeCheck is now LIVE!
echo   - Website URL:  http://localhost:5173
echo   - Backend Docs: http://127.0.0.1:8000/docs
echo.
echo   Keep the two command windows open while using the site.
echo   Close them when you are done.
echo ============================================================
pause
