from django.contrib import admin
from spa.models import ChatMessage, CustomUser

admin.site.register(CustomUser)
admin.site.register(ChatMessage)

# Register your models here.
