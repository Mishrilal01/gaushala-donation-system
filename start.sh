#!/bin/bash
# Gaushala Donation System - Startup Script for Mac/Linux

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Gaushala Donation System Launcher   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found:"
node --version
echo ""

# Install server dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing frontend dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

echo "═══════════════════════════════════════════"
echo "Starting servers..."
echo "═══════════════════════════════════════════"
echo ""

# Start backend server
cd ../server
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Both servers are now running!"
echo ""
echo "🌐 Open your browser:"
echo "   - Home Page: http://localhost:5173"
echo "   - Admin Panel: http://localhost:5173 → Click '🔐 Admin'"
echo "   - Admin Password: gaushala123"
echo ""
echo "📡 API Server: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
