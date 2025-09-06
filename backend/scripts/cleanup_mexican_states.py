#!/usr/bin/env python
"""
Script to clean up duplicate Mexican states with different spellings.
Keeps the properly accented versions and removes duplicates.
"""

import os
import sys
import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Country, State

def cleanup_mexican_states():
    """Remove duplicate Mexican states, keeping the properly accented versions"""
    print("Cleaning up duplicate Mexican states...")
    
    # Get the Mexico country
    try:
        mexico_country = Country.objects.get(code='MEX')
    except Country.DoesNotExist:
        print("Error: Mexico country not found in database")
        return
    
    # Define the correct state names (with proper accents)
    correct_states = {
        'Ciudad de México': 'CDMX',
        'México': 'MEX',
        'Michoacán': 'MIC',
        'Nuevo León': 'NLE',
        'Querétaro': 'QUE',
        'San Luis Potosí': 'SLP',
        'Yucatán': 'YUC'
    }
    
    # Remove duplicates
    for correct_name, code in correct_states.items():
        # Find all states with this code
        states_with_code = State.objects.filter(country=mexico_country, code=code)
        
        if states_with_code.count() > 1:
            print(f"Found {states_with_code.count()} states with code {code}:")
            for state in states_with_code:
                print(f"  - {state.name}")
            
            # Keep the correctly named one, delete the others
            correct_state = states_with_code.filter(name=correct_name).first()
            if correct_state:
                # Delete the incorrectly named ones
                incorrect_states = states_with_code.exclude(name=correct_name)
                for state in incorrect_states:
                    print(f"  Deleting: {state.name}")
                    state.delete()
                print(f"  Kept: {correct_state.name}")
            else:
                print(f"  Warning: No correctly named state found for {code}")
    
    # Final count
    total_mexican_states = State.objects.filter(country__code='MEX').count()
    print(f"\nTotal Mexican states after cleanup: {total_mexican_states}")

def main():
    """Main function"""
    print("🧹 Cleaning up duplicate Mexican states...")
    print("=" * 50)
    
    cleanup_mexican_states()
    
    print("\n" + "=" * 50)
    print("✅ Cleanup complete!")

if __name__ == '__main__':
    main()

