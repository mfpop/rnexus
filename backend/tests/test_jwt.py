import os

import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.conf import settings

import jwt

# Test token
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNzU1NDQyNTk5LCJpYXQiOjE3NTUzNTYxOTl9.xqvmTjb3yjFEoJaGWdFyBVkzXLdHii4TTXuMSuMZdeA"

print(f"Token: {token[:50]}...")
print(f"SECRET_KEY: {settings.SECRET_KEY[:20]}...")

try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    print("Decoded successfully:", payload)
except Exception as e:
    print("Decode failed:", e)
