#!/usr/bin/env python3
"""
Test script to verify the login endpoint works after fixing the phone field issue
"""

import json

import requests


def test_login():
    """Test the login endpoint"""
    url = "http://localhost:8000/api/login/"

    # Test data - you may need to adjust these credentials
    test_credentials = {
        "username": "admin",  # Change this to a real username in your system
        "password": "admin123",  # Change this to the real password
    }

    try:
        print("Testing login endpoint...")
        print(f"URL: {url}")
        print(f"Credentials: {test_credentials['username']}")

        response = requests.post(url, json=test_credentials, timeout=10)

        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")

        if response.status_code == 200:
            print("✅ Login successful!")
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
        else:
            print(f"❌ Login failed with status {response.status_code}")
            print(f"Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print(
            "❌ Cannot connect to server. Make sure Django server is running on localhost:8000"
        )
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    test_login()
