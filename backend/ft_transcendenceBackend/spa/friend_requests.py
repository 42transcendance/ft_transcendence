
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from spa.models import CustomUser, Game, GameHistory
from django.views.decorators.csrf import csrf_exempt
from .usersManagement.pfp_utils import get_base64_image
from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
import requests
import jwt
from django.conf import settings
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

@csrf_exempt
def get_user_details(request):
    token = request.session.get('token')
    profile_id = request.GET.get('profile_id', None)

    if token:
        user_id, username = extract_user_info_from_token(token)
        target_user_id = profile_id if profile_id and profile_id != user_id else user_id

        try:
            user = CustomUser.objects.get(userid=target_user_id)
            formatted_joined_date = user.join_date.strftime('%Y-%m-%d')
            activate(request.session.get('language'))
            user_details = {
                'username': user.username,
                'userPfp' :  get_base64_image(user.profile_picture) if user.profile_picture else None,
                'joinedDate' : formatted_joined_date,
                'userid'    : user.userid,
                'gamesPlayed' : user.game_history.count(),
                'language' : request.session.get('language')
            }
            translations = {
                'join': _("Joined:"),
                'nb_match' : _("Matches Played:"),
                'player' : _("Player "),
                'start_tournament' : _("Start Tournament"),
                'note': _("Note: Tournament mode does not impact player statistics in their profile."),
            }
            return JsonResponse({'user_details': user_details, 'translations': translations})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)



# @csrf_exempt
# def get_user_details(request):
#     token = request.session.get('token')
#     if token:
#         user_id, username = extract_user_info_from_token(token)
#         try:
#             user = CustomUser.objects.get(userid=user_id)
#             formatted_joined_date = user.join_date.strftime('%Y-%m-%d')
#             activate(request.session.get('language'))
#             user_details = {
#                 'username': user.username,
#                 'userPfp' :  get_base64_image(user.profile_picture) if user.profile_picture else None,
#                 'joinedDate' : formatted_joined_date,
#                 'userid'    : user.userid,
#                 'gamesPlayed' : user.game_history.count(),
#             }
#             translatations  = {
#                 'join': _("Joined:"),
#                 'nb_match' : _("Matches Played:"),
#             }
#             return JsonResponse({'user_details': user_details, 'translations' : translatations})
#         except CustomUser.DoesNotExist:
#             return JsonResponse({'error': 'User not found'}, status=404)
#     else:
#         return JsonResponse({'error': 'Token not found in session'}, status=400)

@csrf_exempt
def send_friend_request(request):
    search_term = request.GET.get('search_term', '')
    if search_term:
        try:
            friend = CustomUser.objects.get(username=search_term)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(userid=user_id)

            if current_user.username == friend.username:
                return JsonResponse({'error': 'SelfFriendRequest', 'message': 'You cannot send a friend request to yourself.'}, status=400)

            if current_user.friends.filter(username=friend.username).exists():
                return JsonResponse({'error': 'AlreadyFriends', 'message': 'You are already friends with this user.'}, status=400)
            
            if current_user.outgoing_friends_requests.filter(username=friend.username).exists():
                return JsonResponse({'error': 'OutgoingRequestExists', 'message': 'You have already sent a friend request to this user.'}, status=400)
            
            if current_user.incoming_friends_requests.filter(username=friend.username).exists():
                return JsonResponse({'error': 'IncomingRequestExists', 'message': 'You have already received a friend request from this user.'}, status=400)

            if current_user.blocklist.filter(username=friend.username).exists() or friend.blocklist.filter(username=current_user.username).exists():
                return JsonResponse({'error': 'UserBlocked', 'message': 'You or the user is blocked, unable to send friend request.'}, status=400)

            current_user.outgoing_friends_requests.add(friend) 
            friend.incoming_friends_requests.add(current_user)
            
            return JsonResponse({}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'FriendNotfound', 'message': 'Friend not found.'}, status=404)
    return JsonResponse({'error': 'InvalidRequest', 'message': 'Invalid request parameters.'}, status=400)

