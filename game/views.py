from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Game



def game(request):
    return render(request, 'game.html')


def recevoir_donnees(request):
    if request.method == 'POST':

        data = json.loads(request.body.decode('utf-8'))
        object = Game(player_1 = data["p1"] , player_2 = data["p2"], mode ='D' , status = "en cours" , score_1 = 0 , score_2= 0 , )
        object.save()
        # Traitez les données comme vous le souhaitez
        # Player1 = data.get('message', '')
        # Vous pouvez également effectuer des opérations en base de données ici
        return render(request, 'duelRegistration.html')
    else:
        return JsonResponse({'status': 'Erreur', 'message': 'Méthode non autorisée'})