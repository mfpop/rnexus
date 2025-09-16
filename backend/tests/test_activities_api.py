#!/usr/bin/env python3
"""
Test Activities API Script
This script tests the activities API endpoints with authentication.
"""

import json

import requests

BASE_URL = "http://localhost:8000"


def test_activities_api():
    """Test the activities API endpoints"""

    # First, login to get a JWT token
    print("🔐 Logging in to get JWT token...")
    login_data = {"username": "mihai", "password": "password123"}

    login_response = requests.post(f"{BASE_URL}/api/login/", json=login_data)
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return

    login_result = login_response.json()
    if not login_result.get("success"):
        print(f"❌ Login failed: {login_result.get('error', 'Unknown error')}")
        return

    token = login_result.get("token")
    if not token:
        print("❌ No token received")
        return

    print("✅ Login successful, got JWT token")

    # Set up headers with authentication
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    # Test getting activities list
    print("\n📋 Testing GET /api/activities/...")
    activities_response = requests.get(f"{BASE_URL}/api/activities/", headers=headers)

    if activities_response.status_code == 200:
        activities_result = activities_response.json()
        if activities_result.get("success"):
            activities = activities_result.get("activities", [])
            print(f"✅ Successfully retrieved {len(activities)} activities")
            for activity in activities[:3]:  # Show first 3 activities
                print(f"  - {activity['title']} ({activity['status']})")
        else:
            print(f"❌ API returned error: {activities_result.get('error')}")
    else:
        print(f"❌ Failed to get activities: {activities_response.status_code}")
        print(activities_response.text)

    # Test getting a specific activity
    if activities_response.status_code == 200:
        activities_result = activities_response.json()
        if activities_result.get("success") and activities_result.get("activities"):
            first_activity = activities_result["activities"][0]
            activity_id = first_activity["id"]

            print(f"\n🔍 Testing GET /api/activities/{activity_id}/...")
            activity_response = requests.get(
                f"{BASE_URL}/api/activities/{activity_id}/", headers=headers
            )

            if activity_response.status_code == 200:
                activity_result = activity_response.json()
                if activity_result.get("success"):
                    print(
                        f"✅ Successfully retrieved activity: {activity_result['activity']['title']}"
                    )
                else:
                    print(f"❌ API returned error: {activity_result.get('error')}")
            else:
                print(f"❌ Failed to get activity: {activity_response.status_code}")

    # Test starting an activity
    if activities_response.status_code == 200:
        activities_result = activities_response.json()
        if activities_result.get("success") and activities_result.get("activities"):
            # Find a planned activity to start
            planned_activity = None
            for activity in activities_result["activities"]:
                if activity["status"] == "planned":
                    planned_activity = activity
                    break

            if planned_activity:
                activity_id = planned_activity["id"]
                print(f"\n▶️  Testing POST /api/activities/{activity_id}/start/...")
                start_response = requests.post(
                    f"{BASE_URL}/api/activities/{activity_id}/start/", headers=headers
                )

                if start_response.status_code == 200:
                    start_result = start_response.json()
                    if start_result.get("success"):
                        print(
                            f"✅ Successfully started activity: {start_result['activity']['title']}"
                        )
                        print(
                            f"   Status changed to: {start_result['activity']['status']}"
                        )
                    else:
                        print(f"❌ API returned error: {start_result.get('error')}")
                else:
                    print(f"❌ Failed to start activity: {start_response.status_code}")
                    print(start_response.text)
            else:
                print("\n⚠️  No planned activities found to test start functionality")

    print("\n🎉 API testing completed!")


if __name__ == "__main__":
    test_activities_api()
