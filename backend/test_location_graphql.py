#!/usr/bin/env python3
"""
Test script to verify GraphQL location queries are working.
"""

import os
import sys

import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import City, Country, State, ZipCode


def test_location_data():
    """Test that location data exists and can be queried"""
    print("Testing location data...")

    # Test countries
    print(f"\nCountries: {Country.objects.count()}")
    countries = Country.objects.all()[:5]  # Show first 5
    for country in countries:
        print(
            f"  {country.name} ({country.code}) - {country.phone_code} {country.flag_emoji}"
        )

    # Test states
    print(f"\nStates: {State.objects.count()}")
    states = State.objects.all()[:5]  # Show first 5
    for state in states:
        print(f"  {state.name} ({state.code}) - {state.country.name}")

    # Test cities
    print(f"\nCities: {City.objects.count()}")
    cities = City.objects.all()[:5]  # Show first 5
    for city in cities:
        print(f"  {city.name} - {city.state.name}, {city.country.name}")

    # Test zip codes
    print(f"\nZip Codes: {ZipCode.objects.count()}")
    zipcodes = ZipCode.objects.all()[:5]  # Show first 5
    for zipcode in zipcodes:
        print(
            f"  {zipcode.code} - {zipcode.city.name}, {zipcode.state.name}, {zipcode.country.name}"
        )

    # Test specific country queries
    print(f"\nTesting specific queries:")

    # USA data
    usa = Country.objects.get(code="USA")
    print(f"USA: {usa.name} - {usa.phone_code}")
    usa_states = State.objects.filter(country=usa)
    print(f"  States: {usa_states.count()}")

    # Mexico data
    mexico = Country.objects.get(code="MEX")
    print(f"Mexico: {mexico.name} - {mexico.phone_code}")
    mex_states = State.objects.filter(country=mexico)
    print(f"  States: {mex_states.count()}")

    # Test phone codes
    print(f"\nPhone codes by region:")
    north_america = Country.objects.filter(code__in=["USA", "CAN", "MEX"])
    for country in north_america:
        print(f"  {country.name}: {country.phone_code}")

    europe = Country.objects.filter(code__in=["GBR", "DEU", "FRA", "ITA", "ESP"])
    for country in europe:
        print(f"  {country.name}: {country.phone_code}")

    south_america = Country.objects.filter(code__in=["BRA", "ARG", "CHL", "COL", "PER"])
    for country in south_america:
        print(f"  {country.name}: {country.phone_code}")


if __name__ == "__main__":
    test_location_data()
