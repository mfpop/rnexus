#!/usr/bin/env python3
"""
Test script for system messages WebSocket endpoint
"""

import asyncio
import json

import websockets


async def test_system_messages():
    uri = "ws://localhost:8000/ws/system_messages/"

    try:
        print(f"Connecting to {uri}...")
        async with websockets.connect(uri) as websocket:
            print("✅ System messages WebSocket connected successfully!")
            print("📝 Note: This endpoint requires authentication")
            print("🔐 Connection will be closed if not authenticated")

            # Wait a moment to see if we get disconnected
            try:
                await asyncio.wait_for(websocket.recv(), timeout=3.0)
            except asyncio.TimeoutError:
                print("⏰ No immediate response (expected)")

    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")


if __name__ == "__main__":
    asyncio.run(test_system_messages())
