from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    userid = models.CharField(max_length=20, unique=True, default='-1')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    # game_history = models.TextField(null=True, blank=True)
    friends = models.ManyToManyField('self', blank=True)
    groups = models.ManyToManyField('auth.Group', blank=True, related_name='user_custom')
    user_permissions = models.ManyToManyField('auth.Permission', blank=True, related_name='user_custom')
    join_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.username
