from django.http import JsonResponse
from ..models import Game , CustomUser
from django.conf import settings
from django.db.models import Q
import jwt
 

def extract_user_info_from_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_PHRASE, algorithms=['HS256'])
        user_id = payload.get('user_id')
        username = payload.get('username')
        return user_id, username
    except jwt.ExpiredSignatureError:
        return None, None
    except jwt.InvalidTokenError:
        return None, None

def get_game_history(request):
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            game_history = Game.objects.filter(Q(player1=user) | Q(player2=user))
            game_history_json = []
            for game in game_history:
                if (game.player1.username == user.username):
                    opponent = game.player2.username
                    if (game.player1_score > game.player2_score):
                        outcome = 'Win'
                    else :
                        outcome = 'Loose'
                else :
                    opponent = game.player1.username
                    if (game.player1_score < game.player2_score):
                        outcome = 'Win'
                    else :
                        outcome = 'Loose'
                score = f"{game.player1_score}-{game.player2_score}"
                game_history_json.append({
                    'opponent': opponent,
                    'date': game.date_played.strftime('%Y-%m-%d'),
                    'outcome': outcome,
                    'score': score
                })
            return JsonResponse({'gameHistory': game_history_json})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)
    