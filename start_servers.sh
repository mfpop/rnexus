#!/bin/bash

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_PORT=5173
BACKEND_PORT=8000
FRONTEND_TIMEOUT=10
BACKEND_TIMEOUT=15

echo -e "${BLUE}🚀 Starting RNexus servers...${NC}"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"

    # Stop frontend
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend server stopped${NC}"
    fi

    # Stop backend
    if [ ! -z "$BACKEND_PID" ] && [ "$BACKEND_PID" != "existing" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null
        wait $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend server stopped${NC}"
    elif [ "$BACKEND_PID" = "existing" ]; then
        echo -e "${BLUE}ℹ️  Using existing Daphne instance - not stopping backend${NC}"
    fi

    echo -e "${GREEN}✅ All servers stopped${NC}"
    exit 0
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Function to wait for server to be ready
wait_for_server() {
    local url=$1
    local timeout=$2
    local description=$3

    echo -e "${BLUE}⏳ Waiting for $description to be ready...${NC}"

    local start_time=$(date +%s)
    while [ $(($(date +%s) - start_time)) -lt $timeout ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302\|404"; then
            echo -e "${GREEN}✅ $description is ready${NC}"
            return 0
        fi
        sleep 1
    done

    echo -e "${RED}❌ $description failed to start within ${timeout}s${NC}"
    return 1
}

# Function to check dependencies
check_dependencies() {
    local missing_deps=()

    # Check for required commands
    for cmd in node npm python3 curl lsof; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=("$cmd")
        fi
    done

    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required dependencies: ${missing_deps[*]}${NC}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
}

# Set up signal handler
trap cleanup SIGINT SIGTERM

# Check dependencies first
check_dependencies

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Start frontend server
echo -e "${BLUE}🌐 Starting frontend server...${NC}"
if [ -d "frontend" ]; then
    if [ -f "frontend/package.json" ]; then
        cd frontend

        # Check if node_modules exists and is recent
        if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ] || [ "$(find node_modules -mtime +7 2>/dev/null | wc -l)" -gt 0 ]; then
            echo -e "${YELLOW}📦 Installing/updating frontend dependencies...${NC}"
            npm ci --silent || npm install --silent
        fi

        # Check if frontend port is available
        if ! check_port $FRONTEND_PORT; then
            echo -e "${YELLOW}⚠️  Port $FRONTEND_PORT is in use, frontend will use next available port${NC}"
        fi

        echo -e "${BLUE}🚀 Starting Vite dev server...${NC}"
        npm run dev > /dev/null 2>&1 &
        FRONTEND_PID=$!
        cd "$SCRIPT_DIR"

        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo -e "${GREEN}✅ Frontend server started with PID: $FRONTEND_PID${NC}"
        else
            echo -e "${RED}❌ Failed to start frontend server${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Error: frontend/package.json not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Error: frontend directory not found${NC}"
    exit 1
fi

# Start backend server with Daphne
if [ -d "backend" ]; then
    echo -e "${BLUE}🐍 Starting backend server...${NC}"
    cd backend

    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${RED}❌ Virtual environment not found${NC}"
        echo "Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi

    # Activate virtual environment
    source venv/bin/activate

    # Check if required packages are installed
    if ! python3 -c "import django, channels, daphne" 2>/dev/null; then
        echo -e "${RED}❌ Required packages not installed${NC}"
        echo "Please run: source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi

    # Check if port 8000 is available
    if check_port $BACKEND_PORT; then
        echo -e "${BLUE}🚀 Starting Daphne ASGI server on port $BACKEND_PORT...${NC}"

        export DJANGO_SETTINGS_MODULE=core.settings
        daphne -b 0.0.0.0 -p $BACKEND_PORT core.asgi:application > /dev/null 2>&1 &
        BACKEND_PID=$!

        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo -e "${GREEN}✅ Backend server (Daphne) started with PID: $BACKEND_PID${NC}"
        else
            echo -e "${RED}❌ Failed to start backend server${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Port $BACKEND_PORT is in use. Checking if Daphne is running...${NC}"

        if ps aux | grep -q "daphne.*$BACKEND_PORT"; then
            echo -e "${GREEN}✅ Daphne is already running on port $BACKEND_PORT${NC}"
            echo "   Using existing Daphne instance for WebSocket support"
            BACKEND_PID="existing"
        else
            echo -e "${RED}❌ Port $BACKEND_PORT is in use by another process${NC}"
            echo "Please free up port $BACKEND_PORT first or kill the existing process."
            exit 1
        fi
    fi

    cd "$SCRIPT_DIR"
else
    echo -e "${YELLOW}⚠️  Backend directory not found, skipping backend server${NC}"
fi

# Wait for servers to be ready
echo ""
echo -e "${BLUE}⏳ Waiting for servers to be ready...${NC}"

# Wait for frontend
if [ ! -z "$FRONTEND_PID" ]; then
    if wait_for_server "http://localhost:$FRONTEND_PORT" $FRONTEND_TIMEOUT "Frontend server"; then
        echo -e "${GREEN}✅ Frontend is accessible at http://localhost:$FRONTEND_PORT${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend may not be fully ready yet${NC}"
    fi
fi

# Wait for backend
if [ ! -z "$BACKEND_PID" ] && [ "$BACKEND_PID" != "existing" ]; then
    if wait_for_server "http://localhost:$BACKEND_PORT/admin/" $BACKEND_TIMEOUT "Backend server"; then
        echo -e "${GREEN}✅ Backend is accessible at http://localhost:$BACKEND_PORT${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend may not be fully ready yet${NC}"
    fi
fi

# Final status
echo ""
echo -e "${GREEN}🎉 Servers are running!${NC}"
echo ""

if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:$FRONTEND_PORT"
fi

if [ ! -z "$BACKEND_PID" ]; then
    if [ "$BACKEND_PID" = "existing" ]; then
        echo -e "${BLUE}🐍 Backend:${NC} http://localhost:$BACKEND_PORT (Using existing Daphne)"
    else
        echo -e "${BLUE}🐍 Backend:${NC} http://localhost:$BACKEND_PORT (Daphne + WebSocket)"
    fi
    echo -e "${BLUE}🔌 WebSocket:${NC} ws://localhost:$BACKEND_PORT/ws/"
    echo -e "${BLUE}⚙️  Admin:${NC} http://localhost:$BACKEND_PORT/admin/"
fi

echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all servers${NC}"

# Wait for user to stop
wait
