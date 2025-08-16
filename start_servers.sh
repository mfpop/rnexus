#!/bin/bash

echo "Starting RNexus servers..."

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "Stopping servers..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "Frontend server stopped"
    fi
    if [ ! -z "$BACKEND_PID" ] && [ "$BACKEND_PID" != "existing" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend server stopped"
    elif [ "$BACKEND_PID" = "existing" ]; then
        echo "Note: Using existing Daphne instance - not stopping backend"
    fi
    exit 0
}

# Set up signal handler
trap cleanup SIGINT SIGTERM

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Start frontend server
echo "Starting frontend server..."
if [ -d "frontend" ]; then
    if [ -f "frontend/package.json" ]; then
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo "Installing frontend dependencies..."
            npm install
        fi
        npm run dev &
        FRONTEND_PID=$!
        cd "$SCRIPT_DIR"
        echo "Frontend server started with PID: $FRONTEND_PID"
    else
        echo "Error: frontend/package.json not found"
        exit 1
    fi
else
    echo "Error: frontend directory not found"
    exit 1
fi

# Wait a moment for frontend to start
sleep 2

# Start backend server with Daphne (WebSocket support)
if [ -d "backend" ]; then
    echo "Starting backend server with Daphne (WebSocket support)..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "Error: Virtual environment not found. Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi
    
    # Activate virtual environment and start server
    source venv/bin/activate
    
    # Check if required packages are installed
    if ! python3 -c "import django, channels, daphne" 2>/dev/null; then
        echo "Error: Required packages not installed. Please run: source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi
    
    # Start Daphne ASGI server instead of Django runserver
    echo "Starting Daphne ASGI server on port 8000..."
    
    # Check if port 8000 is already in use
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port 8000 is already in use. Checking if Daphne is running..."
        if ps aux | grep -q "daphne.*8000"; then
            echo "✅ Daphne is already running on port 8000"
            echo "   Using existing Daphne instance for WebSocket support"
            # Don't start a new instance, just note that one exists
            BACKEND_PID="existing"
        else
            echo "❌ Port 8000 is in use by another process. Please free up port 8000 first."
            exit 1
        fi
    else
        daphne -b 0.0.0.0 -p 8000 core.asgi:application &
        BACKEND_PID=$!
        echo "Backend server (Daphne) started with PID: $BACKEND_PID"
    fi
    
    # Wait a moment for Daphne to start
    sleep 3
    
    # Test if Daphne is responding
    echo "Testing backend server..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/admin/ | grep -q "302\|200"; then
        echo "✅ Backend server is responding"
    else
        echo "⚠️  Backend server may not be fully ready yet"
    fi
    
else
    echo "Warning: backend directory not found, skipping backend server"
fi

echo ""
echo "Servers are running!"
echo "Frontend: http://localhost:5173 (or check terminal for actual port)"
if [ ! -z "$BACKEND_PID" ]; then
    if [ "$BACKEND_PID" = "existing" ]; then
        echo "Backend: http://localhost:8000 (Using existing Daphne + WebSocket support)"
    else
        echo "Backend: http://localhost:8000 (Daphne + WebSocket support)"
    fi
    echo "WebSocket: ws://localhost:8000/ws/"
    echo "Admin: http://localhost:8000/admin/"
fi
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
