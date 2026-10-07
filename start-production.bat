@echo off
title ResumeCheck All-in-One Server
echo ============================================================
echo       Starting ResumeCheck All-in-One Server (Port 8000)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting backend + static frontend on port 8000...
start "ResumeCheck Server (Port 8000)" cmd /k ".\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Opening http://localhost:8000 in your browser...
start http://localhost:8000

echo.
echo ============================================================
echo   ResumeCheck is now LIVE at http://localhost:8000
echo   Close the server window when you are done.
echo ============================================================
pause
