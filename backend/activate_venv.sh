#!/bin/bash

# RNexus Backend Virtual Environment Activation Script
# This script activates the consolidated virtual environment in the backend folder

echo "🐍 Activating RNexus Backend Virtual Environment..."
echo "📍 Location: $(pwd)/venv"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Error: Virtual environment not found!"
    echo "Please ensure you're in the backend directory and run:"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    echo "  pip install -r requirements-dev.txt"
    exit 1
fi

# Activate the virtual environment
source venv/bin/activate

# Verify activation
if [ "$VIRTUAL_ENV" != "" ]; then
    echo "✅ Virtual environment activated successfully!"
    echo "🐍 Python: $(which python)"
    echo "📦 Python version: $(python --version)"
    echo "🔧 Pip version: $(pip --version)"
    echo ""
    echo "💡 To deactivate, run: deactivate"
    echo "💡 To install packages: pip install -r requirements.txt"
    echo "💡 To install dev packages: pip install -r requirements-dev.txt"
else
    echo "❌ Failed to activate virtual environment"
    exit 1
fi
