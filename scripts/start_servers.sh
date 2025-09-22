#!/usr/bin/env bash

###############################################################################
# RNexus Unified Server Starter - Optimized Version
# Starts frontend (Vite) and backend (Daphne ASGI) with safety, logging,
# readiness checks, optional migrations, env loading, and graceful shutdown.
###############################################################################

set -euo pipefail
IFS=$'\n\t'

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default configuration
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
MCP_PORT="${MCP_PORT:-4001}"
FRONTEND_TIMEOUT="${FRONTEND_TIMEOUT:-20}"
BACKEND_TIMEOUT="${BACKEND_TIMEOUT:-25}"
MCP_TIMEOUT="${MCP_TIMEOUT:-10}"
RUN_FRONTEND=true
RUN_BACKEND=true
RUN_MCP=true
RUN_MIGRATIONS=false
ENV_FILE=".env"
LOG_DIR="logs"
VERBOSE=false

# PID file locations
FRONTEND_PID_FILE="$LOG_DIR/frontend.pid"
BACKEND_PID_FILE="$LOG_DIR/backend.pid"
MCP_PID_FILE="$LOG_DIR/mcp.pid"

# All function definitions first
usage() {
    cat <<EOF
Usage: $0 [options]

Options:
    --no-frontend        Skip starting the frontend (Vite)
    --no-backend         Skip starting the backend (Daphne)
    --no-mcp             Skip starting the MCP server
    --migrate            Run Django migrations before starting backend
    --env FILE           Load environment variables from FILE (default .env if exists)
    --frontend-port N    Override frontend port (default $FRONTEND_PORT)
    --backend-port N     Override backend port (default $BACKEND_PORT)
    --mcp-port N         Override MCP port (default $MCP_PORT)
    --verbose            Enable verbose output
    --status             Show current server status
    --stop               Stop all running servers
    -h, --help           Show this help message

Environment overrides: FRONTEND_PORT, BACKEND_PORT, MCP_PORT, FRONTEND_TIMEOUT, BACKEND_TIMEOUT, MCP_TIMEOUT
Logs written to: $LOG_DIR/frontend.log & backend.log

Examples:
    $0                          # Start all servers (frontend, backend, MCP)
    $0 --no-frontend            # Start backend and MCP only
    $0 --no-mcp                 # Start frontend and backend only
    $0 --migrate                # Run migrations and start all servers
    $0 --status                 # Check server status
    $0 --stop                   # Stop all servers
EOF
    exit 0
}

log() {
    local level="$1"
    shift
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] $level $*" | tee -a "$LOG_DIR/startup.log"
}

log_info() { log "${BLUE}ℹ️${NC}" "$@"; }
log_success() { log "${GREEN}✅${NC}" "$@"; }
log_warning() { log "${YELLOW}⚠️${NC}" "$@"; }
log_error() { log "${RED}❌${NC}" "$@"; }
log_debug() { [[ "$VERBOSE" == "true" ]] && log "${PURPLE}🐛${NC}" "$@"; }

# Get process info by PID
get_process_info() {
    local pid="$1"
    if [[ -n "$pid" && "$pid" != "0" ]]; then
        if ps -p "$pid" >/dev/null 2>&1; then
            local cmd=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
            echo "$cmd (PID: $pid)"
        else
            echo "not running"
        fi
    else
        echo "not set"
    fi
}

