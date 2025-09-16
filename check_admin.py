#!/usr/bin/env python
import os
import sys

import django

# Add the backend directory to the Python path
sys.path.append("/Users/mihai/Desktop/rnexus/backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# Setup Django
django.setup()

from django.contrib.admin.sites import site

print("Registered models in admin:")
for model, admin in site._registry.items():
    print(f"{model._meta.app_label}.{model._meta.model_name}: {admin}")
    if hasattr(admin, "inlines"):
        print(f"  Inlines: {admin.inlines}")
