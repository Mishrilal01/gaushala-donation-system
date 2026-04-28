@echo off
REM Gaushala Donation System - Startup Script for Windows
REM This script starts both frontend and backend servers

echo.
echo ╔════════════════════════════════════════╗
echo ║   Gaushala Donation System Launcher   ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Install server dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

REM Install client dependencies
echo 📦 Installing frontend dependencies...
cd ..\client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

echo.
echo ═══════════════════════════════════════════
echo Starting servers in new windows...
echo ═══════════════════════════════════════════
echo.

REM Start backend server in new window
start "Gaushala Backend - http://localhost:5000" cmd /k "cd server && npm run dev"

REM Wait 3 seconds for backend to start
timeout /t 3

REM Start frontend in new window
start "Gaushala Frontend - http://localhost:5173" cmd /k "cd client && npm run dev"

echo.
echo 🎉 Both servers should now be running!
echo.
echo 🌐 Open your browser:
echo    - Home Page: http://localhost:5173
echo    - Admin Panel: http://localhost:5173 → Click "🔐 Admin"
echo    - Admin Password: gaushala123
echo.
echo 📡 API Server: http://localhost:5000
echo.
echo ℹ️  Close the command windows to stop the servers
echo.
pause