# Check if a port is available
check_port() {
    local port="$1"
    if lsof -Pi :"$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Show current server status
show_status() {
    echo -e "${CYAN}📊 RNexus Server Status${NC}"
    echo "================================"

    # Check frontend
    if [[ -f "$FRONTEND_PID_FILE" ]]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE" 2>/dev/null || echo "")
        echo -e "Frontend: $(get_process_info "$frontend_pid")"
    else
        echo -e "Frontend: not started"
    fi

    # Check backend
    if [[ -f "$BACKEND_PID_FILE" ]]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE" 2>/dev/null || echo "")
        echo -e "Backend:  $(get_process_info "$backend_pid")"
    else
        echo -e "Backend:  not started"
    fi

    # Check MCP server
    if [[ -f "$MCP_PID_FILE" ]]; then
        local mcp_pid=$(cat "$MCP_PID_FILE" 2>/dev/null || echo "")
        echo -e "MCP:      $(get_process_info "$mcp_pid")"
    else
        echo -e "MCP:      not started"
    fi

    # Check ports
    echo -e "\nPort Status:"
    if check_port "$FRONTEND_PORT"; then
        echo -e "  Frontend ($FRONTEND_PORT): ${GREEN}available${NC}"
    else
        echo -e "  Frontend ($FRONTEND_PORT): ${RED}in use${NC}"
    fi

    if check_port "$BACKEND_PORT"; then
        echo -e "  Backend ($BACKEND_PORT):  ${GREEN}available${NC}"
    else
        echo -e "  Backend ($BACKEND_PORT):  ${RED}in use${NC}"
    fi

    if check_port "$MCP_PORT"; then
        echo -e "  MCP ($MCP_PORT):         ${GREEN}available${NC}"
    else
        echo -e "  MCP ($MCP_PORT):         ${RED}in use${NC}"
    fi
}

# Stop all servers
stop_servers() {
    log_info "Stopping all servers..."

    # Stop frontend
    if [[ -f "$FRONTEND_PID_FILE" ]]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE" 2>/dev/null || echo "")
        if [[ -n "$frontend_pid" && "$frontend_pid" != "0" ]]; then
            if kill -0 "$frontend_pid" 2>/dev/null; then
                log_info "Stopping frontend (PID: $frontend_pid)"
                kill "$frontend_pid" 2>/dev/null || true
                sleep 2
                if kill -0 "$frontend_pid" 2>/dev/null; then
                    log_warning "Frontend didn't stop gracefully, force killing..."
                    kill -9 "$frontend_pid" 2>/dev/null || true
                fi
            fi
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi

    # Stop backend
    if [[ -f "$BACKEND_PID_FILE" ]]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE" 2>/dev/null || echo "")
        if [[ -n "$backend_pid" && "$backend_pid" != "0" ]]; then
            if kill -0 "$backend_pid" 2>/dev/null; then
                log_info "Stopping backend (PID: $backend_pid)"
                kill "$backend_pid" 2>/dev/null || true
                sleep 2
                if kill -0 "$backend_pid" 2>/dev/null; then
                    log_warning "Backend didn't stop gracefully, force killing..."
                    kill -9 "$backend_pid" 2>/dev/null || true
                fi
            fi
        fi
        rm -f "$BACKEND_PID_FILE"
    fi

    # Stop MCP server
    if [[ -f "$MCP_PID_FILE" ]]; then
        local mcp_pid=$(cat "$MCP_PID_FILE" 2>/dev/null || echo "")
        if [[ -n "$mcp_pid" && "$mcp_pid" != "0" ]]; then
            if kill -0 "$mcp_pid" 2>/dev/null; then
                log_info "Stopping MCP server (PID: $mcp_pid)"
                kill "$mcp_pid" 2>/dev/null || true
                sleep 2
                if kill -0 "$mcp_pid" 2>/dev/null; then
                    log_warning "MCP server didn't stop gracefully, force killing..."
                    kill -9 "$mcp_pid" 2>/dev/null || true
                fi
            fi
        fi
        rm -f "$MCP_PID_FILE"
    fi

    log_success "All servers stopped"
}

# Load environment variables
load_env() {
    if [[ -f "$ENV_FILE" ]]; then
        log_info "Loading environment from $ENV_FILE"
        # shellcheck disable=SC2046
        export $(grep -v '^[[:space:]]*#' "$ENV_FILE" | grep -E '^[A-Za-z_][A-Za-z0-9_]*=' | xargs -I{} echo {}) || true
    else
        log_debug "No .env file found, using defaults"
    fi
}

# Create necessary directories
setup_directories() {
    mkdir -p "$LOG_DIR"
    mkdir -p "$(dirname "$FRONTEND_PID_FILE")"
    mkdir -p "$(dirname "$BACKEND_PID_FILE")"
}

# Check dependencies
check_dependencies() {
    local missing=()
    local required_commands=("node" "npm" "python3" "curl" "lsof" "grep" "awk" "sed")

    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing+=("$cmd")
        fi
    done

    if (( ${#missing[@]} > 0 )); then
        log_error "Missing dependencies: ${missing[*]}"
        log_info "Please install missing dependencies and try again"
        exit 1
    fi

    log_debug "All dependencies found"
}

# Wait for service to be ready
wait_for_service() {
    local url="$1"
    local timeout="$2"
    local service_name="$3"

    log_info "Waiting for $service_name to be ready..."
    local start_time=$(date +%s)

    while (( $(date +%s) - start_time < timeout )); do
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

        if [[ "$http_code" =~ ^(200|302|404)$ ]]; then
            log_success "$service_name is ready (HTTP $http_code)"
            return 0
        fi

        log_debug "$service_name not ready yet (HTTP $http_code), waiting..."
        sleep 2
    done

    log_warning "$service_name not ready within ${timeout}s"
    return 1
}

# Cleanup function for graceful shutdown
cleanup() {
    log_info "Shutting down servers..."
    stop_servers
    log_success "Shutdown complete"
    exit 0
}

# Monitor running processes
monitor_processes() {
    while true; do
        sleep 5

        # Check frontend
        if $RUN_FRONTEND && [[ -f "$FRONTEND_PID_FILE" ]]; then
            local frontend_pid=$(cat "$FRONTEND_PID_FILE" 2>/dev/null || echo "")
            if [[ -n "$frontend_pid" && "$frontend_pid" != "0" ]]; then
                if ! kill -0 "$frontend_pid" 2>/dev/null; then
                    log_error "Frontend process exited unexpectedly"
                    cleanup
                fi
            fi
        fi

        # Check backend
        if $RUN_BACKEND && [[ -f "$BACKEND_PID_FILE" ]]; then
            local backend_pid=$(cat "$BACKEND_PID_FILE" 2>/dev/null || echo "")
            if [[ -n "$backend_pid" && "$backend_pid" != "0" ]]; then
                if ! kill -0 "$backend_pid" 2>/dev/null; then
                    log_error "Backend process exited unexpectedly"
                    cleanup
                fi
            fi
        fi

        # Check MCP server
        if $RUN_MCP && [[ -f "$MCP_PID_FILE" ]]; then
            local mcp_pid=$(cat "$MCP_PID_FILE" 2>/dev/null || echo "")
            if [[ -n "$mcp_pid" && "$mcp_pid" != "0" ]]; then
                if ! kill -0 "$mcp_pid" 2>/dev/null; then
                    log_error "MCP server process exited unexpectedly"
                    cleanup
                fi
            fi
        fi
    done
}

# Start frontend server
start_frontend() {
    log_info "Starting frontend server on port $FRONTEND_PORT..."

    if [[ ! -f "frontend/package.json" ]]; then
        log_error "frontend/package.json not found"
        exit 1
    fi

    cd frontend

    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing frontend dependencies..."
        npm install --no-fund --no-audit >>"$PROJECT_ROOT/$LOG_DIR/frontend.log" 2>&1
    fi

    # Check port availability
    if ! check_port "$FRONTEND_PORT"; then
        log_warning "Port $FRONTEND_PORT is in use, Vite will choose another port"
    fi

    # Start the frontend server
    nohup npm run dev >>"$PROJECT_ROOT/$LOG_DIR/frontend.log" 2>&1 &
    local frontend_pid=$!
    echo "$frontend_pid" > "$PROJECT_ROOT/$FRONTEND_PID_FILE"

    cd "$PROJECT_ROOT"

    # Verify the process started
    sleep 2
    if kill -0 "$frontend_pid" 2>/dev/null; then
        log_success "Frontend started (PID: $frontend_pid)"
    else
        log_error "Failed to start frontend"
        exit 1
    fi
}

# Start MCP server
start_mcp() {
    log_info "Starting MCP server on port $MCP_PORT..."

    if [[ ! -d "tools/mcp-server" ]]; then
        log_error "MCP server directory not found"
        exit 1
    fi

    cd tools/mcp-server

    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing MCP server dependencies..."
        npm install --no-fund --no-audit >>"$PROJECT_ROOT/$LOG_DIR/mcp.log" 2>&1
    fi

    # Check port availability
    if ! check_port "$MCP_PORT"; then
        log_error "Port $MCP_PORT is already in use"
        exit 1
    fi

    # Start the MCP server
    nohup npm start >>"$PROJECT_ROOT/$LOG_DIR/mcp.log" 2>&1 &
    local mcp_pid=$!
    echo "$mcp_pid" > "$PROJECT_ROOT/$MCP_PID_FILE"

    cd "$PROJECT_ROOT"

    # Verify the process started
    sleep 2
    if kill -0 "$mcp_pid" 2>/dev/null; then
        log_success "MCP server started (PID: $mcp_pid)"
    else
        log_error "Failed to start MCP server"
        exit 1
    fi
}

# Start backend server
start_backend() {
    log_info "Starting backend server on port $BACKEND_PORT..."

    if [[ ! -d "backend" ]]; then
        log_error "Backend directory not found"
        exit 1
    fi

    cd backend

    # Check virtual environment
    if [[ ! -d "venv" ]]; then
        log_error "Virtual environment not found"
        log_info "Create it with: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi

    # Activate virtual environment
    source venv/bin/activate

    # Check daphne installation
    if ! command -v daphne >/dev/null 2>&1; then
        log_error "Daphne not installed"
        log_info "Install with: pip install daphne"
        exit 1
    fi

    # Run migrations if requested
    if $RUN_MIGRATIONS; then
        log_info "Running database migrations..."
        python manage.py migrate >>"$PROJECT_ROOT/$LOG_DIR/backend.log" 2>&1
        if [[ $? -eq 0 ]]; then
            log_success "Migrations completed"
        else
            log_error "Migrations failed"
            exit 1
        fi
    fi

    # Check port availability
    if ! check_port "$BACKEND_PORT"; then
        log_error "Port $BACKEND_PORT is already in use"
        exit 1
    fi

    # Start the backend server
    export DJANGO_SETTINGS_MODULE=core.settings
    nohup daphne -b 0.0.0.0 -p "$BACKEND_PORT" core.asgi:application >>"$PROJECT_ROOT/$LOG_DIR/backend.log" 2>&1 &
    local backend_pid=$!
    echo "$backend_pid" > "$PROJECT_ROOT/$BACKEND_PID_FILE"

    cd "$PROJECT_ROOT"

    # Verify the process started
    sleep 2
    if kill -0 "$backend_pid" 2>/dev/null; then
        log_success "Backend started (PID: $backend_pid)"
    else
        log_error "Failed to start backend"
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --no-frontend) RUN_FRONTEND=false; shift ;;
        --no-backend) RUN_BACKEND=false; shift ;;
        --no-mcp) RUN_MCP=false; shift ;;
        --migrate) RUN_MIGRATIONS=true; shift ;;
        --env) ENV_FILE="$2"; shift 2 ;;
        --frontend-port) FRONTEND_PORT="$2"; shift 2 ;;
        --backend-port) BACKEND_PORT="$2"; shift 2 ;;
        --mcp-port) MCP_PORT="$2"; shift 2 ;;
        --verbose) VERBOSE=true; shift ;;
        --status) show_status; exit 0 ;;
        --stop) stop_servers; exit 0 ;;
        -h|--help) usage ;;
        *) log_error "Unknown option: $1"; usage ;;
    esac
