# Generated by Django 4.2.11 on 2024-04-01 11:55

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('spa', '0015_remove_customuser_income_friends_requests_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1_score', models.IntegerField()),
                ('player2_score', models.IntegerField()),
                ('date_played', models.DateTimeField(default=django.utils.timezone.now)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1_games', to='spa.customuser')),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2_games', to='spa.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='GameHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spa.game')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_history', to='spa.customuser')),
            ],
        ),
    ]