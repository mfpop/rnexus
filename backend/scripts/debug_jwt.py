#!/usr/bin/env python3
"""
Debug JWT Token Script
This script helps debug JWT token issues.
"""

import json

import requests

BASE_URL = "http://localhost:8000"


def debug_jwt():
    """Debug JWT token authentication"""

    print("🔐 Testing login endpoint...")
    login_data = {"username": "mihai", "password": "password123"}

    login_response = requests.post(f"{BASE_URL}/api/login/", json=login_data)
    print(f"Login response status: {login_response.status_code}")
    print(f"Login response: {login_response.text}")

    if login_response.status_code == 200:
        login_result = login_response.json()
        token = login_result.get("token")

        if token:
            print(f"\n✅ Got JWT token: {token[:50]}...")

            # Test the token with a simple request
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
            }

            print(f"\n🔍 Testing token with activities endpoint...")
            print(f"Headers: {headers}")

            activities_response = requests.get(
                f"{BASE_URL}/api/activities/", headers=headers
            )
            print(f"Activities response status: {activities_response.status_code}")
            print(f"Activities response: {activities_response.text}")
        else:
            print("❌ No token in response")
    else:
        print("❌ Login failed")


if __name__ == "__main__":
    debug_jwt()
