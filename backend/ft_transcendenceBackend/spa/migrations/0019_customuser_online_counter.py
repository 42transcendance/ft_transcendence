# Generated by Django 4.2.13 on 2024-06-30 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spa', '0018_customuser_is_ingame_customuser_is_online'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='online_counter',
            field=models.IntegerField(default=0),
        ),
    ]