@csrf_exempt
def accept_friend_request(request):
    friend_username = request.GET.get('friend_username')
    if friend_username:
        try:
            friend = CustomUser.objects.get(username=friend_username)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(userid=user_id)

            current_user.friends.add(friend) 
            friend.friends.add(current_user)

            current_user.incoming_friends_requests.remove(friend)
            friend.outgoing_friends_requests.remove(current_user)

            friend_details = {
                'name': friend.username,
                'image' : get_base64_image(friend.profile_picture) if friend.profile_picture else None,
                'id'    : friend.userid,
            }
            return JsonResponse({'data': friend_details})
        except CustomUser.DoesNotExist:
            pass
    return JsonResponse({'friend_details': 'No details found'}, status=400)

@csrf_exempt
def decline_friend_request(request):
    friend_username = request.GET.get('friend_username')
    if friend_username:
        try:
            friend = CustomUser.objects.get(username=friend_username)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(userid=user_id)

            current_user.incoming_friends_requests.remove(friend)
            friend.outgoing_friends_requests.remove(current_user)
            return JsonResponse({}, status=200)
        except CustomUser.DoesNotExist:
            pass
    return JsonResponse({'friend_details': 'No details found'}, status=400) 


@csrf_exempt
def block_friend(request):
    friend_username = request.GET.get('friend_username')
    if friend_username:
        try:
            friend = CustomUser.objects.get(username=friend_username)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(userid=user_id)

            current_user.friends.remove(friend)
            friend.friends.remove(current_user)

            current_user.blocklist.add(friend)
            return JsonResponse({}, status=200)
        except CustomUser.DoesNotExist:
            pass
    return JsonResponse({'friend_details': 'No details found'}, status=400)

@csrf_exempt
def unblock_friend(request):
    friend_username = request.GET.get('friend_username')
    if friend_username:
        try:
            friend = CustomUser.objects.get(username=friend_username)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(userid=user_id)

            current_user.blocklist.remove(friend)

            return JsonResponse({}, status=200)
        except CustomUser.DoesNotExist:
            pass
    return JsonResponse({'friend_details': 'No details found'}, status=400) 


@csrf_exempt
def get_incoming_requests(request):
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            incoming_friend_list = user.incoming_friends_requests.all()
            waiting_requests = []

            for friend in incoming_friend_list:
                friend_data = get_user_info(friend)
                waiting_requests.append(friend_data)
            return JsonResponse(waiting_requests, safe=False)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)

@csrf_exempt
def get_outgoing_requests(request):
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            outgoing_friend_list = user.outgoing_friends_requests.all()
            waiting_requests = []

            for friend in outgoing_friend_list:
                friend_data = get_user_info(friend)
                waiting_requests.append(friend_data)
            return JsonResponse(waiting_requests, safe=False)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)

@csrf_exempt
def get_friends(request):
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            friend_list = user.friends.all()
            friends = []

            for friend in friend_list:
                friend_data = get_user_info(friend)
                friends.append(friend_data)
            return JsonResponse(friends, safe=False)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)

@csrf_exempt
def get_block_list(request):
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            block_list = user.blocklist.all()
            blocked = []

            for friend in block_list:
                friend_data = get_user_info(friend)
                blocked.append(friend_data)
            return JsonResponse(blocked, safe=False)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)


def get_user_info(user):
    try:
        formatted_joined_date = user.join_date.strftime('%Y-%m-%d')
        user_details = {
            'username': user.username,
            'userPfp': get_base64_image(user.profile_picture) if user.profile_picture else None,
            'joinedDate': formatted_joined_date,
            'userid': user.userid,
            'is_online': user.is_online,
            'is_ingame': user.is_ingame,
        }
        return user_details
    except CustomUser.DoesNotExist:
        return {'error': 'User not found'}  