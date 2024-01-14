from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


#Var 
var = {
    "type": "",
    "tournement_name" : "",
    "list_players" : {}
}

def interface(request):
    return render(request, 'interface.html')

def duelRegistration(request):
    return render(request, 'duelRegistration.html')


def tournementRegistration(request):
    return render(request, 'tournementRegistration.html')

def game(request):

    return render(request, 'game.html', var['list_players'])

def recevoir_donnees(request):
    print("POST test test ")
    if request.method == 'POST':

        data = json.loads(request.body.decode('utf-8'))
        var["list_players"] = data
        # Traitez les données comme vous le souhaitez
        # Player1 = data.get('message', '')
        # Vous pouvez également effectuer des opérations en base de données ici
        return render(request, 'duelRegistration.html')
    else:
        return JsonResponse({'status': 'Erreur', 'message': 'Méthode non autorisée'})
    
