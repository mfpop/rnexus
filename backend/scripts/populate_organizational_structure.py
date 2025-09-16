#!/usr/bin/env python3
"""
Script to populate the organizational hierarchy tables with sample data
for a lean manufacturing plant structure.
"""

import os
import sys

import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import Department, Employee, Role


def create_departments():
    """Create the main departments for a lean manufacturing plant"""
    departments_data = [
        {
            "name": "Production",
            "description": "Manufacturing operations, assembly lines, and production planning",
        },
        {
            "name": "Quality Assurance",
            "description": "Quality control, testing, compliance, and continuous improvement",
        },
        {
            "name": "Maintenance",
            "description": "Equipment maintenance, preventive maintenance, and facility management",
        },
        {
            "name": "Logistics & Supply Chain",
            "description": "Material flow, warehouse management, and supplier coordination",
        },
        {
            "name": "Continuous Improvement",
            "description": "Lean methodologies, process optimization, and Kaizen initiatives",
        },
        {
            "name": "Human Resources",
            "description": "Employee development, recruitment, and organizational culture",
        },
        {
            "name": "Safety & Environmental",
            "description": "Workplace safety, environmental compliance, and risk management",
        },
        {
            "name": "Engineering",
            "description": "Process engineering, product development, and technical support",
        },
        {
            "name": "Information Technology",
            "description": "Systems support, data management, and digital transformation",
        },
    ]

    departments = {}
    for dept_data in departments_data:
        dept, created = Department.objects.get_or_create(
            name=dept_data["name"], defaults={"description": dept_data["description"]}
        )
        departments[dept.name] = dept
        if created:
            print(f"✅ Created department: {dept.name}")
        else:
            print(f"📋 Department already exists: {dept.name}")

    return departments


def create_roles(departments):
    """Create roles for each department with proper reporting hierarchy"""
    roles_data = [
        # Plant Management Level
        {
            "title": "Plant Manager",
            "department": "Production",
            "description": "Oversees all plant operations and departments",
            "reports_to": None,
        },
        # Department Manager Level
        {
            "title": "Production Manager",
            "department": "Production",
            "description": "Manages manufacturing operations and production planning",
            "reports_to": "Plant Manager",
        },
        {
            "title": "Quality Manager",
            "department": "Quality Assurance",
            "description": "Oversees quality control and compliance processes",
            "reports_to": "Plant Manager",
        },
        {
            "title": "Maintenance Manager",
            "department": "Maintenance",
            "description": "Manages equipment maintenance and facility operations",
            "reports_to": "Plant Manager",
        },
        {
            "title": "Logistics Manager",
            "department": "Logistics & Supply Chain",
            "description": "Oversees material flow and supply chain operations",
            "reports_to": "Plant Manager",
        },
        {
            "title": "CI Manager",
            "department": "Continuous Improvement",
            "description": "Leads lean initiatives and process optimization",
            "reports_to": "Plant Manager",
        },
        {
            "title": "HR Manager",
            "department": "Human Resources",
            "description": "Manages human resources and organizational development",
            "reports_to": "Plant Manager",
        },
        {
            "title": "Safety Manager",
            "department": "Safety & Environmental",
            "description": "Oversees workplace safety and environmental compliance",
            "reports_to": "Plant Manager",
        },
        {
            "title": "Engineering Manager",
            "department": "Engineering",
            "description": "Leads process engineering and technical support",
            "reports_to": "Plant Manager",
        },
        {
            "title": "IT Manager",
            "department": "Information Technology",
            "description": "Manages IT systems and digital transformation",
            "reports_to": "Plant Manager",
        },
        # Supervisor Level
        {
            "title": "Production Supervisor",
            "department": "Production",
            "description": "Supervises production line operations and team leaders",
            "reports_to": "Production Manager",
        },
        {
            "title": "Quality Supervisor",
            "department": "Quality Assurance",
            "description": "Supervises quality control technicians and inspectors",
            "reports_to": "Quality Manager",
        },
        {
            "title": "Maintenance Supervisor",
            "department": "Maintenance",
            "description": "Supervises maintenance technicians and equipment repairs",
            "reports_to": "Maintenance Manager",
        },
        {
            "title": "Warehouse Supervisor",
            "department": "Logistics & Supply Chain",
            "description": "Supervises warehouse operations and material handling",
            "reports_to": "Logistics Manager",
        },
        # Individual Contributor Level
        {
            "title": "Machine Operator",
            "department": "Production",
            "description": "Operates manufacturing equipment and assembly lines",
            "reports_to": "Production Supervisor",
        },
        {
            "title": "Quality Technician",
            "department": "Quality Assurance",
            "description": "Performs quality inspections and testing",
            "reports_to": "Quality Supervisor",
        },
        {
            "title": "Maintenance Technician",
            "department": "Maintenance",
            "description": "Performs equipment maintenance and repairs",
            "reports_to": "Maintenance Supervisor",
        },
        {
            "title": "Warehouse Clerk",
            "department": "Logistics & Supply Chain",
            "description": "Manages inventory and material transactions",
            "reports_to": "Warehouse Supervisor",
        },
        {
            "title": "Process Engineer",
            "department": "Engineering",
            "description": "Designs and optimizes manufacturing processes",
            "reports_to": "Engineering Manager",
        },
        {
            "title": "HR Generalist",
            "department": "Human Resources",
            "description": "Handles employee relations and HR processes",
            "reports_to": "HR Manager",
        },
        {
            "title": "Safety Officer",
            "department": "Safety & Environmental",
            "description": "Monitors workplace safety and conducts inspections",
            "reports_to": "Safety Manager",
        },
        {
            "title": "System Administrator",
            "department": "Information Technology",
            "description": "Manages IT infrastructure and user support",
            "reports_to": "IT Manager",
        },
    ]

    roles = {}
    for role_data in roles_data:
        dept = departments[role_data["department"]]
        reports_to = None
        if role_data["reports_to"]:
            reports_to = roles.get(role_data["reports_to"])

        role, created = Role.objects.get_or_create(
            title=role_data["title"],
            department=dept,
            defaults={
                "description": role_data["description"],
                "reports_to": reports_to,
            },
        )

        # Update reports_to if it was None initially
        if role_data["reports_to"] and not role.reports_to:
            role.reports_to = roles.get(role_data["reports_to"])
            role.save()

        roles[role_data["title"]] = role
        if created:
            print(f"✅ Created role: {role.title} in {dept.name}")
        else:
            print(f"📋 Role already exists: {role.title} in {dept.name}")

    return roles


