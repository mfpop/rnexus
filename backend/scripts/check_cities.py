#!/usr/bin/env python
"""
Script to check current city data in the database.
"""

import os
import sys
import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import City, State, Country
from django.db import models

def check_cities():
    """Check current city data"""
    print("Checking current city data...")
    
    # Total cities
    total_cities = City.objects.count()
    print(f"Total cities: {total_cities}")
    
    # Cities by country
    print("\nCities by country:")
    for country in Country.objects.filter(code__in=['USA', 'MEX']):
        country_cities = City.objects.filter(country=country)
        print(f"  {country.name}: {country_cities.count()} cities")
        
        # Show some examples
        if country_cities.exists():
            print(f"    Examples: {', '.join([c.name for c in country_cities[:5]])}")
    
    # Cities by state (top 5 states)
    print("\nTop 5 states by city count:")
    states_with_cities = State.objects.filter(cities__isnull=False).distinct().annotate(
        city_count=models.Count('cities')
    ).order_by('-city_count')[:5]
    
    for state in states_with_cities:
        print(f"  {state.name}, {state.country.name}: {state.city_count} cities")

if __name__ == '__main__':
    check_cities()
