#!/bin/bash

# Activate the backend virtual environment
echo "🔧 Activating backend virtual environment..."
source backend/venv/bin/activate

# Set environment variables
export DJANGO_SETTINGS_MODULE=core.settings
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

echo "✅ Virtual environment activated!"
echo "📍 Current directory: $(pwd)"
echo "🐍 Python: $(which python)"
echo "📦 Django: $(python -c 'import django; print(django.get_version())')"
echo ""
echo "💡 You can now run Django commands like:"
echo "   python backend/manage.py runserver"
echo "   python backend/manage.py migrate"
echo "   python backend/manage.py shell"
echo ""
echo "🔧 To deactivate, run: deactivate"