def create_sample_employees(roles):
    """Create sample employees for key positions"""
    employees_data = [
        {
            "name": "John Smith",
            "email": "john.smith@nexuslmd.com",
            "role": "Plant Manager",
        },
        {
            "name": "Maria Garcia",
            "email": "maria.garcia@nexuslmd.com",
            "role": "Production Manager",
        },
        {
            "name": "David Chen",
            "email": "david.chen@nexuslmd.com",
            "role": "Quality Manager",
        },
        {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@nexuslmd.com",
            "role": "Maintenance Manager",
        },
        {
            "name": "Michael Brown",
            "email": "michael.brown@nexuslmd.com",
            "role": "Logistics Manager",
        },
        {"name": "Lisa Wang", "email": "lisa.wang@nexuslmd.com", "role": "CI Manager"},
        {
            "name": "Robert Davis",
            "email": "robert.davis@nexuslmd.com",
            "role": "HR Manager",
        },
        {
            "name": "Jennifer Lee",
            "email": "jennifer.lee@nexuslmd.com",
            "role": "Safety Manager",
        },
        {
            "name": "Thomas Wilson",
            "email": "thomas.wilson@nexuslmd.com",
            "role": "Engineering Manager",
        },
        {
            "name": "Amanda Rodriguez",
            "email": "amanda.rodriguez@nexuslmd.com",
            "role": "IT Manager",
        },
    ]

    for emp_data in employees_data:
        role = roles[emp_data["role"]]
        employee, created = Employee.objects.get_or_create(
            email=emp_data["email"], defaults={"name": emp_data["name"], "role": role}
        )

        if created:
            print(f"✅ Created employee: {employee.name} as {role.title}")
        else:
            print(f"📋 Employee already exists: {employee.name} as {role.title}")


def main():
    """Main function to populate the organizational structure"""
    print("🏭 Creating organizational structure for Nexus LMD...")
    print("=" * 60)

    # Create departments
    print("\n📋 Creating departments...")
    departments = create_departments()

    # Create roles
    print("\n👔 Creating roles...")
    roles = create_roles(departments)

    # Create sample employees
    print("\n👥 Creating sample employees...")
    create_sample_employees(roles)

    print("\n" + "=" * 60)
    print("✅ Organizational structure creation completed!")
    print(f"📊 Summary:")
    print(f"   • Departments: {Department.objects.count()}")
    print(f"   • Roles: {Role.objects.count()}")
    print(f"   • Employees: {Employee.objects.count()}")

    # Display hierarchy
    print(f"\n🏗️  Organizational Hierarchy:")
    plant_manager = Role.objects.filter(title="Plant Manager").first()
    if plant_manager:
        print(f"   • {plant_manager.title} (Level 0)")
        for dept_role in Role.objects.filter(reports_to=plant_manager):
            print(f"     └── {dept_role.title} - {dept_role.department.name} (Level 1)")
            for sup_role in Role.objects.filter(reports_to=dept_role):
                print(f"         └── {sup_role.title} (Level 2)")
                for ind_role in Role.objects.filter(reports_to=sup_role):
                    print(f"             └── {ind_role.title} (Level 3)")


if __name__ == "__main__":
    main()
