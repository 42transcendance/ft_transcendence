from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from spa.models import CustomUser
from django.conf import settings
import requests
import base64
import jwt
import os   

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

def download_image(url, destination):
    response = requests.get(url)
    if response.status_code == 200:
        with open(destination, 'wb') as f:
            f.write(response.content)
        return True
    else:
        return False

def get_base64_image(image_field):
    if not image_field:
        return None
    try:
        with open(image_field.path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return f"data:image/png;base64,{encoded_string}"
    except FileNotFoundError:
        return None
    
@csrf_exempt
def upload_profile_picture(request):
    if request.method == 'POST' and request.FILES.get('profile_picture'):
        token = request.session.get('token')
        user_id, username = extract_user_info_from_token(token)
        try:
            current_user = CustomUser.objects.get(userid=user_id)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        profile_picture = request.FILES['profile_picture']

        file_extension = os.path.splitext(profile_picture.name)[-1].lower()
        
        filename = f"{user_id}_profile_picture{file_extension}"
        
        filepath = os.path.join(settings.MEDIA_ROOT, 'profile_pictures', filename)

        if current_user.profile_picture and filename == os.path.basename(str(current_user.profile_picture)):
            pass
        else:
            if current_user.profile_picture:
                old_picture_path = os.path.join(settings.MEDIA_ROOT, str(current_user.profile_picture))
                if os.path.exists(old_picture_path):
                    os.remove(old_picture_path)
        
        with open(filepath, 'wb') as f:
            for chunk in profile_picture.chunks():
                f.write(chunk)
        
        current_user.profile_picture = f"profile_pictures/{filename}"
        current_user.save()
        
        return JsonResponse({'success': 'Profile picture updated successfully', 'userPfp' : get_base64_image(current_user.profile_picture) if current_user.profile_picture else None})
    else:
        return JsonResponse({'error': 'No file uploaded'}, status=400)