#!/usr/bin/env python
"""
Script to populate all US states and Mexican states in the database.
This script adds all 50 US states and all 32 Mexican states.
"""

import os
import sys

import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import Country, State


def populate_us_states():
    """Add all 50 US states"""
    print("Adding US states...")

    # Get the US country
    try:
        us_country = Country.objects.get(code="USA")
    except Country.DoesNotExist:
        print("Error: United States country not found in database")
        return

    # All 50 US states with their abbreviations
    us_states = [
        ("Alabama", "AL"),
        ("Alaska", "AK"),
        ("Arizona", "AZ"),
        ("Arkansas", "AR"),
        ("California", "CA"),
        ("Colorado", "CO"),
        ("Connecticut", "CT"),
        ("Delaware", "DE"),
        ("Florida", "FL"),
        ("Georgia", "GA"),
        ("Hawaii", "HI"),
        ("Idaho", "ID"),
        ("Illinois", "IL"),
        ("Indiana", "IN"),
        ("Iowa", "IA"),
        ("Kansas", "KS"),
        ("Kentucky", "KY"),
        ("Louisiana", "LA"),
        ("Maine", "ME"),
        ("Maryland", "MD"),
        ("Massachusetts", "MA"),
        ("Michigan", "MI"),
        ("Minnesota", "MN"),
        ("Mississippi", "MS"),
        ("Missouri", "MO"),
        ("Montana", "MT"),
        ("Nebraska", "NE"),
        ("Nevada", "NV"),
        ("New Hampshire", "NH"),
        ("New Jersey", "NJ"),
        ("New Mexico", "NM"),
        ("New York", "NY"),
        ("North Carolina", "NC"),
        ("North Dakota", "ND"),
        ("Ohio", "OH"),
        ("Oklahoma", "OK"),
        ("Oregon", "OR"),
        ("Pennsylvania", "PA"),
        ("Rhode Island", "RI"),
        ("South Carolina", "SC"),
        ("South Dakota", "SD"),
        ("Tennessee", "TN"),
        ("Texas", "TX"),
        ("Utah", "UT"),
        ("Vermont", "VT"),
        ("Virginia", "VA"),
        ("Washington", "WA"),
        ("West Virginia", "WV"),
        ("Wisconsin", "WI"),
        ("Wyoming", "WY"),
    ]

    added_count = 0
    for state_name, state_code in us_states:
        state, created = State.objects.get_or_create(
            name=state_name, country=us_country, defaults={"code": state_code}
        )
        if created:
            print(f"  Added: {state_name} ({state_code})")
            added_count += 1
        else:
            print(f"  Already exists: {state_name} ({state_code})")

    print(f"US states: {added_count} new states added")


def populate_mexican_states():
    """Add all 32 Mexican states"""
    print("\nAdding Mexican states...")

    # Get the Mexico country
    try:
        mexico_country = Country.objects.get(code="MEX")
    except Country.DoesNotExist:
        print("Error: Mexico country not found in database")
        return

    # All 32 Mexican states with their abbreviations
    mexican_states = [
        ("Aguascalientes", "AGS"),
        ("Baja California", "BCN"),
        ("Baja California Sur", "BCS"),
        ("Campeche", "CAM"),
        ("Chiapas", "CHP"),
        ("Chihuahua", "CHH"),
        ("Ciudad de México", "CDMX"),
        ("Coahuila", "COA"),
        ("Colima", "COL"),
        ("Durango", "DUR"),
        ("Guanajuato", "GUA"),
        ("Guerrero", "GRO"),
        ("Hidalgo", "HGO"),
        ("Jalisco", "JAL"),
        ("México", "MEX"),
        ("Michoacán", "MIC"),
        ("Morelos", "MOR"),
        ("Nayarit", "NAY"),
        ("Nuevo León", "NLE"),
        ("Oaxaca", "OAX"),
        ("Puebla", "PUE"),
        ("Querétaro", "QUE"),
        ("Quintana Roo", "ROO"),
        ("San Luis Potosí", "SLP"),
        ("Sinaloa", "SIN"),
        ("Sonora", "SON"),
        ("Tabasco", "TAB"),
        ("Tamaulipas", "TAM"),
        ("Tlaxcala", "TLA"),
        ("Veracruz", "VER"),
        ("Yucatán", "YUC"),
        ("Zacatecas", "ZAC"),
    ]

    added_count = 0
    for state_name, state_code in mexican_states:
        state, created = State.objects.get_or_create(
            name=state_name, country=mexico_country, defaults={"code": state_code}
        )
        if created:
            print(f"  Added: {state_name} ({state_code})")
            added_count += 1
        else:
            print(f"  Already exists: {state_name} ({state_code})")

    print(f"Mexican states: {added_count} new states added")


def main():
    """Main function to populate all states"""
    print("🌍 Populating all US and Mexican states...")
    print("=" * 50)

    # Check if countries exist
    us_country = Country.objects.filter(code="USA").first()
    mexico_country = Country.objects.filter(code="MEX").first()

    if not us_country:
        print(
            "Error: United States country not found. Please run populate_location_data.py first."
        )
        return

    if not mexico_country:
        print(
            "Error: Mexico country not found. Please run populate_location_data.py first."
        )
        return

    # Populate states
    populate_us_states()
    populate_mexican_states()

    # Summary
    total_us_states = State.objects.filter(country__code="USA").count()
    total_mexican_states = State.objects.filter(country__code="MEX").count()

    print("\n" + "=" * 50)
    print("✅ Population complete!")
    print(f"Total US states: {total_us_states}")
    print(f"Total Mexican states: {total_mexican_states}")
    print(f"Total states: {total_us_states + total_mexican_states}")


if __name__ == "__main__":
    main()
