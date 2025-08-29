#!/usr/bin/env python3
"""
Script to add sample education and work experience data for admin user
"""

import json
import os
import sys
from datetime import date, datetime

import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import UserProfile


def add_admin_education_experience():
    """Add sample education and work experience for admin user"""

    try:
        # Find admin user
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            print("❌ No admin user found. Please create an admin user first.")
            return False

        print(f"✅ Found admin user: {admin_user.email}")

        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=admin_user)
        if created:
            print("✅ Created new user profile")
        else:
            print("✅ Found existing user profile")

        # Sample education data
        education_data = [
            {
                "id": "edu_001",
                "school": "Stanford University",
                "degree": "Master of Business Administration",
                "field": "Business Administration & Management",
                "startYear": "2018",
                "endYear": "2020",
                "description": "Specialized in Operations Management and Lean Manufacturing. Graduated with honors. Completed capstone project on 'Implementing Six Sigma in Automotive Manufacturing'.",
                "visible": True,
            },
            {
                "id": "edu_002",
                "school": "University of California, Berkeley",
                "degree": "Bachelor of Science",
                "field": "Industrial Engineering",
                "startYear": "2014",
                "endYear": "2018",
                "description": "Major in Industrial Engineering with focus on Manufacturing Systems and Quality Control. Minor in Business Administration. Dean's List recipient for 3 years.",
                "visible": True,
            },
            {
                "id": "edu_003",
                "school": "MIT Professional Education",
                "degree": "Professional Certificate",
                "field": "Advanced Manufacturing",
                "startYear": "2021",
                "endYear": "2021",
                "description": "Intensive 6-month program covering Industry 4.0, Smart Manufacturing, and Digital Transformation in Manufacturing.",
                "visible": True,
            },
        ]

        # Sample work experience data
        work_history_data = [
            {
                "id": "work_001",
                "company": "Tesla Motors",
                "title": "Senior Manufacturing Engineer",
                "department": "Production Engineering",
                "startYear": "2022",
                "endYear": "Present",
                "description": "Lead manufacturing engineer responsible for optimizing production lines for Model 3 and Model Y. Implemented lean manufacturing principles resulting in 25% efficiency improvement. Managed team of 8 engineers and technicians.",
                "visible": True,
            },
            {
                "id": "work_002",
                "company": "Toyota Motor Corporation",
                "title": "Manufacturing Engineer",
                "department": "Quality Assurance",
                "startYear": "2020",
                "endYear": "2022",
                "description": "Developed and implemented quality control systems for automotive manufacturing. Led Kaizen improvement projects that reduced defect rates by 30%. Trained production staff on new quality procedures.",
                "visible": True,
            },
            {
                "id": "work_003",
                "company": "General Electric",
                "title": "Industrial Engineering Intern",
                "department": "Operations",
                "startYear": "2017",
                "endYear": "2018",
                "description": "Summer internship working on process optimization projects. Assisted in time-motion studies and workflow analysis. Contributed to 15% reduction in production cycle time.",
                "visible": True,
            },
            {
                "id": "work_004",
                "company": "Nexus LMD Solutions",
                "title": "Founder & CEO",
                "department": "Executive",
                "startYear": "2023",
                "endYear": "Present",
                "description": "Founded innovative manufacturing consulting company specializing in Lean Manufacturing and Digital Transformation. Leading team of 15 consultants serving Fortune 500 clients.",
                "visible": True,
            },
        ]

        # Update profile with education and work history
        profile.education = education_data
        profile.work_history = work_history_data

        # Also add some additional profile information
        profile.bio = """Experienced manufacturing professional with over 8 years in automotive and technology manufacturing.
        Specialized in Lean Manufacturing, Six Sigma, and Industry 4.0 implementation.
        Passionate about driving operational excellence and digital transformation in manufacturing environments.

        Key achievements:
        • Led 25% efficiency improvement at Tesla Motors
        • Reduced defect rates by 30% at Toyota
        • Implemented lean principles across multiple production facilities
        • Expert in manufacturing automation and quality systems"""

        profile.position = "Founder & CEO"
        profile.department = "Executive Management"
        profile.city = "San Francisco"
        profile.state_province = "California"
        profile.country = "United States"
        profile.zip_code = "94105"
        profile.street_address = "123 Innovation Drive"
        profile.apartment_suite = "Suite 500"
        profile.phone = "+1-555-0123"
        profile.phone_country_code = "+1"
        profile.phone_type = "mobile"

        profile.save()

        print("✅ Successfully updated admin user profile with:")
        print(f"   📚 Education: {len(education_data)} entries")
        print(f"   💼 Work Experience: {len(work_history_data)} entries")
        print(f"   📝 Bio: {len(profile.bio)} characters")
        print(f"   📍 Location: {profile.city}, {profile.state_province}")
        print(f"   📞 Phone: {profile.phone_country_code} {profile.phone}")

        # Verify the data was saved correctly
        profile.refresh_from_db()

        try:
            # Since we're storing as JSONField, no need to parse
            saved_education = profile.education
            saved_work = profile.work_history
            print(f"\n✅ Verification successful:")
            print(f"   Education entries: {len(saved_education)}")
            print(f"   Work history entries: {len(saved_work)}")
        except Exception as e:
            print(f"❌ Error verifying saved data: {e}")
            return False

        return True

    except Exception as e:
        print(f"❌ Error adding education and experience: {e}")
        import traceback

        traceback.print_exc()
        return False


def main():
    """Main function"""
    print("🚀 Adding Education and Work Experience for Admin User")
    print("=" * 60)

    success = add_admin_education_experience()

    if success:
        print("\n🎉 Successfully added sample data for admin user!")
        print("You can now test the profile functionality in the frontend.")
    else:
        print("\n❌ Failed to add sample data. Please check the error messages above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
