# Generated manually for Tag model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_updatecomment_updatelike"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50, unique=True)),
                ("description", models.TextField(blank=True)),
                ("color", models.CharField(default="#3B82F6", max_length=7)),
                ("category", models.CharField(blank=True, max_length=50)),
                ("is_active", models.BooleanField(default=True)),
                ("usage_count", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["category", "name"],
            },
        ),
        migrations.AddIndex(
            model_name="tag",
            index=models.Index(
                fields=["category", "is_active"], name="api_tag_category_8b2c8c_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="tag",
            index=models.Index(
                fields=["is_active", "usage_count"], name="api_tag_is_activ_2c8c8c_idx"
            ),
        ),
    ]
