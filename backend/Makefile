.PHONY: help install format lint test coverage security clean all

# Default target
help:
	@echo "RNexus Development Tools"
	@echo "========================"
	@echo ""
	@echo "Available commands:"
	@echo "  install     - Install development dependencies"
	@echo "  format      - Format code with Black and isort"
	@echo "  lint        - Run linting tools (Black, isort, MyPy)"
	@echo "  test        - Run Django tests"
	@echo "  coverage    - Run tests with coverage report"
	@echo "  security    - Run security scans (Bandit, Safety)"
	@echo "  clean       - Clean up generated files"
	@echo "  all         - Run all checks (format, lint, test, security)"
	@echo "  pre-commit  - Run pre-commit hooks on all files"
	@echo ""

# Install development dependencies
install:
	@echo "Installing development dependencies..."
	pip install -r requirements-dev.txt

# Format code
format:
	@echo "Formatting code with Black..."
	black .
	@echo "Sorting imports with isort..."
	isort .

# Run linting tools
lint:
	@echo "Checking code formatting with Black..."
	black . --check
	@echo "Checking import sorting with isort..."
	isort . --check-only
	@echo "Running type checking with MyPy..."
	mypy . --ignore-missing-imports --no-strict-optional

# Run Django tests
test:
	@echo "Running Django tests..."
	python manage.py test --verbosity=2

# Run tests with coverage
coverage:
	@echo "Running tests with coverage..."
	pytest --cov=api --cov=core --cov-report=term-missing --cov-report=html

# Run security scans
security:
	@echo "Installing security tools..."
	pip install bandit safety
	@echo "Running Bandit security scan..."
	bandit -r . -f txt -o bandit-report.txt || true
	@echo "Running Safety dependency check..."
	safety check --json --output safety-report.json || true
	@echo "Security reports generated:"
	@echo "  - Bandit: bandit-report.txt"
	@echo "  - Safety: safety-report.json"

# Clean up generated files
clean:
	@echo "Cleaning up generated files..."
	rm -rf __pycache__/
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf htmlcov/
	rm -f .coverage
	rm -f coverage.xml
	rm -f bandit-report.txt
	rm -f safety-report.json
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Run all checks
all: format lint test security
	@echo "All checks completed!"

# Run pre-commit hooks
pre-commit:
	@echo "Running pre-commit hooks..."
	pre-commit run --all-files

# Quick development workflow
dev: format lint test
	@echo "Development workflow completed!"

# Install pre-commit hooks
install-hooks:
	@echo "Installing pre-commit hooks..."
	pre-commit install

# Update pre-commit hooks
update-hooks:
	@echo "Updating pre-commit hooks..."
	pre-commit autoupdate
