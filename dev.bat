@echo off
REM Kill all Node processes
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q .next 2>nul

REM Start dev server with Turbopack
echo Starting Next.js dev server with Turbopack...
echo.
echo ========================================
echo  Dev server starting at http://localhost:3000
echo  Turbopack enabled (faster compilation)
echo ========================================
echo.

bun dev --turbo
