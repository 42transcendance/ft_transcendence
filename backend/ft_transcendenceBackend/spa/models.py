from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    userid = models.CharField(max_length=20, unique=True, default='-1')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    friends = models.ManyToManyField('CustomUser', blank=True, related_name='user_friends')
    incoming_friends_requests = models.ManyToManyField('CustomUser', blank=True, related_name='user_incoming_friend_requests')
    outgoing_friends_requests = models.ManyToManyField('CustomUser', blank=True, related_name='user_outgoing_friend_requests')
    blocklist = models.ManyToManyField('CustomUser', blank=True, related_name='user_blocklist')
    join_date = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField('auth.Group', blank=True, related_name='user_custom')
    user_permissions = models.ManyToManyField('auth.Permission', blank=True, related_name='user_custom')

    is_online = models.BooleanField(default=False)
    is_ingame = models.BooleanField(default=False)
    online_counter = models.IntegerField(default=0)
    ingame_counter = models.IntegerField(default=0)

    def __str__(self):
        return self.username

class Game(models.Model):
    player1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player1_games')
    player2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player2_games')
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    date_played = models.DateTimeField(default=timezone.now)

class GameHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='game_history')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

class ChatMessage(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_global = models.BooleanField(default=False)