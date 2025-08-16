#!/bin/bash

# RNexus Code Quality Check Script
# This script runs all code quality tools locally

set -e  # Exit on any error

echo "🔍 Running RNexus Code Quality Checks..."
echo "========================================"

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "❌ Virtual environment not activated. Please run: source venv/bin/activate"
    exit 1
fi

echo "✅ Virtual environment: $VIRTUAL_ENV"

# Function to run a tool and show status
run_tool() {
    local tool_name="$1"
    local command="$2"

    echo ""
    echo "🔧 Running $tool_name..."
    echo "Command: $command"

    if eval "$command"; then
        echo "✅ $tool_name passed"
    else
        echo "❌ $tool_name failed"
        return 1
    fi
}

# Run all tools
echo ""
echo "📝 Code Formatting Checks:"
run_tool "Black (code formatting)" "black . --check"
run_tool "isort (import sorting)" "isort . --check-only"

echo ""
echo "🔍 Code Quality Checks:"
run_tool "MyPy (type checking)" "mypy . --ignore-missing-imports --no-strict-optional"

echo ""
echo "🧪 Testing:"
run_tool "Django tests" "python manage.py test --verbosity=1"
run_tool "Pytest with coverage" "pytest --cov=api --cov=core --cov-report=term-missing"

echo ""
echo "🔒 Security Checks:"
# Install security tools if not present
if ! command -v bandit &> /dev/null; then
    echo "Installing bandit..."
    pip install bandit
fi

if ! command -v safety &> /dev/null; then
    echo "Installing safety..."
    pip install safety
fi

run_tool "Bandit (security scan)" "bandit -r . -f txt -o bandit-report.txt || true"
run_tool "Safety (dependency check)" "safety check --json --output safety-report.json || true"

echo ""
echo "========================================"
echo "🎉 All code quality checks completed!"
echo ""
echo "📊 Reports generated:"
echo "  - Bandit: bandit-report.txt"
echo "  - Safety: safety-report.json"
echo "  - Coverage: htmlcov/index.html"
echo ""
echo "💡 To fix formatting issues, run:"
echo "  black ."
echo "  isort ."
echo ""
echo "💡 To view coverage report:"
echo "  open htmlcov/index.html"