done

# Resolve script directory & project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Main execution
main() {
    # Set up signal handlers
    trap cleanup INT TERM

    # Initialize
    load_env
    setup_directories
    check_dependencies

    # Stop any existing servers first
    stop_servers

    # Start servers
    if $RUN_FRONTEND; then
        start_frontend
    fi

    if $RUN_BACKEND; then
        start_backend
    fi

    if $RUN_MCP; then
        start_mcp
    fi

    # Wait for services to be ready
    log_info "Performing readiness checks..."

    if $RUN_FRONTEND; then
        wait_for_service "http://localhost:$FRONTEND_PORT" "$FRONTEND_TIMEOUT" "Frontend"
    fi

    if $RUN_BACKEND; then
        # Try GraphQL endpoint first, then admin
        wait_for_service "http://localhost:$BACKEND_PORT/graphql/" 6 "Backend GraphQL" || \
        wait_for_service "http://localhost:$BACKEND_PORT/admin/" "$BACKEND_TIMEOUT" "Backend Admin"
    fi

    if $RUN_MCP; then
        wait_for_service "http://localhost:$MCP_PORT/models" "$MCP_TIMEOUT" "MCP Server"
    fi

    # Display server information
    echo -e "\n${GREEN}🎉 All servers are running!${NC}\n"

    if $RUN_FRONTEND; then
        echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:$FRONTEND_PORT"
    fi

    if $RUN_BACKEND; then
        echo -e "${BLUE}🐍 Backend:${NC} http://localhost:$BACKEND_PORT"
        echo -e "${BLUE}🔌 WebSocket:${NC} ws://localhost:$BACKEND_PORT/ws/"
        echo -e "${BLUE}⚙️  Admin:${NC} http://localhost:$BACKEND_PORT/admin/"
    fi

    if $RUN_MCP; then
        echo -e "${BLUE}🔧 MCP Server:${NC} http://localhost:$MCP_PORT"
        echo -e "${BLUE}📋 MCP Models:${NC} http://localhost:$MCP_PORT/models"
    fi

    echo -e "\n${CYAN}📜 Logs:${NC}"
    echo -e "  Frontend: tail -f $LOG_DIR/frontend.log"
    echo -e "  Backend:  tail -f $LOG_DIR/backend.log"
    echo -e "  MCP:      tail -f $LOG_DIR/mcp.log"
    echo -e "  Combined: tail -f $LOG_DIR/frontend.log $LOG_DIR/backend.log $LOG_DIR/mcp.log"

    echo -e "\n${YELLOW}💡 Press Ctrl+C to stop all servers${NC}"
    echo -e "${YELLOW}💡 Use '$0 --status' to check server status${NC}"

    # Start monitoring
    monitor_processes &
    wait
}

# Run main function
main "$@"
