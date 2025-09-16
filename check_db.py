#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append('/Users/mihai/Desktop/rnexus/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Setup Django
django.setup()

from api.models import UserProfile

def check_address_data():
    profiles = UserProfile.objects.all()
    print(f"Total profiles: {profiles.count()}")
    print("\nAddress data in database:")
    print("-" * 80)

    for p in profiles:
        print(f"User: {p.user.username}")
        print(f"  Street Address: {p.street_address or 'None'}")
        print(f"  City: {p.city or 'None'}")
        print(f"  State/Province: {p.state_province or 'None'}")
        print(f"  ZIP Code: {p.zip_code or 'None'}")
        print(f"  Country: {p.country or 'None'}")
        print(f"  Country Code: {p.country_code or 'None'}")
        print()

if __name__ == "__main__":
    check_address_data()
