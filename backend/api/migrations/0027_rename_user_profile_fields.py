# Generated manually for field renaming

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0026_rename_profile_fields"),
    ]

    operations = [
        # Rename fields to match new naming convention
        migrations.RenameField(
            model_name="userprofile",
            old_name="maternal_last_name",
            new_name="lastnamem",
        ),
        migrations.RenameField(
            model_name="userprofile",
            old_name="date_of_birth",
            new_name="birthname",
        ),
    ]
