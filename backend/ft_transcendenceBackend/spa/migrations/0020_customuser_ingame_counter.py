# Generated by Django 4.2.13 on 2024-07-05 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spa', '0019_customuser_online_counter'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='ingame_counter',
            field=models.IntegerField(default=0),
        ),
    ]
