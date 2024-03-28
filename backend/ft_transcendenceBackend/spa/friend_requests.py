
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from spa.models import CustomUser
from django.views.decorators.csrf import csrf_exempt
from .usersManagement.pfp_utils import get_base64_image
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
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            formatted_joined_date = user.join_date.strftime('%Y-%m-%d')
            user_details = {
                'username': user.username,
                'userPfp' :  get_base64_image(user.profile_picture) if user.profile_picture else None,
                'joinedDate' : formatted_joined_date,
                'userid'    : user.userid,
            }
            return JsonResponse({'user_details': user_details})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Token not found in session'}, status=400)

@csrf_exempt
def send_friend_request(request):
    search_term = request.GET.get('search_term', '')
    if search_term :
        try:
            friend = CustomUser.objects.get(username=search_term)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(username=username)

            current_user.outgoing_friends_requests.add(friend) 
            friend.incoming_friends_requests.add(current_user)
            
            return JsonResponse({}, status=200)
        except CustomUser.DoesNotExist:
            pass
    return JsonResponse({}, status=400)

@csrf_exempt
def accept_friend_request(request):
    friend_username = request.GET.get('friend_username')
    if friend_username:
        try:
            friend = CustomUser.objects.get(username=friend_username)
            token = request.session.get('token')
            user_id, username = extract_user_info_from_token(token)
            current_user = CustomUser.objects.get(username=username)

            current_user.friends.add(friend) 
            friend.friends.add(current_user)

            current_user.incoming_friends_requests.remove(friend)
            friend.outgoing_friends_requests.remove(current_user)

            friend_details = {
                'name': friend.name,
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
            current_user = CustomUser.objects.get(username=username)

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
            current_user = CustomUser.objects.get(username=username)

            current_user.friends.remove(friend)
            friend.friends.remove(current_user)

            print("no more friends")

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
            current_user = CustomUser.objects.get(username=username)

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
            user = CustomUser.objects.get(username=username)
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
            user = CustomUser.objects.get(username=username)
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
            user = CustomUser.objects.get(username=username)
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
            user = CustomUser.objects.get(username=username)
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
        }
        return user_details
    except CustomUser.DoesNotExist:
        return {'error': 'User not found'}  