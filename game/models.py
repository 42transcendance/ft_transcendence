from django.db import models

# Create your models here.
class Game(models.Model):


    player_1 = models.CharField(max_length = 255)
    player_2 = models.CharField(max_length = 255)
    mode = models.CharField(max_length=1)
    status = models.CharField(max_length=50, default='En cours')
    score_1 = models.IntegerField()
    score_2 = models.IntegerField()


# Create your models here.
class tournament(models.Model):

    name = models.CharField(max_length = 255)
    semifinal_1 = models.CharField(max_length = 255)
    semifinal_2 = models.CharField(max_length = 255)
    semifinal_3 = models.CharField(max_length = 255)
    semifinal_4 = models.CharField(max_length = 255)
    final_1 = models.CharField(max_length = 255)
    final_2 = models.CharField(max_length = 255)
    winner = models.CharField(max_length = 255)
    mode = models.CharField(max_length=1)
    status = models.CharField(max_length=50, default='En cours')
