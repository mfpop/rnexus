#!/usr/bin/env python
"""
Script to add major cities for Baja California, Mexico.
"""

import os
import sys

import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import City, Country, State


def add_baja_california_cities():
    """Add major cities for Baja California"""
    print("Adding major cities for Baja California...")

    # Get the country and state
    try:
        country = Country.objects.get(code="MEX")
        state = State.objects.get(country=country, code="BCN")
    except (Country.DoesNotExist, State.DoesNotExist) as e:
        print(f"Error: {e}")
        return

    # Major cities in Baja California
    cities = [
        "Tijuana",
        "Mexicali",
        "Ensenada",
        "Tecate",
        "Rosarito",
        "Playas de Rosarito",
        "San Felipe",
        "San Quintín",
        "El Sauzal",
        "La Paz",
        "Cabo San Lucas",
        "San José del Cabo",
        "Todos Santos",
        "La Ribera",
        "Buena Vista",
        "Santiago",
        "Miraflores",
        "Cabo Pulmo",
        "El Pescadero",
        "Los Barriles",
    ]

    total_added = 0
    for city_name in cities:
        city, created = City.objects.get_or_create(
            name=city_name, state=state, country=country, defaults={"is_active": True}
        )
        if created:
            total_added += 1
            print(f"  Added: {city_name}")
        else:
            print(f"  Already exists: {city_name}")

    print(f"Total cities added: {total_added}")


if __name__ == "__main__":
    add_baja_california_cities()
