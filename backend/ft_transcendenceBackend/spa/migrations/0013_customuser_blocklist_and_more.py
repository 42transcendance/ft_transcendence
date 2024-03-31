# Generated by Django 4.2.11 on 2024-03-26 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spa', '0012_customuser_join_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='blocklist',
            field=models.ManyToManyField(blank=True, to='spa.customuser'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='income_friends_requests',
            field=models.ManyToManyField(blank=True, to='spa.customuser'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='outcome_friends_requests',
            field=models.ManyToManyField(blank=True, to='spa.customuser'),
        ),
    ]