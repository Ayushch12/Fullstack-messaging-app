# Generated by Django 5.0.6 on 2024-05-14 04:03

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0004_chatroom_creator"),
    ]

    operations = [
        migrations.AlterField(
            model_name="chatroom",
            name="password",
            field=models.CharField(max_length=60),
        ),
        migrations.AlterField(
            model_name="message",
            name="id",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
    ]
