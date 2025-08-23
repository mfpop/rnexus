#!/usr/bin/env python3
"""
Test JWT Authentication Script
This script tests JWT authentication step by step.
"""

import json

import requests

BASE_URL = "http://localhost:8000"


def test_jwt_auth():
    """Test JWT authentication step by step"""

    print("🔐 Step 1: Testing login endpoint...")
    login_data = {"username": "mihai", "password": "password123"}

    login_response = requests.post(f"{BASE_URL}/api/login/", json=login_data)
    print(f"Login response status: {login_response.status_code}")
    print(f"Login response: {login_response.text}")

    if login_response.status_code != 200:
        print("❌ Login failed")
        return

    login_result = login_response.json()
    if not login_result.get("success"):
        print("❌ Login response indicates failure")
        return

    token = login_result.get("token")
    if not token:
        print("❌ No token in response")
        return

    print(f"\n✅ Got JWT token: {token[:50]}...")

    # Test the token with a simple request
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    print(f"\n🔍 Step 2: Testing token with activities endpoint...")
    print(f"Headers: {headers}")

    activities_response = requests.get(f"{BASE_URL}/api/activities/", headers=headers)
    print(f"Activities response status: {activities_response.status_code}")
    print(f"Activities response: {activities_response.text}")

    # Test with user info endpoint to see if JWT is working at all
    print(f"\n🔍 Step 3: Testing token with user info endpoint...")
    user_response = requests.get(f"{BASE_URL}/api/auth/user/", headers=headers)
    print(f"User info response status: {user_response.status_code}")
    print(f"User info response: {user_response.text}")

    # Test without token to see the difference
    print(f"\n🔍 Step 4: Testing without token...")
    no_auth_response = requests.get(f"{BASE_URL}/api/activities/")
    print(f"No auth response status: {no_auth_response.status_code}")
    print(f"No auth response: {no_auth_response.text}")


if __name__ == "__main__":
    test_jwt_auth()
