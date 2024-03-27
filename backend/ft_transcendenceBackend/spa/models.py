from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    userid = models.CharField(max_length=20, unique=True, default='-1')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    # game_history = models.TextField(null=True, blank=True)
    friends = models.ManyToManyField('CustomUser', blank=True, related_name='user_friends')
    incoming_friends_requests = models.ManyToManyField('CustomUser', blank=True, related_name='user_incoming_friend_requests')
    outgoing_friends_requests = models.ManyToManyField('CustomUser', blank=True, related_name='user_outgoing_friend_requests')
    blocklist = models.ManyToManyField('CustomUser', blank=True, related_name='user_blocklist')
    join_date = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField('auth.Group', blank=True, related_name='user_custom')
    user_permissions = models.ManyToManyField('auth.Permission', blank=True, related_name='user_custom')
    

    def __str__(self):
        return self.username
