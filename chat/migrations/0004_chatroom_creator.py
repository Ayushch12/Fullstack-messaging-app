# Generated by Django 5.0.6 on 2024-05-13 16:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0003_message_username"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatroom",
            name="creator",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
