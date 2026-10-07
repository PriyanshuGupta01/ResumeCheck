@echo off
title Stop ResumeCheck Servers
echo ============================================================
echo               Stopping ResumeCheck Servers
echo ============================================================
echo.

powershell -Command "Get-NetTCPConnection -LocalPort 8000, 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo.
echo All ResumeCheck servers (Port 8000 and 5173) have been stopped.
pause
