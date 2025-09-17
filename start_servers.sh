#!/usr/bin/env bash

###############################################################################
# RNexus Unified Server Starter
# Starts frontend (Vite) and backend (Daphne ASGI) with safety, logging,
# readiness checks, optional migrations, env loading, and graceful shutdown.
###############################################################################

set -euo pipefail
IFS=$'\n\t'

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

# Defaults (can be overridden by env / .env / CLI args)
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_TIMEOUT="${FRONTEND_TIMEOUT:-20}"
BACKEND_TIMEOUT="${BACKEND_TIMEOUT:-25}"
RUN_FRONTEND=true
RUN_BACKEND=true
RUN_MIGRATIONS=false
ENV_FILE=".env"
LOG_DIR="logs"

usage() {
    cat <<EOF
Usage: $0 [options]
Options:
    --no-frontend        Skip starting the frontend (Vite)
    --no-backend         Skip starting the backend (Daphne)
    --migrate            Run Django migrations before starting backend
    --env FILE           Load environment variables from FILE (default .env if exists)
    --frontend-port N    Override frontend port (default $FRONTEND_PORT)
    --backend-port N     Override backend port (default $BACKEND_PORT)
    -h, --help           Show this help message
Environment overrides: FRONTEND_PORT, BACKEND_PORT, FRONTEND_TIMEOUT, BACKEND_TIMEOUT
Logs written to: $LOG_DIR/frontend.log & backend.log
EOF
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --no-frontend) RUN_FRONTEND=false; shift ;;
        --no-backend) RUN_BACKEND=false; shift ;;
        --migrate) RUN_MIGRATIONS=true; shift ;;
        --env) ENV_FILE="$2"; shift 2 ;;
        --frontend-port) FRONTEND_PORT="$2"; shift 2 ;;
        --backend-port) BACKEND_PORT="$2"; shift 2 ;;
        -h|--help) usage ;;
        *) echo -e "${YELLOW}⚠️  Unknown option: $1${NC}"; usage ;;
    esac
done

echo -e "${BLUE}🚀 Starting RNexus servers (frontend:${RUN_FRONTEND} backend:${RUN_BACKEND})...${NC}"

# Resolve script directory & project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load .env if present
if [[ -f "$ENV_FILE" ]]; then
    echo -e "${BLUE}🔐 Loading environment from $ENV_FILE${NC}"
    # shellcheck disable=SC2046
    export $(grep -v '^[[:space:]]*#' "$ENV_FILE" | grep -E '^[A-Za-z_][A-Za-z0-9_]*=' | xargs -I{} echo {}) || true
fi

mkdir -p "$LOG_DIR"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_LOG="$LOG_DIR/backend.log"

echo -e "${BLUE}🧾 Logging to: $FRONTEND_LOG, $BACKEND_LOG${NC}"

