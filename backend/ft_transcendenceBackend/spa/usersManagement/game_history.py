from django.http import JsonResponse
from ..models import Game , CustomUser
from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
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
    users_id = request.GET.get('profile_id')
    if not users_id:
        token = request.session.get('token')
        if token:
            users_id, username = extract_user_info_from_token(token)
    if users_id:
        try:
            #The get() right below >>>
            user = CustomUser.objects.get(userid=users_id)
            game_history = Game.objects.filter(Q(player1=user) | Q(player2=user)).order_by('-date_played')
            
            game_history_json = []
            for game in game_history:
                player1_username = game.player1.username
                player2_username = game.player2.username
                if (game.player1.username == user.username):
                    opponent = player2_username
                    if (game.player1_score > game.player2_score):
                        outcome = 'Win'
                    else:
                        outcome = 'Defeat'
                else:
                    opponent = player1_username
                    if (game.player1_score < game.player2_score):
                        outcome = 'Win'
                    else:
                        outcome = 'Defeat'
                score = f"{game.player1_score}-{game.player2_score}"
                game_history_json.append({
                    'player1_username': player1_username,
                    'player2_username': player2_username,
                    'opponent': opponent,
                    'date': game.date_played.strftime('%Y-%m-%d'),
                    'outcome': outcome,
                    'score': score
                })
            activate(request.session.get('language'))
            translations  = {
                'history': _("Game History"),
                'history_empty' : _("No game played online"),
                'stats' : _("Statistics"),
                'stats_empty': _("Need 1 game to see stats"),
                'avg' : _("Average Score: "),
                'win_str' : _("Win Streak: "),
                'win' : _("Win"),
                'defeat' : _("Defeat"),
                'score' : _("Score: "),
                'vs' : _("Versus: "),
            }
            return JsonResponse({'gameHistory': game_history_json, 'currentUser': user.username, 'translations': translations})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)