check_dependencies() {
    local missing=()
    for cmd in node npm python3 curl lsof grep awk sed; do
        command -v "$cmd" >/dev/null 2>&1 || missing+=("$cmd")
    done
    if (( ${#missing[@]} > 0 )); then
        echo -e "${RED}❌ Missing dependencies: ${missing[*]}${NC}"; exit 1
    fi
}

check_port() { ! lsof -Pi :"$1" -sTCP:LISTEN -t >/dev/null 2>&1; }

wait_for() {
    local url=$1 timeout=$2 label=$3
    echo -e "${BLUE}⏳ Waiting for $label ...${NC}"
    local start=$(date +%s)
    while (( $(date +%s) - start < timeout )); do
        local code
        code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
        if [[ "$code" =~ ^(200|302|404)$ ]]; then
            echo -e "${GREEN}✅ $label ready (HTTP $code)${NC}"; return 0
        fi
        sleep 1
    done
    echo -e "${YELLOW}⚠️  $label not confirmed within ${timeout}s${NC}"; return 1
}

cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping servers...${NC}"
    [[ -n "${FRONTEND_PID:-}" && -d /proc/$FRONTEND_PID ]] 2>/dev/null && kill $FRONTEND_PID 2>/dev/null || true
    if [[ -n "${BACKEND_PID:-}" && "$BACKEND_PID" != existing ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Shutdown complete${NC}"
    exit 0
}
trap cleanup INT TERM

monitor_processes() {
    while true; do
        sleep 3
        if $RUN_FRONTEND && [[ -n "${FRONTEND_PID:-}" ]] && ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
            echo -e "${RED}❌ Frontend process exited unexpectedly. Stopping...${NC}"; cleanup
        fi
        if $RUN_BACKEND && [[ -n "${BACKEND_PID:-}" ]] && [[ "$BACKEND_PID" != existing ]] && ! kill -0 "$BACKEND_PID" 2>/dev/null; then
            echo -e "${RED}❌ Backend process exited unexpectedly. Stopping...${NC}"; cleanup
        fi
    done
}

check_dependencies

################################ Frontend ################################
if $RUN_FRONTEND; then
    echo -e "${BLUE}🌐 Starting frontend (port $FRONTEND_PORT)...${NC}"
    if [[ ! -f frontend/package.json ]]; then
        echo -e "${RED}❌ frontend/package.json not found${NC}"; exit 1
    fi
    pushd frontend >/dev/null
    if [[ ! -d node_modules ]]; then
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        npm install --no-fund --no-audit >>"$SCRIPT_DIR/$FRONTEND_LOG" 2>&1
    fi
    if check_port "$FRONTEND_PORT"; then
        echo -e "${YELLOW}⚠️  Port $FRONTEND_PORT in use; Vite will choose another free port${NC}"
    fi
    (npm run dev >>"$SCRIPT_DIR/$FRONTEND_LOG" 2>&1 & echo $! >"$SCRIPT_DIR/$LOG_DIR/frontend.pid")
    FRONTEND_PID=$(cat "$SCRIPT_DIR/$LOG_DIR/frontend.pid")
    popd >/dev/null
    sleep 1
    kill -0 "$FRONTEND_PID" 2>/dev/null && echo -e "${GREEN}✅ Frontend PID $FRONTEND_PID${NC}" || { echo -e "${RED}❌ Frontend failed${NC}"; exit 1; }
fi

################################ Backend #################################
if $RUN_BACKEND; then
    echo -e "${BLUE}🐍 Starting backend (port $BACKEND_PORT)...${NC}"
    if [[ ! -d backend ]]; then echo -e "${RED}❌ backend directory missing${NC}"; exit 1; fi
    pushd backend >/dev/null
    if [[ ! -d venv ]]; then
        echo -e "${RED}❌ venv missing. Create with: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt${NC}"; exit 1
    fi
    source venv/bin/activate
    command -v daphne >/dev/null 2>&1 || { echo -e "${RED}❌ daphne not installed (pip install daphne)${NC}"; exit 1; }
    if $RUN_MIGRATIONS; then
        echo -e "${BLUE}🔄 Applying migrations...${NC}"
        python manage.py migrate >>"$SCRIPT_DIR/$BACKEND_LOG" 2>&1 || { echo -e "${RED}❌ Migrations failed${NC}"; exit 1; }
    fi
    if check_port "$BACKEND_PORT"; then
        echo -e "${BLUE}🚀 Launching Daphne on $BACKEND_PORT${NC}"
        export DJANGO_SETTINGS_MODULE=core.settings
        (daphne -b 0.0.0.0 -p "$BACKEND_PORT" core.asgi:application >>"$SCRIPT_DIR/$BACKEND_LOG" 2>&1 & echo $! >"$SCRIPT_DIR/$LOG_DIR/backend.pid")
        BACKEND_PID=$(cat "$SCRIPT_DIR/$LOG_DIR/backend.pid")
        sleep 1
        kill -0 "$BACKEND_PID" 2>/dev/null && echo -e "${GREEN}✅ Backend PID $BACKEND_PID${NC}" || { echo -e "${RED}❌ Backend failed${NC}"; exit 1; }
    else
        if ps aux | grep -v grep | grep -q "daphne.*$BACKEND_PORT"; then
            echo -e "${GREEN}✅ Using existing Daphne on $BACKEND_PORT${NC}"; BACKEND_PID=existing
        else
            echo -e "${RED}❌ Port $BACKEND_PORT in use by unknown process${NC}"; exit 1
        fi
    fi
    popd >/dev/null
fi

############################ Readiness Checks #############################
echo -e "\n${BLUE}⏳ Performing readiness checks...${NC}"
if $RUN_FRONTEND; then
    wait_for "http://localhost:$FRONTEND_PORT" "$FRONTEND_TIMEOUT" "Frontend"
fi
if $RUN_BACKEND && [[ "$BACKEND_PID" != existing ]]; then
    # Try graphql first, then admin
    wait_for "http://localhost:$BACKEND_PORT/graphql/" 6 "Backend GraphQL" || \
    wait_for "http://localhost:$BACKEND_PORT/admin/" "$BACKEND_TIMEOUT" "Backend Admin"
fi

echo -e "\n${GREEN}🎉 Servers running${NC}\n"
if $RUN_FRONTEND; then echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:$FRONTEND_PORT"; fi
if $RUN_BACKEND; then
    echo -e "${BLUE}🐍 Backend:${NC} http://localhost:$BACKEND_PORT"
    echo -e "${BLUE}🔌 WebSocket:${NC} ws://localhost:$BACKEND_PORT/ws/"
    echo -e "${BLUE}⚙️  Admin:${NC} http://localhost:$BACKEND_PORT/admin/"
fi
echo -e "${BLUE}📜 Tail logs:${NC} tail -f $FRONTEND_LOG $BACKEND_LOG"
echo -e "${YELLOW}💡 Ctrl+C to stop all${NC}"

monitor_processes &
wait
